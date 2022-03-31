import { Box3, Object3D, ObjectLoader, Scene } from 'three';
import { CT_WGS84, IWGS84, WGS84_TYPE } from '../../../math';
import { isMetaObject } from '../../../meta';
import { ObjectData } from '../object-data';
import { Cesium3Synchronization } from '../synchronization';

interface IObjectCallbackFunction<T> {
    onSuccess(object: Object3D): T;
    onError?(): void;
}

export namespace SceneComponent {
    export const scene = new Scene();

    function getObject<T>(id: number, cb: IObjectCallbackFunction<T>) {
        const object = scene.getObjectById(id);
        if (object) {
            return cb.onSuccess(object);
        } else {
            if (cb.onError) {
                cb.onError();
            }
        }
    }

    export namespace API {
        /**
         * 오브젝트의 포지션을 설정합니다.
         * @param id
         * @param position
         */
        export const setObjectPosition = (id: number | Object3D, position: IWGS84) => {
            let object: Object3D | undefined;

            if (typeof id === 'number') {
                getObject(id, {
                    onSuccess(result) {
                        object = result;
                    },
                });
            } else {
                object = id;
            }

            if (object) {
                const rps = ObjectData.API.getPositionRotationScale(object.id);

                if (rps) {
                    if (position.height === 0) {
                        let max = ObjectData.API.getBox3Max(object.id);
                        if (!max) {
                            const box3 = new Box3().setFromObject(object);
                            box3.max.setZ(box3.max.z + 1);
                            ObjectData.setBox3(object.id, box3);
                            max = box3.max;
                        }
                        position.height = max.z;
                    }

                    object.position.copy(rps.position);
                    object.rotation.copy(rps.rotation);
                    object.scale.copy(rps.scale);

                    const wgs84 = Cesium3Synchronization.syncObject3DPosition(
                        object,
                        position,
                        WGS84_TYPE.CESIUM
                    );

                    ObjectData.setWGS84(object.id, wgs84);
                }
            }
        };

        /**
         * 오브젝트를 추가합니다.
         * @param json
         * @param position
         * @returns
         */
        export const add = (json: any, position?: IWGS84) => {
            debugger;
            const object = new ObjectLoader().parse(json);

            ObjectData.setBox3ByObject3D(object);
            ObjectData.setPositionRotationScaleByObject3D(object);

            if (position) {
                ObjectData.setWGS84(object.id, position);
                setObjectPosition(object, {
                    height: position.height,
                    latitude: position.longitude,
                    longitude: position.latitude,
                });
            }

            scene.add(object);

            return object.id;
        };

        /**
         * 오브젝트를 제거합니다.
         * @param id
         */
        export function remove(id: number) {
            getObject(id, {
                onSuccess(object) {
                    if (isMetaObject(object) && object.dispose) {
                        object.dispose();
                    }

                    scene.remove(object);
                },
            });
        }

        export function isExistObject(id: number) {
            return getObject(id, {
                onSuccess() {
                    return true;
                },
            });
        }
    }
}

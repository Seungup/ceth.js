import { Box3, Object3D, ObjectLoader, Scene } from 'three';
import { CT_WGS84, IWGS84, WGS84_ACTION } from '../../../../../../../../math';
import { isMetaObject } from '../../../../../../../../meta';
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
        export const setObjectPosition = (
            id: number | Object3D,
            postiion: { wgs84: IWGS84; action: WGS84_ACTION }
        ) => {
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
                    if (postiion.wgs84.height === 0) {
                        let max = ObjectData.API.getBox3Max(object.id);
                        if (!max) {
                            const box3 = new Box3().setFromObject(object);
                            box3.max.setZ(box3.max.z + 1);
                            ObjectData.setBox3(object.id, box3);
                            max = box3.max;
                        }
                        postiion.wgs84.height = max.z;
                    }

                    object.position.copy(rps.position);
                    object.rotation.copy(rps.rotation);
                    object.scale.copy(rps.scale);

                    const wgs84 = Cesium3Synchronization.syncObject3DPosition(
                        object,
                        postiion.wgs84,
                        postiion.action
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
        export const add = (json: any, position?: { wgs84: IWGS84; action: WGS84_ACTION }) => {
            const object = new ObjectLoader().parse(json);

            ObjectData.setBox3ByObject3D(object);
            ObjectData.setPositionRotationScaleByObject3D(object);

            if (position) {
                const wgs84 = new CT_WGS84(position.wgs84, position.action);
                ObjectData.setWGS84(object.id, wgs84.toIWGS84());
                setObjectPosition(object, { ...position });
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

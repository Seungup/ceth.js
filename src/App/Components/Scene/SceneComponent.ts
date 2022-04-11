import { Box3, Object3D, ObjectLoader, Scene } from "three";
import { CT_WGS84, IWGS84, WGS84_ACTION } from "../../Math";
import { Cesium3Synchronization } from "../../Utils/Synchronization";
import { ObjectData } from "../../data/ObjectData";
import { Manager } from "../../Managers/Manager";
import { InstancedManager } from "../../Managers/Strategy/InstancedManager";
import { THREEUtils } from "../../Utils/ThreeUtils";

interface IObjectCallbackFunction<T> {
    onSuccess(object: Object3D): T;
    onError?(): void;
}

export namespace SceneComponent {
    export const scene = new Scene();
    const objectLoader = new ObjectLoader();

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
         * @param wgs84
         * @param action
         */
        export function setObjectPosition(
            id: number | Object3D,
            wgs84: IWGS84,
            action: WGS84_ACTION = WGS84_ACTION.NONE
        ) {
            let object: Object3D | undefined;

            if (typeof id === "number") {
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
                    if (wgs84.height === 0) {
                        let max = ObjectData.API.getBox3Max(object.id);
                        if (!max) {
                            const box3 = new Box3().setFromObject(object);
                            box3.max.setZ(box3.max.z + 1);
                            ObjectData.setBox3(object.id, box3);
                            max = box3.max;
                        }
                        wgs84.height = max.z;
                    }

                    object.position.copy(rps.position);
                    object.rotation.copy(rps.rotation);
                    object.scale.copy(rps.scale);

                    Cesium3Synchronization.syncObject3DPosition(
                        object,
                        wgs84,
                        action
                    ).then((result) => {
                        ObjectData.setWGS84(result.object.id, result.wgs84);
                    });
                }
            }
        }

        /**
         * 오브젝트를 추가합니다.
         * @param json
         * @param wgs84
         * @param action
         * @returns
         */
        export async function add(
            json: any,
            wgs84?: IWGS84,
            action: WGS84_ACTION = WGS84_ACTION.NONE
        ) {
            const object = objectLoader.parse(json);

            ObjectData.setBox3ByObject3D(object);
            ObjectData.setPositionRotationScaleByObject3D(object);

            if (wgs84) {
                const position = new CT_WGS84(wgs84, action);
                ObjectData.setWGS84(object.id, position.toIWGS84());
                setObjectPosition(object, wgs84, action);
            }

            scene.add(object);

            return object.id;
        }

        /**
         *
         * @param json
         * @param wgs84
         * @param action
         */
        export function dynamicAppend(
            json: any,
            wgs84: IWGS84,
            action: WGS84_ACTION = WGS84_ACTION.NONE,
            visibility: boolean = true
        ) {
            const original = THREEUtils.getTypeSafeObject3D(
                objectLoader.parse(json)
            );

            if (original.geometry && original.material) {
                const managerAccessKey = Manager.getHashByGeometryMaterial(
                    original.geometry,
                    original.material
                );
                let manager =
                    Manager.getClass<InstancedManager>(managerAccessKey);
                if (!manager) {
                    manager = new InstancedManager(
                        {
                            geomtery: original.geometry,
                            material: original.material,
                            maxCount: 1000000,
                        },
                        SceneComponent.scene
                    );
                    Manager.registClass(manager);
                }

                const position = new CT_WGS84(wgs84, action);

                const objectId = manager.add(
                    position.getMatrix4(),
                    visibility,
                    {
                        wgs84: position.toIWGS84(),
                    }
                );
                return {
                    managerAccessKey: managerAccessKey,
                    objectId: objectId,
                };
            }
        }

        export function getDynamicPosition(
            managerAccessKey: string,
            objectId: number
        ): IWGS84 | undefined {
            let manager = Manager.getClass<InstancedManager>(managerAccessKey);

            if (manager) {
                return manager.getUserData(objectId)?.wgs84;
            }
        }

        export function dynamicUpdate(
            managerAccessKey: string,
            objectId: number,
            wgs84: IWGS84,
            action: WGS84_ACTION = WGS84_ACTION.NONE
        ) {
            let manager = Manager.getClass(managerAccessKey);
            if (manager) {
                if (manager.delete(objectId)) {
                    manager.add(new CT_WGS84(wgs84, action).getMatrix4());
                }
            }
        }

        export function dynamicDelete(
            managerAccessKey: string,
            objectId: number
        ) {
            let manager = Manager.getClass(managerAccessKey);
            if (manager) {
                manager.delete(objectId);
            }
        }

        export function dynamicVisible(
            managerAccessKey: string,
            id: number,
            visible: boolean
        ) {
            let manager = Manager.getClass(managerAccessKey);
            if (manager) {
                manager.setVisibiltiy(id, visible);
            }
        }

        /**
         * 오브젝트를 제거합니다.
         * @param id
         */
        export function remove(id: number) {
            getObject(id, {
                onSuccess(object) {
                    THREEUtils.disposeObject3D(object);
                    scene.remove(object);
                },
            });
        }

        export function isExistObject(id: number) {
            return !!scene.getObjectById(id);
        }
    }
}

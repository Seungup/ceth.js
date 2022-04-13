import { Box3, Object3D, ObjectLoader, Scene, Vector3 } from "three";
import { CT_WGS84, HeadingPitchRoll, IWGS84, Position } from "../../Math";
import { Cesium3Synchronization } from "../../Utils/Synchronization";
import { ObjectData } from "../../data/ObjectData";
import { Manager } from "../Object/Manager";
import { InstancedObjectManager } from "../Object/Strategy/InstancedObjectManager";
import { THREEUtils } from "../../Utils/ThreeUtils";

interface IObjectCallbackFunction<T> {
    onSuccess(object: Object3D): T;
    onError?(): void;
}

export namespace SceneComponent {
    export const scene = new Scene();
    const objectLoader = new ObjectLoader();

    const getObject = <T>(id: number, cb: IObjectCallbackFunction<T>) => {
        const object = scene.getObjectById(id);
        if (object) {
            return cb.onSuccess(object);
        } else {
            if (cb.onError) {
                cb.onError();
            }
        }
    };

    export namespace API {
        export const setObjectPosition = (
            id: number | Object3D,
            position: Position
        ) => {
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
                    const { wgs84, action } = position;
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
        };

        export const add = async (json: any, position?: Position) => {
            const object = objectLoader.parse(json);

            ObjectData.setBox3ByObject3D(object);
            ObjectData.setPositionRotationScaleByObject3D(object);

            if (position) {
                const pos = new CT_WGS84(position);
                ObjectData.setWGS84(object.id, pos.toIWGS84());
                setObjectPosition(object, position);
            }

            scene.add(object);

            return object.id;
        };

        /**
         *
         * @param json
         * @param option
         * @returns
         */
        export const dynamicAppend = (
            json: any,
            option: {
                position: Position;
                headingPitchRoll: HeadingPitchRoll;
                visibility?: boolean;
            }
        ) => {
            const { headingPitchRoll, position, visibility } = option;
            const object = THREEUtils.getTypeSafeObject3D(
                objectLoader.parse(json)
            );

            if (object.geometry && object.material) {
                const managerAccessKey = Manager.getHashByGeometryMaterial(
                        object.geometry,
                        object.material
                    ),
                    writeAbleClass =
                        Manager.getWriteableClass<InstancedObjectManager>(
                            managerAccessKey
                        );

                let manager: InstancedObjectManager;
                if (!writeAbleClass) {
                    manager = new InstancedObjectManager(
                        {
                            geomtery: object.geometry,
                            material: object.material,
                            maxCount: 1000,
                        },
                        SceneComponent.scene
                    );

                    // don't for regist manager class
                    Manager.registClass(manager);
                } else {
                    manager = writeAbleClass;
                }

                const box3 = new Box3().setFromObject(object);
                if (position.wgs84.height === 0) {
                    position.wgs84.height = box3.max.z;
                }

                const _wgs84 = new CT_WGS84(position),
                    matrix = _wgs84.getMatrix4(headingPitchRoll),
                    userData = {
                        wgs84: _wgs84.toIWGS84(),
                        box3: box3,
                        PRS: {
                            position: object.position.clone(),
                            rotation: object.rotation.clone(),
                            scale: object.scale.clone(),
                        },
                    };

                const id = manager.add(matrix, visibility, userData);

                return {
                    managerAccessKey: manager.hash,
                    managerId: manager.id,
                    objectId: id,
                };
            }
        };

        export const getDynamicPosition = (
            managerAccessKey: string,
            objectId: number
        ): IWGS84 | undefined => {
            let manager =
                Manager.getClass<InstancedObjectManager>(managerAccessKey);

            if (manager) {
                return manager.getUserData(objectId)?.wgs84;
            }
        };

        export const getDynamicBox3Max = (
            managerAccessKey: string,
            objectId: number
        ): Vector3 | undefined => {
            let manager =
                Manager.getClass<InstancedObjectManager>(managerAccessKey);

            if (manager) {
                return manager.getUserData(objectId)?.box3.max;
            }
        };

        export const dynamicUpdate = (
            managerAccessKey: string,
            objectId: number,
            option: {
                position: Position;
                scale: Vector3;
                headingPitchRoll: HeadingPitchRoll;
            }
        ) => {
            let manager = Manager.getClass(managerAccessKey);
            if (manager) {
                const { position, headingPitchRoll, scale } = option;
                return manager.update(
                    objectId,
                    new CT_WGS84(position)
                        .getMatrix4(headingPitchRoll)
                        .scale(scale)
                );
            }
        };

        export const dynamicDelete = (
            managerAccessKey: string,
            objectId: number
        ) => {
            let manager =
                Manager.getClass<InstancedObjectManager>(managerAccessKey);
            if (manager) {
                manager.delete(objectId);
                if (manager.isEmpty()) {
                    manager.dispose();
                }
            }
        };

        export const dynamicVisible = (
            managerAccessKey: string,
            id: number,
            visible: boolean
        ) => {
            let manager = Manager.getClass(managerAccessKey);
            if (manager) {
                manager.setVisibiltiy(id, visible);
            }
        };

        /**
         * 오브젝트를 제거합니다.
         * @param id
         */
        export const remove = (id: number) => {
            getObject(id, {
                onSuccess(object) {
                    THREEUtils.disposeObject3D(object);
                    scene.remove(object);
                },
            });
        };

        export const isExistObject = (id: number) => {
            return !!scene.getObjectById(id);
        };
    }
}

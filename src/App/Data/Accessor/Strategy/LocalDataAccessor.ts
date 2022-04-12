import { DataAccessor } from "../DataAccessor";

import * as THREE from "three";
import { ObjectData } from "../../ObjectData";
import { Cesium3Synchronization } from "../../../Utils/Synchronization";
import { IWGS84, WGS84_ACTION } from "../../../Math";
import { THREEUtils } from "../../../Utils/ThreeUtils";

export class LocalDataAccessor implements DataAccessor {
    private scene?: THREE.Scene;
    private id?: number;

    setId(id: number) {
        this.id = id;
    }

    setScene(scene: THREE.Scene) {
        this.scene = scene;
    }

    isExise(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (this.scene && this.id) {
                resolve(!!this.scene.getObjectById(this.id));
            } else {
                reject("scene, id is not defeined.");
            }
        });
    }

    remove(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.scene && this.id) {
                const object = this.scene.getObjectById(this.id);
                if (object) {
                    THREEUtils.disposeObject3D(object);
                    this.scene.remove(object);
                    ObjectData.remove(this.id);
                    resolve();
                }
            } else {
                reject();
            }
        });
    }

    setWGS84(
        wgs84: IWGS84,
        action: WGS84_ACTION = WGS84_ACTION.NONE
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.scene && this.id) {
                const object = this.scene.getObjectById(this.id);
                if (object) {
                    ObjectData.setPositionRotationScaleByObject3D(object);
                    Cesium3Synchronization.syncObject3DPosition(
                        object,
                        wgs84,
                        action
                    );
                    resolve();
                }
            } else {
                reject();
            }
        });
    }

    getBox3Max(): Promise<THREE.Vector3> {
        return new Promise((resolve, reject) => {
            if (this.id) {
                const data = ObjectData.API.getBox3Max(this.id);
                if (data) {
                    resolve(data);
                }
            } else {
                reject();
            }
        });
    }

    getWGS84(): Promise<IWGS84> {
        return new Promise((resolve, rejcet) => {
            if (this.id) {
                const data = ObjectData.API.getWGS84(this.id);
                if (data) {
                    resolve(data);
                }
            } else {
                rejcet();
            }
        });
    }
}

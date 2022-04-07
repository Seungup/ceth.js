import { DataAccessor } from '../DataAccessor.Interface';

import * as THREE from 'three';
import { ObjectData } from '../../ObjectData';
import { Cesium3Synchronization } from '../../../core/utils/Synchronization';
import { IWGS84, WGS84_ACTION } from '../../../core/utils/Math';

export class LocalDataAccessStrategy implements DataAccessor {
    private readonly scene: THREE.Scene;
    private readonly id: number;
    constructor(scene: THREE.Scene, id: number) {
        this.scene = scene;
        this.id = id;
    }
    isExise(): Promise<boolean> {
        return new Promise((resolve) => {
            resolve(!!this.scene.getObjectById(this.id));
        });
    }
    remove(): Promise<void> {
        return new Promise((resolve, reject) => {
            const object = this.scene.getObjectById(this.id);
            if (object) {
                this.scene.remove(object);
                ObjectData.remove(this.id);
                resolve();
            } else {
                reject();
            }
        });
    }

    setWGS84(wgs84: IWGS84, action: WGS84_ACTION = WGS84_ACTION.NONE): Promise<void> {
        return new Promise((resolve, reject) => {
            const object = this.scene.getObjectById(this.id);
            if (object) {
                ObjectData.setPositionRotationScaleByObject3D(object);
                Cesium3Synchronization.syncObject3DPosition(object, wgs84, action);
                resolve();
            } else {
                reject();
            }
        });
    }

    getBox3Max(): Promise<THREE.Vector3> {
        return new Promise((resolve, reject) => {
            const data = ObjectData.API.getBox3Max(this.id);
            if (data) {
                resolve(data);
            } else {
                reject();
            }
        });
    }

    getWGS84(): Promise<IWGS84> {
        return new Promise((resolve, rejcet) => {
            const data = ObjectData.API.getWGS84(this.id);
            if (data) {
                resolve(data);
            } else {
                rejcet();
            }
        });
    }
}

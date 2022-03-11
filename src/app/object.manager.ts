import { Object3D } from 'three';
import { IWGS84, CT_Matrix4 } from '../core';
import { SingletonWorkerFactory } from '../core/worker-factory';
import { ObjectAPI } from './object.api';

export interface RequestResult {
    objectId: number;
    result: boolean;
}

export class ObjectManager {
    private readonly coreWrapper =
        SingletonWorkerFactory.getWrapper('CoreThread');

    async add(object: Object3D, position?: IWGS84): Promise<ObjectAPI> {
        /**
         * 위치 값을 가지는 오브젝트인 경우 90도 회전하여,
         * Cesium 에서 정상적으로 보이도록 변환한다.
         */
        if (position) {
            const matrixRot90X = CT_Matrix4.fromRotationX(90);
            object.applyMatrix4(matrixRot90X);
        }

        const id = await this.coreWrapper.add(object.toJSON(), position);
        return new ObjectAPI(id);
    }

    async get(id: number) {
        const isExist = await this.coreWrapper.isExist(id);
        if (isExist) return new ObjectAPI(id);
    }

    async updateObject(id: number, object: Object3D): Promise<RequestResult> {
        return {
            objectId: id,
            result: await this.coreWrapper.update(id, object.toJSON()),
        };
    }
}

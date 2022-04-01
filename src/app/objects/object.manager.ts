import { ObjectAPI } from './object.api';
import { Object3D } from 'three';
import { IMetaObject, isMetaObject, IWGS84 } from '../..';
import { CoreThreadCommand } from '../../core-thread.command';
import { WGS84_ACTION } from '../../math';

export class ObjectManager {
    /**
     * 장면에 오브젝트를 추가합니다.
     *
     * IMetaObject의 경우 내부적에서 자동으로 관리됩니다.
     *
     * @param object
     * @param position
     * @returns
     */
    async add<T extends IMetaObject | Object3D>(
        object: T,
        position: { wgs84: IWGS84; action: WGS84_ACTION }
    ): Promise<ObjectAPI> {
        const id = await CoreThreadCommand.excuteAPI('SceneComponentAPI', 'add', [
            object.toJSON(),
            position,
        ]);

        if (isMetaObject(object) && object.dispose) {
            object.dispose();
        }

        return await new ObjectAPI(id).updateAll();
    }

    async get(id: number) {
        const isExist = await CoreThreadCommand.excuteAPI('SceneComponentAPI', 'isExistObject', [
            id,
        ]);
        if (isExist) {
            return await new ObjectAPI(id).updateAll();
        }
    }
}
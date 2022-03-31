import { Viewer } from 'cesium';
import { Object3D } from 'three';
import { IMetaObject } from '../..';
import { ObjectAPI } from './object.api';
import { CoreAPI } from './core-api';
import { isMetaObject } from '../../meta';
import { Utils } from '../utils';
import { WGS84_ACTION } from '../../math';

export class ObjectPreview {
    private _attachedObjectAPI: ObjectAPI | undefined;
    constructor(private readonly viewer: Viewer) {
        const canvas = this.viewer.canvas;
        canvas.addEventListener('pointermove', this._onMouseEvent.bind(this));
    }

    private _onBeforeDetach?: { (api: ObjectAPI): Promise<void> };

    /**
     * attached 된 오브젝트는 clone되어 원본을 유지합니다.
     *
     * @param object
     */
    async attach(
        object: IMetaObject | Object3D,
        onBeforeDetach?: { (api: ObjectAPI): Promise<void> }
    ) {
        this.detach();
        this._onBeforeDetach = onBeforeDetach;

        if (object instanceof Object3D || isMetaObject(object)) {
            const clone = object.clone();

            const id = await CoreAPI.excuteAPI('SceneComponentAPI', 'add', [
                clone.toJSON(),
                undefined,
            ]);
            this._attachedObjectAPI = await new ObjectAPI(id).updateAll();
            return;
        }
    }

    /**
     * 오브젝트가 attach 되었는가
     * @returns
     */
    isAttached() {
        return !!this._attachedObjectAPI;
    }

    /**
     * 자동으로 오브젝트의 위치를 업데이트합니다.
     */
    autoPositionUpdate: boolean = true;

    /**
     * 오브젝트를 분리합니다.
     *
     * @returns 분리에 성공하면, true를 리턴합니다.
     */
    async detach() {
        if (this._attachedObjectAPI) {
            if (this._onBeforeDetach) {
                await this._onBeforeDetach(this._attachedObjectAPI);
            }
            this._attachedObjectAPI.remove();

            this._attachedObjectAPI = undefined;

            return true;
        }
        return false;
    }

    private _onMouseEvent(event: MouseEvent) {
        if (!this._attachedObjectAPI) return;
        if (!this.autoPositionUpdate) return;

        const position = Utils.mouseEventToWGS84(this.viewer, event);

        if (position) {
            this._attachedObjectAPI.setPosition({ ...position, height: 0 }, WGS84_ACTION.NONE);
        }
    }
}

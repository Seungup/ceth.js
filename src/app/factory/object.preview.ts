import { Viewer } from 'cesium';
import { Object3D } from 'three';
import { IMetaObject } from '../..';
import { ObjectAPI } from './object.api';
import { CesiumUtils } from '..';
import { CoreAPI } from './core-api';
import { isMetaObject } from '../../meta';
import { IWGS84 } from '../../math';

export class ObjectPreview {
    private _attachedObjectAPI: ObjectAPI | undefined;
    constructor(private readonly viewer: Viewer) {
        const canvas = this.viewer.canvas;
        canvas.addEventListener('pointermove', this._onMouseEvent.bind(this));
    }

    private _attachedType: 'ObjectAPI' | 'Object3D' | undefined;

    private _onDetached?: { (lastPosition?: IWGS84): void };

    /**
     * attached 된 오브젝트는 clone되어 원본을 유지합니다.
     *
     * @param object
     */
    async attach(
        object: IMetaObject | Object3D | ObjectAPI,
        onDetached?: { (lastPosition?: IWGS84): void }
    ) {
        this.detach();
        this._onDetached = onDetached;
        if (object instanceof Object3D || isMetaObject(object)) {
            this._attachedType = 'Object3D';
            const id = await CoreAPI.excuteAPI('SceneComponentAPI', 'add', [
                object.clone().toJSON(),
                undefined,
            ]);
            this._attachedObjectAPI = await new ObjectAPI(id).updateAll();
            return;
        }
        this._attachedObjectAPI = object;
        this._attachedType = 'ObjectAPI';
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
            switch (this._attachedType) {
                case 'Object3D':
                    this._attachedObjectAPI.remove();
                    break;
                default:
                    break;
            }
            const position = await this._attachedObjectAPI.getPosition();
            this._onDetached?.(position);
            this._attachedObjectAPI = undefined;
            this._attachedType = undefined;
            return true;
        }
        return false;
    }

    private _onMouseEvent(event: MouseEvent) {
        if (!this._attachedObjectAPI) return;
        if (!this.autoPositionUpdate) return;

        const position = CesiumUtils.mousePositionToWGS84(this.viewer, event);

        if (position) {
            this._attachedObjectAPI.setPosition(position);
        }
    }
}

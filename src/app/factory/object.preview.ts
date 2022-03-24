import { Viewer } from 'cesium';
import { Object3D } from 'three';
import { IMetaObject } from '../..';
import { ObjectAPI } from './object.api';
import { mousePositionToWGS84 } from '..';
import { CoreAPI } from './core-api';

export class ObjectPreview {
	private _attachedObjectAPI: ObjectAPI | undefined;
	constructor(private readonly viewer: Viewer) {
		const canvas = this.viewer.canvas;
		canvas.addEventListener('pointermove', this._onMouseEvent.bind(this));
	}

	/**
	 * attached 된 오브젝트는 clone되어 원본을 유지합니다.
	 *
	 * @param object
	 */
	async attach(object: IMetaObject | Object3D) {
		this.detach();

		const id = await CoreAPI.excuteAPI('SceneAPI', 'add', [
			object.clone().toJSON(),
			undefined,
		]);

		this._attachedObjectAPI = await new ObjectAPI(id).update();
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
	detach() {
		if (this._attachedObjectAPI) {
			this._attachedObjectAPI.remove();
			this._attachedObjectAPI = undefined;
			return true;
		}
		return false;
	}

	private _onMouseEvent(event: MouseEvent) {
		if (!this._attachedObjectAPI) return;
		if (!this.autoPositionUpdate) return;

		const position = mousePositionToWGS84(this.viewer, event);

		if (position) {
			this._attachedObjectAPI.setPosition(position);
		}
	}
}

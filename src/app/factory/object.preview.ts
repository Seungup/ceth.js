import { Viewer } from 'cesium';
import { BoxHelper, Object3D } from 'three';
import { IMetaObject, IWGS84 } from '../..';
import { SingletonWorkerFactory } from '../../worker-factory';
import { ObjectAPI } from './object.api';
import { flyByObjectAPI, mousePositionToWGS84 } from '..';

export class ObjectPreview {
	private readonly coreWrapper =
		SingletonWorkerFactory.getWrapper('CoreThread');

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
	attach(object: IMetaObject | Object3D) {
		this.detach();
		const temp = object.clone();

		temp.add(new BoxHelper(temp));

		this.coreWrapper.add(temp.toJSON(), undefined).then((id) => {
			new ObjectAPI(id).update().then((api) => {
				this._attachedObjectAPI = api;
				flyByObjectAPI(this.viewer, api);
			});
		});
	}

	/**
	 * 오브젝트의 미리보기 위치를 마우스의 위치에 맞게 업데이트합니다.
	 * @default true
	 */
	updateObjectPositionToMousePosition: boolean = true;

	/**
	 * 오브젝트가 attach 되었는가
	 * @returns
	 */
	isAttached() {
		return !!this._attachedObjectAPI;
	}

	/**
	 * 오브젝트의 위치를 업데이트합니다.
	 * @param position
	 */
	setObjectPosition(position: IWGS84) {
		if (this.updateObjectPositionToMousePosition) return;
		if (this._attachedObjectAPI) {
			this._attachedObjectAPI.setPosition(position);
		}
	}

	/**
	 * 오브젝트를 분리합니다.
	 *
	 * @returns 분리에 성공하면, true를 리턴합니다.
	 */
	detach() {
		if (this._attachedObjectAPI) {
			this._attachedObjectAPI.delete();
			this._attachedObjectAPI = undefined;
			return true;
		}
		return false;
	}

	private _onMouseEvent(event: MouseEvent) {
		if (!this._attachedObjectAPI) return;
		if (!this.updateObjectPositionToMousePosition) return;

		const position = mousePositionToWGS84(this.viewer, event);

		if (position) {
			this._attachedObjectAPI.setPosition(position);
		}
	}
}

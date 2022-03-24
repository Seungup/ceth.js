import { expose } from 'comlink';
import { Graphic } from './graphic';
import { Box3, ObjectLoader, Vector3 } from 'three';
import { RenderQueue } from './render-queue';
import { CT_WGS84, IWGS84 } from '../math';
import { isMetaObject } from '../meta';
import { WGS84_TYPE } from '../math';
import {
	API_MAP_APIFunctionArgs,
	API_MAP_APIFunctions,
	API_MAP_APIKeys,
	excute,
} from './API';

export interface CameraInitParam {
	aspect: number;
	far: number;
	near: number;
	fov: number;
}
export enum CoreThreadRequestType {
	RENDER,
	INIT,
}

function isCoreThreadRequestType(
	object: any
): object is ICoreThreadRequetMessage {
	return (
		typeof (<ICoreThreadRequetMessage>object).CoreThreadRequestType ===
		'number'
	);
}
export interface ICoreThreadRequetMessage {
	CoreThreadRequestType: CoreThreadRequestType;
	[key: string]: any;
}

export default class CoreThread {
	private readonly graphic = Graphic.getInstance();
	private readonly objectLoader = new ObjectLoader();
	private _renderQueue = new RenderQueue();

	constructor() {
		this._renderQueue.renderNextFrame$.subscribe(() => {
			self.postMessage({ type: 'onRender' });
		});

		// 짧은 시간안에 즉각적으로 실행되어야하는 메서드의 경우 PostMessage 를 통하여 인자값을 전달 받습니다.

		self.onmessage = (e: MessageEvent) => {
			const message = e.data;
			if (isCoreThreadRequestType(message)) {
				switch (message.CoreThreadRequestType) {
					case CoreThreadRequestType.RENDER:
						this._renderQueue.requestRender({
							...message.param,
						});
						break;
					case CoreThreadRequestType.INIT:
						this.graphic.init(message.canvas);
						break;
					default:
						break;
				}
			}
		};
	}

	excuteAPI<
		API_NAME extends API_MAP_APIKeys,
		API_METHOD extends API_MAP_APIFunctions<API_NAME>,
		API_ARGS extends API_MAP_APIFunctionArgs<API_NAME, API_METHOD>
	>(apiName: API_NAME, apiMethod: API_METHOD, apiArgs: API_ARGS) {
		excute(apiName, apiMethod, apiArgs);
	}

	/**
	 * 지구 뒷편에 존재하는 오브젝트의 렌더 여부를 결정합니다.
	 *
	 * @param visible 가시 여부
	 */
	setRenderBehindEarthOfObjects(visible: boolean) {
		this.graphic.renderBehindEarthOfObjects = visible;
	}

	/**
	 * 오브젝트의 유저 데이터를 가져옵니다.
	 * @param id
	 * @returns
	 */
	getUserData(id: number) {
		const object = this.getObject(id);
		if (object) {
			return object.userData;
		}
	}

	/**
	 * 오브젝트를 장면에서 가져옵니다.
	 * @param value
	 * @returns
	 */
	private getObject(value: number) {
		return this.graphic.scene.getObjectById(value);
	}

	/**
	 * 오브젝트가 장면에 추가되어있는지 확인합니다.
	 *
	 * @param id
	 * @returns
	 */
	isExist(id: number) {
		return !!this.getObject(id);
	}

	/**
	 * 오브젝트를 장면에 추가합니다.
	 * @param json
	 * @param position
	 * @returns 오브젝트 아이디
	 */
	add(json: any, position: IWGS84 | undefined) {
		debugger;
		const object = this.objectLoader.parse(json);

		object.userData.original = {
			position: object.position.clone(),
			rotation: object.rotation.clone(),
			scale: object.scale.clone(),
		};

		const box3 = new Box3().setFromObject(object).max;
		if (Math.abs(box3.x) === Infinity) {
			box3.setX(0);
		}
		if (Math.abs(box3.y) === Infinity) {
			box3.setY(0);
		}
		if (Math.abs(box3.z) === Infinity) {
			box3.setZ(0);
		}

		object.userData.box3 = box3;

		this.graphic.scene.add(object);

		if (position) {
			this.setPosition(object.id, {
				height: position.height,
				latitude: position.longitude,
				longitude: position.latitude,
			});
		}

		return object.id;
	}

	/**
	 * 오브젝트의 위치값을 가져옵니다.
	 * @param id
	 * @returns
	 */
	getPosition(id: number): IWGS84 | undefined {
		const wgs84: IWGS84 | undefined = this.getObject(id)?.userData.wgs84;
		if (wgs84) {
			return new CT_WGS84(wgs84, WGS84_TYPE.THREEJS).toIWGS84();
		}
	}

	/**
	 * 오브젝트의 위치를 설정합니다.
	 * @param id
	 * @param position
	 * @returns
	 */
	setPosition(id: number, position: IWGS84) {
		const object = this.getObject(id);
		if (object && object.userData.original) {
			if (position.height === 0) {
				let box3: Vector3 | undefined = object.userData.box3;
				if (!box3) {
					box3 = new Box3().setFromObject(object).max;
					box3.setZ(box3.z + 1);
					object.userData.box3 = box3;
				}
				position.height = box3.z;
			}
			const wgs84 = new CT_WGS84(position, WGS84_TYPE.CESIUM);
			object.position.copy(object.userData.original.position);
			object.rotation.copy(object.userData.original.rotation);
			object.scale.copy(object.userData.original.scale);
			object.applyMatrix4(wgs84.getMatrix4());
			object.userData.wgs84 = wgs84.toIWGS84();
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 렌더러의 크기를 설정합니다.
	 * @param width
	 * @param height
	 */
	setSize(width: number, height: number) {
		this.graphic.setSize(width, height);
	}

	/**
	 * 렌더러의 카메라를 초기화합니다.
	 * @param param
	 */
	initCamera(param: CameraInitParam) {
		const camera = this.graphic.camera;
		camera.aspect = param.aspect;
		camera.far = param.far;
		camera.near = param.near;
		camera.fov = param.fov;
		camera.updateProjectionMatrix();
	}

	/**
	 * 오브젝트를 삭제합니다.
	 * @param id
	 * @returns
	 */
	delete(id: number) {
		const object = this.getObject(id);

		if (object) {
			if (isMetaObject(object) && object.dispose) {
				object.dispose();
			}

			this.graphic.scene.remove(object);
		}

		return !!object;
	}
}

expose(new CoreThread());

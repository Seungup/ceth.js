import { expose } from 'comlink';
import { Graphic } from './graphic';
import { Box3, Object3D, ObjectLoader, Vector3 } from 'three';
import { RenderQueue } from './render-queue';
import { CT_WGS84, IWGS84 } from './math';
import { isMetaObject, MetaObjectClassCache } from './objects/MetaObject';
import { MetaObjectClassMap, MetaObjectConstructorMap, WGS84_TYPE } from '.';

export interface CameraInitParam {
	aspect: number;
	far: number;
	near: number;
	fov: number;
}

export default class CoreThread {
	private readonly graphic = Graphic.getInstance();
	private readonly objectLoader = new ObjectLoader();
	private _renderQueue = new RenderQueue();
	constructor() {
		this._renderQueue.renderNextFrame$.subscribe(() => {
			self.postMessage({ type: 'onRender' });
		});
		self.onmessage = (e: MessageEvent) => {
			const message = e.data;
			if (message) {
				switch (message.type) {
					case RequestType.RENDER:
						this._renderQueue.requestRender({
							...message.param,
						});
						break;
					case RequestType.INIT:
						this.graphic.init(message.canvas);
						break;
					default:
						break;
				}
			}
		};
	}

	createObject<T extends keyof typeof MetaObjectClassMap>(
		_class: T,
		initParam: MetaObjectConstructorMap[T],
		position: IWGS84 | undefined
	) {
		const MetaClass = MetaObjectClassCache.get(
			MetaObjectClassMap[_class].name
		);
		if (MetaClass) {
			const metaClass = new MetaClass();
			metaClass.onInitialization(initParam);
			if (position) {
				position = new CT_WGS84(position, WGS84_TYPE.CESIUM).toIWGS84();
			}
			this.beforeAdd(metaClass, position);
			this.graphic.scene.add(metaClass);
			return metaClass.id;
		}
	}

	getRenderBehindEarthOfObjects() {
		return this.graphic.renderBehindEarthOfObjects;
	}

	setRenderBehindEarthOfObjects(visible: boolean) {
		if (visible) {
			this.graphic.scene.traverse((object) => {
				if (object.userData.wgs84 && !object.visible) {
					object.visible = true
				};
			})
		}
		this.graphic.renderBehindEarthOfObjects = visible;
	}

	getUserData(id: number) {
		const object = this.getObject(id);
		if (object) {
			return object.userData;
		}
	}

	private getObject(value: number) {
		return this.graphic.scene.getObjectById(value);
	}

	isExist(id: number) {
		return !!this.getObject(id);
	}

	visible(show: boolean) {
		this.graphic.scene.visible = show;
	}

	isVisible() {
		return this.graphic.scene.visible;
	}

	hide(id: number) {
		const object = this.getObject(id);
		if (object) {
			object.visible = false;
		}
		return !!object;
	}

	show(id: number) {
		const object = this.getObject(id);
		if (object) {
			object.visible = true;
		}
		return !!object;
	}

	private beforeAdd(object: Object3D, position: IWGS84 | undefined) {
		object.userData.original = {
			position: object.position.clone(),
			rotation: object.rotation.clone(),
			scale: object.scale.clone(),
		};
		const box3 = new Box3().setFromObject(object).max;
		object.userData.box3 = box3;
		if (!position) {
			position = { height: 0, latitude: 0, longitude: 0 };
		}

		// 높이가 존재하는 물체라면, 높이 적용
		if (position.height === 0 && box3.z !== 0) {
			position.height = box3.z;
		}

		const wgs84 = new CT_WGS84(position, WGS84_TYPE.CESIUM);
		object.applyMatrix4(wgs84.getMatrix4());
		object.userData.wgs84 = wgs84.toIWGS84();
	}

	add(json: any, position: IWGS84 | undefined) {
		const object = this.objectLoader.parse(json);
		object.userData.original = {
			position: object.position.clone(),
			rotation: object.rotation.clone(),
			scale: object.scale.clone(),
		};
		const box3 = new Box3().setFromObject(object).max;
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

	update(id: number, json: any) {
		let object = this.getObject(id);
		if (object) {
			const updateObject = this.objectLoader.parse(json);
			object.copy(updateObject);
		}
		return !!object;
	}

	getPosition(id: number): IWGS84 | undefined {
		const wgs84: IWGS84 | undefined = this.getObject(id)?.userData.wgs84;
		if (wgs84) {
			return new CT_WGS84(wgs84, WGS84_TYPE.THREEJS).toIWGS84();
		}
	}

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

	setSize(width: number, height: number) {
		this.graphic.setSize(width, height);
	}

	initCamera(param: CameraInitParam) {
		const camera = this.graphic.camera;
		camera.aspect = param.aspect;
		camera.far = param.far;
		camera.near = param.near;
		camera.fov = param.fov;
		camera.updateProjectionMatrix();
	}

	delete(id: number) {
		const object = this.getObject(id);
		if (object) {
			if (isMetaObject(object)) {
				object.dispose();
			}
			this.graphic.scene.remove(object);
		}
		return !!object;
	}
}

export const RequestType = Object.freeze({
	RENDER: 0,
	INIT: 1,
});

expose(new CoreThread());

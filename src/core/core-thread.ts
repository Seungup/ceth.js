import { expose } from 'comlink';
import { Graphic } from './graphic';
import {
	Box3,
	IcosahedronBufferGeometry,
	Object3D,
	ObjectLoader,
	Vector3,
} from 'three';
import { RenderQueue } from './render-queue';
import { CT_WGS84, IWGS84, WGS84_TYPE } from './math';
import { MetaObjectCache } from './objects/MetaObject';

export interface CameraInitParam {
	aspect: number;
	far: number;
	near: number;
	fov: number;
}

export default class CoreThread {
	private readonly helpers = new Map<string, Object3D>();
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
					case RequestType.ADD:
						const MetaClass = MetaObjectCache.get(message.class);
						if (MetaClass) {
							const metaClass = new MetaClass();
							metaClass.onInitialization(message.update);
							this.beforeAdd(metaClass, message.position);
							this.graphic.scene.add(metaClass);
						}
						break;
					default:
						break;
				}
			}
		};
	}

	getRenderBehindEarthOfObjects() {
		return this.graphic.renderBehindEarthOfObjects;
	}

	setRenderBehindEarthOfObjects(visible: boolean) {
		this.graphic.renderBehindEarthOfObjects = visible;
	}

	init(canvas: HTMLCanvasElement) {
		this.graphic.init(canvas);
	}

	setPixelRatio(value: number) {
		this.graphic.setPixelRatio(value);
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

		if (position) {
			if (position.height === 0) {
				position.height = box3.z;
			}
			const wgs84 = new CT_WGS84(position, WGS84_TYPE.CESIUM);
			object.applyMatrix4(wgs84.getMatrix4());
			object.userData.wgs84 = wgs84.toIWGS84();
		}
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
			this.graphic.scene.remove(object);
		}
		return !!object;
	}
}

export const RequestType = Object.freeze({
	RENDER: 0,
	ADD: 1,
});

expose(new CoreThread());

import { expose } from 'comlink';
import { Graphic } from './graphic';
import {
	Box3,
	BoxHelper,
	Matrix4,
	Object3D,
	ObjectLoader,
	Vector3,
} from 'three';
import { RenderQueue } from './render-queue';
import { CT_WGS84, IWGS84 } from './math';
import { pointInsideTriangle } from 'cesium';
import { BehaviorSubject } from 'rxjs';

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

	getBox3(id: number): Vector3 | undefined {
		const object = this.getObject(id);
		if (object) {
			return object.userData.box3;
		}
	}

	getUserDataAt<T>(id: number, key: string) {
		const object = this.getObject(id);
		if (object) {
			return <T>object.userData[key];
		}
	}

	setUserDataAt(id: number, key: string, data: any) {
		const object = this.getObject(id);
		if (object) {
			object.userData[key] = data;
		}
	}

	private getObject(value: number) {
		return this.graphic.scene.getObjectById(value);
	}

	isExist(id: number) {
		return !!this.getObject(id);
	}

	setBoxHelperTo(id: number) {
		const object = this.getObject(id);
		if (object) {
			if (this.helpers.has('BoxHelper')) {
				const helper = this.helpers.get('BoxHelper')! as BoxHelper;
				helper.update(object);
			} else {
				const helper = new BoxHelper(object);
				this.helpers.set('BoxHelper', helper);
				this.graphic.scene.add(helper);
			}
		}
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

	add(json: any, position: IWGS84 | undefined) {
		const object = this.objectLoader.parse(json);

		const box3 = new Box3().setFromObject(object).max;
		object.userData.box3 = box3;

		if (position) {
			if (position.height === 0) {
				position.height = box3.z;
			}
			const wgs84 = new CT_WGS84(position);
			object.applyMatrix4(wgs84.getMatrix4());
			object.userData.wgs84 = wgs84.toIWGS84();
		}

		this.graphic.scene.add(object);

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
		return this.getObject(id)?.userData.wgs84;
	}

	setPosition(id: number, position: IWGS84) {
		const object = this.getObject(id);
		if (object) {
			if (position.height === 0) {
				let box3: Vector3 | undefined = object.userData.box3;
				if (!box3) {
					box3 = new Box3().setFromObject(object).max;
					object.userData.box3 = box3;
				}
				position.height = box3.z;
			}
			const wgs84 = new CT_WGS84(position);
			console.log(wgs84.toIWGS84());
			object.position.set(0, 0, 0);
			object.rotation.set(0, 0, 0);
			object.applyMatrix4(wgs84.getMatrix4());
			object.userData.wgs84 = wgs84.toIWGS84();
		}
		return !!object;
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
});

expose(new CoreThread());

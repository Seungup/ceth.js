import { expose } from 'comlink';
import { Graphic } from './graphic';
import { Box3, BoxHelper, Object3D, ObjectLoader, Vector3 } from 'three';
import { RenderQueue } from './render-queue';
import { CT_WGS84, IWGS84 } from './math';

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
						this._renderQueue.updateNextAnimationFrame({
							...message.param,
						});
						break;
					default:
						break;
				}
			}
		};
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

	add(json: any, wgs84: IWGS84 | undefined) {
		const object = this.objectLoader.parse(json);

		const box3 = new Box3().setFromObject(object).max;
		object.userData.box3 = box3;

		if (wgs84) {
			if (wgs84.height === 0) {
				wgs84.height = box3.y;
			}
			object.applyMatrix4(
				CT_WGS84.fromThreeWGS84(
					wgs84.latitude,
					wgs84.longitude,
					wgs84.height
				).getMatrix4()
			);
			object.userData.wgs84 = wgs84;
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

	getWGS84(id: number) {
		debugger;
		const wgs84: CT_WGS84 | undefined = this.getObject(id)?.userData.wgs84;
		if (
			wgs84 &&
			wgs84.latitude !== undefined &&
			wgs84.longitude !== undefined &&
			wgs84.height !== undefined
		) {
			return {
				latitude: wgs84.longitude,
				longitude: wgs84.latitude,
				height: wgs84.height,
			} as IWGS84;
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
		console.table(param);
		camera.updateProjectionMatrix();
	}

	updatePosition(id: number, position: IWGS84) {
		const object = this.getObject(id);
		if (object) {
			position.height = position.height
				? new Box3().setFromObject(object).max.y
				: 0;
			const wgs84 = CT_WGS84.fromCesiumWGS84(
				position.latitude,
				position.longitude,
				position.height
			);
			object.applyMatrix4(wgs84.getMatrix4());
			object.userData.wgs84 = wgs84;
		}
		return !!object;
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

import { expose } from 'comlink';
import { GraphicComponent } from './graphic/graphic.component';
import { BoxHelper, Matrix4, Object3D, ObjectLoader, Vector3 } from 'three';
import { ThreeWGS84 } from '..';
import CameraComponent from './camera/camera.component';
import { RenderQueue } from './render.queue';

export interface CameraInitParam {
	aspect: number;
	far: number;
	near: number;
	fov: number;
}

export default class CoreThread {
	private readonly helpers = new Map<string, Object3D>();
	private readonly graphicComponent = GraphicComponent.getInstance();
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
		this.graphicComponent.init(canvas);
	}

	setPixelRatio(value: number) {
		this.graphicComponent.setPixelRatio(value);
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
		return this.graphicComponent.scene.getObjectById(value);
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
				this.graphicComponent.scene.add(helper);
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

	add(json: any) {
		const object = this.objectLoader.parse(json);
		this.graphicComponent.scene.add(object);
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
		const object = this.getObject(id);
		if (object) {
			return object.userData.wgs84 as ThreeWGS84;
		}
	}

	setSize(width: number, height: number) {
		GraphicComponent.getInstance().setSize(width, height);
	}

	initCamera(param: CameraInitParam) {
		const camera = CameraComponent.getInstance().getCamera();
		camera.aspect = param.aspect;
		camera.far = param.far;
		camera.near = param.near;
		camera.fov = param.fov;
		console.table(param);
		camera.updateProjectionMatrix();
	}

	updatePosition(
		id: number,
		param: {
			matrix: Matrix4;
			position: ThreeWGS84;
		}
	) {
		let object = this.getObject(id);
		if (object) {
			object.applyMatrix4(param.matrix);
			object.userData.wgs84 = param.position;
		}
		return !!object;
	}

	delete(id: number) {
		const object = this.getObject(id);
		if (object) {
			this.graphicComponent.scene.remove(object);
		}
		return !!object;
	}
}

export const RequestType = Object.freeze({
	RENDER: 0,
});

expose(new CoreThread());

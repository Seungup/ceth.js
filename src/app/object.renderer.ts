import { Viewer } from 'cesium';
import { RenderParam } from '../core/graphic/graphic.component';
import { SingletonWorkerFactory } from '../core/worker-factory';
import { Math as CesiumMath, PerspectiveFrustum } from 'cesium';
import { RequestType } from '../core/core-thread';

export class ObjectRenderer {
	private readonly coreWorker =
		SingletonWorkerFactory.getWorker('CoreThread');
	private readonly coreWrapper =
		SingletonWorkerFactory.getWrapper('CoreThread');

	constructor(private readonly viewer: Viewer) {
		this.coreWrapper.setPixelRatio(window.devicePixelRatio);
		this.coreWrapper.initCamera({
			fov: CesiumMath.toDegrees(
				(this.viewer.camera.frustum as PerspectiveFrustum).fovy
			),
			near: this.viewer.camera.frustum.near,
			far: this.viewer.camera.frustum.far,
			aspect:
				this.viewer.container.clientWidth /
				this.viewer.container.clientHeight,
		});
	}

	setSize(width: number, height: number) {
		return this.coreWrapper.setSize(width, height);
	}

	render() {
		const cvm = new Float32Array(this.viewer.camera.viewMatrix);
		const civm = new Float32Array(this.viewer.camera.inverseViewMatrix);
		this.coreWorker.postMessage(
			{
				type: RequestType.RENDER,
				param: {
					cvm: cvm,
					civm: civm,
				} as RenderParam,
			},
			[cvm.buffer, civm.buffer]
		);
	}
}

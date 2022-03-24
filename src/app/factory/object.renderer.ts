import { Viewer } from 'cesium';
import { Math as CesiumMath, PerspectiveFrustum } from 'cesium';
import { getCameraPosition } from '..';
import {
	CoreThreadRequestType,
	ICoreThreadRequetMessage,
} from '../../core/core-thread';
import { RenderParam } from '../../core/graphic';
import { SingletonWorkerFactory } from '../../worker-factory';

export class ObjectRenderer {
	private readonly coreWorker =
		SingletonWorkerFactory.getWorker('CoreThread');
	private readonly coreWrapper =
		SingletonWorkerFactory.getWrapper('CoreThread');

	constructor(private readonly viewer: Viewer) {
		this._update();
	}

	private _update() {
		const w = this.viewer.canvas.width;
		const h = this.viewer.canvas.height;

		this.coreWrapper.initCamera({
			fov: CesiumMath.toDegrees(
				(this.viewer.camera.frustum as PerspectiveFrustum).fovy
			),
			near: this.viewer.camera.frustum.near,
			far: this.viewer.camera.frustum.far,
			aspect: w / h,
		});

		this.coreWrapper.setSize(w, h);
		// 카메라의 높이가 10km 보다 작을 경우, 내부 오브젝트 포지션 계산을 중지하여, 가까운 물체의 가시성이 삭제되는 현상 보완

		this.coreWrapper.setRenderBehindEarthOfObjects(
			getCameraPosition(this.viewer).height < 50 * 1000
		);
	}

	/**
	 * 다음 장면을 요청합니다.
	 */
	render() {
		this._update();

		const cvm = new Float64Array(this.viewer.camera.viewMatrix);
		const civm = new Float64Array(this.viewer.camera.inverseViewMatrix);
		this.coreWorker.postMessage(
			{
				CoreThreadRequestType: CoreThreadRequestType.RENDER,
				param: {
					cvm: cvm,
					civm: civm,
				} as RenderParam,
			} as ICoreThreadRequetMessage,
			[cvm.buffer, civm.buffer]
		);
		// cvm, civm 은 postMessage 로 보내진 후 오브젝트가 자동으로 파기되어 더 이상 사용 불가함.
	}
}

import { Viewer } from 'cesium';
import { RenderParam } from '../core/graphic';
import { SingletonWorkerFactory } from '../core/worker-factory';
import { Math as CesiumMath, PerspectiveFrustum } from 'cesium';
import { RequestType } from '../core/core-thread';

export class ObjectRenderer {
	private readonly coreWorker =
		SingletonWorkerFactory.getWorker('CoreThread');
	private readonly coreWrapper =
		SingletonWorkerFactory.getWrapper('CoreThread');

	constructor(private readonly viewer: Viewer) {
		this.update();
	}

	update() {
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
	}

	/**
	 * 지구 뒷편에 존재하는 오브젝트 렌더링 여부 설정합니다.
	 *
	 * 만약 오브젝트의 위치가 전 세계가 아닐 경우
	 * true 로 설정하여 성능을 향상시킬 수 있습니다.
	 *
	 * @default false
	 *
	 * @param doRender
	 */
	async setRenderBehindEarthOfObjects(doRender: boolean) {
		await this.coreWrapper.setRenderBehindEarthOfObjects(doRender);
	}
	/**
	 * 지구 뒷편에 존재하는 오브젝트의 렌더링 여부를 가져옵니다.
	 *
	 * @returns 렌더링 여부
	 */
	async getRenderBehindEarthOfObjects() {
		return await this.coreWrapper.getRenderBehindEarthOfObjects();
	}

	/**
	 * 다음 장면을 요청합니다.
	 */
	render() {
		// 업데이트
		this.update();

		const cvm = new Float64Array(this.viewer.camera.viewMatrix);
		const civm = new Float64Array(this.viewer.camera.inverseViewMatrix);
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
		// cvm, civm 은 postMessage 로 보내진 후 오브젝트가 자동으로 파기되어 더 이상 사용 불가함.
	}

	visible(show: boolean) {
		this.coreWrapper.visible(show);
	}
}

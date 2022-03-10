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

	/**
	 * 지구 뒷편에 존재하는 오브젝트 렌더링 여부 설정합니다.
	 *
	 * 만약 오브젝트의 위치가 전 세계가 아닐 경우
	 * true 로 설정하여 성능을 향상시킬 수 있습니다.
	 *
	 * @default false
	 *
	 * @param visible 렌더링 여부
	 */
	async setRenderBehindEarthOfObject(visible: boolean) {
		await this.coreWrapper.setRenderBehindEarthOfObject(visible);
	}
	/**
	 * 지구 뒷편에 존재하는 오브젝트의 렌더링 여부를 가져옵니다.
	 *
	 * @returns 렌더링 여부
	 */
	async getRenderBehindEarthOfObject() {
		return await this.coreWrapper.getRenderBehindEarthOfObject();
	}

	/**
	 * 장면을 그리기 위한 크기를 설정합니다.
	 * @param width
	 * @param height
	 * @returns
	 */
	setSize(width: number, height: number) {
		return this.coreWrapper.setSize(width, height);
	}

	/**
	 * 장면을 그립니다.
	 */
	render() {
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
	}
}

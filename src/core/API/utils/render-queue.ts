import { CameraComponent } from '../components/camera.component';
import { Graphic } from '../graphic';

/**
 * Cesium 과 three.js 의 스레드 간 렌더 비동기 이슈를 해결합니다.
 */
export namespace RenderQueue {
	let param: CameraComponent.UpdateCameraParam | undefined;
	let isRequestRender: boolean = false;

	/**
	 * 다음 장면을 그립니다.
	 */
	const render = () => {
		if (param) {
			Graphic.render(param);
			param = undefined;
		}
		isRequestRender = false;
	};

	/**
	 * 다음 장면을 요청합니다.
	 * @param param 렌더링 파라미터
	 */
	export const requestRender = (
		updateCameraParam: CameraComponent.UpdateCameraParam
	) => {
		if (!isRequestRender) {
			isRequestRender = true;
			param = updateCameraParam;
			render();
		}
	};
}

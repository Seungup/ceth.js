/**
 * 렌더러와 연결되는 API 입니다.
 */
import { Graphic } from '../graphic';

export namespace RendererAPI {
	export interface CameraInitParam {
		aspect: number;
		far: number;
		near: number;
		fov: number;
	}
	/**
	 * 렌더러의 카메라를 초기화합니다.
	 * @param param
	 */
	export function initCamera(param: CameraInitParam) {
		const camera = Graphic.getInstance().camera;
		camera.aspect = param.aspect;
		camera.far = param.far;
		camera.near = param.near;
		camera.fov = param.fov;
		camera.updateProjectionMatrix();
	}

	/**
	 * 렌더러의 크기를 설정합니다.
	 * @param width
	 * @param height
	 */
	export function setSize(width: number, height: number) {
		Graphic.getInstance().setSize(width, height);
	}

	/**
	 * 지구 뒷편에 존재하는 오브젝트의 렌더 여부를 결정합니다.
	 *
	 * @param visible 가시 여부
	 */
	export function setRenderBehindEarthOfObjects(visible: boolean) {
		Graphic.getInstance().renderBehindEarthOfObjects = visible;
	}
}

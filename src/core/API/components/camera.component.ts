import { PerspectiveCamera } from 'three';

export namespace CameraComponent {
	export interface UpdateCameraParam {
		cvm: Float64Array;
		civm: Float64Array;
	}

	export function isUpdateCameraParam(
		object: any
	): object is UpdateCameraParam {
		object = <UpdateCameraParam>object;
		return object.cvm !== undefined && object.civm !== undefined;
	}

	export const camera = new PerspectiveCamera();

	export namespace API {
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
		export const initCamera = (param: CameraInitParam) => {
			camera.aspect = param.aspect;
			camera.far = param.far;
			camera.near = param.near;
			camera.fov = param.fov;
			camera.updateProjectionMatrix();
		};

		export const updateCamera = (param: UpdateCameraParam) => {
			camera.matrixAutoUpdate = false;

			// prettier-ignore
			camera.matrixWorld.set(
                param.civm[ 0], param.civm[ 4], param.civm[ 8], param.civm[12],
                param.civm[ 1], param.civm[ 5], param.civm[ 9], param.civm[13],
                param.civm[ 2], param.civm[ 6], param.civm[10], param.civm[14],
                param.civm[ 3], param.civm[ 7], param.civm[11], param.civm[15]
            );
			// prettier-ignore
			camera.matrixWorldInverse.set(
                param.cvm[ 0], param.cvm[ 4], param.cvm[ 8], param.cvm[12],
                param.cvm[ 1], param.cvm[ 5], param.cvm[ 9], param.cvm[13],
                param.cvm[ 2], param.cvm[ 6], param.cvm[10], param.cvm[14],
                param.cvm[ 3], param.cvm[ 7], param.cvm[11], param.cvm[15]
            );
			camera.updateProjectionMatrix();
		};
	}
}

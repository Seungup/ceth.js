import * as THREE from 'three';
import { CT_Cartesian3, IWGS84 } from '.';

export interface CurrentExtent {
	xmin: number;
	ymin: number;
	xmax: number;
	ymax: number;
	height: number;
}

export interface RenderParam {
	cvm: Float64Array;
	civm: Float64Array;
}

export class Graphic {
	private static instance: Graphic;
	readonly camera: THREE.PerspectiveCamera;
	private constructor(readonly scene = new THREE.Scene()) {
		this.camera = new THREE.PerspectiveCamera();
	}

	static getInstance() {
		return this.instance || (this.instance = new this());
	}

	setPixelRatio(value: number): boolean {
		let success = false;
		if (this.renderer) {
			this.renderer.setPixelRatio(value);
			success = true;
		}
		return success;
	}

	renderer?: THREE.WebGLRenderer;
	init(canvas: HTMLCanvasElement) {
		const params: THREE.WebGLRendererParameters = {
			canvas: canvas,
			powerPreference: 'high-performance',
			alpha: true,
			antialias: true,
			logarithmicDepthBuffer: true,
			depth: false,
		};

		const context = canvas.getContext('webgl2');
		if (context) {
			params.context = context;
		}

		this.renderer = new THREE.WebGLRenderer(params);
		console.log(
			`[Graphic] isWebGL2Enabled : ${this.renderer.capabilities.isWebGL2}`
		);
	}

	setSize(width: number, height: number) {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer?.setSize(width, height, false);
	}

	private _normalMatrix = new THREE.Matrix3();
	/**
	 * 장면을 렌더링합니다.
	 * @param param
	 */
	render(param: RenderParam) {
		if (this.renderer) {
			this.camera.matrixAutoUpdate = false;

			// prettier-ignore
			this.camera.matrixWorld.set(
				param.civm[ 0], param.civm[ 4], param.civm[ 8], param.civm[12],
				param.civm[ 1], param.civm[ 5], param.civm[ 9], param.civm[13],
				param.civm[ 2], param.civm[ 6], param.civm[10], param.civm[14],
				param.civm[ 3], param.civm[ 7], param.civm[11], param.civm[15]
			);
			// prettier-ignore
			this.camera.matrixWorldInverse.set(
				param.cvm[ 0], param.cvm[ 4], param.cvm[ 8], param.cvm[12],
				param.cvm[ 1], param.cvm[ 5], param.cvm[ 9], param.cvm[13],
				param.cvm[ 2], param.cvm[ 6], param.cvm[10], param.cvm[14],
				param.cvm[ 3], param.cvm[ 7], param.cvm[11], param.cvm[15]
			);
			this.camera.updateProjectionMatrix();

			this._normalMatrix.getNormalMatrix(this.camera.matrixWorldInverse);
			this.scene.traverse(this._setObjectVisible.bind(this));

			this.renderer.render(this.scene, this.camera);
		}
	}

	private _tempVector3 = new THREE.Vector3();
	private _cameraToPoint = new THREE.Vector3();
	/**
	 * 오브젝트의 지구 뒷면 렌더링을 제어합니다.
	 *
	 * @param object
	 * @returns
	 */
	private _setObjectVisible(object: THREE.Object3D) {
		// 위치를 가지는 오브젝트만 선정
		if (!object.userData.wgs84) return;

		this._tempVector3
			.copy(object.position)
			.applyMatrix3(this._normalMatrix);

		this._cameraToPoint
			.copy(object.position)
			.applyMatrix4(this.camera.matrixWorldInverse)
			.normalize();

		/**
		 * 카메라에서 현재 위치의 방향(벡터) 값으로 카메라에서 지구본 위 위치값 까지의
		 * 방향 값을 구한 후, 이 값으로 스칼라 곱을 구한다.
		 *
		 * == -1 : 카메라를 정면으로 바라봄
		 *
		 * ==  0 : 카메라에서 구면에 정확히 접선함.
		 *
		 * >=  0 : 카메라 뒷면에 있음
		 */
		const dot = this._tempVector3.dot(this._cameraToPoint);
		const maxDot = -0.2;
		object.visible = dot < maxDot;
	}
}

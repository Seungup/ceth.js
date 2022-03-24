import {
	Matrix3,
	Object3D,
	PerspectiveCamera,
	Scene,
	sRGBEncoding,
	Vector3,
	WebGLRenderer,
	WebGLRendererParameters,
} from 'three';

export interface RenderParam {
	cvm: Float64Array;
	civm: Float64Array;
}

export interface InitParam {
	canvas: HTMLCanvasElement;
}

export class Graphic {
	private static instance: Graphic;
	readonly camera: PerspectiveCamera = new PerspectiveCamera();
	readonly scene: Scene = new Scene();
	private constructor() {
		this.scene.matrixAutoUpdate = false;
	}

	static getInstance() {
		return this.instance || (this.instance = new this());
	}

	renderer?: WebGLRenderer;

	init(param: InitParam) {
		const params: WebGLRendererParameters = {
			canvas: param.canvas,
			powerPreference: 'high-performance',
			alpha: true,
			logarithmicDepthBuffer: true,
			depth: false,
			preserveDrawingBuffer: false,
			stencil: false,
		};

		const context = param.canvas.getContext('webgl2');
		if (context) {
			params.context = context;
		}

		this.renderer = new WebGLRenderer(params);
		this.renderer.outputEncoding = sRGBEncoding;
	}

	setSize(width: number, height: number) {
		this.renderer?.setSize(width, height, false);
	}

	// 지구 뒷편 오브젝트 렌더링 여부
	renderBehindEarthOfObjects: boolean = false;

	private _normalMatrix = new Matrix3();
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

			// 지구 뒷편 오브젝트 계산 여부
			if (!this.renderBehindEarthOfObjects) {
				this._normalMatrix.getNormalMatrix(
					this.camera.matrixWorldInverse
				);
				this.scene.traverse(this._setObjectVisible.bind(this));
			}
			this.renderer.render(this.scene, this.camera);
		}
	}

	private _tempVector3 = new Vector3();
	private _cameraToPoint = new Vector3();
	/**
	 * 오브젝트의 지구 뒷면 렌더링을 제어합니다.
	 *
	 * @param object
	 * @returns
	 */
	private _setObjectVisible(object: Object3D) {
		// 위치를 가지는 오브젝트만 선정
		if (!object.userData.wgs84) return;

		object.visible =
			this._tempVector3
				.copy(object.position)
				.applyMatrix3(this._normalMatrix)
				.dot(
					this._cameraToPoint
						.copy(object.position)
						.applyMatrix4(this.camera.matrixWorldInverse)
						.normalize()
				) < 0;
	}
}

import * as THREE from 'three';
import CameraComponent from '../camera/camera.component';
import { Matrix4, Vector3, WebGLRendererParameters } from 'three';

export interface CurrentExtent {
	xmin: number;
	ymin: number;
	xmax: number;
	ymax: number;
	height: number;
}

export interface RenderParam {
	cvm: Float32Array;
	civm: Float32Array;
}

export class GraphicComponent {
	private static instance: GraphicComponent;
	private readonly camera: THREE.PerspectiveCamera;
	private constructor(
		readonly scene = new THREE.Scene(),
		private readonly cameraComponent = CameraComponent.getInstance()
	) {
		this.camera = this.cameraComponent.getCamera();
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
		const params: WebGLRendererParameters = {
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
		const camera = this.cameraComponent.getCamera();
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		this.renderer?.setSize(width, height, false);
	}

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

			this.renderer.render(this.scene, this.camera);
		}
	}
}

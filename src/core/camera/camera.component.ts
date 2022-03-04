import { PerspectiveCamera } from 'three';
import { Matrix4 } from 'cesium';

export default class CameraComponent {
	private static instance: CameraComponent;
	private readonly perspectiveCamera: PerspectiveCamera;
	private constructor() {
		this.perspectiveCamera = new PerspectiveCamera();
	}

	getCamera(): PerspectiveCamera {
		return this.perspectiveCamera;
	}

	static getInstance() {
		return this.instance || (this.instance = new this());
	}
}

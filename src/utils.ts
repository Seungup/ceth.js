import * as Cesium from 'cesium';
import * as THREE from 'three';
import { CesiumWGS84, ThreeWGS84 } from './interface';

export class Utils {
	static randomOffset() {
		return Math.floor(Math.random() * 10000) * 0.000001;
	}
	static CesiumWGS84ToThreeWGS84(cesiumWGS84: CesiumWGS84): ThreeWGS84 {
		return {
			latitude: cesiumWGS84.longitude,
			longitude: cesiumWGS84.latitude,
		};
	}

	static ThreeWGS84ToCesiumWGS84(ThreeWGS84: ThreeWGS84): CesiumWGS84 {
		return {
			latitude: ThreeWGS84.longitude,
			longitude: ThreeWGS84.latitude,
		};
	}

	static getWindowPosition(viewer: Cesium.Viewer) {
		return new Cesium.Cartesian2(
			viewer.canvas.clientWidth / 2.0,
			viewer.canvas.clientHeight / 2.0
		);
	}

	static getPosition(
		viewer: Cesium.Viewer,
		windowPosition: Cesium.Cartesian2
	) {
		const result = viewer.camera.pickEllipsoid(windowPosition);
		if (result) {
			return viewer.scene.globe.ellipsoid.cartesianToCartographic(result);
		}
	}

	static getWGS84FromCartographic(cartographic: Cesium.Cartographic) {
		return {
			lat: (cartographic.latitude * 180) / Math.PI,
			lon: (cartographic.longitude * 180) / Math.PI,
		};
	}

	static getCurrentCenterPosition(viewer: Cesium.Viewer) {
		return this.getPosition(viewer, this.getWindowPosition(viewer));
	}

	static getCurrentCenterHeight(viewer: Cesium.Viewer) {
		return this.getCurrentCenterPosition(viewer)?.height;
	}

	static rotationX(degrees: number) {
		return new THREE.Matrix4().makeRotationX(
			Cesium.Math.toRadians(degrees)
		);
	}

	static applayRotation(object: THREE.BufferGeometry, degrees: number) {
		object.applyMatrix4(this.rotationX(degrees));
	}
}

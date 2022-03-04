import * as Cesium from 'cesium';
import * as THREE from 'three';
import { Transforms } from '.';
import { Cartesian3 } from './core/math/cartesian3';
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

	static localWGS84ToMattrix4(
		position: ThreeWGS84,
		height: number = 0
	): THREE.Matrix4 {
		const matrix = Transforms.headingPitchRollToFixedFrame(
			Cartesian3.fromDegree(position.longitude, position.latitude, height)
		);

		const localToWgs84Mattrix = new THREE.Matrix4();
		// prettier-ignore
		localToWgs84Mattrix.set(
			matrix.elements[0], matrix.elements[4], matrix.elements[ 8], matrix.elements[12],
			matrix.elements[1], matrix.elements[5], matrix.elements[ 9], matrix.elements[13],
			matrix.elements[2], matrix.elements[6], matrix.elements[10], matrix.elements[14],
			matrix.elements[3], matrix.elements[7], matrix.elements[11], matrix.elements[15]
		);

		return localToWgs84Mattrix;
	}

	static applyObjectWGS84Postion(
		geometry: THREE.BufferGeometry,
		position: CesiumWGS84 | ThreeWGS84
	) {
		let pos: ThreeWGS84;
		if (position instanceof CesiumWGS84) {
			pos = this.CesiumWGS84ToThreeWGS84(position);
		} else {
			pos = position;
		}
		const matrix = this.localWGS84ToMattrix4(pos);
		geometry.applyMatrix4(matrix);
		geometry.userData.wgs84 = pos;
	}
}

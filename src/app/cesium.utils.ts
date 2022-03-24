import * as Cesium from 'cesium';
import { IWGS84 } from '../math';
import { ObjectAPI } from './factory/object.api';

export function getCameraPosition(viewer: Cesium.Viewer) {
	const result = new Cesium.Cartographic();
	viewer.scene.globe.ellipsoid.cartesianToCartographic(
		viewer.camera.positionWC,
		result
	);
	return {
		longitude: Cesium.Math.toDegrees(result.longitude),
		latitude: Cesium.Math.toDegrees(result.latitude),
		height: result.height,
	} as IWGS84;
}

const _scratchCartesian2 = new Cesium.Cartesian2();

export function mousePositionToWGS84(viewer: Cesium.Viewer, event: MouseEvent) {
	_scratchCartesian2.x = event.clientX;
	_scratchCartesian2.y = event.clientY;

	const selectedLocation = convertScreenPixelToLocation(
		viewer,
		_scratchCartesian2
	);

	if (selectedLocation) {
		return {
			height: 0,
			latitude: selectedLocation.longitude,
			longitude: selectedLocation.latitude,
		} as IWGS84;
	}
}

export function convertScreenPixelToLocation(
	viewer: Cesium.Viewer,
	position: Cesium.Cartesian2
) {
	const ellipsoid = viewer.scene.globe.ellipsoid;
	const cartesian = viewer.camera.pickEllipsoid(position, ellipsoid);

	if (cartesian) {
		const cartographic = ellipsoid.cartesianToCartographic(cartesian);
		return {
			height: 0,
			latitude: Cesium.Math.toDegrees(cartographic.latitude),
			longitude: Cesium.Math.toDegrees(cartographic.longitude),
		} as IWGS84;
	}
}
export async function flyByObjectAPI(viewer: Cesium.Viewer, api: ObjectAPI) {
	const position = await api.getPosition();
	const box3 = await api.getBox3();
	if (position) {
		let radius = undefined;
		if (box3) {
			if (box3.z > 0) {
				radius = box3.z * 1.5;
			} else if (box3.y > 0) {
				radius = box3.y * 1.5;
			} else if (box3.x > 0) {
				radius = box3.x * 1.5;
			} else {
				radius = 50;
			}
		}
		if (isNaN(position.height)) {
			position.height = 0;
		}
		return flyByWGS84(viewer, position, radius);
	}
}

export function flyByWGS84(
	viewer: Cesium.Viewer,
	position: IWGS84,
	radius: number | undefined = undefined
) {
	const wgs84Position = Cesium.Cartesian3.fromDegrees(
		position.longitude,
		position.latitude,
		position.height
	);
	viewer.camera.flyToBoundingSphere(
		new Cesium.BoundingSphere(wgs84Position, radius)
	);
}

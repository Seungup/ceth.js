import * as Cesium from 'cesium';
import OpenStreetMapImageryProvider from 'cesium/Source/Scene/OpenStreetMapImageryProvider';
import { IWGS84 } from '..';
import { SingletonWorkerFactory } from '../core/worker-factory';
import { ObjectAPI } from './object.api';

export class ObjectUtil {
	private readonly coreWrapper =
		SingletonWorkerFactory.getWrapper('CoreThread');

	constructor(private readonly viewer: Cesium.Viewer) {
		this.viewer.canvas.addEventListener(
			'contextmenu',
			(event) => {
				const mousePosition = new Cesium.Cartesian2(
					event.clientX,
					event.clientY
				);
				const selectedLocation =
					this.convertScreenPixelToLocation(mousePosition);
				console.log(selectedLocation);
			},
			false
		);
	}

	convertScreenPixelToLocation(position: Cesium.Cartesian2) {
		const ellipsoid = this.viewer.scene.globe.ellipsoid;
		const cartesian = this.viewer.camera.pickEllipsoid(position, ellipsoid);

		if (cartesian) {
			const cartographic = ellipsoid.cartesianToCartographic(cartesian);
			const lon = Cesium.Math.toDegrees(cartographic.longitude);
			const lat = Cesium.Math.toDegrees(cartographic.latitude);

			return {
				lat: Number(lat.toFixed(15)),
				lon: Number(lon.toFixed(15)),
			};
		}
	}

	async flyByObjectAPI(api: ObjectAPI) {
		return this.flyByObjectId(api.id);
	}

	async flyByObjectId(id: number) {
		const position = await this.coreWrapper.getPosition(id);
		if (position) {
			const latitude = position.latitude;
			position.latitude = position.longitude;
			position.longitude = latitude;
			const result = await this.coreWrapper.getBox3(id);
			const radius = result ? result.z * 2 : undefined;
			return this.flyByWGS84(position, radius);
		}
	}

	async flyByWGS84(position: IWGS84, radius: number | undefined = undefined) {
		const wgs84Position = Cesium.Cartesian3.fromDegrees(
			position.latitude,
			position.longitude,
			position.height
		);
		this.viewer.camera.flyToBoundingSphere(
			new Cesium.BoundingSphere(wgs84Position, radius),
			{
				duration: 1,
			}
		);
	}
}

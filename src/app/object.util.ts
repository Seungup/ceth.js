import * as Cesium from 'cesium';
import { IWGS84 } from '../math';
import { ObjectAPI } from './object.api';

export class ObjectUtil {
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
				if (selectedLocation) {
					this.onSelectLocation(selectedLocation);
				}
			},
			false
		);
	}

	onSelectLocation: { (location: IWGS84): void } = () => {};

	convertScreenPixelToLocation(position: Cesium.Cartesian2) {
		const ellipsoid = this.viewer.scene.globe.ellipsoid;
		const cartesian = this.viewer.camera.pickEllipsoid(position, ellipsoid);

		if (cartesian) {
			const cartographic = ellipsoid.cartesianToCartographic(cartesian);
			return {
				height: 0,
				latitude: Cesium.Math.toDegrees(cartographic.latitude),
				longitude: Cesium.Math.toDegrees(cartographic.longitude),
			} as IWGS84;
		}
	}

	async flyByObjectAPI(api: ObjectAPI) {
		const position = await api.getPosition();
		const box3 = await api.getBox3();
		if (position) {
			let radius = undefined;
			if (box3 && box3.z) {
				radius = box3.z * 3;
			}
			if (isNaN(position.height)) {
				position.height = 0;
			}
			return this.flyByWGS84(position, radius);
		}
	}

	flyByWGS84(position: IWGS84, radius: number | undefined = undefined) {
		const wgs84Position = Cesium.Cartesian3.fromDegrees(
			position.longitude,
			position.latitude,
			position.height
		);
		this.viewer.camera.flyToBoundingSphere(
			new Cesium.BoundingSphere(wgs84Position, radius)
		);
	}
}

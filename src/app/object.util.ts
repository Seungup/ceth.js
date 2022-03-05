import * as Cesium from 'cesium';
import { Utils } from '..';
import { SingletonWorkerFactory } from '../core/worker-factory';

export class ObjectUtil {
	private readonly coreWrapper =
		SingletonWorkerFactory.getWrapper('CoreThread');

	constructor(private readonly viewer: Cesium.Viewer) {}

	async flyTo(id: number) {
		let position = await this.coreWrapper.getWGS84(id);
		if (position) {
			position = Utils.ThreeWGS84ToCesiumWGS84(position);
			const wgs84Position = Cesium.Cartesian3.fromDegrees(
				position.latitude,
				position.longitude,
				0
			);
			const result = await this.coreWrapper.getBox3(id);
			const radius = result ? result.z * 2 : undefined;
			this.viewer.camera.flyToBoundingSphere(
				new Cesium.BoundingSphere(wgs84Position, radius)
			);
		}
	}
}

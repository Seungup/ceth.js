import * as Cesium from 'cesium';
import { IWGS84 } from '..';
import { SingletonWorkerFactory } from '../core/worker-factory';
import { ObjectAPI } from './object.api';

export class ObjectUtil {
	private readonly coreWrapper =
		SingletonWorkerFactory.getWrapper('CoreThread');

	constructor(private readonly viewer: Cesium.Viewer) {}

	async flyByObjectAPI(api: ObjectAPI) {
		return this.flyByObjectId(api.id);
	}

	async flyByObjectId(id: number) {
		const position = await this.coreWrapper.getWGS84(id);
		if (position) {
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

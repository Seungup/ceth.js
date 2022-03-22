/**
 * You can also import Cesium Object like this
 *
 * import * as Cesium from 'cesium';
 * const viewer = new Cesium.Viewer('cesiumContainer');
 */
import { Viewer } from 'cesium';
import './css/main.css';
import * as CT from '../../src';
import { CircleObjectInitializationParam } from '../../src/core/objects/CircleObject';

const viewer = new Viewer('cesiumContainer', { useDefaultRenderLoop: false });

const factory = new CT.InterfcaeFactory(viewer);
const manager = factory.manager;
const util = factory.util;
const renderer = factory.renderer;

(function animation() {
	requestAnimationFrame(animation);
	renderer.render();
	viewer.render();
})();

manager
	.addObject(
		CT.ObjectStore.CircleObject,
		{
			color: 0xffffff,
			radius: 100,
		} as CircleObjectInitializationParam,
		{
			height: 0,
			latitude: 37.5666805,
			longitude: 126.9784147,
		}
	)
	.then((api) => {
		if (api) {
			util.flyByObjectAPI(api);
		}
	});

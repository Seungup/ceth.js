/**
 * You can also import Cesium Object like this
 *
 * import * as Cesium from 'cesium';
 * const viewer = new Cesium.Viewer('cesiumContainer');
 */
import { Viewer } from 'cesium';
import './css/main.css';
import * as CT from '../../src';

const constructorOptions: Viewer.ConstructorOptions = {
	useDefaultRenderLoop: false,
};

(function setViewerConstructorOptions(option: Viewer.ConstructorOptions) {
	option.infoBox = false;
	option.timeline = false;
	option.vrButton = false;
	option.geocoder = false;
	option.animation = false;
	option.sceneModePicker = false;
	option.baseLayerPicker = false;
	option.projectionPicker = false;
	option.fullscreenButton = false;
	option.navigationHelpButton = false;
})(constructorOptions);

const viewer = new Viewer('cesiumContainer', constructorOptions);

const factory = new CT.InterfcaeFactory(viewer);
const manager = factory.manager;
const util = factory.util;
const renderer = factory.renderer;
// renderer.setRenderBehindEarthOfObjects(true);

(function animation() {
	requestAnimationFrame(animation);
	renderer.render();
	viewer.render();
})();

async function example() {
	let flyed = false;
	for (let i = 0; i < 90; i++) {
		for (let j = 0; j < 30; j++) {
			const api = await manager.addObject(
				'CircleObject',
				{
					color: Math.random() * 0xffffff,
					radius: 500,
				},
				{
					height: 0,
					latitude: 37.5666805 + j * 10,
					longitude: 126.9784147 + i * 4,
				}
			);
			if (api && !flyed) {
				await util.flyByObjectAPI(api);
				flyed = true;
			}
		}
	}
}

example();

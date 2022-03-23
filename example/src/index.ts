import * as Cesium from 'cesium';
import './css/main.css';
import * as CT from '../../src';
import { getCameraPosition } from '../../src/app/cesium.utils';
import { ObjectAPI } from '../../src/app/object.api';
import { CustomObject } from './CustomObject';

const constructorOptions: Cesium.Viewer.ConstructorOptions = {
	useDefaultRenderLoop: false,
};

(function setViewerConstructorOptions(
	option: Cesium.Viewer.ConstructorOptions
) {
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

const viewer = new Cesium.Viewer('cesiumContainer', constructorOptions);

const factory = new CT.InterfcaeFactory(viewer);
const manager = factory.manager;
const util = factory.util;
const renderer = factory.renderer;

(function animation() {
	requestAnimationFrame(animation);
	renderer.render();
	viewer.render();
})();

let objectAPI: ObjectAPI | undefined;

util.onSelectLocation = (location) => {
	const size = Math.random() * getCameraPosition(viewer).height * 0.05 + 10;
	manager.add(new CustomObject(size), location).then((api) => {
		if (objectAPI) {
			objectAPI.dispose();
		}
		objectAPI = api;
	});
};

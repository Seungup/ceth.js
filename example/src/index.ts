import * as Cesium from 'cesium';
import {
	BoxBufferGeometry,
	BoxHelper,
	DoubleSide,
	GridHelper,
	MeshBasicMaterial,
	MeshNormalMaterial,
} from 'three';
import { Cesium3, MetaMesh } from '../../src';
import './css/main.css';

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

const factory = new Cesium3.InterfcaeFactory(viewer);
const manager = factory.manager;
const util = factory.util;
const renderer = factory.renderer;
const preview = factory.preview;

(function animation() {
	requestAnimationFrame(animation);
	renderer.render();
	viewer.render();
})();

const object = new MetaMesh(
	new BoxBufferGeometry(10, 10, 10),
	new MeshNormalMaterial({
		side: DoubleSide,
		wireframe: true,
	})
);
object.add(new BoxHelper(object));

util.onSelectLocation = () => {
	if (preview.isAttached()) {
		preview.detach();
	} else {
		preview.attach(object);
	}
};

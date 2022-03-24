import { Viewer } from 'cesium';
import { BoxBufferGeometry, DoubleSide, MeshNormalMaterial } from 'three';
import { Cesium3, MetaMesh } from '../../src';
import { flyByObjectAPI } from '../../src/app';
import './css/main.css';

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

const factory = new Cesium3.InterfcaeFactory(viewer);

// const manager = factory.manager;
const renderer = factory.renderer;
const preview = factory.preview;
const event = factory.event;
const manager = factory.manager;

(function animation() {
	requestAnimationFrame(animation);
	renderer.render();
	viewer.render();
})();

const object = new MetaMesh(
	new BoxBufferGeometry(10000, 10000, 10000),
	new MeshNormalMaterial({
		side: DoubleSide,
	})
);
// manager
// 	.add(object, {
// 		height: 0,
// 		latitude: 37.5666805,
// 		longitude: 126.9784147,
// 	})
// 	.then((api) => {
// 		flyByObjectAPI(viewer, api);
// 	});

event.onContextMenu.subscribe(() => {
	debugger;
	if (preview.isAttached()) {
		preview.detach();
	} else {
		preview.attach(object);
	}
});

import * as Cesium from 'cesium';
import './css/main.css';
import * as CT from '../../src';
import * as THREE from 'three'

const constructorOptions: Cesium.Viewer.ConstructorOptions = {
	useDefaultRenderLoop: false,
};

(function setViewerConstructorOptions(option: Cesium.Viewer.ConstructorOptions) {
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

async function example() {
	let flyed = false;
	for (let i = 0; i < 180; i++) {
		for (let j = 0; j < 10; j++) {
			const api = await manager.addObject(
				'CircleObject',
				{
					color:  0xffffff,
					radius: 10,
				},
				{
					height: 0,
					latitude: 37.5666805 + j * 0.0001,
					longitude: 126.9784147 + i * 0.0001,
				}
			);
			if (api && !flyed) {
				await util.flyByObjectAPI(api);
				flyed = true;
			}
		}
	}
}

async function example2() {
	let flyed = false;
	manager.add(new THREE.DirectionalLight())
	for (let i = 0; i < 45; i++) {
		for (let j = 0; j < 5; j++) {
			const result = await manager.add(
				new THREE.Mesh(
					new THREE.BoxGeometry(100000, 100000, 100000),
					new THREE.MeshPhongMaterial({
						side: THREE.DoubleSide
					})
				),
				{
					height: 0,
					latitude: 37.5666805 + j * 2,
					longitude: 126.9784147 + i * 2,
				}
			);
			if (result) {
				result.object.material.dispose();
				result.object.geometry.dispose();
				if (!flyed) {
					await util.flyByObjectAPI(result.api);
					flyed = true;
				}
			}
		}
	}
}

example2();

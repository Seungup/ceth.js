import { PlaneGeometry, BoxGeometry } from 'three';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry';
import { Utils } from './utils';

export function makeTeapotGeometry(teapotSize: number = 10) {
	const teapotGeometry = new TeapotGeometry(teapotSize);
	Utils.applayRotation(teapotGeometry, 90);
	return teapotGeometry;
}

export function makeBoxGeometry(boxSize = 1000) {
	const geometry = new BoxGeometry(boxSize, boxSize, boxSize);
	return geometry;
}

export function makePlaneGeometry(w: number, h: number) {
	const geometry = new PlaneGeometry(w, h);
	// Utils.applayRotation(geometry, 90);
	return geometry;
}

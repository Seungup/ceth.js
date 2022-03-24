import {
	SVGLoader,
	SVGResultPaths,
} from 'three/examples/jsm/loaders/SVGLoader';
import { DoubleSide, MeshBasicMaterial, ShapeGeometry } from 'three';
import { MetaMesh } from './MetaMesh';
import { MetaGroup } from './MetaGroup';
import { IMetaObject } from '.';

export class MetaSVG extends MetaGroup implements IMetaObject {
	isMetaObject: boolean = true;

	private constructor(paths: SVGResultPaths[]) {
		super();
		this.position.x = -7000;
		this.position.y = 7000;

		for (let i = 0; i < paths.length; i++) {
			const path = paths[i];

			const material = new MeshBasicMaterial({
				color: path.color,
				side: DoubleSide,
				depthWrite: false,
			});

			const shapes = SVGLoader.createShapes(path);

			for (let j = 0; j < shapes.length; j++) {
				const shape = shapes[j];
				const geometry = new ShapeGeometry(shape);
				const mesh = new MetaMesh(geometry, material);
				this.add(mesh);
			}
		}
	}

	static async fromURL(url: string) {
		const loader = new SVGLoader();
		const data = await loader.loadAsync(url);
		return new MetaSVG(data.paths);
	}

	static fromText(text: string) {
		const loader = new SVGLoader();
		const data = loader.parse(text);
		return new MetaSVG(data.paths);
	}
}

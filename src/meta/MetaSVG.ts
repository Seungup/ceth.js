import {
	SVGLoader,
	SVGResultPaths,
} from 'three/examples/jsm/loaders/SVGLoader';
import { BoxHelper, DoubleSide, MeshBasicMaterial, ShapeGeometry } from 'three';
import { MetaMesh } from './MetaMesh';
import { MetaGroup } from './MetaGroup';
import { IMetaObject } from '.';
export class MetaSVG extends MetaGroup implements IMetaObject {
	isMetaObject: boolean = true;

	private _update(paths: SVGResultPaths[], scale: number = 1): this {
		this.dispose();

		this.scale.multiplyScalar(0.25);

		this.position.x = -70;
		this.position.y = 70;
		this.scale.y *= -1;

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
				mesh.scale.x = mesh.scale.y = mesh.scale.z = scale;

				mesh.matrixAutoUpdate = false;
				mesh.updateMatrix();

				this.add(mesh);
			}
		}

		return this;
	}

	async fromURL(url: string, scale: number = 1): Promise<this> {
		const loader = new SVGLoader();
		const data = await loader.loadAsync(url);
		return this._update(data.paths, scale);
	}

	fromText(text: string, scale: number = 1): this {
		const loader = new SVGLoader();
		const data = loader.parse(text);
		return this._update(data.paths, scale);
	}
}

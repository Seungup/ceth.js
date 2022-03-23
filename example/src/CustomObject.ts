import { IMetaObject } from '../../src/core';
import * as THREE from 'three';

export class CustomObject
	extends THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial>
	implements IMetaObject
{
	isMetaObject = true;
	constructor(size: number) {
		super(
			new THREE.BoxGeometry(size, size, size),
			new THREE.MeshNormalMaterial({
				side: THREE.DoubleSide,
			})
		);
	}

	dispose(): void {
		this.geometry.dispose();
		this.material.dispose();
	}
}

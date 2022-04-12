import * as THREE from "three";
import { Mesh } from "three";
import { randInt } from "three/src/math/MathUtils";

export class RandomObject {
    private readonly geometryArray = new Array<THREE.BufferGeometry>();
    private readonly matrialArray = new Array<THREE.Material>();

    constructor() {
        this.geometryArray.push(
            new THREE.BoxBufferGeometry(10000, 10000, 10000),
            new THREE.BoxBufferGeometry(20000, 20000, 20000),
            new THREE.BoxBufferGeometry(30000, 30000, 30000),
            new THREE.BoxBufferGeometry(40000, 40000, 40000),
            new THREE.BoxBufferGeometry(50000, 50000, 50000),
            new THREE.BoxBufferGeometry(15000, 15000, 15000),
            new THREE.BoxBufferGeometry(25000, 25000, 25000),
            new THREE.BoxBufferGeometry(35000, 35000, 35000),
            new THREE.BoxBufferGeometry(45000, 45000, 45000),
            new THREE.BoxBufferGeometry(55000, 55000, 55000)
        );
        this.matrialArray.push(
            new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
            }),
            new THREE.MeshLambertMaterial({
                side: THREE.DoubleSide,
            }),
            new THREE.MeshNormalMaterial({
                side: THREE.DoubleSide,
            })
        );
    }

    choice() {
        // prettier-ignore
        return new Mesh(
            this.geometryArray[
                randInt(0, this.geometryArray.length - 1)
            ].clone(),
            this.matrialArray[
                randInt(0, this.matrialArray.length - 1)
            ].clone()
        );
    }
}

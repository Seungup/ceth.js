import * as THREE from "three";
import { Mesh } from "three";
import { randInt } from "three/src/math/MathUtils";
import { API } from "./API";

export class RandomObject {
    private readonly geometryArray = new Array<THREE.BufferGeometry>();
    private readonly matrialArray = new Array<THREE.Material>();

    constructor() {
        this.geometryArray.push(
            new THREE.BoxBufferGeometry(10000, 10000, 10000)
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
            }),
            new THREE.MeshPhongMaterial({
                side: THREE.DoubleSide,
            })
        );
    }

    choice() {
        const geometryIndex = randInt(0, this.geometryArray.length - 1);
        const matrialIndex = randInt(0, this.matrialArray.length - 1);
        console.log(`G: ${geometryIndex} M: ${matrialIndex}`);
        const geometry = this.geometryArray[geometryIndex].clone();
        geometry.scale(API.scale, API.scale, API.scale);

        const matrial = this.matrialArray[matrialIndex].clone();

        const mesh = new Mesh(geometry, matrial);

        return mesh;
    }
}

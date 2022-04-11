import * as THREE from "three";
import { Manager } from "../Manager";

/**
 * 인스턴스 메시의 관리를 위한 메니저 클래스입니다.
 */
export class InstancedManager<
    TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry,
    TMaterial extends THREE.Material | THREE.Material[] =
        | THREE.Material
        | THREE.Material[]
> implements Manager.Interface
{
    private readonly instancedMesh: THREE.InstancedMesh<TGeometry, TMaterial>;
    private readonly entityDataMap = new Map<number, { [key: string]: any }>();
    private readonly entityIdArray = new Array<number>();

    private id_counter = 0;

    readonly hash: string;
    constructor(
        param: { geomtery: TGeometry; material: TMaterial; maxCount: number },
        scene: THREE.Scene
    ) {
        this.instancedMesh = new THREE.InstancedMesh(
            param.geomtery,
            param.material,
            param.maxCount
        );
        this.instancedMesh.count = 0;

        this.hash = Manager.getHashByGeometryMaterial(
            this.instancedMesh.geometry,
            this.instancedMesh.material
        );

        scene.add(this.instancedMesh);
    }

    private setMatrixAt(index: number, matrix: THREE.Matrix4) {
        this.instancedMesh.matrixAutoUpdate = false;
        this.instancedMesh.setMatrixAt(index, matrix);
        this.instancedMesh.instanceMatrix.needsUpdate = true;
    }

    dispose(): void {
        this.clear();
        this.instancedMesh.dispose();
    }

    clear(): void {
        for (let i = 0, len = this.entityIdArray.length; i < len; i++) {
            this.delete(this.entityIdArray[i]);
        }
    }

    traverse(callback: { (matrix: THREE.Matrix4, id: number): void }) {
        const matrix = new THREE.Matrix4();
        this.entityIdArray.forEach((id, index) => {
            this.instancedMesh.getMatrixAt(index, matrix);
            callback(matrix, id);
        });
    }

    update(id: number, matrix: THREE.Matrix4): boolean {
        const index = this.entityIdArray.findIndex((el) => el === id);

        if (index === -1) {
            console.error("cannot found element in current array.");
            return false;
        }

        this.setMatrixAt(index, matrix);

        return true;
    }

    getUserData(id: number) {
        return this.entityDataMap.get(id);
    }

    add(
        matrix: THREE.Matrix4,
        visible: boolean = true,
        userData?: { [key: string]: any }
    ): number {
        this.entityIdArray.push(++this.id_counter);

        if (userData) {
            this.entityDataMap.set(this.id_counter, userData);
        }

        this.setMatrixAt(this.entityIdArray.length - 1, matrix);

        if (visible) {
            this.instancedMesh.count++;
        }

        return this.id_counter;
    }

    private swapInstances(index1: number, index2: number) {
        // CACHING
        const matrix = new THREE.Matrix4(),
            cachedMatrix = new THREE.Matrix4(),
            cachedInstanceId = this.entityIdArray[index1];
        this.instancedMesh.getMatrixAt(index1, cachedMatrix);

        // SWAP
        this.instancedMesh.getMatrixAt(index2, matrix);
        this.setMatrixAt(index1, matrix);

        this.entityIdArray[index1] = this.entityIdArray[index2];

        // REPLACE
        this.setMatrixAt(index2, cachedMatrix);
        this.entityIdArray[index2] = cachedInstanceId;
    }

    delete(id: number): boolean {
        const index = this.entityIdArray.findIndex((el) => el === id);

        if (index === -1) {
            console.error("cannot found element in current array.");
            return false;
        }

        this.swapInstances(this.entityIdArray.length - 1, index);

        this.entityIdArray.pop();

        if (index < this.instancedMesh.count) {
            this.instancedMesh.count--;
        }

        return true;
    }

    setColor(id: number, color: THREE.Color): void {
        const n = this.entityIdArray.findIndex((el) => el === id);
        this.instancedMesh.setColorAt(n, color);
        if (this.instancedMesh.instanceColor) {
            this.instancedMesh.instanceColor.needsUpdate = true;
        }
    }

    setVisibiltiy(id: number, visible: boolean): void {
        const n = this.entityIdArray.findIndex((el) => el === id);
        if (n === -1) {
            console.error("cannot found element in current array");
            return;
        }
        if (visible) {
            if (n > this.instancedMesh.count) {
                this.swapInstances(this.instancedMesh.count, n);
                this.instancedMesh.count++;
            }
        } else {
            if (n < this.instancedMesh.count) {
                this.swapInstances(this.instancedMesh.count - 1, n);
                this.instancedMesh.count--;
            }
        }
    }
}

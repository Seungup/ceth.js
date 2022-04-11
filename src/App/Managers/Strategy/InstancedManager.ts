import * as THREE from "three";
import { THREEUtils } from "../../Utils/ThreeUtils";
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

    readonly id: number;
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

        this.hash = Manager.getHashByGeometryMaterial(
            this.instancedMesh.geometry,
            this.instancedMesh.material
        );

        scene.add(this.instancedMesh);

        this.id = this.instancedMesh.id;
    }

    clear() {
        for (let i = 0, len = this.entityIdArray.length; i < len; i++) {
            this.delete(this.entityIdArray[i]);
        }
    }

    dispose(): void {
        this.clear();
        this.instancedMesh.dispose();
    }

    /**
     * 현재 데이터를 순회합니다.
     *
     * @param callback
     */
    traverse(callback: { (matrix: THREE.Matrix4, id: number): void }) {
        const matrix = new THREE.Matrix4();

        for (let i = 0, len = this.entityIdArray.length; i < len; i++) {
            this.instancedMesh.getMatrixAt(i, matrix);
            callback(matrix, this.entityIdArray[i]);
        }
    }

    update(id: number, matrix: THREE.Matrix4): boolean {
        const index = this.entityIdArray.findIndex((el) => el === id);

        if (index === -1) {
            console.error("cannot found element in current array.");
            return false;
        }

        this._setMatrix(index, matrix);
        return true;
    }

    private _setMatrix(index: number, matrix: THREE.Matrix4) {
        this.instancedMesh.matrixAutoUpdate = false;
        this.instancedMesh.setMatrixAt(index, matrix);
        this.instancedMesh.instanceMatrix.needsUpdate = true;
    }

    /**
     * id에 해당하는 유저 데이터를 가져옵니다.
     * @param id
     * @returns
     */
    getUserData(id: number) {
        return this.entityDataMap.get(id);
    }

    /**
     * 행렬을 추가합니다.
     *
     * @param matrix 행렬
     * @param visible 가시여부
     * @param userData 추가 데이터
     * @returns id
     */
    add(
        matrix: THREE.Matrix4,
        visible: boolean = true,
        userData?: { [key: string]: any }
    ): number {
        this.entityIdArray.push(++this.id_counter);

        if (userData) {
            this.entityDataMap.set(this.id_counter, userData);
        }

        this._setMatrix(this.entityIdArray.length - 1, matrix);

        if (visible) {
            this.instancedMesh.count++;
        }

        return this.id_counter;
    }

    delete(id: number): boolean {
        const index = this.entityIdArray.findIndex((el) => el === id);

        if (index === -1) {
            console.error("cannot found element in current array.");
            return false;
        }

        THREEUtils.swapInstances(
            this.instancedMesh,
            this.entityIdArray.length - 1,
            index,
            { syncTargetArray: this.entityIdArray }
        );

        this.entityIdArray.pop();
        this.entityDataMap.delete(id);

        if (index < this.instancedMesh.count) {
            this.instancedMesh.count--;
        }

        return true;
    }

    setColor(id: number, color: THREE.Color): void {
        const index = this.entityIdArray.findIndex((el) => el === id);
        this.instancedMesh.setColorAt(index, color);
        if (this.instancedMesh.instanceColor) {
            this.instancedMesh.instanceColor.needsUpdate = true;
        }
    }

    setVisibiltiy(id: number, visible: boolean): void {
        const index = this.entityIdArray.findIndex((el) => el === id);

        if (index === -1) {
            console.error("cannot found element in current array");
            return;
        }

        if (visible) {
            if (index > this.instancedMesh.count) {
                THREEUtils.swapInstances(
                    this.instancedMesh,
                    this.instancedMesh.count,
                    index,
                    { syncTargetArray: this.entityIdArray }
                );
                this.instancedMesh.count++;
            }
        } else {
            if (index < this.instancedMesh.count) {
                THREEUtils.swapInstances(
                    this.instancedMesh,
                    this.instancedMesh.count - 1,
                    index,
                    { syncTargetArray: this.entityIdArray }
                );
                this.instancedMesh.count--;
            }
        }
    }
}

import { Subject } from "rxjs";
import * as THREE from "three";
import { THREEUtils } from "../../../Utils/ThreeUtils";
import { Manager } from "../Manager";

/**
 * 인스턴스 메시의 관리를 위한 메니저 클래스입니다.
 */
export class InstancedObjectManager<
    TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry,
    TMaterial extends THREE.Material | THREE.Material[] =
        | THREE.Material
        | THREE.Material[]
> implements Manager.Interface
{
    private readonly instancedMesh: THREE.InstancedMesh<TGeometry, TMaterial>;
    private readonly entityDataMap = new Map<number, { [key: string]: any }>();
    private readonly entityIdArray = new Array<number>();

    private index: number | undefined;
    private id_counter = 0;
    private readonly MAX_COUNT: number;

    readonly hash: string;
    readonly id: number;

    constructor(
        param: { geomtery: TGeometry; material: TMaterial; maxCount: number },
        public readonly scene: THREE.Scene
    ) {
        const { geomtery, material, maxCount } = param;

        this.MAX_COUNT = maxCount;

        this.instancedMesh = new THREE.InstancedMesh(
            geomtery,
            material,
            maxCount
        );

        this.id = this.instancedMesh.id;
        this.instancedMesh.count = 0;

        this.hash = Manager.getHashByGeometryMaterial(
            this.instancedMesh.geometry,
            this.instancedMesh.material,
            this.id
        );
        this.instancedMesh.userData.hash = this.hash;

        this.scene.add(this.instancedMesh);
    }

    isEmpty() {
        return this.entityIdArray.length === 0;
    }

    isAddble(): boolean {
        return this.entityIdArray.length < this.MAX_COUNT;
    }

    private setMatrixAt(index: number, matrix: THREE.Matrix4) {
        this.instancedMesh.matrixAutoUpdate = false;
        this.instancedMesh.setMatrixAt(index, matrix);
        this.instancedMesh.instanceMatrix.needsUpdate = true;
    }

    private readonly onDisposeSubject = new Subject<this>();
    $dispose = this.onDisposeSubject.pipe();
    dispose(): void {
        try {
            this.onDisposeSubject.next(this);
            this.clear();
            this.instancedMesh.dispose();
            THREEUtils.disposeObject3D(this.instancedMesh);
            this.scene.remove(this.instancedMesh);
        } catch (error) {
            this.onDisposeSubject.error(error);
        } finally {
            this.onDisposeSubject.complete();
        }
    }

    clear(): void {
        for (let i = 0, len = this.entityIdArray.length; i < len; i++) {
            this.delete(this.entityIdArray[i]);
        }
    }

    private matrix = new THREE.Matrix4();
    traverse(callback: { (matrix: THREE.Matrix4, id: number): void }) {
        this.entityIdArray.forEach((id, index) => {
            this.instancedMesh.getMatrixAt(index, this.matrix);
            callback(this.matrix, id);
        });
    }

    update(id: number, matrix: THREE.Matrix4): boolean {
        this.index = this.entityIdArray.findIndex((el) => el === id);

        if (this.index === -1) {
            console.error("cannot found element in current array.");
            return false;
        }

        this.setMatrixAt(this.index, matrix);

        return true;
    }

    getUserData(id: number) {
        return this.entityDataMap.get(id);
    }

    /**
     * 데이터를 추가합니다.
     *
     * @param matrix 행렬
     * @param visible 가시성
     * @param userData 유저 데이터
     * @returns 아이디
     */
    add(
        matrix: THREE.Matrix4,
        visible: boolean = true,
        userData?: { [key: string]: any }
    ) {
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

    private cachedMatrix1 = new THREE.Matrix4();
    private cachedMatrix2 = new THREE.Matrix4();

    private swapInstances(index1: number, index2: number) {
        this.instancedMesh.getMatrixAt(index1, this.cachedMatrix1);
        this.instancedMesh.getMatrixAt(index2, this.cachedMatrix2);
        this.setMatrixAt(index1, this.cachedMatrix2);
        this.setMatrixAt(index2, this.cachedMatrix1);

        // prettier-ignore
        [
            this.entityIdArray[index1], 
            this.entityIdArray[index2]
        ] = [
            this.entityIdArray[index2],
            this.entityIdArray[index1],
        ];
    }

    delete(id: number): boolean {
        this.index = this.entityIdArray.findIndex((el) => el === id);

        if (this.index === -1) {
            console.error("cannot found element in current array.");
            return false;
        }

        this.swapInstances(this.entityIdArray.length - 1, this.index);

        this.entityIdArray.pop();

        if (this.index < this.instancedMesh.count) {
            this.instancedMesh.count--;
        }

        return true;
    }

    setColor(id: number, color: THREE.Color): void {
        this.index = this.entityIdArray.findIndex((el) => el === id);
        this.instancedMesh.setColorAt(this.index, color);
        if (this.instancedMesh.instanceColor) {
            this.instancedMesh.instanceColor.needsUpdate = true;
        }
    }

    setVisibiltiy(id: number, visible: boolean): void {
        this.index = this.entityIdArray.findIndex((el) => el === id);
        if (this.index === -1) {
            console.error("cannot found element in current array");
            return;
        }
        if (visible) {
            if (this.index > this.instancedMesh.count) {
                this.swapInstances(this.instancedMesh.count, this.index);
                this.instancedMesh.count++;
            }
        } else {
            if (this.index < this.instancedMesh.count) {
                this.swapInstances(this.instancedMesh.count - 1, this.index);
                this.instancedMesh.count--;
            }
        }
    }
}

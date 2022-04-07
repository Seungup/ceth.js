import * as THREE from 'three';

interface InstancedMeshDataType {
    matrix: THREE.Matrix4;
    color?: THREE.Color;
}

export class InstancedMeshBuilder<
    TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry,
    TMaterial extends THREE.Material | THREE.Material[] = THREE.Material | THREE.Material[]
> {
    private dataArray = new Array<InstancedMeshDataType>();

    private geometry: TGeometry | undefined;
    private matrial: TMaterial | undefined;

    constructor(geometry?: TGeometry, matrial?: TMaterial) {
        this.geometry = geometry;
        this.matrial = matrial;
    }

    private usage: THREE.Usage | undefined;
    /**
     *
     * https://threejs.org/docs/index.html#api/en/core/BufferAttribute.usage
     * @param usage
     * @returns
     */
    setUsage(usage: THREE.Usage) {
        this.usage = usage;
        return this;
    }

    addData(data: InstancedMeshDataType) {
        this.dataArray.push(data);
        return this;
    }

    build() {
        const instancedMesh = new THREE.InstancedMesh(
            this.geometry,
            this.matrial,
            this.dataArray.length
        );

        let data: InstancedMeshDataType | undefined,
            index = 0;

        while (this.dataArray.length) {
            data = this.dataArray.shift();
            if (data) {
                instancedMesh.setMatrixAt(index, data.matrix);
                if (data.color) {
                    instancedMesh.setColorAt(index, data.color);
                }
                index++;
            }
        }

        if (this.usage) {
            instancedMesh.instanceMatrix.setUsage(this.usage);
        }

        return instancedMesh;
    }
}

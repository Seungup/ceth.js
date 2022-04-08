import * as THREE from 'three';

export namespace Manager {
    const managerMap = new Map<string, Interface>();

    export const registClass = (_this: Interface) => {
        const hash = getManagerAccessKey(_this.geometry, _this.material);
        if (!getClass(hash)) {
            managerMap.set(hash, _this);
        } else {
            console.error(`manager already exist`);
        }
    };

    export const getClass = <T extends Interface>(hashKey: string): T | undefined => {
        const manager = managerMap.get(hashKey);
        if (manager) {
            return manager as T;
        }
    };

    export const getManagerAccessKey = <
        TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry,
        TMaterial extends THREE.Material | THREE.Material[] = THREE.Material | THREE.Material[]
    >(
        geometry: TGeometry,
        material: TMaterial
    ) => {
        let matrialType: string = '';

        if (material instanceof THREE.Material) {
            matrialType = material.type;
        } else {
            material.forEach((matrial) => {
                matrialType.concat(matrial.type);
            });
        }

        return `${geometry.type}${matrialType}`;
    };

    export interface Interface<
        TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry,
        TMaterial extends THREE.Material | THREE.Material[] = THREE.Material | THREE.Material[]
    > {
        geometry: TGeometry;
        material: TMaterial;
        add(matrix: THREE.Matrix4): number;
        delete(id: number): boolean;
        update(id: number, matrix: THREE.Matrix4): boolean;
        setColor(id: number, color: THREE.Color): void;
        setVisibiltiy(id: number, visible: boolean): void;
    }
}

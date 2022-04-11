import * as THREE from "three";

export namespace Manager {
    const managerMap = new Map<string, Interface>();

    export const registClass = (_this: Interface) => {
        if (!getClass(_this.hash)) {
            managerMap.set(_this.hash, _this);
        } else {
            console.error(`manager already exist`);
        }
    };

    export const getClass = <T extends Interface>(
        hashKey: string
    ): T | undefined => {
        const manager = managerMap.get(hashKey);
        if (manager) {
            return manager as T;
        }
    };

    export const getHashByGeometryMaterial = <
        TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry,
        TMaterial extends THREE.Material | THREE.Material[] =
            | THREE.Material
            | THREE.Material[]
    >(
        geometry: TGeometry,
        material: TMaterial
    ) => {
        const hash: string = geometry.type;

        if (material instanceof THREE.Material) {
            hash.concat(material.type);
        } else {
            material.forEach((m) => {
                hash.concat(m.type);
            });
        }

        return hash;
    };

    export interface Interface<
        TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry,
        TMaterial extends THREE.Material | THREE.Material[] =
            | THREE.Material
            | THREE.Material[]
    > {
        readonly hash: string;

        /**
         * 행렬을 추가합니다.
         *
         * @param matrix 행렬
         * @returns id
         */
        add(matrix: THREE.Matrix4): number;

        /**
         * id에 해당하는 행렬을 삭제합니다.
         *
         * @param id
         * @returns 성공여부
         */
        delete(id: number): boolean;

        /**
         * id에 해당하는 행렬을 업데이트합니다.
         */
        update(id: number, matrix: THREE.Matrix4): boolean;

        /**
         * id에 해당하는 색상 행렬을 업데이트합니다.
         *
         * @param id
         * @param color
         */
        setColor(id: number, color: THREE.Color): void;

        /**
         * id에 해당하는 행렬의 가시 여부를 설정합니다.
         *
         * @param id
         * @param visible
         * @returns
         */
        setVisibiltiy(id: number, visible: boolean): void;

        /**
         * 오브젝트를 파기합니다.
         */
        dispose(): void;

        /**
         * 모든 데이터를 초기 상태로 되돌립니다.
         */
        clear(): void;
    }
}

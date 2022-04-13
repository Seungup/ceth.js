import * as THREE from "three";
import { Observable } from "rxjs";

export namespace Manager {
    const managerArray = new Array<Interface>();

    const onDispose = (manager: Interface) => {
        for (let i = 0, len = managerArray.length; i < len; i++) {
            if (managerArray[i] && managerArray[i].hash === manager.hash) {
                // prettier-ignore
                [
                    managerArray[i],
                    managerArray[managerArray.length - 1]
                ] = [
                    managerArray[managerArray.length - 1],
                    managerArray[i],
                ]
                managerArray.pop();
                return;
            }
        }
    };

    export const registClass = (_this: Interface) => {
        if (!getClass(_this.hash)) {
            _this.$dispose.subscribe(onDispose);
            managerArray.push(_this);
        } else {
            console.error(`${_this.hash} manager already exist`);
        }
    };

    export const getClass = <T extends Interface>(hashKey: string) => {
        for (let i = 0, len = managerArray.length; i < len; i++) {
            if (managerArray[i].hash === hashKey) {
                return managerArray[i] as T;
            }
        }
    };

    export const getAllClass = <T extends Interface>(baseKey: string) => {
        const result = new Array<T>();

        for (let i = 0, len = managerArray.length; i < len; i++) {
            if (
                managerArray[i] &&
                managerArray[i].hash.split(`_$`)[0] === baseKey &&
                managerArray[i].isAddble()
            ) {
                result.push(managerArray[i] as T);
            }
        }

        return result;
    };

    export const getWriteableClass = <T extends Interface>(baseKey: string) => {
        for (let i = 0, len = managerArray.length; i < len; i++) {
            if (
                managerArray[i] &&
                managerArray[i].hash.split(`_$`)[0] === baseKey &&
                managerArray[i].isAddble()
            ) {
                return managerArray[i] as T;
            }
        }
    };

    export const getHashByGeometryMaterial = <
        TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry,
        TMaterial extends THREE.Material | THREE.Material[] =
            | THREE.Material
            | THREE.Material[]
    >(
        geometry: TGeometry,
        material: TMaterial,
        id?: number
    ) => {
        let hash: string = geometry.type;

        if (material instanceof THREE.Material) {
            hash = hash.concat(material.type);
        } else {
            for (let i = 0, len = material.length; i < len; i++) {
                hash = hash.concat(material[i].type);
            }
        }

        if (id) {
            hash = hash.concat(`_$${id.toString()}`);
        }

        return hash;
    };

    export interface Interface {
        readonly hash: string;

        /**
         * 객체를 추가로 생성 가능한지 확인합니다.
         */
        isAddble(): boolean;

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
        $dispose: Observable<this>;

        /**
         * 모든 데이터를 초기 상태로 되돌립니다.
         */
        clear(): void;
    }
}

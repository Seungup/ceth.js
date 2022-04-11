import * as THREE from "three";

export namespace THREEUtils {
    interface IObject3D extends THREE.Object3D {
        geometry?: THREE.BufferGeometry | undefined;
        material?: THREE.Material | THREE.Material[] | undefined;
    }

    /**
     * 오브젝트의 위치를 변경합니다.
     *
     * @param target
     * @param index1
     * @param index2
     * @param option
     */
    export function swapInstances(
        target: THREE.InstancedMesh,
        index1: number,
        index2: number,
        option?: { syncTargetArray?: any[] }
    ) {
        const cachedMatrix = new THREE.Matrix4();
        target.getMatrixAt(index1, cachedMatrix);

        const matrix = new THREE.Matrix4();
        target.getMatrixAt(index2, matrix);
        target.setMatrixAt(index1, matrix);

        target.setMatrixAt(index2, cachedMatrix);

        if (option?.syncTargetArray) {
            const cachedArrayData = option.syncTargetArray[index1];
            option.syncTargetArray[index1] = option.syncTargetArray[index2];
            option.syncTargetArray[index2] = cachedArrayData;
        }
    }

    export function getTypeSafeObject3D(object: IObject3D): IObject3D {
        return object;
    }

    /**
     * 오브젝트를 폐기하여, GC에서 수집될 수 있도록 합니다.
     *
     * @param object
     */
    export function disposeObject3D(object: IObject3D) {
        while (object.children.length > 0) {
            disposeObject3D(object.children[0] as IObject3D);
            object.remove(object.children[0]);
        }

        if (object.geometry) {
            object.geometry.dispose();
        }

        if (object.material) {
            if (object.material instanceof THREE.Material) {
                object.material.dispose();
            } else {
                for (let i = 0, len = object.material.length; i < len; i++) {
                    object.material[i].dispose();
                }
            }
        }
    }
}

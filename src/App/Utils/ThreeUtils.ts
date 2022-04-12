import * as THREE from "three";

export namespace THREEUtils {
    interface IObject3D extends THREE.Object3D {
        geometry?: THREE.BufferGeometry | undefined;
        material?: THREE.Material | THREE.Material[] | undefined;
    }

    export const getTypeSafeObject3D = (object: IObject3D): IObject3D => {
        return object;
    };

    /**
     * 오브젝트를 폐기하여, GC에서 수집될 수 있도록 합니다.
     *
     * @param object
     */
    export const disposeObject3D = (object: IObject3D) => {
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
    };
}

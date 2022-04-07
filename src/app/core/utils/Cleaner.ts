import { Object3D } from 'three';

export function disposeObject3D(obj: Object3D) {
    while (obj.children.length > 0) {
        disposeObject3D(obj.children[0]);
        obj.remove(obj.children[0]);
    }
    // @ts-ignore
    if (obj.geometry) obj.geometry.dispose();

    // @ts-ignore
    if (obj.material) {
        //in case of map, bumpMap, normalMap, envMap ...
        // @ts-ignore
        Object.keys(obj.material).forEach((prop) => {
            // @ts-ignore
            if (!obj.material[prop]) return;
            if (
                // @ts-ignore
                obj.material[prop] !== null &&
                // @ts-ignore
                typeof obj.material[prop].dispose === 'function'
            ) {
                // @ts-ignore
                obj.material[prop].dispose();
            }
        });
        // @ts-ignore
        obj.material.dispose();
    }
}

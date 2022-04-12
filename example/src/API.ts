import { Controller } from "lil-gui";
import { DataAccessor } from "../../src/App/Data/Accessor/DataAccessor";

let removeAllController: Controller | undefined;

export const dataAccessorArray = new Array<{
    constructor: new () => DataAccessor;
    param: {
        id?: number;
        accessKey?: string;
        worker?: Worker;
        scene?: THREE.Scene;
    };
}>();

export function setRemoveAllController(ctrl: Controller) {
    removeAllController = ctrl;
}

const weakMap = new WeakMap<typeof DataAccessor, DataAccessor>();

export const API = {
    count: 1_000,
    removeAll: async () => {
        removeAllController?.disable();
        console.time("delete");
        while (dataAccessorArray.length) {
            const { constructor, param } = dataAccessorArray.pop();
            const { accessKey, id, scene, worker } = param;
            let accessor: DataAccessor;
            if (weakMap.has(constructor)) {
                accessor = weakMap.get(constructor);
            } else {
                accessor = new constructor();
                weakMap.set(constructor, accessor);
            }

            if (accessor.setAccessKey && accessKey) {
                accessor.setAccessKey(accessKey);
            }

            if (accessor.setId && id) {
                accessor.setId(id);
            }

            if (accessor.setWorker && worker) {
                accessor.setWorker(worker);
            }

            if (accessor.setScene && scene) {
                accessor.setScene(scene);
            }

            await accessor.remove();
        }
        console.timeEnd("delete");
        removeAllController?.enable();
    },
    lonGap: Math.random(),
    latGap: Math.random(),
    help: () => {
        alert("mouse right click somewhere in earth.");
    },
};

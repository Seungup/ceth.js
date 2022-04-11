import { Controller } from "lil-gui";
import { DataAccessor } from "../../src/App/Data/Accessor/DataAccessor";

let removeAllController: Controller | undefined;

export const dataAccessorArray = new Array<DataAccessor>();
export function setRemoveAllController(ctrl: Controller) {
    removeAllController = ctrl;
}

export const API = {
    count: 10_000,
    removeAll: async () => {
        removeAllController?.disable();
        console.time("delete");
        for (let i = 0, len = dataAccessorArray.length; i < len; i++) {
            await dataAccessorArray.pop().remove();
        }
        console.timeEnd("delete");
        removeAllController?.enable();
    },
    lonGap: Math.random(),
    latGap: Math.random(),
    help: () => {
        alert("mouse right click somewhere in earth.");
    },
    scale: 1,
};

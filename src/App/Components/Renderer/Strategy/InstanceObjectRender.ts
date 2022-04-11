import * as THREE from "three";
import { Manager } from "../../../Managers/Manager";
import { InstancedManager } from "../../../Managers/Strategy/InstancedManager";
import { DefaultObjectPositionChecker } from "./DefaultObjectRender";

export class InstanceObjectPositionChecker extends DefaultObjectPositionChecker {
    checkPosition(object: THREE.InstancedMesh) {
        this.setNormalMatrix();
        const hash = Manager.getManagerAccessKey(
            object.geometry,
            object.material
        );
        const manager = Manager.getClass<InstancedManager>(hash);
        if (manager) {
            manager.traverse((_, position, id) => {
                // manager.setVisibiltiy(id, this.getVisible(position));
            });
        }
    }
}

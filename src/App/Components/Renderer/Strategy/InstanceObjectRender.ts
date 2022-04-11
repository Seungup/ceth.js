import * as THREE from "three";
import { Manager } from "../../../Managers/Manager";
import { InstancedManager } from "../../../Managers/Strategy/InstancedManager";
import { DefaultObjectPositionChecker } from "./DefaultObjectRender";

export class InstanceObjectPositionChecker extends DefaultObjectPositionChecker {
    checkPosition(object: THREE.InstancedMesh) {
        this.setNormalMatrix();
        const manager = Manager.getClass<InstancedManager>(
            object.userData.hash
        );
        if (manager) {
            const position = new THREE.Vector3();
            manager.traverse((matrix, id) => {
                position.setFromMatrixPosition(matrix);
                manager.setVisibiltiy(id, this.getVisible(position));
            });
        }
    }
}

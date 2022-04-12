import * as THREE from "three";
import { Manager } from "../../Object/Manager";
import { InstancedObjectManager } from "../../Object/Strategy/InstancedObjectManager";
import { DefaultObjectPositionChecker } from "./DefaultObjectRender";
export class InstancedObjectPositionChecker extends DefaultObjectPositionChecker {
    private _position = new THREE.Vector3();
    private _manager: Manager.Interface | undefined;
    checkPosition(object: THREE.InstancedMesh) {
        this.setNormalMatrix();
        this._manager = Manager.getClass(object.userData.hash);
        if (this._manager instanceof InstancedObjectManager) {
            this._manager.traverse(this._bindCallback);
        }
    }

    private _bindCallback = this.callback.bind(this);
    private callback(matrix: THREE.Matrix4, id: number) {
        this._position.set(0, 0, 0).setFromMatrixPosition(matrix);
        this._manager?.setVisibiltiy(id, this.getVisible(this._position));
    }
}

import { CameraComponent } from "../../Camera/CameraComponent";
import { ObjectPositionCheckStrategy } from "./ObjectPositionChecker";
import * as THREE from "three";

export class DefaultObjectPositionChecker
    implements ObjectPositionCheckStrategy
{
    protected _camera = CameraComponent.perspectiveCamera;

    protected cameraToPoint = new THREE.Vector3();
    protected tempVector = new THREE.Vector3();
    protected normalMatrix = new THREE.Matrix3();

    setNormalMatrix() {
        this.normalMatrix.getNormalMatrix(this._camera.matrixWorldInverse);
    }

    checkPosition(object: THREE.Object3D<THREE.Event>): void {
        object.visible = this.getVisible(object.position);
    }

    protected getVisible(position: THREE.Vector3) {
        this.cameraToPoint.copy(position);
        this.cameraToPoint.applyMatrix4(this._camera.matrixWorldInverse);
        this.cameraToPoint.normalize();

        this.tempVector.copy(position);
        this.tempVector.applyMatrix3(this.normalMatrix);

        return this.tempVector.dot(this.cameraToPoint) < 0;
    }
}

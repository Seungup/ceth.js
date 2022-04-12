import * as THREE from "three";
import { DefaultObjectPositionChecker } from "./DefaultObjectRender";
import { InstanceObjectPositionChecker } from "./InstanceObjectRender";

export interface ObjectPositionCheckStrategy {
    checkPosition(object: THREE.Object3D): void;
}

export namespace ObjectPositionChecker {
    const DEFAULT = new DefaultObjectPositionChecker();
    const INSTANCE = new InstanceObjectPositionChecker();
    export function check(scene: THREE.Scene) {
        scene.traverse((object) => {
            switch (object.type) {
                case "Mesh":
                    if (object instanceof THREE.InstancedMesh) {
                        INSTANCE.setNormalMatrix();
                        INSTANCE.checkPosition(object);
                    } else {
                        DEFAULT.setNormalMatrix();
                        DEFAULT.checkPosition(object);
                    }
                    break;
                case "Scene":
                    break;
                case "AmbientLight":
                    break;
                default:
                    break;
            }
        });
    }
}

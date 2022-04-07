import * as THREE from 'three';
import { IWGS84, WGS84_ACTION } from '../core/utils/Math';

export interface IManager {
    add(object: THREE.Object3D, position: IWGS84, action: WGS84_ACTION): number;
    remove(id: number): boolean;
}

import { Object3D, Event } from 'three';
import { IWGS84, WGS84_ACTION } from '../core/utils/Math';
import { IManager } from './Manager.Interface';

export class SceneManager implements IManager {
    add(object: Object3D<Event>, position: IWGS84, action: WGS84_ACTION): number {
        throw new Error('Method not implemented.');
    }
    remove(id: number): boolean {
        throw new Error('Method not implemented.');
    }
}

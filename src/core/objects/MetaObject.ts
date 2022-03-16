import { Object3D } from "three";

export class MetaObjectCache {
    private static _class = new Map<string, { new (): IMetaObject }>();
    static add(target: { new (): IMetaObject }) {
        this._class.set(target.name, target);
    }

    static get(key: string) {
        return this._class.get(key);
    }
}

export interface IMetaObject {
    update(parma: any): void;
    getObject3D(): Object3D;
}

import { BufferGeometry, Material, Points } from 'three';
import { IMetaObject } from './interface';

export class MetaPoints<
        TGeometry extends BufferGeometry = BufferGeometry,
        TMaterial extends Material | Material[] = Material | Material[]
    >
    extends Points
    implements IMetaObject
{
    isMetaObject: boolean = true;

    constructor(geometry?: TGeometry, material?: TMaterial) {
        super(geometry, material);
    }

    dispose() {
        this.geometry.dispose();
        if (this.material instanceof Material) {
            this.material.dispose();
        } else {
            const size = this.material.length;
            for (let i = 0; i < size; i++) {
                this.material[i].dispose();
            }
        }
    }
}

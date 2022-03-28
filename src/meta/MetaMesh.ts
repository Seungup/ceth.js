import { BufferGeometry, Material, Mesh } from 'three';
import { IMetaObject } from '..';

export class MetaMesh<
        TGeometry extends BufferGeometry = BufferGeometry,
        TMaterial extends Material | Material[] = Material | Material[]
    >
    extends Mesh
    implements IMetaObject
{
    readonly isMetaObject: boolean = true;
    readonly isMetaMesh: boolean = true;

    constructor(geometry?: TGeometry, material?: TMaterial) {
        super(geometry, material);
    }

    dispose() {
        this.dispatchEvent({ type: 'dispose' });
        this.geometry.dispose();
        if (this.material) {
            if (this.material instanceof Array) {
                for (let i = 0; i < this.material.length; i++) {
                    this.material[i].dispose();
                }
            } else {
                this.material.dispose();
            }
        }
    }
}

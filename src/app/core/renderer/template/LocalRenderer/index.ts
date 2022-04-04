import { BaseRenderer } from '../renderer.template';
import { Context } from '../../../../context';
import * as THREE from 'three';

export class LocalRenderer extends BaseRenderer {
    constructor() {
        super();
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.name = 'LocalRenderer';

        if (Context.viewer) {
            this.renderer.setSize(Context.viewer.canvas.width, Context.viewer.canvas.height);
        }

        Context.container.appendChild(this.renderer.domElement);
    }
}

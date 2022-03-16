import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { Color, Object3D, Vector2 } from "three";
import { IMetaObject, MetaObjectCache } from "./MetaObject";

export interface LineObjectUpdate {
    points: Vector2[];
    color: number;
}

export class LineObject extends Line2 implements IMetaObject {
    constructor() {
        const geometry = new LineGeometry();
        const material = new LineMaterial({
            color: 0xffffff,
            linewidth: 5,
            vertexColors: true,
            dashed: false,
            alphaToCoverage: true,
        });
        super(geometry, material);
    }

    getObject3D(): Object3D {
        return this;
    }

    update(param: LineObjectUpdate) {
        const positions = [];
        const colors = [];
        const color = new Color(param.color);

        if (param.points.length == 0) {
            colors.push(color.r, color.g, color.b);
        } else {
            for (let i = 0; i < param.points.length; i++) {
                positions.push(param.points[i].x, 0, param.points[i].y);
                colors.push(color.r, color.g, color.b);
            }
            this.geometry.setPositions(positions);
            this.computeLineDistances();
        }

        this.geometry.setColors(colors);
    }
}
MetaObjectCache.add(LineObject);

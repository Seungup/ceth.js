import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { Color, Vector3 } from 'three';

export class CT_LineGeometry extends LineGeometry {
	constructor(points: Vector3[], color: Color) {
		super();

		const colors: number[] = [];
		const positions: number[] = [];

		for (let i = 0; i < points.length; i++) {
			positions.push(points[i].x, points[i].y, points[i].z);
			colors.push(color.r, color.g, color.b);
		}

		super.setPositions(positions);
		super.setColors(colors);
	}
}

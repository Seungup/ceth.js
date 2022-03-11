import { Color, Vector3 } from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import {
	LineMaterial,
	LineMaterialParameters,
} from 'three/examples/jsm/lines/LineMaterial';
import { CT_LineGeometry } from '..';

export class CT_Box extends Line2 {
	private _material: LineMaterial;
	private _geometry: CT_LineGeometry;
	constructor(
		width: number,
		height: number,
		parameters?: LineMaterialParameters
	) {
		const color = parameters?.color
			? new Color(parameters.color)
			: new Color(0xffffff);

		const geometry = new CT_LineGeometry(
			[
				new Vector3(0, 0, 0),
				new Vector3(0, 0, width),
				new Vector3(height, 0, width),
				new Vector3(height, 0, 0),
				new Vector3(0, 0, 0),
			],
			color
		);
		const material = new LineMaterial(parameters);
		super(geometry, material);
		super.computeLineDistances();

		this._material = material;
		this._geometry = geometry;
	}

	set dashed(dash: boolean) {
		this._material.dashed = dash;
	}

	set lineWidth(width: number) {
		this._material.linewidth = width;
	}

	get lineWidth() {
		return this._material.linewidth;
	}

	get dashed() {
		return this._material.dashed;
	}

	set dashSize(size: number) {
		this._material.dashSize = size;
	}

	get dashSize() {
		return this._material.dashSize;
	}

	set gapSize(size: number) {
		this._material.gapSize = size;
	}

	get gapSize() {
		return this._material.gapSize;
	}
}

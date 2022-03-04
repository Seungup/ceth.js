import { Vector3 } from 'three';

export class HeadingPitchRoll extends Vector3 {
	constructor(
		heading: number = 0.0,
		pitch: number = 0.0,
		roll: number = 0.0
	) {
		super(heading, pitch, roll);
	}

	get heading() {
		return this.x;
	}

	get pitch() {
		return this.y;
	}

	get roll() {
		return this.z;
	}
}

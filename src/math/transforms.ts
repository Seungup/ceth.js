import { Matrix4 } from 'three';
import { Ellipsoid } from './ellipsoid';
import { Cartesian3 } from './cartesian3';

export class Transforms {
	private static scratchFirstCartesian: Cartesian3;
	private static scratchSecondCartesian: Cartesian3;
	private static scratchThirdCartesian: Cartesian3;
	private static scratchCalculateCartesian = {
		east: new Cartesian3(),
		north: new Cartesian3(),
		up: new Cartesian3(),
	};

	static eastNorthUpToFixedFrame(
		origin: Cartesian3,
		result: Matrix4 = new Matrix4()
	) {
		Ellipsoid.getDefaultWGS84RadiiSquaredGeodticSurfaceNormal(
			origin,
			this.scratchCalculateCartesian.up
		);

		this.scratchCalculateCartesian.east
			.set(-origin.y, origin.x, 0.0)
			.normalizeByMagnitude();

		this.scratchCalculateCartesian.north
			.copy(this.scratchCalculateCartesian.up)
			.cross(this.scratchCalculateCartesian.east);

		this.scratchFirstCartesian = this.scratchCalculateCartesian.east;
		this.scratchSecondCartesian = this.scratchCalculateCartesian.north;
		this.scratchThirdCartesian = this.scratchCalculateCartesian.up;

		// prettier-ignore
		return result.set(
        this.scratchFirstCartesian.x,    this.scratchSecondCartesian.x,   this.scratchThirdCartesian.x,    origin.x,
        this.scratchFirstCartesian.y,    this.scratchSecondCartesian.y,   this.scratchThirdCartesian.y,    origin.y,
        this.scratchFirstCartesian.z,    this.scratchSecondCartesian.z,   this.scratchThirdCartesian.z,    origin.z,
        0.0,                             0.0,                             0.0,                             1.0
    );
	}

	static matrix4ToFixedFrame(
		origin: Cartesian3,
		matrix: Matrix4 = new Matrix4(),
		result: Matrix4 = new Matrix4()
	) {
		return result
			.copy(this.eastNorthUpToFixedFrame(origin))
			.multiply(matrix);
	}
}

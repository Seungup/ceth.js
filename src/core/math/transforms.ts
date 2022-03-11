import { Matrix4 } from 'three';
import { CT_Ellipsoid } from './ellipsoid';
import { CT_Quaternion } from './quration';
import { MathUtils } from '../utils';
import { CT_Cartesian3 } from './cartesian3';
import { CT_Matrix4 } from './matrix4';

export class CT_Transforms {
    private static scratchFirstCartesian: CT_Cartesian3;
    private static scratchSecondCartesian: CT_Cartesian3;
    private static scratchThirdCartesian: CT_Cartesian3;
    private static scratchCalculateCartesian = {
        east: new CT_Cartesian3(),
        north: new CT_Cartesian3(),
        up: new CT_Cartesian3(),
    };

    static eastNorthUpToFixedFrame(
        origin: CT_Cartesian3,
        result: Matrix4 = new Matrix4()
    ) {
        if (origin.isZero()) {
            this.scratchFirstCartesian = CT_Cartesian3.unpack([0, 1, 0]);
            this.scratchSecondCartesian = CT_Cartesian3.unpack([-1, 0, 0]);
            this.scratchThirdCartesian = CT_Cartesian3.unpack([0, 0, 1]);
        } else if (
            MathUtils.equalsEpsilon(origin.x, 0.0) &&
            MathUtils.equalsEpsilon(origin.y, 0.0)
        ) {
            const sign = Math.sign(origin.z);
            this.scratchFirstCartesian = CT_Cartesian3.unpack([0, 1, 0]);
            this.scratchSecondCartesian = CT_Cartesian3.unpack([
                -1, 0, 0,
            ]).multiplyScalar(sign);
            this.scratchThirdCartesian = CT_Cartesian3.unpack([
                -1, 0, 0,
            ]).multiplyScalar(sign);
        } else {
            CT_Ellipsoid.getDefaultWGS84RadiiSquaredGeodticSurfaceNormal(
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
        }

        // prettier-ignore
        return result.set(
      this.scratchFirstCartesian.x,    this.scratchSecondCartesian.x,   this.scratchThirdCartesian.x,    origin.x,
      this.scratchFirstCartesian.y,    this.scratchSecondCartesian.y,   this.scratchThirdCartesian.y,    origin.y,
      this.scratchFirstCartesian.z,    this.scratchSecondCartesian.z,   this.scratchThirdCartesian.z,    origin.z,
      0.0,                             0.0,                             0.0,                             0.0
    );
    }

    static matrix4ToFixedFrame(
        origin: CT_Cartesian3,
        matrix: Matrix4,
        result: Matrix4 = new Matrix4()
    ) {
        return result
            .copy(CT_Transforms.eastNorthUpToFixedFrame(origin))
            .multiply(matrix);
    }

    static headingPitchRollToFixedFrame(
        origin: CT_Cartesian3,
        heading: number,
        pitch: number,
        roll: number,
        result: Matrix4 = new Matrix4()
    ) {
        const hprQuration = CT_Quaternion.fromHeadingPitchRoll(
            heading,
            pitch,
            roll
        );

        const hprMatrix = CT_Matrix4.fromTranslationQuaternionRotationScale(
            CT_Cartesian3.ZERO,
            hprQuration,
            new CT_Cartesian3(1.0, 1.0, 1.0)
        );

        return this.matrix4ToFixedFrame(origin, hprMatrix, result);
    }
}

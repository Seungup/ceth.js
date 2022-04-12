import { Matrix4, Quaternion } from "three";
import { Ellipsoid } from "./Ellipsoid";
import { Cartesian3 } from "./Cartesian3";
import { QuaternionUtils } from "./Quration";

export interface HeadingPitchRoll {
    heading: number;
    pitch: number;
    roll: number;
}

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
            .normalize();

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

    static fromTranslationQuaternionRotationScale(
        translation: Cartesian3,
        rotation: Quaternion,
        scale: Cartesian3,
        result: Matrix4 = new Matrix4()
    ) {
        const scaleX = scale.x;
        const scaleY = scale.y;
        const scaleZ = scale.z;

        const x2 = rotation.x * rotation.x;
        const xy = rotation.x * rotation.y;
        const xz = rotation.x * rotation.z;
        const xw = rotation.x * rotation.w;
        const y2 = rotation.y * rotation.y;
        const yz = rotation.y * rotation.z;
        const yw = rotation.y * rotation.w;
        const z2 = rotation.z * rotation.z;
        const zw = rotation.z * rotation.w;
        const w2 = rotation.w * rotation.w;

        const m00 = x2 - y2 - z2 + w2;
        const m01 = 2.0 * (xy - zw);
        const m02 = 2.0 * (xz + yw);

        const m10 = 2.0 * (xy + zw);
        const m11 = -x2 + y2 - z2 + w2;
        const m12 = 2.0 * (yz - xw);

        const m20 = 2.0 * (xz - yw);
        const m21 = 2.0 * (yz + xw);
        const m22 = -x2 - y2 + z2 + w2;

        // prettier-ignore
        result.set(
            m00 * scaleX, 	m10 * scaleX, 	m20 * scaleX, 	0.0,
            m01 * scaleY, 	m11 * scaleY, 	m21 * scaleY, 	0.0,
            m02 * scaleZ, 	m12 * scaleZ, 	m22 * scaleZ, 	0.0,
            translation.x, 	translation.y, 	translation.z,	1.0,
        )

        return result;
    }

    private static hprQuaternion = new Quaternion();

    static matrix4ToFixedFrame(
        origin: Cartesian3,
        headingPitchRoll: HeadingPitchRoll,
        result: Matrix4 = new Matrix4()
    ) {
        const { heading, pitch, roll } = headingPitchRoll;
        const hprMatrix = new Matrix4();

        if (heading !== 0 && pitch !== 0 && roll !== 0) {
            QuaternionUtils.setFromHeadingPitchRoll(
                this.hprQuaternion,
                headingPitchRoll
            );
            this.fromTranslationQuaternionRotationScale(
                Cartesian3.ZERO,
                this.hprQuaternion,
                new Cartesian3(1.0, 1.0, 1.0),
                hprMatrix
            );
        }

        return this.eastNorthUpToFixedFrame(origin, result).multiply(hprMatrix);
    }
}

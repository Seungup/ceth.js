import { Matrix4 } from "three";
import { CT_Cartesian3, CT_Quaternion, CT_Transforms } from ".";
import { MathUtils } from "../utils";

export class CT_Matrix4 extends Matrix4 {
  static fromRotationX(degrees: number, result: Matrix4 = new Matrix4()) {
    return result.makeRotationX(MathUtils.toRadians(degrees));
  }

  static fromWGS84(
    longitude: number,
    latitude: number,
    height: number,
    result: Matrix4 = new Matrix4()
  ) {
    const matrix = CT_Transforms.matrix4ToFixedFrame(
      CT_Cartesian3.fromDegree(longitude, latitude, height),
      new Matrix4()
    ).elements;

    // prettier-ignore
    return result.set(
        matrix[ 0], matrix[ 4], matrix[ 8], matrix[12],
        matrix[ 1], matrix[ 5], matrix[ 9], matrix[13],
        matrix[ 2], matrix[ 6], matrix[10], matrix[14],
        matrix[ 3], matrix[ 7], matrix[11], matrix[15]
    );
  }

  static fromTranslationQuaternionRotationScale(
    translation: CT_Cartesian3,
    rotation: CT_Quaternion,
    scale: CT_Cartesian3,
    result: CT_Matrix4 = new CT_Matrix4()
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
    return result.set(
        m00 * scaleX, 	m10 * scaleX, 	m20 * scaleX, 	0.0,
        m01 * scaleY, 	m11 * scaleY, 	m21 * scaleY, 	0.0,
        m02 * scaleZ, 	m12 * scaleZ, 	m22 * scaleZ, 	0.0,
        translation.x, 	translation.y, 	translation.z,	1.0,
    );
  }
}

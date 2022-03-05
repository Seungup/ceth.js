import { Vector3 } from "three";
import { EARTH_RADIUS_X_SQURAE, EARTH_RADIUS_Y_SQURAE, EARTH_RADIUS_Z_SQURAE } from "../../constants";
import { MathUtils } from "../utils";
export class CT_Cartesian3 extends Vector3 {
  static get WGS84_RADII_SQUARED() {  
    return new CT_Cartesian3(
      EARTH_RADIUS_X_SQURAE,
      EARTH_RADIUS_Y_SQURAE,
      EARTH_RADIUS_Z_SQURAE
    );
  }

  static get UINT_X() {
    return new CT_Cartesian3(1.0, 0.0, 0.0);
  }

  static get UINT_Y() {
    return new CT_Cartesian3(0.0, 1.0, 0.0);
  }

  static get UINT_Z() {
    return new CT_Cartesian3(0.0, 0.0, 1.0);
  }

  static get ZERO() {
    return new CT_Cartesian3(0, 0, 0);
  }

  static fromRadians(longitude: number, latitude: number, height: number) {
    const cosLatitude = Math.cos(latitude);

    const cartesian = new CT_Cartesian3(
      cosLatitude * Math.cos(longitude),
      cosLatitude * Math.sin(longitude),
      Math.sin(latitude)
    ).normalizeByMagnitude();

    const WGS84_RADII_SQUARED = CT_Cartesian3.WGS84_RADII_SQUARED.multiply(cartesian);

    const gamma = Math.sqrt(WGS84_RADII_SQUARED.dot(cartesian));

    WGS84_RADII_SQUARED.divideScalar(gamma);

    return cartesian.multiplyScalar(height).add(WGS84_RADII_SQUARED);
  }

  static fromDegree(longitude: number, latitude: number, height: number) {
    return this.fromRadians(
      MathUtils.toRadians(longitude),
      MathUtils.toRadians(latitude),
      height
    );
  }

  static equalsEpsilon(
    left: CT_Cartesian3,
    right: CT_Cartesian3,
    relativeEpsilon: number = MathUtils.EPSILON_14,
    absoluteEpsilon: number = MathUtils.EPSILON_14
  ) {
    if (left.equals(right)) return true;
    return (
      MathUtils.equalsEpsilon(
        left.x,
        right.x,
        relativeEpsilon,
        absoluteEpsilon
      ) &&
      MathUtils.equalsEpsilon(
        left.y,
        right.y,
        relativeEpsilon,
        absoluteEpsilon
      ) &&
      MathUtils.equalsEpsilon(left.z, right.z, relativeEpsilon, absoluteEpsilon)
    );
  }

  normalizeByMagnitude() {
    return this.divideScalar(MathUtils.magnitude(this));
  }

  isZero() {
    return CT_Cartesian3.equalsEpsilon(this, CT_Cartesian3.ZERO);
  }

  static unpack(
    array: Array<number>,
    startIndex: number = 0,
    result: CT_Cartesian3 = new CT_Cartesian3()
  ) {
    return result.set(
      array[startIndex++],
      array[startIndex++],
      array[startIndex]
    );
  }
}

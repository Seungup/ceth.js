import { Vector3 } from 'three';
import {
  EARTH_RADIUS_X,
  EARTH_RADIUS_Y,
  EARTH_RADIUS_Z,
} from '../../constants';
import { CT_Cartesian3 } from './cartesian3';

export class CT_Ellipsoid extends Vector3 {
  private _oneOverRadiiSquared: CT_Cartesian3;

  constructor(x: number, y: number, z: number) {
    super(x, y, z);
    this._oneOverRadiiSquared = new CT_Cartesian3(
      this.x == 0.0 ? 0.0 : 1.0 / (this.x * this.x),
      this.y == 0.0 ? 0.0 : 1.0 / (this.y * this.y),
      this.z == 0.0 ? 0.0 : 1.0 / (this.z * this.z)
    );
  }

  static get WGS84() {
    return new CT_Ellipsoid(EARTH_RADIUS_X, EARTH_RADIUS_Y, EARTH_RADIUS_Z);
  }

  static readonly DEFAULT_WGS84_RADII_SQUARED = Object.freeze(
    CT_Ellipsoid.WGS84._oneOverRadiiSquared
  );
  static getDefaultWGS84RadiiSquaredGeodticSurfaceNormal(
    cartesian: CT_Cartesian3,
    result: CT_Cartesian3 = new CT_Cartesian3()
  ) {
    if (cartesian.isZero()) return;
    return result
      .copy(cartesian)
      .multiply(this.DEFAULT_WGS84_RADII_SQUARED)
      .normalizeByMagnitude();
  }

  geodeticSurfaceNormal(
    cartesian: CT_Cartesian3,
    result: CT_Cartesian3 = new CT_Cartesian3()
  ) {
    if (cartesian.isZero()) return;
    return result
      .copy(cartesian)
      .multiply(this._oneOverRadiiSquared)
      .normalizeByMagnitude();
  }
}

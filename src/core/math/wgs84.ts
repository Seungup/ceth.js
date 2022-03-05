import { Matrix4, Vector3 } from "three";
import { CT_Cartesian3, CT_Transforms } from ".";
import { CT_Matrix4 } from "./matrix4";

export interface IWGS84 {
  latitude: number;
  longitude: number;
  height: number;
}

export class CT_WGS84 extends Vector3 {
  constructor(
    latitude: number | undefined = undefined,
    longitude: number | undefined = undefined,
    height: number | undefined = undefined
  ) {
    super(latitude, longitude, height);
  }

  get latitude() {
    return this.x;
  }

  set latitude(value: number) {
    this.setX(value);
  }

  get longitude() {
    return this.y;
  }

  set longitude(value: number) {
    this.setY(value);
  }

  get height() {
    return this.z;
  }

  set height(value: number) {
    this.setZ(value);
  }

  getMatrix4(result: CT_Matrix4 = new CT_Matrix4()) {
    const matrix = CT_Transforms.matrix4ToFixedFrame(
      CT_Cartesian3.fromDegree(this.longitude, this.latitude, this.height),
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

  toJSON(): IWGS84 {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
      height: this.height,
    };
  }

  static fromCesiumWGS84(
    wgs84: number,
    longitude: number,
    height: number,
    result: CT_WGS84 = new CT_WGS84()
  ) {
    return result.set(wgs84, longitude, height);
  }

  static fromThreeWGS84(
    latitude: number,
    longitude: number,
    height: number,
    result: CT_WGS84 = new CT_WGS84()
  ) {
    return result.set(latitude, longitude, height);
  }
}

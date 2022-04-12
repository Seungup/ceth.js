import { MathUtils, Vector3 } from "three";
import {
    EARTH_RADIUS_X_SQURAE,
    EARTH_RADIUS_Y_SQURAE,
    EARTH_RADIUS_Z_SQURAE,
} from "../../Constant";

export class Cartesian3 extends Vector3 {
    static get WGS84_RADII_SQUARED() {
        return new Cartesian3(
            EARTH_RADIUS_X_SQURAE,
            EARTH_RADIUS_Y_SQURAE,
            EARTH_RADIUS_Z_SQURAE
        );
    }

    static get UINT_X() {
        return new Cartesian3(1.0, 0.0, 0.0);
    }

    static get UINT_Y() {
        return new Cartesian3(0.0, 1.0, 0.0);
    }

    static get UINT_Z() {
        return new Cartesian3(0.0, 0.0, 1.0);
    }

    static get ZERO() {
        return new Cartesian3(0, 0, 0);
    }

    static fromRadians(longitude: number, latitude: number, height: number) {
        const cosLatitude = Math.cos(latitude);

        const cartesian = Cartesian3.ZERO.set(
            cosLatitude * Math.cos(longitude),
            cosLatitude * Math.sin(longitude),
            Math.sin(latitude)
        ).normalize();

        const WGS84_RADII_SQUARED = Cartesian3.WGS84_RADII_SQUARED;
        WGS84_RADII_SQUARED.multiply(cartesian);

        const gamma = Math.sqrt(WGS84_RADII_SQUARED.dot(cartesian));
        WGS84_RADII_SQUARED.divideScalar(gamma);

        return cartesian.multiplyScalar(height).add(WGS84_RADII_SQUARED);
    }

    static fromDegree(longitude: number, latitude: number, height: number) {
        return this.fromRadians(
            MathUtils.degToRad(longitude),
            MathUtils.degToRad(latitude),
            height
        );
    }

    isZero() {
        return this.equals(Cartesian3.ZERO);
    }

    static unpack(
        array: Array<number>,
        startIndex: number = 0,
        result: Cartesian3 = new Cartesian3()
    ) {
        return result.set(
            array[startIndex++],
            array[startIndex++],
            array[startIndex]
        );
    }
}

import { Matrix4 } from "three";
import { Cartesian3, Transforms } from ".";
import { HeadingPitchRoll } from "./Transforms";

export interface Position {
    wgs84: IWGS84;
    action?: WGS84_ACTION;
}

export interface IWGS84 {
    latitude: number;
    longitude: number;
    height: number;
}

export enum WGS84_ACTION {
    NONE,
    SWAP,
}

export class CT_WGS84 {
    private position: IWGS84;

    constructor(position: Position) {
        const { wgs84, action } = position;
        /**
         * Cesium 에서 제공되는 좌표 위치 값은 threejs 에서의 XY 값이 반대이기 때문에
         * 위도 경도의 위치가 서로 뒤바뀌어야합니다.
         */
        if (action === WGS84_ACTION.SWAP) {
            // prettier-ignore
            [
                wgs84.latitude,
                wgs84.longitude
            ] = [
                wgs84.longitude,
                wgs84.latitude,
            ];
        }
        this.position = wgs84;
    }

    getMatrix4(
        headingPitchRoll: HeadingPitchRoll,
        result: Matrix4 = new Matrix4()
    ) {
        const matrix = Transforms.matrix4ToFixedFrame(
            Cartesian3.fromDegree(this.position),
            headingPitchRoll
        ).elements;

        // prettier-ignore
        return result.set(
			matrix[ 0], matrix[ 4], matrix[ 8], matrix[12],
			matrix[ 1], matrix[ 5], matrix[ 9], matrix[13],
			matrix[ 2], matrix[ 6], matrix[10], matrix[14],
			matrix[ 3], matrix[ 7], matrix[11], matrix[15]
		);
    }

    toString() {
        const atl = this.position.height / 1000;
        let str = "";
        if (atl > 1) {
            str = `${Number(atl.toFixed(1)).toLocaleString()}km`;
        } else {
            str = `${Number(
                this.position.height.toFixed(1)
            ).toLocaleString()}m`;
        }
        return `Lat: ${this.position.latitude}\nLon: ${this.position.longitude}\nAlt: ${str}`;
    }

    toIWGS84(): IWGS84 {
        return this.position;
    }
}

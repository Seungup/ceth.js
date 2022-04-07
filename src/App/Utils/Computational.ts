import { CT_WGS84, IWGS84, WGS84_ACTION } from '../Math';

export class Computational {
    static async computePosition(longitude: number, latitude: number, height: number) {
        return this.computePositionByWGS84(
            {
                height: height,
                latitude: latitude,
                longitude: longitude,
            },
            WGS84_ACTION.NONE
        );
    }

    static async computePositionByWGS84(wgs84: IWGS84, action: WGS84_ACTION) {
        return new CT_WGS84(wgs84, action).getMatrix4();
    }
}

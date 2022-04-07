import * as Cesium from 'cesium';
import { ApplicationContext } from '../Context/ApplicationContext';
import { CT_WGS84, IWGS84 } from '../Math';
import { ObjectAPI } from '../Objects/ObjectAPI';

export class CesiumUtils {
    static getCameraPosition() {
        const viewer = ApplicationContext.getInstance().viewer;
        if (viewer) {
            const result = new Cesium.Cartographic();
            viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.positionWC, result);
            return {
                longitude: Cesium.Math.toDegrees(result.longitude),
                latitude: Cesium.Math.toDegrees(result.latitude),
                height: result.height,
            } as IWGS84;
        }
    }

    private static _scratchCartesian2 = new Cesium.Cartesian2();

    static getLongitudeLatitudeByMouseEvent(event: MouseEvent) {
        this._scratchCartesian2.x = event.clientX;
        this._scratchCartesian2.y = event.clientY;
        return CesiumUtils.getLongitudeLatitudeByLocation(this._scratchCartesian2);
    }

    static getLongitudeLatitudeByLocation(position: Cesium.Cartesian2) {
        const viewer = ApplicationContext.getInstance().viewer;
        if (viewer) {
            const ellipsoid = viewer.scene.globe.ellipsoid;
            const cartesian = viewer.camera.pickEllipsoid(position, ellipsoid);

            if (cartesian) {
                const cartographic = ellipsoid.cartesianToCartographic(cartesian);
                return {
                    latitude: Cesium.Math.toDegrees(cartographic.latitude),
                    longitude: Cesium.Math.toDegrees(cartographic.longitude),
                };
            }
        }
    }

    static async flyByObjectAPI(api: ObjectAPI) {
        const position = await api.getPosition();
        const box3 = await api.getBox3();
        if (position) {
            let radius = undefined;
            if (box3) {
                if (box3.z > 0) {
                    radius = box3.z * 1.5;
                } else if (box3.y > 0) {
                    radius = box3.y * 1.5;
                } else if (box3.x > 0) {
                    radius = box3.x * 1.5;
                } else {
                    radius = 50;
                }
            }
            if (isNaN(position.height)) {
                position.height = 0;
            }

            return CesiumUtils.flyByWGS84(new CT_WGS84(position).toIWGS84(), radius);
        }
    }

    static flyByWGS84(position: IWGS84, radius: number | undefined = undefined) {
        const viewer = ApplicationContext.getInstance().viewer;
        if (viewer) {
            const wgs84Position = Cesium.Cartesian3.fromDegrees(
                position.longitude,
                position.latitude,
                position.height
            );

            viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(wgs84Position, radius));
        }
    }
}

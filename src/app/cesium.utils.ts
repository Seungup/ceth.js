import { Cartesian2, Cartographic, Math, Viewer, Cartesian3, BoundingSphere } from 'cesium';
import { IWGS84 } from '../math';
import { ObjectAPI } from './factory/object.api';

export namespace CesiumUtils {
    export const getCameraPosition = (viewer: Viewer) => {
        const result = new Cartographic();
        viewer.scene.globe.ellipsoid.cartesianToCartographic(viewer.camera.positionWC, result);
        return {
            longitude: Math.toDegrees(result.longitude),
            latitude: Math.toDegrees(result.latitude),
            height: result.height,
        } as IWGS84;
    };

    const _scratchCartesian2 = new Cartesian2();

    export const mousePositionToWGS84 = (viewer: Viewer, event: MouseEvent) => {
        _scratchCartesian2.x = event.clientX;
        _scratchCartesian2.y = event.clientY;

        const selectedLocation = convertScreenPixelToLocation(viewer, _scratchCartesian2);

        if (selectedLocation) {
            return {
                height: 0,
                latitude: selectedLocation.longitude,
                longitude: selectedLocation.latitude,
            } as IWGS84;
        }
    };

    export const convertScreenPixelToLocation = (viewer: Viewer, position: Cartesian2) => {
        const ellipsoid = viewer.scene.globe.ellipsoid;
        const cartesian = viewer.camera.pickEllipsoid(position, ellipsoid);

        if (cartesian) {
            const cartographic = ellipsoid.cartesianToCartographic(cartesian);
            return {
                height: 0,
                latitude: Math.toDegrees(cartographic.latitude),
                longitude: Math.toDegrees(cartographic.longitude),
            } as IWGS84;
        }
    };
    export const flyByObjectAPI = async (viewer: Viewer, api: ObjectAPI) => {
        const position = await api.getPosition();
        const box3 = await api.getBox3();
        if (position) {
            let radius = undefined;
            if (box3) {
                if (box3.max.z > 0) {
                    radius = box3.max.z * 1.5;
                } else if (box3.max.y > 0) {
                    radius = box3.max.y * 1.5;
                } else if (box3.max.x > 0) {
                    radius = box3.max.x * 1.5;
                } else {
                    radius = 50;
                }
            }
            if (isNaN(position.height)) {
                position.height = 0;
            }
            return flyByWGS84(
                viewer,
                {
                    height: position.height,
                    latitude: position.latitude,
                    longitude: position.longitude,
                },
                radius
            );
        }
    };

    export const flyByWGS84 = (
        viewer: Viewer,
        position: IWGS84,
        radius: number | undefined = undefined
    ) => {
        const wgs84Position = Cartesian3.fromDegrees(
            position.longitude,
            position.latitude,
            position.height
        );
        viewer.camera.flyToBoundingSphere(new BoundingSphere(wgs84Position, radius));
    };
}

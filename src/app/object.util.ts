import * as Cesium from 'cesium';
import { IWGS84 } from '..';
import { SingletonWorkerFactory } from '../core/worker-factory';
import { ObjectAPI } from './object.api';

export class ObjectUtil {
  private readonly coreWrapper =
    SingletonWorkerFactory.getWrapper('CoreThread');

  constructor(private readonly viewer: Cesium.Viewer) {
    this.viewer.canvas.addEventListener(
      'contextmenu',
      (event) => {
        const mousePosition = new Cesium.Cartesian2(
          event.clientX,
          event.clientY
        );
        const selectedLocation =
          this.convertScreenPixelToLocation(mousePosition);
        console.log(selectedLocation);
      },
      false
    );
  }

  convertScreenPixelToLocation(position: Cesium.Cartesian2) {
    const ellipsoid = this.viewer.scene.globe.ellipsoid;
    const cartesian = this.viewer.camera.pickEllipsoid(position, ellipsoid);

    if (cartesian) {
      const cartographic = ellipsoid.cartesianToCartographic(cartesian);
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);

      return {
        lat: Number(lat.toFixed(15)),
        lon: Number(lon.toFixed(15)),
      };
    }
  }

  async flyByObjectAPI(api: ObjectAPI) {
    const position = await api.getPosition();
    const box3 = await api.getBox3();
    if (position) {
      const radius = box3 ? box3.z * 3 : undefined;
      return this.flyByWGS84(position, radius);
    }
  }

  flyByWGS84(position: IWGS84, radius: number | undefined = undefined) {
    const wgs84Position = Cesium.Cartesian3.fromDegrees(
      position.longitude,
      position.latitude,
      position.height
    );
    this.viewer.camera.flyToBoundingSphere(
      new Cesium.BoundingSphere(wgs84Position, radius),
      {
        duration: 1,
      }
    );
  }
}

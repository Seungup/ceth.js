import { CT_WGS84, IWGS84 } from "../core";
import { SingletonWorkerFactory } from "../core/worker-factory";

export class ObjectAPI {
  readonly id: number;
  private readonly _coreThread =
    SingletonWorkerFactory.getWrapper("CoreThread");

  constructor(id: number) {
    this.id = id;
  }

  getUserData(key: string) {
    return this._coreThread.getUserDataAt(this.id, key);
  }

  setUserData(key: string, value: any) {
    return this._coreThread.setUserDataAt(this.id, key, value);
  }

  hide(): Promise<boolean> {
    return this._coreThread.hide(this.id);
  }

  show(): Promise<boolean> {
    return this._coreThread.show(this.id);
  }

  setPosition(position: IWGS84): Promise<boolean> {
    const wgs84 = CT_WGS84.fromCesiumWGS84(
      position.latitude,
      position.longitude,
      position.height
    );
    return this._coreThread.updatePosition(this.id, wgs84);
  }

  async getPosition(): Promise<IWGS84 | undefined> {
    const position = await this._coreThread.getWGS84(this.id);
    if (position) {
      return {
        latitude: position.longitude,
        longitude: position.latitude,
        height: position.height,
      };
    }
  }

  dispose(): Promise<boolean> {
    return this._coreThread.delete(this.id);
  }

  isDisposed(): Promise<boolean> {
    return this._coreThread.isExist(this.id);
  }
}

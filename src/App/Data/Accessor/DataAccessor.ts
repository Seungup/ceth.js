import * as THREE from "three";
import { IWGS84, WGS84_ACTION } from "../../Math";
import { InstanceDataAccessor } from "./Strategy/InstanceDataAccessor";
import { LocalDataAccessor } from "./Strategy/LocalDataAccessor";
import { WorkerDataAccessor } from "./Strategy/WorkerDataAccessor";

interface IDataAccessor {
    setWGS84(wgs84: IWGS84, action: WGS84_ACTION): Promise<void>;
    getWGS84(): Promise<IWGS84 | undefined>;
    getBox3Max(): Promise<THREE.Vector3 | undefined>;
    remove(): Promise<void>;
    isExise(): Promise<boolean>;
    setWorker?(worker: Worker): void;
    setId?(id: number): void;
    setAccessKey?(key: string): void;
    setScene?(scene: THREE.Scene): void;
}

export abstract class DataAccessor implements IDataAccessor {
    setWGS84(wgs84: IWGS84, action: WGS84_ACTION): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getWGS84(): Promise<IWGS84 | undefined> {
        throw new Error("Method not implemented.");
    }
    getBox3Max(): Promise<THREE.Vector3 | undefined> {
        throw new Error("Method not implemented.");
    }
    remove(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    isExise(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    setWorker?(worker: Worker): void;
    setId?(id: number): void;
    setAccessKey?(key: string): void;
    setScene?(scene: THREE.Scene): void;
}

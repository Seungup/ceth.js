import * as THREE from "three";
import { IWGS84, WGS84_ACTION } from "../../Math";
import { InstanceDataAccessor } from "./Strategy/InstanceDataAccessor";
import { LocalDataAccessor } from "./Strategy/LocalDataAccessor";
import { WorkerDataAccessor } from "./Strategy/WorkerDataAccessor";

export type Accessor =
    | typeof InstanceDataAccessor
    | typeof LocalDataAccessor
    | typeof WorkerDataAccessor;

export interface DataAccessor {
    setWGS84(wgs84: IWGS84, action: WGS84_ACTION): Promise<void>;
    getWGS84(): Promise<IWGS84 | undefined>;
    getBox3Max(): Promise<THREE.Vector3 | undefined>;
    remove(): Promise<void>;
    isExise(): Promise<boolean>;
}

import * as Cesium from "cesium";
import { Viewer } from "cesium";
import * as THREE from "three";
import { Object3D, SphereGeometry, Vector3, PlaneGeometry, BoxGeometry, Matrix4 } from "three";
import { TeapotGeometry } from "three/examples/jsm/geometries/TeapotGeometry";
export const REVISION = "0dev";
declare class ObjectRenderer {
    constructor(viewer: Viewer);
    setSize(width: number, height: number): Promise<void>;
    render(): void;
}
declare class ObjectAPI {
    readonly id: number;
    constructor(id: number);
    getUserData(key: string): Promise<unknown>;
    setUserData(key: string, value: any): Promise<void>;
    hide(): Promise<boolean>;
    show(): Promise<boolean>;
    setPosition(position: CesiumWGS84, height?: number): Promise<boolean>;
    getPosition(): Promise<CesiumWGS84>;
    dispose(): Promise<boolean>;
    isDisposed(): Promise<boolean>;
}
interface RequestResult {
    objectId: number;
    result: boolean;
}
declare class ObjectManager {
    add(object: Object3D, position?: CesiumWGS84): Promise<ObjectAPI>;
    get(id: number): Promise<ObjectAPI | undefined>;
    updateObject(id: number, object: Object3D): Promise<RequestResult>;
}
declare class ObjectUtil {
    constructor(viewer: Cesium.Viewer);
    flyTo(id: number): Promise<void>;
}
export class InterfcaeFactory {
    constructor(viewer: Cesium.Viewer);
    get manager(): ObjectManager;
    get util(): ObjectUtil;
    get renderer(): ObjectRenderer;
}
export class EarthGeometry extends SphereGeometry {
    constructor(segments?: number);
}
declare class Cartesian3 extends Vector3 {
    static get WGS84_RADII_SQUARED(): Cartesian3;
    static get UINT_X(): Cartesian3;
    static get UINT_Y(): Cartesian3;
    static get UINT_Z(): Cartesian3;
    static get ZERO(): Cartesian3;
    normalizeByMagnitude(): this;
    static fromDegree(longitude: number, latitude: number, height: number): Cartesian3;
    static fromRadians(longitude: number, latitude: number, height: number): Cartesian3;
    isZero(): boolean;
    static unpack(array: Array<number>, startIndex?: number, result?: Cartesian3): Cartesian3;
    static equalsEpsilon(left: Cartesian3, right: Cartesian3, relativeEpsilon?: number, absoluteEpsilon?: number): boolean;
}
export class CesiumWGS84 {
    longitude: number;
    latitude: number;
    constructor(longitude: number, latitude: number);
}
export class ThreeWGS84 {
    longitude: number;
    latitude: number;
    constructor(longitude: number, latitude: number);
}
export class Utils {
    static randomOffset(): number;
    static CesiumWGS84ToThreeWGS84(cesiumWGS84: CesiumWGS84): ThreeWGS84;
    static ThreeWGS84ToCesiumWGS84(ThreeWGS84: ThreeWGS84): CesiumWGS84;
    static getWindowPosition(viewer: Cesium.Viewer): Cesium.Cartesian2;
    static getPosition(viewer: Cesium.Viewer, windowPosition: Cesium.Cartesian2): Cesium.Cartographic | undefined;
    static getWGS84FromCartographic(cartographic: Cesium.Cartographic): {
        lat: number;
        lon: number;
    };
    static getCurrentCenterPosition(viewer: Cesium.Viewer): Cesium.Cartographic | undefined;
    static getCurrentCenterHeight(viewer: Cesium.Viewer): number | undefined;
    static rotationX(degrees: number): THREE.Matrix4;
    static applayRotation(object: THREE.BufferGeometry, degrees: number): void;
    static localWGS84ToMattrix4(position: ThreeWGS84, height?: number): THREE.Matrix4;
    static applyObjectWGS84Postion(geometry: THREE.BufferGeometry, position: CesiumWGS84 | ThreeWGS84): void;
}
export function makeTeapotGeometry(teapotSize?: number): TeapotGeometry;
export function makeBoxGeometry(boxSize?: number): BoxGeometry;
export function makePlaneGeometry(w: number, h: number): PlaneGeometry;
declare const vectorProductLocalFrame: {
    readonly up: {
        readonly south: "east";
        readonly north: "west";
        readonly west: "south";
        readonly east: "north";
    };
    readonly down: {
        readonly south: "west";
        readonly north: "east";
        readonly west: "north";
        readonly east: "south";
    };
    readonly south: {
        readonly up: "west";
        readonly down: "east";
        readonly west: "down";
        readonly east: "up";
    };
    readonly north: {
        readonly up: "east";
        readonly down: "west";
        readonly west: "up";
        readonly east: "down";
    };
    readonly west: {
        readonly up: "north";
        readonly down: "south";
        readonly north: "down";
        readonly south: "up";
    };
    readonly east: {
        readonly up: "south";
        readonly down: "north";
        readonly north: "up";
        readonly south: "down";
    };
};
type AxisFirst = keyof typeof vectorProductLocalFrame;
type AxisSecond<K extends AxisFirst> = keyof typeof vectorProductLocalFrame[K];
type FixedFrameTransformFunction = {
    (origin: Cartesian3): Matrix4;
};
export class Transforms {
    static localFrameToFixedFrameCache: Map<string, FixedFrameTransformFunction>;
    static localFrameToFixedFrameGenerator<K extends AxisFirst>(firstAixs: K, secondAxis: AxisSecond<K>): FixedFrameTransformFunction;
    static headingPitchRollToFixedFrame(origin: Cartesian3, result?: Matrix4): Matrix4;
}

//# sourceMappingURL=index.d.ts.map

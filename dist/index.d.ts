import { Vector3, Matrix4, Vector4, Object3D } from "three";
import * as Cesium from "cesium";
import { Viewer } from "cesium";
export const REVISION = "0dev";
export class MathUtils {
    static readonly RADIANS_PER_DEGREE: number;
    static readonly EPSILON_01: number;
    static readonly EPSILON_02: number;
    static readonly EPSILON_03: number;
    static readonly EPSILON_04: number;
    static readonly EPSILON_05: number;
    static readonly EPSILON_06: number;
    static readonly EPSILON_07: number;
    static readonly EPSILON_08: number;
    static readonly EPSILON_09: number;
    static readonly EPSILON_10: number;
    static readonly EPSILON_11: number;
    static readonly EPSILON_12: number;
    static readonly EPSILON_13: number;
    static readonly EPSILON_14: number;
    static readonly EPSILON_15: number;
    static readonly EPSILON_16: number;
    static readonly EPSILON_17: number;
    static readonly EPSILON_18: number;
    static readonly EPSILON_19: number;
    static readonly EPSILON_20: number;
    static readonly EPSILON_21: number;
    static toRadians(degrees: number): number;
    static randomOffset(): number;
    /**
     * 절대 공차 검정 또는 상대 공차 검정을 사용하여 두 값이 같은지 여부를 확인합니다.
     *
     * @example
     * MathUtils.equalsEpsilon(0.1, 0.01, MathUtils.EPSILON_01) // true
     * MathUtils.equalsEpsilon(0.1, 0.01, MathUtils.EPSILON_02) // false
     *
     * @param left - The first value to compare.
     * @param right - The other value to compare.
     * @param relativeEpsilon
     * @param absoluteEpsilon
     * @returns
     */
    static equalsEpsilon(left: number, right: number, relativeEpsilon?: number, absoluteEpsilon?: number): boolean;
    static magnitude(vec: {
        x: number;
        y: number;
        z: number;
    }): number;
}
export class CT_Cartesian3 extends Vector3 {
    static get WGS84_RADII_SQUARED(): CT_Cartesian3;
    static get UINT_X(): CT_Cartesian3;
    static get UINT_Y(): CT_Cartesian3;
    static get UINT_Z(): CT_Cartesian3;
    static get ZERO(): CT_Cartesian3;
    static fromRadians(longitude: number, latitude: number, height: number): CT_Cartesian3;
    static fromDegree(longitude: number, latitude: number, height: number): CT_Cartesian3;
    static equalsEpsilon(left: CT_Cartesian3, right: CT_Cartesian3, relativeEpsilon?: number, absoluteEpsilon?: number): boolean;
    normalizeByMagnitude(): this;
    isZero(): boolean;
    static unpack(array: Array<number>, startIndex?: number, result?: CT_Cartesian3): CT_Cartesian3;
}
export class CT_Ellipsoid extends Vector3 {
    constructor(x: number, y: number, z: number);
    static get WGS84(): CT_Ellipsoid;
    static readonly DEFAULT_WGS84_RADII_SQUARED: Readonly<CT_Cartesian3>;
    static getDefaultWGS84RadiiSquaredGeodticSurfaceNormal(cartesian: CT_Cartesian3, result?: CT_Cartesian3): CT_Cartesian3 | undefined;
    geodeticSurfaceNormal(cartesian: CT_Cartesian3, result?: CT_Cartesian3): CT_Cartesian3 | undefined;
}
export class CT_Matrix4 extends Matrix4 {
    static fromRotationX(degrees: number, result?: Matrix4): Matrix4;
    static fromWGS84(longitude: number, latitude: number, height: number, result?: Matrix4): Matrix4;
    static fromTranslationQuaternionRotationScale(translation: CT_Cartesian3, rotation: CT_Quaternion, scale: CT_Cartesian3, result?: CT_Matrix4): Matrix4;
}
export class CT_Quaternion extends Vector4 {
    static fromAxisAngle(aixs: CT_Cartesian3, angle: number, result?: CT_Quaternion): CT_Quaternion;
    static fromHeadingPitchRoll(heading: number, pitch: number, roll: number, result?: CT_Quaternion): CT_Quaternion;
}
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
    (origin: CT_Cartesian3): Matrix4;
};
export class CT_Transforms {
    static localFrameToFixedFrameCache: Map<string, FixedFrameTransformFunction>;
    static localFrameToFixedFrameGenerator<K extends AxisFirst>(firstAixs: K, secondAxis: AxisSecond<K>): FixedFrameTransformFunction;
    static eastNorthUpToFixedFrame: FixedFrameTransformFunction;
    static matrix4ToFixedFrame(origin: CT_Cartesian3, matrix: Matrix4, result?: Matrix4): Matrix4;
    static headingPitchRollToFixedFrame(origin: CT_Cartesian3, heading: number, pitch: number, roll: number, result?: Matrix4): Matrix4;
}
export interface IWGS84 {
    latitude: number;
    longitude: number;
    height: number;
}
export class CT_WGS84 extends Vector3 {
    constructor(latitude?: number | undefined, longitude?: number | undefined, height?: number | undefined);
    get latitude(): number;
    set latitude(value: number);
    get longitude(): number;
    set longitude(value: number);
    get height(): number;
    set height(value: number);
    getMatrix4(result?: CT_Matrix4): Matrix4;
    toJSON(): IWGS84;
    static fromCesiumWGS84(latitude: number, longitude: number, height: number, result?: CT_WGS84): CT_WGS84;
    static fromThreeWGS84(latitude: number, longitude: number, height: number, result?: CT_WGS84): CT_WGS84;
}
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
    setPosition(position: IWGS84): Promise<boolean>;
    getPosition(): Promise<IWGS84 | undefined>;
    dispose(): Promise<boolean>;
    isDisposed(): Promise<boolean>;
}
interface RequestResult {
    objectId: number;
    result: boolean;
}
declare class ObjectManager {
    add(object: Object3D, position?: IWGS84): Promise<ObjectAPI>;
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

//# sourceMappingURL=index.d.ts.map

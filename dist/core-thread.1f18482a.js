import {expose as $d9Ejt$expose} from "comlink";
import {ObjectLoader as $d9Ejt$ObjectLoader, BoxHelper as $d9Ejt$BoxHelper, Box3 as $d9Ejt$Box3, Scene as $d9Ejt$Scene, PerspectiveCamera as $d9Ejt$PerspectiveCamera, WebGLRenderer as $d9Ejt$WebGLRenderer, Vector3 as $d9Ejt$Vector3, Matrix4 as $d9Ejt$Matrix4, Vector4 as $d9Ejt$Vector4} from "three";
import {Subject as $d9Ejt$Subject} from "rxjs";

function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}



class $d1b8e958636edac6$export$adfa9d260876eca5 {
    constructor(scene = new $d9Ejt$Scene()){
        this.scene = scene;
        this.camera = new $d9Ejt$PerspectiveCamera();
    }
    static getInstance() {
        return this.instance || (this.instance = new this());
    }
    setPixelRatio(value) {
        let success = false;
        if (this.renderer) {
            this.renderer.setPixelRatio(value);
            success = true;
        }
        return success;
    }
    init(canvas) {
        const params = {
            canvas: canvas,
            powerPreference: 'high-performance',
            alpha: true,
            antialias: true,
            logarithmicDepthBuffer: true,
            depth: false
        };
        const context = canvas.getContext('webgl2');
        if (context) params.context = context;
        this.renderer = new $d9Ejt$WebGLRenderer(params);
        console.log(`[Graphic] isWebGL2Enabled : ${this.renderer.capabilities.isWebGL2}`);
    }
    setSize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer?.setSize(width, height, false);
    }
    /**
	 * 장면을 렌더링합니다.
	 * @param param
	 */ render(param) {
        if (this.renderer) {
            this.camera.matrixAutoUpdate = false;
            // prettier-ignore
            this.camera.matrixWorld.set(param.civm[0], param.civm[4], param.civm[8], param.civm[12], param.civm[1], param.civm[5], param.civm[9], param.civm[13], param.civm[2], param.civm[6], param.civm[10], param.civm[14], param.civm[3], param.civm[7], param.civm[11], param.civm[15]);
            // prettier-ignore
            this.camera.matrixWorldInverse.set(param.cvm[0], param.cvm[4], param.cvm[8], param.cvm[12], param.cvm[1], param.cvm[5], param.cvm[9], param.cvm[13], param.cvm[2], param.cvm[6], param.cvm[10], param.cvm[14], param.cvm[3], param.cvm[7], param.cvm[11], param.cvm[15]);
            this.camera.updateProjectionMatrix();
            this.renderer.render(this.scene, this.camera);
        }
    }
}





class $f20f17e129275ffd$export$8890c8adaae71a72 {
    /**
	 * 다음 장면을 그립니다.
	 */ _renderNextAnimationFrame() {
        this.param = this._queue.pop();
        if (this.param) this.graphic.render(this.param);
        this._handle = requestAnimationFrame(this._bindRenderNextAnimationFrame);
        this._renderSubject.next();
    }
    /**
	 * 다음 장면을 요청합니다.
	 * @param param 렌더링 파라미터
	 */ updateNextAnimationFrame(param) {
        if (this._queue.length) this._queue[0] = param;
        else this._queue.push(param);
        if (!this._handle) this._renderNextAnimationFrame();
    }
    constructor(){
        this._queue = [];
        this.graphic = $d1b8e958636edac6$export$adfa9d260876eca5.getInstance();
        this._bindRenderNextAnimationFrame = this._renderNextAnimationFrame.bind(this);
        this._renderSubject = new $d9Ejt$Subject();
        this.renderNextFrame$ = this._renderSubject.pipe();
    }
}


var $041dfd65fc078bd9$exports = {};
var $54db50d775dc5ee6$exports = {};

$parcel$export($54db50d775dc5ee6$exports, "CT_Cartesian3", () => $54db50d775dc5ee6$export$aca70b982fa554b6);

const $234747a9630b4642$export$3545e07a80636437 = '0dev';
const $234747a9630b4642$export$d055d6f746a0dadb = 6378137;
const $234747a9630b4642$export$e586789a40edc0eb = 6378137;
const $234747a9630b4642$export$9d8be9f67f903df8 = 6356752.314245179;
const $234747a9630b4642$export$e7c2ef8be8b001f4 = 40680631590769;
const $234747a9630b4642$export$c9841caf9817ab44 = 40680631590769;
const $234747a9630b4642$export$1845088a49f45c1b = 40408299984661.445;


var $0df7ca19a0800c87$exports = {};

$parcel$export($0df7ca19a0800c87$exports, "MathUtils", () => $a37d01845c731898$export$6a7ef315a0d1ef07);
class $a37d01845c731898$export$6a7ef315a0d1ef07 {
    static toRadians(degrees) {
        return degrees * this.RADIANS_PER_DEGREE;
    }
    static randomOffset() {
        return Math.floor(Math.random() * 10000) * 0.000001;
    }
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
   */ static equalsEpsilon(left, right, relativeEpsilon = this.EPSILON_14, absoluteEpsilon = this.EPSILON_14) {
        const absDiff = Math.abs(left - right);
        if (absDiff <= absoluteEpsilon) return true;
        return absDiff <= relativeEpsilon * Math.max(Math.abs(left), Math.abs(right));
    }
    static magnitude(vec) {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    }
}
$a37d01845c731898$export$6a7ef315a0d1ef07.RADIANS_PER_DEGREE = Math.PI / 180;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_01 = 0.1;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_02 = 0.01;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_03 = 0.001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_04 = 0.0001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_05 = 0.00001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_06 = 0.000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_07 = 0.0000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_08 = 0.00000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_09 = 0.000000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_10 = 0.0000000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_11 = 0.00000000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_12 = 0.000000000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_13 = 0.0000000000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_14 = 0.00000000000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_15 = 0.000000000000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_16 = 0.0000000000000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_17 = 0.00000000000000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_18 = 0.000000000000000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_19 = 0.0000000000000000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_20 = 0.00000000000000000001;
$a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_21 = 0.000000000000000000001;




class $54db50d775dc5ee6$export$aca70b982fa554b6 extends $d9Ejt$Vector3 {
    static get WGS84_RADII_SQUARED() {
        return new $54db50d775dc5ee6$export$aca70b982fa554b6($234747a9630b4642$export$e7c2ef8be8b001f4, $234747a9630b4642$export$c9841caf9817ab44, $234747a9630b4642$export$1845088a49f45c1b);
    }
    static get UINT_X() {
        return new $54db50d775dc5ee6$export$aca70b982fa554b6(1, 0, 0);
    }
    static get UINT_Y() {
        return new $54db50d775dc5ee6$export$aca70b982fa554b6(0, 1, 0);
    }
    static get UINT_Z() {
        return new $54db50d775dc5ee6$export$aca70b982fa554b6(0, 0, 1);
    }
    static get ZERO() {
        return new $54db50d775dc5ee6$export$aca70b982fa554b6(0, 0, 0);
    }
    static fromRadians(longitude, latitude, height) {
        const cosLatitude = Math.cos(latitude);
        const cartesian = new $54db50d775dc5ee6$export$aca70b982fa554b6(cosLatitude * Math.cos(longitude), cosLatitude * Math.sin(longitude), Math.sin(latitude)).normalizeByMagnitude();
        const WGS84_RADII_SQUARED = $54db50d775dc5ee6$export$aca70b982fa554b6.WGS84_RADII_SQUARED.multiply(cartesian);
        const gamma = Math.sqrt(WGS84_RADII_SQUARED.dot(cartesian));
        WGS84_RADII_SQUARED.divideScalar(gamma);
        return cartesian.multiplyScalar(height).add(WGS84_RADII_SQUARED);
    }
    static fromDegree(longitude, latitude, height) {
        return this.fromRadians($a37d01845c731898$export$6a7ef315a0d1ef07.toRadians(longitude), $a37d01845c731898$export$6a7ef315a0d1ef07.toRadians(latitude), height);
    }
    static equalsEpsilon(left, right, relativeEpsilon = $a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_14, absoluteEpsilon = $a37d01845c731898$export$6a7ef315a0d1ef07.EPSILON_14) {
        if (left.equals(right)) return true;
        return $a37d01845c731898$export$6a7ef315a0d1ef07.equalsEpsilon(left.x, right.x, relativeEpsilon, absoluteEpsilon) && $a37d01845c731898$export$6a7ef315a0d1ef07.equalsEpsilon(left.y, right.y, relativeEpsilon, absoluteEpsilon) && $a37d01845c731898$export$6a7ef315a0d1ef07.equalsEpsilon(left.z, right.z, relativeEpsilon, absoluteEpsilon);
    }
    normalizeByMagnitude() {
        return this.divideScalar($a37d01845c731898$export$6a7ef315a0d1ef07.magnitude(this));
    }
    isZero() {
        return $54db50d775dc5ee6$export$aca70b982fa554b6.equalsEpsilon(this, $54db50d775dc5ee6$export$aca70b982fa554b6.ZERO);
    }
    static unpack(array, startIndex = 0, result = new $54db50d775dc5ee6$export$aca70b982fa554b6()) {
        return result.set(array[startIndex++], array[startIndex++], array[startIndex]);
    }
}


var $19176608e346944f$exports = {};

$parcel$export($19176608e346944f$exports, "CT_Ellipsoid", () => $19176608e346944f$export$5851ecdbb051d869);



class $19176608e346944f$export$5851ecdbb051d869 extends $d9Ejt$Vector3 {
    constructor(x, y, z){
        super(x, y, z);
        this._oneOverRadiiSquared = new $54db50d775dc5ee6$export$aca70b982fa554b6(this.x == 0 ? 0 : 1 / (this.x * this.x), this.y == 0 ? 0 : 1 / (this.y * this.y), this.z == 0 ? 0 : 1 / (this.z * this.z));
    }
    static get WGS84() {
        return new $19176608e346944f$export$5851ecdbb051d869($234747a9630b4642$export$d055d6f746a0dadb, $234747a9630b4642$export$e586789a40edc0eb, $234747a9630b4642$export$9d8be9f67f903df8);
    }
    static getDefaultWGS84RadiiSquaredGeodticSurfaceNormal(cartesian, result = new $54db50d775dc5ee6$export$aca70b982fa554b6()) {
        if (cartesian.isZero()) return;
        return result.copy(cartesian).multiply(this.DEFAULT_WGS84_RADII_SQUARED).normalizeByMagnitude();
    }
    geodeticSurfaceNormal(cartesian, result = new $54db50d775dc5ee6$export$aca70b982fa554b6()) {
        if (cartesian.isZero()) return;
        return result.copy(cartesian).multiply(this._oneOverRadiiSquared).normalizeByMagnitude();
    }
}
$19176608e346944f$export$5851ecdbb051d869.DEFAULT_WGS84_RADII_SQUARED = Object.freeze($19176608e346944f$export$5851ecdbb051d869.WGS84._oneOverRadiiSquared);


var $b5a7119ef71cd3f1$exports = {};

$parcel$export($b5a7119ef71cd3f1$exports, "CT_Matrix4", () => $b5a7119ef71cd3f1$export$e6eceaa934a6d3e5);



class $b5a7119ef71cd3f1$export$e6eceaa934a6d3e5 extends $d9Ejt$Matrix4 {
    static fromRotationX(degrees, result = new $d9Ejt$Matrix4()) {
        return result.makeRotationX($a37d01845c731898$export$6a7ef315a0d1ef07.toRadians(degrees));
    }
    static fromWGS84(longitude, latitude, height, result = new $d9Ejt$Matrix4()) {
        const matrix = $23952d628235a608$export$4fd467e6c04a27e1.matrix4ToFixedFrame($54db50d775dc5ee6$export$aca70b982fa554b6.fromDegree(longitude, latitude, height), new $d9Ejt$Matrix4()).elements;
        // prettier-ignore
        return result.set(matrix[0], matrix[4], matrix[8], matrix[12], matrix[1], matrix[5], matrix[9], matrix[13], matrix[2], matrix[6], matrix[10], matrix[14], matrix[3], matrix[7], matrix[11], matrix[15]);
    }
    static fromTranslationQuaternionRotationScale(translation, rotation, scale, result = new $b5a7119ef71cd3f1$export$e6eceaa934a6d3e5()) {
        const scaleX = scale.x;
        const scaleY = scale.y;
        const scaleZ = scale.z;
        const x2 = rotation.x * rotation.x;
        const xy = rotation.x * rotation.y;
        const xz = rotation.x * rotation.z;
        const xw = rotation.x * rotation.w;
        const y2 = rotation.y * rotation.y;
        const yz = rotation.y * rotation.z;
        const yw = rotation.y * rotation.w;
        const z2 = rotation.z * rotation.z;
        const zw = rotation.z * rotation.w;
        const w2 = rotation.w * rotation.w;
        const m00 = x2 - y2 - z2 + w2;
        const m01 = 2 * (xy - zw);
        const m02 = 2 * (xz + yw);
        const m10 = 2 * (xy + zw);
        const m11 = -x2 + y2 - z2 + w2;
        const m12 = 2 * (yz - xw);
        const m20 = 2 * (xz - yw);
        const m21 = 2 * (yz + xw);
        const m22 = -x2 - y2 + z2 + w2;
        // prettier-ignore
        return result.set(m00 * scaleX, m10 * scaleX, m20 * scaleX, 0, m01 * scaleY, m11 * scaleY, m21 * scaleY, 0, m02 * scaleZ, m12 * scaleZ, m22 * scaleZ, 0, translation.x, translation.y, translation.z, 1);
    }
}


var $809c87f5dbed8e16$exports = {};

$parcel$export($809c87f5dbed8e16$exports, "CT_Quaternion", () => $809c87f5dbed8e16$export$487e31a511bfcc15);


class $809c87f5dbed8e16$export$487e31a511bfcc15 extends $d9Ejt$Vector4 {
    static fromAxisAngle(aixs, angle, result = new $809c87f5dbed8e16$export$487e31a511bfcc15()) {
        const halfAngle = angle / 2;
        const halfAnlgOfSin = Math.sin(halfAngle);
        this._fromAxisAngleScratch.copy(aixs).normalizeByMagnitude();
        return result.set(this._fromAxisAngleScratch.x * halfAnlgOfSin, this._fromAxisAngleScratch.y * halfAnlgOfSin, this._fromAxisAngleScratch.z * halfAnlgOfSin, Math.cos(halfAngle));
    }
    static fromHeadingPitchRoll(heading, pitch, roll, result = new $809c87f5dbed8e16$export$487e31a511bfcc15()) {
        this._scratchRollQuaternion = this.fromAxisAngle($54db50d775dc5ee6$export$aca70b982fa554b6.UINT_X, roll, this._scratchHPRQuaternion);
        result = this.fromAxisAngle($54db50d775dc5ee6$export$aca70b982fa554b6.UINT_Y, pitch, this._scratchPitchQuaternion);
        this._scratchPitchQuaternion.multiply(this._scratchRollQuaternion);
        this._scratchHeadingQuaternion = this.fromAxisAngle($54db50d775dc5ee6$export$aca70b982fa554b6.UINT_Z, -heading, this._scratchHPRQuaternion);
        return result.copy(new $809c87f5dbed8e16$export$487e31a511bfcc15().copy(this._scratchHeadingQuaternion).multiply(result));
    }
}
$809c87f5dbed8e16$export$487e31a511bfcc15._fromAxisAngleScratch = new $54db50d775dc5ee6$export$aca70b982fa554b6();
$809c87f5dbed8e16$export$487e31a511bfcc15._scratchHPRQuaternion = new $809c87f5dbed8e16$export$487e31a511bfcc15();
$809c87f5dbed8e16$export$487e31a511bfcc15._scratchHeadingQuaternion = new $809c87f5dbed8e16$export$487e31a511bfcc15();
$809c87f5dbed8e16$export$487e31a511bfcc15._scratchPitchQuaternion = new $809c87f5dbed8e16$export$487e31a511bfcc15();
$809c87f5dbed8e16$export$487e31a511bfcc15._scratchRollQuaternion = new $809c87f5dbed8e16$export$487e31a511bfcc15();


var $23952d628235a608$exports = {};

$parcel$export($23952d628235a608$exports, "CT_Transforms", () => $23952d628235a608$export$4fd467e6c04a27e1);






const $23952d628235a608$var$vectorProductLocalFrame = {
    up: {
        south: 'east',
        north: 'west',
        west: 'south',
        east: 'north'
    },
    down: {
        south: 'west',
        north: 'east',
        west: 'north',
        east: 'south'
    },
    south: {
        up: 'west',
        down: 'east',
        west: 'down',
        east: 'up'
    },
    north: {
        up: 'east',
        down: 'west',
        west: 'up',
        east: 'down'
    },
    west: {
        up: 'north',
        down: 'south',
        north: 'down',
        south: 'up'
    },
    east: {
        up: 'south',
        down: 'north',
        north: 'up',
        south: 'down'
    }
};
// prettier-ignore
const $23952d628235a608$var$degeneratePositionLocalFrame = {
    north: [
        -1,
        0,
        0
    ],
    east: [
        0,
        1,
        0
    ],
    south: [
        1,
        0,
        0
    ],
    west: [
        0,
        -1,
        0
    ],
    up: [
        0,
        0,
        1
    ],
    down: [
        0,
        0,
        -1
    ]
};
const $23952d628235a608$var$scratchCalculateCartesian = {
    east: new $54db50d775dc5ee6$export$aca70b982fa554b6(),
    north: new $54db50d775dc5ee6$export$aca70b982fa554b6(),
    up: new $54db50d775dc5ee6$export$aca70b982fa554b6(),
    west: new $54db50d775dc5ee6$export$aca70b982fa554b6(),
    south: new $54db50d775dc5ee6$export$aca70b982fa554b6(),
    down: new $54db50d775dc5ee6$export$aca70b982fa554b6()
};
class $23952d628235a608$export$4fd467e6c04a27e1 {
    static localFrameToFixedFrameGenerator(firstAixs, secondAxis) {
        const axisHash = firstAixs + secondAxis;
        let f = $23952d628235a608$export$4fd467e6c04a27e1.localFrameToFixedFrameCache.get(axisHash);
        if (f) return f;
        const thirdAxis = $23952d628235a608$var$vectorProductLocalFrame[firstAixs][secondAxis];
        f = (origin, result = new $d9Ejt$Matrix4())=>{
            let scratchFirstCartesian;
            let scratchSecondCartesian;
            let scratchThirdCartesian;
            if (origin.isZero()) {
                scratchFirstCartesian = $54db50d775dc5ee6$export$aca70b982fa554b6.unpack($23952d628235a608$var$degeneratePositionLocalFrame[firstAixs]);
                scratchSecondCartesian = $54db50d775dc5ee6$export$aca70b982fa554b6.unpack(// @ts-ignore
                $23952d628235a608$var$degeneratePositionLocalFrame[secondAxis]);
                scratchThirdCartesian = $54db50d775dc5ee6$export$aca70b982fa554b6.unpack(// @ts-ignore
                $23952d628235a608$var$degeneratePositionLocalFrame[thirdAxis]);
            } else if ($a37d01845c731898$export$6a7ef315a0d1ef07.equalsEpsilon(origin.x, 0) && $a37d01845c731898$export$6a7ef315a0d1ef07.equalsEpsilon(origin.y, 0)) {
                const sign = Math.sign(origin.z);
                scratchFirstCartesian = $54db50d775dc5ee6$export$aca70b982fa554b6.unpack($23952d628235a608$var$degeneratePositionLocalFrame[firstAixs]);
                if (firstAixs !== 'east' && firstAixs !== 'west') scratchFirstCartesian.multiplyScalar(sign);
                scratchSecondCartesian = $54db50d775dc5ee6$export$aca70b982fa554b6.unpack(// @ts-ignore
                $23952d628235a608$var$degeneratePositionLocalFrame[secondAxis]);
                if (secondAxis !== 'east' && secondAxis !== 'west') scratchSecondCartesian.multiplyScalar(sign);
                scratchThirdCartesian = $54db50d775dc5ee6$export$aca70b982fa554b6.unpack(// @ts-ignore
                $23952d628235a608$var$degeneratePositionLocalFrame[thirdAxis]);
                // @ts-ignore
                if (thirdAxis !== 'east' && thirdAxis !== 'west') scratchThirdCartesian.multiplyScalar(sign);
            } else {
                $19176608e346944f$export$5851ecdbb051d869.getDefaultWGS84RadiiSquaredGeodticSurfaceNormal(origin, $23952d628235a608$var$scratchCalculateCartesian.up);
                $23952d628235a608$var$scratchCalculateCartesian.east.set(-origin.y, origin.x, 0).normalizeByMagnitude();
                $23952d628235a608$var$scratchCalculateCartesian.north.copy($23952d628235a608$var$scratchCalculateCartesian.up).cross($23952d628235a608$var$scratchCalculateCartesian.east);
                $23952d628235a608$var$scratchCalculateCartesian.down.copy($23952d628235a608$var$scratchCalculateCartesian.up).multiplyScalar(-1);
                $23952d628235a608$var$scratchCalculateCartesian.west.copy($23952d628235a608$var$scratchCalculateCartesian.east).multiplyScalar(-1);
                $23952d628235a608$var$scratchCalculateCartesian.south.copy($23952d628235a608$var$scratchCalculateCartesian.north).multiplyScalar(-1);
                scratchFirstCartesian = $23952d628235a608$var$scratchCalculateCartesian[firstAixs];
                // @ts-ignore
                scratchSecondCartesian = $23952d628235a608$var$scratchCalculateCartesian[secondAxis];
                // @ts-ignore
                scratchThirdCartesian = $23952d628235a608$var$scratchCalculateCartesian[thirdAxis];
            }
            // prettier-ignore
            result.set(scratchFirstCartesian.x, scratchSecondCartesian.x, scratchThirdCartesian.x, origin.x, scratchFirstCartesian.y, scratchSecondCartesian.y, scratchThirdCartesian.y, origin.y, scratchFirstCartesian.z, scratchSecondCartesian.z, scratchThirdCartesian.z, origin.z, 0, 0, 0, 0);
            return result;
        };
        this.localFrameToFixedFrameCache.set(axisHash, f);
        return f;
    }
    static matrix4ToFixedFrame(origin, matrix, result = new $d9Ejt$Matrix4()) {
        return result.copy($23952d628235a608$export$4fd467e6c04a27e1.eastNorthUpToFixedFrame(origin)).multiply(matrix);
    }
    static headingPitchRollToFixedFrame(origin, heading, pitch, roll, result = new $d9Ejt$Matrix4()) {
        const hprQuration = $809c87f5dbed8e16$export$487e31a511bfcc15.fromHeadingPitchRoll(heading, pitch, roll);
        const hprMatrix = $b5a7119ef71cd3f1$export$e6eceaa934a6d3e5.fromTranslationQuaternionRotationScale($54db50d775dc5ee6$export$aca70b982fa554b6.ZERO, hprQuration, new $54db50d775dc5ee6$export$aca70b982fa554b6(1, 1, 1));
        return this.matrix4ToFixedFrame(origin, hprMatrix, result);
    }
}
$23952d628235a608$export$4fd467e6c04a27e1.localFrameToFixedFrameCache = new Map();
$23952d628235a608$export$4fd467e6c04a27e1.eastNorthUpToFixedFrame = $23952d628235a608$export$4fd467e6c04a27e1.localFrameToFixedFrameGenerator('east', 'north');


var $9cc46a5bb5d8ad43$exports = {};

$parcel$export($9cc46a5bb5d8ad43$exports, "CT_WGS84", () => $9cc46a5bb5d8ad43$export$2779d2581814b131);



class $9cc46a5bb5d8ad43$export$2779d2581814b131 extends $d9Ejt$Vector3 {
    constructor(latitude, longitude, height){
        super(latitude, longitude, height);
    }
    get latitude() {
        return this.x;
    }
    set latitude(value) {
        this.setX(value);
    }
    get longitude() {
        return this.y;
    }
    set longitude(value) {
        this.setY(value);
    }
    get height() {
        return this.z;
    }
    set height(value) {
        this.setZ(value);
    }
    getMatrix4(result = new $b5a7119ef71cd3f1$export$e6eceaa934a6d3e5()) {
        const matrix = $23952d628235a608$export$4fd467e6c04a27e1.matrix4ToFixedFrame($54db50d775dc5ee6$export$aca70b982fa554b6.fromDegree(this.longitude, this.latitude, this.height), new $d9Ejt$Matrix4()).elements;
        // prettier-ignore
        return result.set(matrix[0], matrix[4], matrix[8], matrix[12], matrix[1], matrix[5], matrix[9], matrix[13], matrix[2], matrix[6], matrix[10], matrix[14], matrix[3], matrix[7], matrix[11], matrix[15]);
    }
    toJSON() {
        return {
            latitude: this.latitude,
            longitude: this.longitude,
            height: this.height
        };
    }
    static fromCesiumWGS84(latitude, longitude, height, result = new $9cc46a5bb5d8ad43$export$2779d2581814b131()) {
        return result.set(latitude, longitude, height);
    }
    static fromThreeWGS84(latitude, longitude, height, result = new $9cc46a5bb5d8ad43$export$2779d2581814b131()) {
        return result.set(latitude, longitude, height);
    }
}


$parcel$exportWildcard($041dfd65fc078bd9$exports, $54db50d775dc5ee6$exports);
$parcel$exportWildcard($041dfd65fc078bd9$exports, $19176608e346944f$exports);
$parcel$exportWildcard($041dfd65fc078bd9$exports, $b5a7119ef71cd3f1$exports);
$parcel$exportWildcard($041dfd65fc078bd9$exports, $809c87f5dbed8e16$exports);
$parcel$exportWildcard($041dfd65fc078bd9$exports, $23952d628235a608$exports);
$parcel$exportWildcard($041dfd65fc078bd9$exports, $9cc46a5bb5d8ad43$exports);


class $c895e49b264c1790$export$2e2bcd8739ae039 {
    constructor(){
        this.helpers = new Map();
        this.graphic = $d1b8e958636edac6$export$adfa9d260876eca5.getInstance();
        this.objectLoader = new $d9Ejt$ObjectLoader();
        this._renderQueue = new $f20f17e129275ffd$export$8890c8adaae71a72();
        this._renderQueue.renderNextFrame$.subscribe(()=>{
            self.postMessage({
                type: "onRender"
            });
        });
        self.onmessage = (e)=>{
            const message = e.data;
            if (message) switch(message.type){
                case $c895e49b264c1790$export$8d9ecf8a6190d0ad.RENDER:
                    this._renderQueue.updateNextAnimationFrame({
                        ...message.param
                    });
                    break;
                default:
                    break;
            }
        };
    }
    init(canvas) {
        this.graphic.init(canvas);
    }
    setPixelRatio(value) {
        this.graphic.setPixelRatio(value);
    }
    getBox3(id) {
        const object = this.getObject(id);
        if (object) return object.userData.box3;
    }
    getUserDataAt(id, key) {
        const object = this.getObject(id);
        if (object) return object.userData[key];
    }
    setUserDataAt(id, key, data) {
        const object = this.getObject(id);
        if (object) object.userData[key] = data;
    }
    getObject(value) {
        return this.graphic.scene.getObjectById(value);
    }
    isExist(id) {
        return !!this.getObject(id);
    }
    setBoxHelperTo(id) {
        const object = this.getObject(id);
        if (object) {
            if (this.helpers.has("BoxHelper")) {
                const helper = this.helpers.get("BoxHelper");
                helper.update(object);
            } else {
                const helper = new $d9Ejt$BoxHelper(object);
                this.helpers.set("BoxHelper", helper);
                this.graphic.scene.add(helper);
            }
        }
    }
    hide(id) {
        const object = this.getObject(id);
        if (object) object.visible = false;
        return !!object;
    }
    show(id) {
        const object = this.getObject(id);
        if (object) object.visible = true;
        return !!object;
    }
    add(json, wgs84) {
        const object = this.objectLoader.parse(json);
        if (wgs84) {
            console.log(wgs84);
            object.applyMatrix4($9cc46a5bb5d8ad43$export$2779d2581814b131.fromThreeWGS84(wgs84.latitude, wgs84.longitude, wgs84.height).getMatrix4());
            object.userData.wgs84 = wgs84;
        }
        this.graphic.scene.add(object);
        return object.id;
    }
    update(id, json) {
        let object = this.getObject(id);
        if (object) {
            const updateObject = this.objectLoader.parse(json);
            object.copy(updateObject);
        }
        return !!object;
    }
    getWGS84(id) {
        debugger;
        const wgs84 = this.getObject(id)?.userData.wgs84;
        if (wgs84 && wgs84.latitude !== undefined && wgs84.longitude !== undefined && wgs84.height !== undefined) return {
            latitude: wgs84.longitude,
            longitude: wgs84.latitude,
            height: wgs84.height
        };
    }
    setSize(width, height) {
        this.graphic.setSize(width, height);
    }
    initCamera(param) {
        const camera = this.graphic.camera;
        camera.aspect = param.aspect;
        camera.far = param.far;
        camera.near = param.near;
        camera.fov = param.fov;
        console.table(param);
        camera.updateProjectionMatrix();
    }
    updatePosition(id, position) {
        const object = this.getObject(id);
        if (object) {
            position.height = position.height ? new $d9Ejt$Box3().setFromObject(object).max.y : 0;
            const wgs84 = $9cc46a5bb5d8ad43$export$2779d2581814b131.fromCesiumWGS84(position.latitude, position.longitude, position.height);
            object.applyMatrix4(wgs84.getMatrix4());
            object.userData.wgs84 = wgs84;
        }
        return !!object;
    }
    delete(id) {
        const object = this.getObject(id);
        if (object) this.graphic.scene.remove(object);
        return !!object;
    }
}
const $c895e49b264c1790$export$8d9ecf8a6190d0ad = Object.freeze({
    RENDER: 0
});
$d9Ejt$expose(new $c895e49b264c1790$export$2e2bcd8739ae039());


export {$c895e49b264c1790$export$2e2bcd8739ae039 as default, $c895e49b264c1790$export$8d9ecf8a6190d0ad as RequestType};
//# sourceMappingURL=core-thread.1f18482a.js.map

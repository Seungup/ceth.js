import {transfer as $hgUW1$transfer, wrap as $hgUW1$wrap, expose as $hgUW1$expose} from "comlink";
import {ObjectLoader as $hgUW1$ObjectLoader, BoxHelper as $hgUW1$BoxHelper, Box3 as $hgUW1$Box3, Scene as $hgUW1$Scene, WebGLRenderer as $hgUW1$WebGLRenderer, PerspectiveCamera as $hgUW1$PerspectiveCamera, Matrix4 as $hgUW1$Matrix4, Vector3 as $hgUW1$Vector3, Vector4 as $hgUW1$Vector4, SphereGeometry as $hgUW1$SphereGeometry, BoxGeometry as $hgUW1$BoxGeometry, PlaneGeometry as $hgUW1$PlaneGeometry} from "three";
import {Subject as $hgUW1$Subject} from "rxjs";
import {Math as $hgUW1$Math, Cartesian2 as $hgUW1$Cartesian2, Cartesian3 as $hgUW1$Cartesian3, BoundingSphere as $hgUW1$BoundingSphere} from "cesium";
import {TeapotGeometry as $hgUW1$TeapotGeometry} from "three/examples/jsm/geometries/TeapotGeometry";

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
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
const $234747a9630b4642$export$3545e07a80636437 = '0dev';
const $234747a9630b4642$export$938789a6994ad1a = 6378137;






class $66eb4ee2a70bb3b6$export$2e2bcd8739ae039 {
    constructor(){
        this.perspectiveCamera = new $hgUW1$PerspectiveCamera();
    }
    getCamera() {
        return this.perspectiveCamera;
    }
    static getInstance() {
        return this.instance || (this.instance = new this());
    }
}


class $07bc5a8b8ee70be8$export$68b8bcd517bf7533 {
    constructor(scene = new $hgUW1$Scene(), cameraComponent = $66eb4ee2a70bb3b6$export$2e2bcd8739ae039.getInstance()){
        this.scene = scene;
        this.cameraComponent = cameraComponent;
        this.camera = this.cameraComponent.getCamera();
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
        this.renderer = new $hgUW1$WebGLRenderer(params);
        console.log(`[Graphic] isWebGL2Enabled : ${this.renderer.capabilities.isWebGL2}`);
    }
    setSize(width, height) {
        const camera = this.cameraComponent.getCamera();
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
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
            this.camera.aspect = param.width / param.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(param.width, param.height, false);
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
        }
    }
}






class $995821fa3a7efcc2$export$8890c8adaae71a72 {
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
        this.graphic = $07bc5a8b8ee70be8$export$68b8bcd517bf7533.getInstance();
        this._bindRenderNextAnimationFrame = this._renderNextAnimationFrame.bind(this);
        this._renderSubject = new $hgUW1$Subject();
        this.renderNextFrame$ = this._renderSubject.pipe();
    }
}



var $764ac7478921f02a$exports = {};

$parcel$export($764ac7478921f02a$exports, "Transforms", () => $764ac7478921f02a$export$2e7e2a6179fcdd5c);




class $54db50d775dc5ee6$export$a930246057f569fe extends $hgUW1$Vector3 {
    static get WGS84_RADII_SQUARED() {
        return new $54db50d775dc5ee6$export$a930246057f569fe(40680631590769, 40680631590769, 40408299984661.445 // 6356752.3142451793^2
        );
    }
    static get UINT_X() {
        return new $54db50d775dc5ee6$export$a930246057f569fe(1, 0, 0);
    }
    static get UINT_Y() {
        return new $54db50d775dc5ee6$export$a930246057f569fe(0, 1, 0);
    }
    static get UINT_Z() {
        return new $54db50d775dc5ee6$export$a930246057f569fe(0, 0, 1);
    }
    static get ZERO() {
        return new $54db50d775dc5ee6$export$a930246057f569fe(0, 0, 0);
    }
    normalizeByMagnitude() {
        return this.divideScalar($27c67f197043802e$export$6a7ef315a0d1ef07.magnitude(this));
    }
    static fromDegree(longitude, latitude, height) {
        return this.fromRadians($27c67f197043802e$export$6a7ef315a0d1ef07.toRadians(longitude), $27c67f197043802e$export$6a7ef315a0d1ef07.toRadians(latitude), height);
    }
    static fromRadians(longitude, latitude, height) {
        const cosLatitude = Math.cos(latitude);
        const cartesian = new $54db50d775dc5ee6$export$a930246057f569fe(cosLatitude * Math.cos(longitude), cosLatitude * Math.sin(longitude), Math.sin(latitude)).normalizeByMagnitude();
        const WGS84_RADII_SQUARED = $54db50d775dc5ee6$export$a930246057f569fe.WGS84_RADII_SQUARED.multiply(cartesian);
        const gamma = Math.sqrt(WGS84_RADII_SQUARED.dot(cartesian));
        WGS84_RADII_SQUARED.divideScalar(gamma);
        return cartesian.multiplyScalar(height).add(WGS84_RADII_SQUARED);
    }
    isZero() {
        return $54db50d775dc5ee6$export$a930246057f569fe.equalsEpsilon(this, $54db50d775dc5ee6$export$a930246057f569fe.ZERO);
    }
    static unpack(array, startIndex = 0, result = new $54db50d775dc5ee6$export$a930246057f569fe()) {
        return result.set(array[startIndex++], array[startIndex++], array[startIndex]);
    }
    static equalsEpsilon(left, right, relativeEpsilon = $27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_14, absoluteEpsilon = $27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_14) {
        if (left.equals(right)) return true;
        return $27c67f197043802e$export$6a7ef315a0d1ef07.equalsEpsilon(left.x, right.x, relativeEpsilon, absoluteEpsilon) && $27c67f197043802e$export$6a7ef315a0d1ef07.equalsEpsilon(left.y, right.y, relativeEpsilon, absoluteEpsilon) && $27c67f197043802e$export$6a7ef315a0d1ef07.equalsEpsilon(left.z, right.z, relativeEpsilon, absoluteEpsilon);
    }
}


class $1a1da69edc3c7876$export$edfc7dc0e9336c5b extends $hgUW1$Vector3 {
    constructor(x, y, z){
        super(x, y, z);
        this._oneOverRadiiSquared = new $54db50d775dc5ee6$export$a930246057f569fe(this.x == 0 ? 0 : 1 / (this.x * this.x), this.y == 0 ? 0 : 1 / (this.y * this.y), this.z == 0 ? 0 : 1 / (this.z * this.z));
    }
    static get WGS84() {
        return new $1a1da69edc3c7876$export$edfc7dc0e9336c5b(6378137, 6378137, 6356752.314245179);
    }
    static getDefaultWGS84RadiiSquaredGeodticSurfaceNormal(cartesian, result = new $54db50d775dc5ee6$export$a930246057f569fe()) {
        if (cartesian.isZero()) return;
        return result.copy(cartesian).multiply(this.DEFAULT_WGS84_RADII_SQUARED).normalizeByMagnitude();
    }
    geodeticSurfaceNormal(cartesian, result = new $54db50d775dc5ee6$export$a930246057f569fe()) {
        if (cartesian.isZero()) return;
        return result.copy(cartesian).multiply(this._oneOverRadiiSquared).normalizeByMagnitude();
    }
}
$1a1da69edc3c7876$export$edfc7dc0e9336c5b.DEFAULT_WGS84_RADII_SQUARED = Object.freeze($1a1da69edc3c7876$export$edfc7dc0e9336c5b.WGS84._oneOverRadiiSquared);



class $91bc6249ba4a0756$export$129f66e263976997 extends $hgUW1$Vector3 {
    constructor(heading = 0, pitch = 0, roll = 0){
        super(heading, pitch, roll);
    }
    get heading() {
        return this.x;
    }
    get pitch() {
        return this.y;
    }
    get roll() {
        return this.z;
    }
}






class $ec71d95b9270bbe0$export$23d6a54f0bbc85a3 extends $hgUW1$Vector4 {
    static fromAxisAngle(aixs, angle, result = new $ec71d95b9270bbe0$export$23d6a54f0bbc85a3()) {
        const halfAngle = angle / 2;
        const halfAnlgOfSin = Math.sin(halfAngle);
        this._fromAxisAngleScratch.copy(aixs).normalizeByMagnitude();
        return result.set(this._fromAxisAngleScratch.x * halfAnlgOfSin, this._fromAxisAngleScratch.y * halfAnlgOfSin, this._fromAxisAngleScratch.z * halfAnlgOfSin, Math.cos(halfAngle));
    }
    static fromHeadingPitchRoll(headingPitchRoll, result = new $ec71d95b9270bbe0$export$23d6a54f0bbc85a3()) {
        this._scratchRollQuaternion = $ec71d95b9270bbe0$export$23d6a54f0bbc85a3.fromAxisAngle($54db50d775dc5ee6$export$a930246057f569fe.UINT_X, headingPitchRoll.roll, this._scratchHPRQuaternion);
        result = $ec71d95b9270bbe0$export$23d6a54f0bbc85a3.fromAxisAngle($54db50d775dc5ee6$export$a930246057f569fe.UINT_Y, headingPitchRoll.pitch, this._scratchPitchQuaternion);
        this._scratchPitchQuaternion.multiply(this._scratchRollQuaternion);
        this._scratchHeadingQuaternion = $ec71d95b9270bbe0$export$23d6a54f0bbc85a3.fromAxisAngle($54db50d775dc5ee6$export$a930246057f569fe.UINT_Z, -headingPitchRoll.heading, this._scratchHPRQuaternion);
        return result.copy(new $ec71d95b9270bbe0$export$23d6a54f0bbc85a3().copy(this._scratchHeadingQuaternion).multiply(result));
    }
}
$ec71d95b9270bbe0$export$23d6a54f0bbc85a3._fromAxisAngleScratch = new $54db50d775dc5ee6$export$a930246057f569fe();
$ec71d95b9270bbe0$export$23d6a54f0bbc85a3._scratchHPRQuaternion = new $ec71d95b9270bbe0$export$23d6a54f0bbc85a3();
$ec71d95b9270bbe0$export$23d6a54f0bbc85a3._scratchHeadingQuaternion = new $ec71d95b9270bbe0$export$23d6a54f0bbc85a3();
$ec71d95b9270bbe0$export$23d6a54f0bbc85a3._scratchPitchQuaternion = new $ec71d95b9270bbe0$export$23d6a54f0bbc85a3();
$ec71d95b9270bbe0$export$23d6a54f0bbc85a3._scratchRollQuaternion = new $ec71d95b9270bbe0$export$23d6a54f0bbc85a3();


const $764ac7478921f02a$var$vectorProductLocalFrame = {
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
const $764ac7478921f02a$var$degeneratePositionLocalFrame = {
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
const $764ac7478921f02a$var$scratchCalculateCartesian = {
    east: new $54db50d775dc5ee6$export$a930246057f569fe(),
    north: new $54db50d775dc5ee6$export$a930246057f569fe(),
    up: new $54db50d775dc5ee6$export$a930246057f569fe(),
    west: new $54db50d775dc5ee6$export$a930246057f569fe(),
    south: new $54db50d775dc5ee6$export$a930246057f569fe(),
    down: new $54db50d775dc5ee6$export$a930246057f569fe()
};
class $764ac7478921f02a$export$2e7e2a6179fcdd5c {
    static localFrameToFixedFrameGenerator(firstAixs, secondAxis) {
        const axisHash = firstAixs + secondAxis;
        let f = $764ac7478921f02a$export$2e7e2a6179fcdd5c.localFrameToFixedFrameCache.get(axisHash);
        if (f) return f;
        const thirdAxis = $764ac7478921f02a$var$vectorProductLocalFrame[firstAixs][secondAxis];
        f = (origin, result = new $hgUW1$Matrix4())=>{
            let scratchFirstCartesian;
            let scratchSecondCartesian;
            let scratchThirdCartesian;
            if (origin.isZero()) {
                scratchFirstCartesian = $54db50d775dc5ee6$export$a930246057f569fe.unpack($764ac7478921f02a$var$degeneratePositionLocalFrame[firstAixs]);
                scratchSecondCartesian = $54db50d775dc5ee6$export$a930246057f569fe.unpack(// @ts-ignore
                $764ac7478921f02a$var$degeneratePositionLocalFrame[secondAxis]);
                scratchThirdCartesian = $54db50d775dc5ee6$export$a930246057f569fe.unpack(// @ts-ignore
                $764ac7478921f02a$var$degeneratePositionLocalFrame[thirdAxis]);
            } else if ($27c67f197043802e$export$6a7ef315a0d1ef07.equalsEpsilon(origin.x, 0) && $27c67f197043802e$export$6a7ef315a0d1ef07.equalsEpsilon(origin.y, 0)) {
                const sign = Math.sign(origin.z);
                scratchFirstCartesian = $54db50d775dc5ee6$export$a930246057f569fe.unpack($764ac7478921f02a$var$degeneratePositionLocalFrame[firstAixs]);
                if (firstAixs !== 'east' && firstAixs !== 'west') scratchFirstCartesian.multiplyScalar(sign);
                scratchSecondCartesian = $54db50d775dc5ee6$export$a930246057f569fe.unpack(// @ts-ignore
                $764ac7478921f02a$var$degeneratePositionLocalFrame[secondAxis]);
                if (secondAxis !== 'east' && secondAxis !== 'west') scratchSecondCartesian.multiplyScalar(sign);
                scratchThirdCartesian = $54db50d775dc5ee6$export$a930246057f569fe.unpack(// @ts-ignore
                $764ac7478921f02a$var$degeneratePositionLocalFrame[thirdAxis]);
                // @ts-ignore
                if (thirdAxis !== 'east' && thirdAxis !== 'west') scratchThirdCartesian.multiplyScalar(sign);
            } else {
                $1a1da69edc3c7876$export$edfc7dc0e9336c5b.getDefaultWGS84RadiiSquaredGeodticSurfaceNormal(origin, $764ac7478921f02a$var$scratchCalculateCartesian.up);
                $764ac7478921f02a$var$scratchCalculateCartesian.east.set(-origin.y, origin.x, 0);
                $764ac7478921f02a$var$scratchCalculateCartesian.east.normalizeByMagnitude();
                $764ac7478921f02a$var$scratchCalculateCartesian.north.copy($764ac7478921f02a$var$scratchCalculateCartesian.up).cross($764ac7478921f02a$var$scratchCalculateCartesian.east);
                $764ac7478921f02a$var$scratchCalculateCartesian.down.copy($764ac7478921f02a$var$scratchCalculateCartesian.up).multiplyScalar(-1);
                $764ac7478921f02a$var$scratchCalculateCartesian.west.copy($764ac7478921f02a$var$scratchCalculateCartesian.east).multiplyScalar(-1);
                $764ac7478921f02a$var$scratchCalculateCartesian.south.copy($764ac7478921f02a$var$scratchCalculateCartesian.north).multiplyScalar(-1);
                scratchFirstCartesian = $764ac7478921f02a$var$scratchCalculateCartesian[firstAixs];
                // @ts-ignore
                scratchSecondCartesian = $764ac7478921f02a$var$scratchCalculateCartesian[secondAxis];
                // @ts-ignore
                scratchThirdCartesian = $764ac7478921f02a$var$scratchCalculateCartesian[thirdAxis];
            }
            // prettier-ignore
            result.set(scratchFirstCartesian.x, scratchSecondCartesian.x, scratchThirdCartesian.x, origin.x, scratchFirstCartesian.y, scratchSecondCartesian.y, scratchThirdCartesian.y, origin.y, scratchFirstCartesian.z, scratchSecondCartesian.z, scratchThirdCartesian.z, origin.z, 0, 0, 0, 0);
            return result;
        };
        this.localFrameToFixedFrameCache.set(axisHash, f);
        return f;
    }
    static matrix4ToFixedFrame(origin, matrix, result = new $hgUW1$Matrix4()) {
        const eastNorthUpToFixedFrame = $764ac7478921f02a$export$2e7e2a6179fcdd5c.localFrameToFixedFrameGenerator('east', 'north');
        return result.copy(eastNorthUpToFixedFrame(origin)).multiply(matrix);
    }
    static headingPitchRollToFixedFrame(origin, headingPitchRoll = new $91bc6249ba4a0756$export$129f66e263976997(), result = new $hgUW1$Matrix4()) {
        const hprQuration = $ec71d95b9270bbe0$export$23d6a54f0bbc85a3.fromHeadingPitchRoll(headingPitchRoll);
        const hprMatrix = $27c67f197043802e$export$6a7ef315a0d1ef07.Matrix4.fromTranslationQuaternionRotationScale($54db50d775dc5ee6$export$a930246057f569fe.ZERO, hprQuration, new $54db50d775dc5ee6$export$a930246057f569fe(1, 1, 1));
        return this.matrix4ToFixedFrame(origin, hprMatrix, result);
    }
}
$764ac7478921f02a$export$2e7e2a6179fcdd5c.localFrameToFixedFrameCache = new Map();



class $27c67f197043802e$export$6a7ef315a0d1ef07 {
    static toRadians(degrees) {
        return degrees * this.RADIANS_PER_DEGREE;
    }
    static magnitudeSquared(vec) {
        return vec.x * vec.x + vec.y * vec.y + vec.z * vec.z;
    }
    static magnitude(vec) {
        return Math.sqrt(this.magnitudeSquared(vec));
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
   */ static equalsEpsilon(left, right, relativeEpsilon = $27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_14, absoluteEpsilon = $27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_14) {
        const absDiff = Math.abs(left - right);
        if (absDiff <= absoluteEpsilon) return true;
        return absDiff <= relativeEpsilon * Math.max(Math.abs(left), Math.abs(right));
    }
}
$27c67f197043802e$export$6a7ef315a0d1ef07.RADIANS_PER_DEGREE = Math.PI / 180;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_01 = 0.1;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_02 = 0.01;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_03 = 0.001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_04 = 0.0001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_05 = 0.00001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_06 = 0.000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_07 = 0.0000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_08 = 0.00000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_09 = 0.000000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_10 = 0.0000000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_11 = 0.00000000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_12 = 0.000000000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_13 = 0.0000000000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_14 = 0.00000000000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_15 = 0.000000000000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_16 = 0.0000000000000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_17 = 0.00000000000000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_18 = 0.000000000000000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_19 = 0.0000000000000000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_20 = 0.00000000000000000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.EPSILON_21 = 0.000000000000000000001;
$27c67f197043802e$export$6a7ef315a0d1ef07.Matrix4 = class {
    static localWGS84ToMattrix4(position, height, result = new $hgUW1$Matrix4()) {
        const matrix = $764ac7478921f02a$export$2e7e2a6179fcdd5c.matrix4ToFixedFrame($54db50d775dc5ee6$export$a930246057f569fe.fromDegree(position.longitude, position.latitude, height), new $hgUW1$Matrix4()).elements;
        // prettier-ignore
        return result.set(matrix[0], matrix[4], matrix[8], matrix[12], matrix[1], matrix[5], matrix[9], matrix[13], matrix[2], matrix[6], matrix[10], matrix[14], matrix[3], matrix[7], matrix[11], matrix[15]);
    }
    static fromTranslationQuaternionRotationScale(translation, rotation, scale, result = new $hgUW1$Matrix4()) {
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
};


class $c895e49b264c1790$export$2e2bcd8739ae039 {
    constructor(){
        this.helpers = new Map();
        this.graphicComponent = $07bc5a8b8ee70be8$export$68b8bcd517bf7533.getInstance();
        this.objectLoader = new $hgUW1$ObjectLoader();
        this._renderQueue = new $995821fa3a7efcc2$export$8890c8adaae71a72();
        this._renderQueue.renderNextFrame$.subscribe(()=>{
            self.postMessage({
                type: 'onRender'
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
        this.graphicComponent.init(canvas);
    }
    setPixelRatio(value) {
        this.graphicComponent.setPixelRatio(value);
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
        return this.graphicComponent.scene.getObjectById(value);
    }
    isExist(id) {
        return !!this.getObject(id);
    }
    setBoxHelperTo(id) {
        const object = this.getObject(id);
        if (object) {
            if (this.helpers.has('BoxHelper')) {
                const helper = this.helpers.get('BoxHelper');
                helper.update(object);
            } else {
                const helper = new $hgUW1$BoxHelper(object);
                this.helpers.set('BoxHelper', helper);
                this.graphicComponent.scene.add(helper);
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
    add(json, position) {
        const object = this.objectLoader.parse(json);
        if (position) {
            object.userData.wgs84 = position;
            object.applyMatrix4($27c67f197043802e$export$6a7ef315a0d1ef07.Matrix4.localWGS84ToMattrix4(position, new $hgUW1$Box3().setFromObject(object).max.y));
        }
        this.graphicComponent.scene.add(object);
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
        const object = this.getObject(id);
        if (object) return object.userData.wgs84;
    }
    setSize(width, height) {
        $07bc5a8b8ee70be8$export$68b8bcd517bf7533.getInstance().setSize(width, height);
    }
    initCamera(param) {
        const camera = $66eb4ee2a70bb3b6$export$2e2bcd8739ae039.getInstance().getCamera();
        camera.aspect = param.aspect;
        camera.far = param.far;
        camera.near = param.near;
        camera.fov = param.fov;
        console.table(param);
        camera.updateProjectionMatrix();
    }
    updatePosition(id, position, height) {
        const object = this.getObject(id);
        if (object) {
            height = height ? new $hgUW1$Box3().setFromObject(object).max.y : 0;
            object.applyMatrix4($27c67f197043802e$export$6a7ef315a0d1ef07.Matrix4.localWGS84ToMattrix4(position, height));
            object.userData.wgs84 = position;
        }
        return !!object;
    }
    delete(id) {
        const object = this.getObject(id);
        if (object) this.graphicComponent.scene.remove(object);
        return !!object;
    }
}
const $c895e49b264c1790$export$8d9ecf8a6190d0ad = Object.freeze({
    RENDER: 0
});
$hgUW1$expose(new $c895e49b264c1790$export$2e2bcd8739ae039());


const $b920a6b4966bc37f$export$4d9f7473977bcb18 = {
    CoreThread: new URL("core-thread.1f18482a.js", import.meta.url)
};
class $b920a6b4966bc37f$export$e37028405a3089df {
    /**
	 * 웹 워커를 가져옵니다.
	 * @param workerClassName
	 * @returns
	 */ static getWorker(workerClassName) {
        let worker;
        const workerURL = $b920a6b4966bc37f$export$4d9f7473977bcb18[workerClassName];
        if (!this.workerMap.has(workerURL)) {
            worker = new Worker(workerURL, {
                type: 'module'
            });
            this.workerMap.set(workerURL, worker);
        } else worker = this.workerMap.get(workerURL);
        return worker;
    }
    /**
	 * 웹 워커의 Warpper 를 가져옵니다.
	 * @param workerClassName
	 * @returns
	 */ static getWrapper(workerClassName) {
        const worker = $b920a6b4966bc37f$export$e37028405a3089df.getWorker(workerClassName);
        const workerURL = $b920a6b4966bc37f$export$4d9f7473977bcb18[workerClassName];
        let wrapper;
        if (!this.wrapperMap.has(workerURL)) {
            wrapper = $hgUW1$wrap(worker);
            this.wrapperMap.set(workerURL, wrapper);
        } else wrapper = this.wrapperMap.get(workerURL);
        return wrapper;
    }
}
$b920a6b4966bc37f$export$e37028405a3089df.workerMap = new Map();
$b920a6b4966bc37f$export$e37028405a3089df.wrapperMap = new Map();






class $e71b51a0ba2fbda5$export$ca67b0b0fa758253 {
    constructor(viewer){
        this.viewer = viewer;
        this.coreWorker = $b920a6b4966bc37f$export$e37028405a3089df.getWorker('CoreThread');
        this.coreWrapper = $b920a6b4966bc37f$export$e37028405a3089df.getWrapper('CoreThread');
        this.coreWrapper.setPixelRatio(window.devicePixelRatio);
        this.coreWrapper.initCamera({
            fov: $hgUW1$Math.toDegrees(this.viewer.camera.frustum.fovy),
            near: this.viewer.camera.frustum.near,
            far: this.viewer.camera.frustum.far,
            aspect: this.viewer.container.clientWidth / this.viewer.container.clientHeight
        });
    }
    setSize(width, height) {
        return this.coreWrapper.setSize(width, height);
    }
    render() {
        const cvm = new Float32Array(this.viewer.camera.viewMatrix);
        const civm = new Float32Array(this.viewer.camera.inverseViewMatrix);
        this.coreWorker.postMessage({
            type: $c895e49b264c1790$export$8d9ecf8a6190d0ad.RENDER,
            param: {
                cvm: cvm,
                civm: civm,
                height: this.viewer.container.clientHeight,
                width: this.viewer.container.clientWidth
            }
        }, [
            cvm.buffer,
            civm.buffer
        ]);
    }
}




var $fab42eb3dee39b5b$exports = {};

$parcel$export($fab42eb3dee39b5b$exports, "Utils", () => $fab42eb3dee39b5b$export$d2ca453b913dcdea);


var $5876ab33e7eee8c7$exports = {};

$parcel$export($5876ab33e7eee8c7$exports, "CesiumWGS84", () => $5876ab33e7eee8c7$export$1156bcd15cdf41b6);
$parcel$export($5876ab33e7eee8c7$exports, "ThreeWGS84", () => $5876ab33e7eee8c7$export$5fca51fe6d1fa856);
class $5876ab33e7eee8c7$export$1156bcd15cdf41b6 {
    constructor(longitude, latitude){
        this.longitude = longitude;
        this.latitude = latitude;
    }
}
class $5876ab33e7eee8c7$export$5fca51fe6d1fa856 {
    constructor(longitude, latitude){
        this.longitude = longitude;
        this.latitude = latitude;
    }
}


class $fab42eb3dee39b5b$export$d2ca453b913dcdea {
    static randomOffset() {
        return Math.floor(Math.random() * 10000) * 0.000001;
    }
    static CesiumWGS84ToThreeWGS84(cesiumWGS84) {
        return {
            latitude: cesiumWGS84.longitude,
            longitude: cesiumWGS84.latitude
        };
    }
    static ThreeWGS84ToCesiumWGS84(ThreeWGS84) {
        return {
            latitude: ThreeWGS84.longitude,
            longitude: ThreeWGS84.latitude
        };
    }
    static getWindowPosition(viewer) {
        return new $hgUW1$Cartesian2(viewer.canvas.clientWidth / 2, viewer.canvas.clientHeight / 2);
    }
    static getPosition(viewer, windowPosition) {
        const result = viewer.camera.pickEllipsoid(windowPosition);
        if (result) return viewer.scene.globe.ellipsoid.cartesianToCartographic(result);
    }
    static getWGS84FromCartographic(cartographic) {
        return {
            lat: cartographic.latitude * 180 / Math.PI,
            lon: cartographic.longitude * 180 / Math.PI
        };
    }
    static getCurrentCenterPosition(viewer) {
        return this.getPosition(viewer, this.getWindowPosition(viewer));
    }
    static getCurrentCenterHeight(viewer) {
        return this.getCurrentCenterPosition(viewer)?.height;
    }
    static rotationX(degrees) {
        return new $hgUW1$Matrix4().makeRotationX($hgUW1$Math.toRadians(degrees));
    }
    static applayRotation(object, degrees) {
        object.applyMatrix4(this.rotationX(degrees));
    }
}




class $1f355be06b059ce1$export$362079230e3f7f0b {
    constructor(id){
        this._coreThread = $b920a6b4966bc37f$export$e37028405a3089df.getWrapper('CoreThread');
        this.id = id;
    }
    getUserData(key) {
        return this._coreThread.getUserDataAt(this.id, key);
    }
    setUserData(key, value) {
        return this._coreThread.setUserDataAt(this.id, key, value);
    }
    hide() {
        return this._coreThread.hide(this.id);
    }
    show() {
        return this._coreThread.show(this.id);
    }
    setPosition(position) {
        const threeWGS84 = $fab42eb3dee39b5b$export$d2ca453b913dcdea.CesiumWGS84ToThreeWGS84(position);
        return this._coreThread.updatePosition(this.id, threeWGS84);
    }
    async getPosition() {
        const position = await this._coreThread.getWGS84(this.id);
        if (position) return $fab42eb3dee39b5b$export$d2ca453b913dcdea.ThreeWGS84ToCesiumWGS84(position);
    }
    dispose() {
        return this._coreThread.delete(this.id);
    }
    isDisposed() {
        return this._coreThread.isExist(this.id);
    }
}


class $9c4a242349458aaf$export$19321809bd793da0 {
    _calcBox3(object) {
        return new $hgUW1$Box3().setFromObject(object).max;
    }
    async add(object, position) {
        position = position ? $fab42eb3dee39b5b$export$d2ca453b913dcdea.CesiumWGS84ToThreeWGS84(position) : position;
        const id = await this.coreWrapper.add(object.toJSON(), position);
        return new $1f355be06b059ce1$export$362079230e3f7f0b(id);
    }
    async get(id) {
        if (await this.coreWrapper.isExist(id)) return new $1f355be06b059ce1$export$362079230e3f7f0b(id);
    }
    async updateObject(id, object) {
        this._calcBox3(object);
        return {
            objectId: id,
            result: await this.coreWrapper.update(id, object.toJSON())
        };
    }
    constructor(){
        this.coreWrapper = $b920a6b4966bc37f$export$e37028405a3089df.getWrapper('CoreThread');
    }
}





class $077c9942e0ea3920$export$2c17cb06bc53e24 {
    constructor(viewer){
        this.viewer = viewer;
        this.coreWrapper = $b920a6b4966bc37f$export$e37028405a3089df.getWrapper('CoreThread');
    }
    async flyTo(id) {
        let position = await this.coreWrapper.getWGS84(id);
        if (position) {
            position = $fab42eb3dee39b5b$export$d2ca453b913dcdea.ThreeWGS84ToCesiumWGS84(position);
            const wgs84Position = $hgUW1$Cartesian3.fromDegrees(position.latitude, position.longitude, 0);
            const result = await this.coreWrapper.getBox3(id);
            const radius = result ? result.z * 2 : undefined;
            this.viewer.camera.flyToBoundingSphere(new $hgUW1$BoundingSphere(wgs84Position, radius));
        }
    }
}


class $1b983a38f3bf9a9b$export$3c33b7cf4c12f471 {
    constructor(viewer){
        this.viewer = viewer;
        this.coreWrapper = $b920a6b4966bc37f$export$e37028405a3089df.getWrapper('CoreThread');
        const root = viewer.container.parentElement;
        this.container = document.createElement('div');
        this.container.id = 'ThreeContainer';
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.height = '100%';
        this.container.style.width = '100%';
        this.container.style.margin = '0';
        this.container.style.overflow = 'hidden';
        this.container.style.padding = '0';
        this.container.style.pointerEvents = 'none';
        const canvas = document.createElement('canvas');
        this.container.append(canvas);
        if (!root) throw new Error('cannot fond parent element');
        else root.append(this.container);
        if (viewer.useDefaultRenderLoop) console.warn('Please set Cesium viewer.useDefaultRenderLoop = false for syncronize animation frame to this plug-in');
        // @ts-ignore
        const offscreen = canvas.transferControlToOffscreen();
        offscreen.width = canvas.clientWidth;
        offscreen.height = canvas.clientHeight;
        // @ts-ignore
        this.coreWrapper.init($hgUW1$transfer(offscreen, [
            offscreen
        ])).then(()=>{
            this.coreWrapper.setPixelRatio(window.devicePixelRatio);
        });
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }
    onWindowResize() {
        this.renderer.setSize(this.viewer.container.clientWidth, this.viewer.container.clientHeight);
    }
    get manager() {
        return this._manager || (this._manager = new $9c4a242349458aaf$export$19321809bd793da0());
    }
    get util() {
        return this._util || (this._util = new $077c9942e0ea3920$export$2c17cb06bc53e24(this.viewer));
    }
    get renderer() {
        return this._renderer || (this._renderer = new $e71b51a0ba2fbda5$export$ca67b0b0fa758253(this.viewer));
    }
}


var $88ee43a4cb2532ea$exports = {};
var $eb3eccffcb58f145$exports = {};

$parcel$export($eb3eccffcb58f145$exports, "EarthGeometry", () => $eb3eccffcb58f145$export$d3bc06bbab0156ac);


class $eb3eccffcb58f145$export$d3bc06bbab0156ac extends $hgUW1$SphereGeometry {
    constructor(segments = 32){
        super($234747a9630b4642$export$938789a6994ad1a, segments, segments);
    }
}


$parcel$exportWildcard($88ee43a4cb2532ea$exports, $eb3eccffcb58f145$exports);




var $82e614c8221c81c3$exports = {};

$parcel$export($82e614c8221c81c3$exports, "makeTeapotGeometry", () => $82e614c8221c81c3$export$689d6f22f19954a7);
$parcel$export($82e614c8221c81c3$exports, "makeBoxGeometry", () => $82e614c8221c81c3$export$d1c415793f46918c);
$parcel$export($82e614c8221c81c3$exports, "makePlaneGeometry", () => $82e614c8221c81c3$export$ef5bbeb4ada3d789);



function $82e614c8221c81c3$export$689d6f22f19954a7(teapotSize = 10) {
    const teapotGeometry = new $hgUW1$TeapotGeometry(teapotSize);
    $fab42eb3dee39b5b$export$d2ca453b913dcdea.applayRotation(teapotGeometry, 90);
    return teapotGeometry;
}
function $82e614c8221c81c3$export$d1c415793f46918c(boxSize = 1000) {
    const geometry = new $hgUW1$BoxGeometry(boxSize, boxSize, boxSize);
    return geometry;
}
function $82e614c8221c81c3$export$ef5bbeb4ada3d789(w, h) {
    const geometry = new $hgUW1$PlaneGeometry(w, h);
    // Utils.applayRotation(geometry, 90);
    return geometry;
}





export {$234747a9630b4642$export$3545e07a80636437 as REVISION, $1b983a38f3bf9a9b$export$3c33b7cf4c12f471 as InterfcaeFactory, $eb3eccffcb58f145$export$d3bc06bbab0156ac as EarthGeometry, $fab42eb3dee39b5b$export$d2ca453b913dcdea as Utils, $5876ab33e7eee8c7$export$1156bcd15cdf41b6 as CesiumWGS84, $5876ab33e7eee8c7$export$5fca51fe6d1fa856 as ThreeWGS84, $82e614c8221c81c3$export$689d6f22f19954a7 as makeTeapotGeometry, $82e614c8221c81c3$export$d1c415793f46918c as makeBoxGeometry, $82e614c8221c81c3$export$ef5bbeb4ada3d789 as makePlaneGeometry, $764ac7478921f02a$export$2e7e2a6179fcdd5c as Transforms};
//# sourceMappingURL=index.js.map

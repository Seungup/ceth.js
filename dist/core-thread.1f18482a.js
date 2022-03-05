import {expose as $d9Ejt$expose} from "comlink";
import {ObjectLoader as $d9Ejt$ObjectLoader, BoxHelper as $d9Ejt$BoxHelper, Box3 as $d9Ejt$Box3, Scene as $d9Ejt$Scene, WebGLRenderer as $d9Ejt$WebGLRenderer, PerspectiveCamera as $d9Ejt$PerspectiveCamera, Matrix4 as $d9Ejt$Matrix4, Vector3 as $d9Ejt$Vector3, Vector4 as $d9Ejt$Vector4} from "three";
import {Subject as $d9Ejt$Subject} from "rxjs";

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}



class $66eb4ee2a70bb3b6$export$2e2bcd8739ae039 {
    constructor(){
        this.perspectiveCamera = new $d9Ejt$PerspectiveCamera();
    }
    getCamera() {
        return this.perspectiveCamera;
    }
    static getInstance() {
        return this.instance || (this.instance = new this());
    }
}


class $07bc5a8b8ee70be8$export$68b8bcd517bf7533 {
    constructor(scene = new $d9Ejt$Scene(), cameraComponent = $66eb4ee2a70bb3b6$export$2e2bcd8739ae039.getInstance()){
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
        this.renderer = new $d9Ejt$WebGLRenderer(params);
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
        this._renderSubject = new $d9Ejt$Subject();
        this.renderNextFrame$ = this._renderSubject.pipe();
    }
}



var $764ac7478921f02a$exports = {};

$parcel$export($764ac7478921f02a$exports, "Transforms", () => $764ac7478921f02a$export$2e7e2a6179fcdd5c);




class $54db50d775dc5ee6$export$a930246057f569fe extends $d9Ejt$Vector3 {
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


class $1a1da69edc3c7876$export$edfc7dc0e9336c5b extends $d9Ejt$Vector3 {
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



class $91bc6249ba4a0756$export$129f66e263976997 extends $d9Ejt$Vector3 {
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






class $ec71d95b9270bbe0$export$23d6a54f0bbc85a3 extends $d9Ejt$Vector4 {
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
        f = (origin, result = new $d9Ejt$Matrix4())=>{
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
    static matrix4ToFixedFrame(origin, matrix, result = new $d9Ejt$Matrix4()) {
        const eastNorthUpToFixedFrame = $764ac7478921f02a$export$2e7e2a6179fcdd5c.localFrameToFixedFrameGenerator('east', 'north');
        return result.copy(eastNorthUpToFixedFrame(origin)).multiply(matrix);
    }
    static headingPitchRollToFixedFrame(origin, headingPitchRoll = new $91bc6249ba4a0756$export$129f66e263976997(), result = new $d9Ejt$Matrix4()) {
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
    static localWGS84ToMattrix4(position, height, result = new $d9Ejt$Matrix4()) {
        const matrix = $764ac7478921f02a$export$2e7e2a6179fcdd5c.matrix4ToFixedFrame($54db50d775dc5ee6$export$a930246057f569fe.fromDegree(position.longitude, position.latitude, height), new $d9Ejt$Matrix4()).elements;
        // prettier-ignore
        return result.set(matrix[0], matrix[4], matrix[8], matrix[12], matrix[1], matrix[5], matrix[9], matrix[13], matrix[2], matrix[6], matrix[10], matrix[14], matrix[3], matrix[7], matrix[11], matrix[15]);
    }
    static fromTranslationQuaternionRotationScale(translation, rotation, scale, result = new $d9Ejt$Matrix4()) {
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
        this.objectLoader = new $d9Ejt$ObjectLoader();
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
                const helper = new $d9Ejt$BoxHelper(object);
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
            object.applyMatrix4($27c67f197043802e$export$6a7ef315a0d1ef07.Matrix4.localWGS84ToMattrix4(position, new $d9Ejt$Box3().setFromObject(object).max.y));
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
            height = height ? new $d9Ejt$Box3().setFromObject(object).max.y : 0;
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
$d9Ejt$expose(new $c895e49b264c1790$export$2e2bcd8739ae039());


export {$c895e49b264c1790$export$2e2bcd8739ae039 as default, $c895e49b264c1790$export$8d9ecf8a6190d0ad as RequestType};
//# sourceMappingURL=core-thread.1f18482a.js.map

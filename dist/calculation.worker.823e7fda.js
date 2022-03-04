import {expose as $d92o5$expose, transfer as $d92o5$transfer, wrap as $d92o5$wrap} from "comlink";
import {ObjectLoader as $d92o5$ObjectLoader, Scene as $d92o5$Scene, WebGLRenderer as $d92o5$WebGLRenderer, PerspectiveCamera as $d92o5$PerspectiveCamera, SphereGeometry as $d92o5$SphereGeometry, Matrix4 as $d92o5$Matrix4} from "three";
import {Cartesian2 as $d92o5$Cartesian2, Math as $d92o5$Math, Ellipsoid as $d92o5$Ellipsoid, Cartesian3 as $d92o5$Cartesian3, Transforms as $d92o5$Transforms, HeadingPitchRoll as $d92o5$HeadingPitchRoll} from "cesium";
import {TeapotGeometry as $d92o5$TeapotGeometry} from "three/examples/jsm/geometries/TeapotGeometry";

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

var $149c1bd638913645$exports = {};

$parcel$export($149c1bd638913645$exports, "REVISION", () => $234747a9630b4642$export$3545e07a80636437);
$parcel$export($149c1bd638913645$exports, "InterfcaeFactory", () => $1b983a38f3bf9a9b$export$3c33b7cf4c12f471);
$parcel$export($149c1bd638913645$exports, "makeTeapotGeometry", () => $82e614c8221c81c3$export$689d6f22f19954a7);
const $234747a9630b4642$export$3545e07a80636437 = '0dev';
const $234747a9630b4642$export$938789a6994ad1a = 6378137;






class $66eb4ee2a70bb3b6$export$2e2bcd8739ae039 {
    constructor(){
        this.perspectiveCamera = new $d92o5$PerspectiveCamera();
    }
    getCamera() {
        return this.perspectiveCamera;
    }
    synchronization(param) {
        this.perspectiveCamera.matrixAutoUpdate = false;
        this.perspectiveCamera.fov = param.fov;
        this.perspectiveCamera.near = param.near;
        this.perspectiveCamera.far = param.far;
        this.perspectiveCamera.aspect = param.aspect;
        this.perspectiveCamera.matrixWorld.set(param.civm[0], param.civm[4], param.civm[8], param.civm[12], param.civm[1], param.civm[5], param.civm[9], param.civm[13], param.civm[2], param.civm[6], param.civm[10], param.civm[14], param.civm[3], param.civm[7], param.civm[11], param.civm[15]);
        this.perspectiveCamera.matrixWorldInverse.set(param.cvm[0], param.cvm[4], param.cvm[8], param.cvm[12], param.cvm[1], param.cvm[5], param.cvm[9], param.cvm[13], param.cvm[2], param.cvm[6], param.cvm[10], param.cvm[14], param.cvm[3], param.cvm[7], param.cvm[11], param.cvm[15]);
        this.perspectiveCamera.updateProjectionMatrix();
    }
    static getInstance() {
        return this.instance || (this.instance = new this());
    }
}



class $07bc5a8b8ee70be8$export$68b8bcd517bf7533 {
    constructor(scene = new $d92o5$Scene(), cameraComponent = $66eb4ee2a70bb3b6$export$2e2bcd8739ae039.getInstance()){
        this.scene = scene;
        this.cameraComponent = cameraComponent;
        this.calculationWorkerRemote = $b920a6b4966bc37f$export$e37028405a3089df.getWrapper('CalculationWorker');
    }
    static getInstance() {
        return this.instance || (this.instance = new this());
    }
    getScene() {
        return this.scene;
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
        this.renderer = new $d92o5$WebGLRenderer({
            canvas: canvas,
            alpha: true,
            depth: true,
            stencil: false,
            preserveDrawingBuffer: true,
            powerPreference: 'high-performance',
            antialias: true,
            premultipliedAlpha: true
        });
        this.renderer.sortObjects = false;
        this.renderer.autoClear = false;
    }
    render(param) {
        if (this.renderer) {
            this.cameraComponent.synchronization({
                aspect: param.width / param.height,
                far: param.far,
                near: param.near,
                fov: param.fov,
                cvm: param.cvm,
                civm: param.civm
            });
            this.scene.traverse((object3D)=>{
                const position = object3D.userData.wgs84;
                if (position) this.calculationWorkerRemote.calculationObjectVisible(position, {
                    longitude: param.centerPosition.lon,
                    latitude: param.centerPosition.lat
                }).then((visible)=>{
                    object3D.visible = visible;
                });
            });
            this.renderer.setSize(param.width, param.height, false);
            this.renderer.clear();
            this.renderer.render(this.scene, this.cameraComponent.getCamera());
        }
    }
}



class $c895e49b264c1790$export$2e2bcd8739ae039 {
    init(canvas) {
        this.graphicComponent.init(canvas);
    }
    setPixelRatio(value) {
        this.graphicComponent.setPixelRatio(value);
    }
    render(param) {
        this.graphicComponent.render(param);
    }
    getObject(value) {
        let object;
        if (typeof value === 'number') object = this.graphicComponent.getScene().getObjectById(value);
        if (typeof value === 'string') object = this.graphicComponent.getScene().getObjectByName(value);
        return {
            isExist: !!object,
            object: object
        };
    }
    isExist(value) {
        return this.getObject(value).isExist;
    }
    hide(value) {
        const result = this.getObject(value);
        if (result.isExist) result.object.visible = false;
        return result.isExist;
    }
    show(value) {
        const result = this.getObject(value);
        if (result.isExist) result.object.visible = true;
        return result.isExist;
    }
    add(json) {
        const object = this.objectLoader.parse(json);
        this.graphicComponent.getScene().add(object);
        return object.id;
    }
    updateObject(id, json) {
        let isSuccess = false;
        let result = this.getObject(id);
        if (result.isExist) {
            const updateObject = this.objectLoader.parse(json);
            result.object.copy(updateObject);
            isSuccess = true;
        }
        return isSuccess;
    }
    updatePosition(id, param) {
        let isSuccess = false;
        let result = this.getObject(id);
        if (result.isExist) {
            const object = result.object;
            object.applyMatrix4(param.matrix);
            object.userData.wgs84 = param.position;
            isSuccess = true;
        }
        return isSuccess;
    }
    delete(value) {
        const result = this.getObject(value);
        if (result.isExist) this.graphicComponent.getScene().remove(result.object);
        return result.isExist;
    }
    constructor(){
        this.graphicComponent = $07bc5a8b8ee70be8$export$68b8bcd517bf7533.getInstance();
        this.objectLoader = new $d92o5$ObjectLoader();
    }
}
$d92o5$expose(new $c895e49b264c1790$export$2e2bcd8739ae039());



const $b920a6b4966bc37f$export$4d9f7473977bcb18 = {
    CoreThread: new URL("core-thread.1f18482a.js", import.meta.url),
    CalculationWorker: new URL("calculation.worker.823e7fda.js", import.meta.url)
};
class $b920a6b4966bc37f$export$e37028405a3089df {
    static getWorker(workerClassName) {
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
    static getWrapper(workerClassName) {
        const worker = $b920a6b4966bc37f$export$e37028405a3089df.getWorker(workerClassName);
        const workerURL = $b920a6b4966bc37f$export$4d9f7473977bcb18[workerClassName];
        let wrapper;
        if (!this.wrapperMap.has(workerURL)) {
            wrapper = $d92o5$wrap(worker);
            this.wrapperMap.set(workerURL, wrapper);
        } else wrapper = this.wrapperMap.get(workerURL);
        return wrapper;
    }
}
$b920a6b4966bc37f$export$e37028405a3089df.workerMap = new Map();
$b920a6b4966bc37f$export$e37028405a3089df.wrapperMap = new Map();





class $e71b51a0ba2fbda5$export$ca67b0b0fa758253 {
    constructor(viewer){
        this.coreWrapper = $b920a6b4966bc37f$export$e37028405a3089df.getWrapper('CoreThread');
        this.viewer = viewer;
        this.coreWrapper.setPixelRatio(window.devicePixelRatio);
    }
    _getCurrentExtent() {
        let currentExtent = {
            xmax: 0,
            xmin: 0,
            ymax: 0,
            ymin: 0,
            height: 0
        };
        const viewer = this.viewer;
        const ellipsoid = viewer.scene.globe.ellipsoid;
        const car3_lt = viewer.camera.pickEllipsoid(new $d92o5$Cartesian2(0, 0), ellipsoid);
        const car3_rb = viewer.camera.pickEllipsoid(new $d92o5$Cartesian2(viewer.canvas.width, viewer.canvas.height), ellipsoid);
        if (car3_lt && car3_rb) {
            const carto_lt = ellipsoid.cartesianToCartographic(car3_lt);
            const carto_rb = ellipsoid.cartesianToCartographic(car3_rb);
            currentExtent.xmin = $d92o5$Math.toDegrees(carto_lt.longitude);
            currentExtent.ymin = $d92o5$Math.toDegrees(carto_lt.latitude);
            currentExtent.xmax = $d92o5$Math.toDegrees(carto_rb.longitude);
            currentExtent.ymax = $d92o5$Math.toDegrees(carto_rb.latitude);
        } else if (!car3_lt && car3_rb) {
            const canvas = viewer.canvas;
            let car3_lt2 = null;
            let yIndex = 0;
            do {
                yIndex <= canvas.height ? yIndex += 10 : canvas.height;
                car3_lt2 = viewer.camera.pickEllipsoid(new $d92o5$Cartesian2(0, yIndex), ellipsoid);
            }while (!car3_lt2)
            const carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2);
            const carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb);
            currentExtent.xmin = $d92o5$Math.toDegrees(carto_lt2.longitude);
            currentExtent.ymax = $d92o5$Math.toDegrees(carto_lt2.latitude);
            currentExtent.xmax = $d92o5$Math.toDegrees(carto_rb2.longitude);
            currentExtent.ymin = $d92o5$Math.toDegrees(carto_rb2.latitude);
        }
        currentExtent.height = Math.ceil(viewer.camera.positionCartographic.height);
        return currentExtent;
    }
    _getHeight() {
        return this.viewer.scene.globe.ellipsoid.cartesianToCartographic(this.viewer.camera.position).height;
    }
    _getCenterPosition() {
        const windowPosition = new $d92o5$Cartesian2(this.viewer.canvas.clientWidth / 2, this.viewer.canvas.clientHeight / 2);
        const result = this.viewer.camera.pickEllipsoid(windowPosition);
        if (result) {
            const currentPosition = $d92o5$Ellipsoid.WGS84.cartesianToCartographic(result);
            return {
                lon: currentPosition.longitude * 180 / Math.PI,
                lat: currentPosition.latitude * 180 / Math.PI,
                height: this._getHeight(),
                now: this._getCurrentExtent()
            };
        }
        return undefined;
    }
    async render() {
        const centerPosition = this._getCenterPosition();
        if (centerPosition) {
            const renderParam = {
                fov: $d92o5$Math.toDegrees(this.viewer.camera.frustum.fovy),
                near: this.viewer.camera.frustum.near,
                far: this.viewer.camera.frustum.far,
                civm: this.viewer.camera.inverseViewMatrix,
                cvm: this.viewer.camera.viewMatrix,
                width: this.viewer.container.clientWidth,
                height: this.viewer.container.clientHeight,
                centerPosition: centerPosition
            };
            await this.coreWrapper.render(renderParam);
        }
    }
}




class $9c4a242349458aaf$export$19321809bd793da0 {
    async hide(id) {
        return {
            objectId: id,
            result: await this.coreWrapper.hide(id)
        };
    }
    async show(id) {
        return {
            objectId: id,
            result: await this.coreWrapper.show(id)
        };
    }
    async add(object, position) {
        const id = await this.coreWrapper.add(object.toJSON());
        if (position) return await this.updatePosition(id, position);
        return {
            objectId: id,
            result: true
        };
    }
    async addFromJSON(json, position) {
        const id = await this.coreWrapper.add(json);
        if (position) return await this.updatePosition(id, position);
        return {
            objectId: id,
            result: true
        };
    }
    async delete(id) {
        return {
            objectId: id,
            result: await this.coreWrapper.delete(id)
        };
    }
    async updateObject(id, object) {
        return {
            objectId: id,
            result: await this.coreWrapper.updateObject(id, object.toJSON())
        };
    }
    async updatePosition(id, position) {
        position = $fab42eb3dee39b5b$export$581f30ecb3490957(position);
        const matrix = $fab42eb3dee39b5b$export$a53eb7d829763e1c(position);
        return {
            objectId: id,
            result: await this.coreWrapper.updatePosition(id, {
                matrix: matrix,
                position: position
            })
        };
    }
    constructor(){
        this.coreWrapper = $b920a6b4966bc37f$export$e37028405a3089df.getWrapper('CoreThread');
    }
}


class $1b983a38f3bf9a9b$export$3c33b7cf4c12f471 {
    constructor(){
        this.coreWrapper = $b920a6b4966bc37f$export$e37028405a3089df.getWrapper('CoreThread');
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
        // @ts-ignore
        const offscreen = canvas.transferControlToOffscreen();
        offscreen.width = canvas.clientWidth;
        offscreen.height = canvas.clientHeight;
        // @ts-ignore
        this.coreWrapper.init($d92o5$transfer(offscreen, [
            offscreen
        ])).then(()=>{
            this.coreWrapper.setPixelRatio(window.devicePixelRatio);
        });
    }
    createObjectManager() {
        return new $9c4a242349458aaf$export$19321809bd793da0();
    }
    createRenderer(viewer) {
        const root = viewer.container.parentElement;
        if (!root) throw new Error('cannot fond parent element');
        else root.append(this.container);
        if (viewer.useDefaultRenderLoop) console.warn('Please set Cesium viewer.useDefaultRenderLoop = false for syncronize animation frame to this plug-in');
        return new $e71b51a0ba2fbda5$export$ca67b0b0fa758253(viewer);
    }
}


var $88ee43a4cb2532ea$exports = {};
var $eb3eccffcb58f145$exports = {};

$parcel$export($eb3eccffcb58f145$exports, "EarthGeometry", () => $eb3eccffcb58f145$export$d3bc06bbab0156ac);


class $eb3eccffcb58f145$export$d3bc06bbab0156ac extends $d92o5$SphereGeometry {
    constructor(segments = 32){
        super($234747a9630b4642$export$938789a6994ad1a, segments, segments);
    }
}


$parcel$exportWildcard($88ee43a4cb2532ea$exports, $eb3eccffcb58f145$exports);


var $fab42eb3dee39b5b$exports = {};

$parcel$export($fab42eb3dee39b5b$exports, "CesiumWGS84ToThreeWGS84", () => $fab42eb3dee39b5b$export$581f30ecb3490957);
$parcel$export($fab42eb3dee39b5b$exports, "ThreeWGS84ToCesiumWGS84", () => $fab42eb3dee39b5b$export$7d3acff57e5c668b);
$parcel$export($fab42eb3dee39b5b$exports, "applayRotation", () => $fab42eb3dee39b5b$export$122d934c6a51a22a);
$parcel$export($fab42eb3dee39b5b$exports, "localWGS84ToMattrix4", () => $fab42eb3dee39b5b$export$a53eb7d829763e1c);
$parcel$export($fab42eb3dee39b5b$exports, "applyObjectWGS84Postion", () => $fab42eb3dee39b5b$export$3e1bdbb47f7e9f1e);


var $5876ab33e7eee8c7$exports = {};


function $fab42eb3dee39b5b$export$581f30ecb3490957(cesiumWGS84) {
    return {
        latitude: cesiumWGS84.longitude,
        longitude: cesiumWGS84.latitude
    };
}
function $fab42eb3dee39b5b$export$7d3acff57e5c668b(ThreeWGS84) {
    return {
        latitude: ThreeWGS84.longitude,
        longitude: ThreeWGS84.latitude
    };
}
function $fab42eb3dee39b5b$var$rotationX(degrees) {
    return new $d92o5$Matrix4().makeRotationX($d92o5$Math.toRadians(degrees));
}
function $fab42eb3dee39b5b$export$122d934c6a51a22a(object, degrees) {
    object.applyMatrix4($fab42eb3dee39b5b$var$rotationX(degrees));
}
function $fab42eb3dee39b5b$export$a53eb7d829763e1c(position) {
    const wgs84Position = $d92o5$Cartesian3.fromDegrees(position.longitude, position.latitude);
    const matrix = $d92o5$Transforms.headingPitchRollToFixedFrame(wgs84Position, new $d92o5$HeadingPitchRoll(0, 0, 0));
    const localToWgs84Mattrix = new $d92o5$Matrix4();
    localToWgs84Mattrix.set(matrix[0], matrix[4], matrix[8], matrix[12], matrix[1], matrix[5], matrix[9], matrix[13], matrix[2], matrix[6], matrix[10], matrix[14], matrix[3], matrix[7], matrix[11], matrix[15]);
    return localToWgs84Mattrix;
}
function $fab42eb3dee39b5b$export$3e1bdbb47f7e9f1e(object, position) {
    position = $fab42eb3dee39b5b$export$581f30ecb3490957(position);
    const matrix = $fab42eb3dee39b5b$export$a53eb7d829763e1c(position);
    object.applyMatrix4(matrix);
    object.userData.wgs84 = position;
}





function $82e614c8221c81c3$export$689d6f22f19954a7(teapotSize = 10) {
    const teapotGeometry = new $d92o5$TeapotGeometry(teapotSize);
    $fab42eb3dee39b5b$export$122d934c6a51a22a(teapotGeometry, 90);
    return teapotGeometry;
}


$parcel$exportWildcard($149c1bd638913645$exports, $88ee43a4cb2532ea$exports);
$parcel$exportWildcard($149c1bd638913645$exports, $fab42eb3dee39b5b$exports);
$parcel$exportWildcard($149c1bd638913645$exports, $5876ab33e7eee8c7$exports);


class $52eb5f7f738484f9$export$7ee43ee285de8226 {
    calculationObjectVisible(objectPosition, currentPosition) {
        objectPosition = $fab42eb3dee39b5b$export$7d3acff57e5c668b(objectPosition);
        let objLon = objectPosition.longitude;
        let objLat = objectPosition.latitude;
        let curLon = currentPosition.longitude;
        let curLat = currentPosition.latitude;
        if (Math.abs(objLon - curLat) > 300) {
            if (objLon < 0) objLon += 360;
            else curLon += 360;
        }
        const lonGap = Math.abs(objLon - curLon);
        const latGap = Math.abs(objLat - curLat);
        const accpectableGapSize = 50;
        return lonGap < accpectableGapSize && latGap < accpectableGapSize;
    }
}
$d92o5$expose(new $52eb5f7f738484f9$export$7ee43ee285de8226());


export {$52eb5f7f738484f9$export$7ee43ee285de8226 as CalculationWorker};
//# sourceMappingURL=calculation.worker.823e7fda.js.map

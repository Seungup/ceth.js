import {expose as $d9Ejt$expose} from "comlink";
import {ObjectLoader as $d9Ejt$ObjectLoader, BoxHelper as $d9Ejt$BoxHelper, Scene as $d9Ejt$Scene, WebGLRenderer as $d9Ejt$WebGLRenderer, PerspectiveCamera as $d9Ejt$PerspectiveCamera} from "three";
import {Subject as $d9Ejt$Subject} from "rxjs";




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
            this.camera.updateProjectionMatrix();
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
    add(json) {
        const object = this.objectLoader.parse(json);
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
    updatePosition(id, param) {
        let object = this.getObject(id);
        if (object) {
            object.applyMatrix4(param.matrix);
            object.userData.wgs84 = param.position;
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

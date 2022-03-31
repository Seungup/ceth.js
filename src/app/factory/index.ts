import { Viewer } from 'cesium';
import { ObjectManager } from './object.manager';
import { ObjectEvent } from './object.event';
import { ObjectPreview } from './object.preview';
import { Renderers } from './renderers';

export class InterfcaeFactory {
    readonly container: HTMLDivElement;
    constructor(private readonly viewer: Viewer) {
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
    }

    private _manager: ObjectManager | undefined;
    /**
     * 오브젝트를 관리하는 메니저 클래스를 가져옵니다.
     */
    get manager() {
        return this._manager || (this._manager = new ObjectManager());
    }

    private _event: ObjectEvent | undefined;
    /**
     * 오브젝트의 유용한 기능을 사용할 수 있는 유틸 클래스를 가져옵니다.
     */
    get event() {
        return this._event || (this._event = new ObjectEvent(this.viewer));
    }

    private _renderers: Renderers | undefined;
    get renderers() {
        return this._renderers || (this._renderers = new Renderers(this.viewer, this.container));
    }

    private _preview: ObjectPreview | undefined;
    get preview() {
        return this._preview || (this._preview = new ObjectPreview(this.viewer));
    }
}

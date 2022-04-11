import { Object3D } from "three";
import { ObjectAPI } from "./ObjectAPI";
import { CesiumUtils } from "../Utils/CesiumUtils";
import { WGS84_ACTION } from "../Math";
import { ApplicationContext } from "../Contexts/ApplicationContext";
import { RendererContext } from "../Contexts/RendererContext";
import { RendererMap } from "../Components/Renderer";

export class ObjectPreview {
    private _attachedObjectAPI: ObjectAPI | undefined;
    constructor() {
        const context = ApplicationContext.getInstance();

        if (context.viewer) {
            context.viewer.canvas.addEventListener(
                "pointermove",
                this._onMouseEvent.bind(this)
            );
        }
    }

    private _onBeforeDetach?: { (api: ObjectAPI): Promise<void> };

    /**
     * attached 된 오브젝트는 clone되어 원본을 유지합니다.
     *
     * @param object
     */
    async attach(
        object: Object3D,
        target: keyof RendererMap,
        onBeforeDetach?: { (api: ObjectAPI): Promise<void> }
    ) {
        this.detach();
        this._onBeforeDetach = onBeforeDetach;

        const renderer = RendererContext.getRenderer(target);
        if (renderer) {
            this._attachedObjectAPI = await renderer.add(object.clone());
        }
    }

    /**
     * 오브젝트가 attach 되었는가
     * @returns
     */
    isAttached() {
        return !!this._attachedObjectAPI;
    }

    /**
     * 자동으로 오브젝트의 위치를 업데이트합니다.
     */
    autoPositionUpdate: boolean = true;

    /**
     * 오브젝트를 분리합니다.
     *
     * @returns 분리에 성공하면, true를 리턴합니다.
     */
    async detach() {
        if (this._attachedObjectAPI) {
            if (this._onBeforeDetach) {
                await this._onBeforeDetach(this._attachedObjectAPI);
            }
            this._attachedObjectAPI.remove();

            this._attachedObjectAPI = undefined;

            return true;
        }
        return false;
    }

    private _onMouseEvent(event: MouseEvent) {
        if (!this._attachedObjectAPI) return;
        if (!this.autoPositionUpdate) return;
        const viewer = ApplicationContext.getInstance().viewer;
        if (!viewer) return;

        const position = CesiumUtils.getLongitudeLatitudeByMouseEvent(event);

        if (position) {
            this._attachedObjectAPI.setPosition(
                { ...position, height: 0 },
                WGS84_ACTION.NONE
            );
        }
    }
}

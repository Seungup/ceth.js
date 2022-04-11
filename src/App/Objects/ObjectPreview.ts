import { Object3D } from "three";
import { CesiumUtils } from "../Utils/CesiumUtils";
import { WGS84_ACTION } from "../Math";
import { ApplicationContext } from "../Contexts/ApplicationContext";
import { RendererContext } from "../Contexts/RendererContext";
import { RendererMap } from "../Components/Renderer";
import { DataAccessor } from "../Data/Accessor/DataAccessor";

export class ObjectPreview {
    private _attachedDataAccessor: DataAccessor | undefined;
    constructor() {
        const context = ApplicationContext.getInstance();

        if (context.viewer) {
            context.viewer.canvas.addEventListener(
                "pointermove",
                this._onMouseEvent.bind(this)
            );
        }
    }

    private _onBeforeDetach?: { (accessor: DataAccessor): Promise<void> };

    /**
     * attached 된 오브젝트는 clone되어 원본을 유지합니다.
     *
     * @param object
     */
    async attach(
        object: Object3D,
        target: keyof RendererMap,
        onBeforeDetach?: { (accessor: DataAccessor): Promise<void> }
    ) {
        this.detach();
        this._onBeforeDetach = onBeforeDetach;

        const renderer = RendererContext.getRenderer(target);
        if (renderer) {
            this._attachedDataAccessor = await renderer.add(object.clone());
        }
    }

    /**
     * 오브젝트가 attach 되었는가
     * @returns
     */
    isAttached() {
        return !!this._attachedDataAccessor;
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
        if (this._attachedDataAccessor) {
            if (this._onBeforeDetach) {
                await this._onBeforeDetach(this._attachedDataAccessor);
            }
            this._attachedDataAccessor.remove();

            this._attachedDataAccessor = undefined;

            return true;
        }
        return false;
    }

    private _onMouseEvent(event: MouseEvent) {
        if (!this._attachedDataAccessor) return;
        if (!this.autoPositionUpdate) return;
        const viewer = ApplicationContext.getInstance().viewer;
        if (!viewer) return;

        const position = CesiumUtils.getLongitudeLatitudeByMouseEvent(event);

        if (position) {
            this._attachedDataAccessor.setWGS84(
                { ...position, height: 0 },
                WGS84_ACTION.NONE
            );
        }
    }
}

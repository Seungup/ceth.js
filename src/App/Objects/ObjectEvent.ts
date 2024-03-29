import { Subject } from "rxjs";
import { ApplicationContext } from "../Contexts/ApplicationContext";

export class ObjectEvent {
    private readonly onKeyDownSubject = new Subject<KeyboardEvent>();
    private readonly onPointerMoveSubject = new Subject<MouseEvent>();
    private readonly onContextMenuSubject = new Subject<MouseEvent>();
    private readonly onDblclickSubject = new Subject<MouseEvent>();
    readonly onDblclick = this.onDblclickSubject.pipe();
    readonly onKeyDown = this.onKeyDownSubject.pipe();
    readonly onPointerMove = this.onPointerMoveSubject.pipe();
    readonly onContextMenu = this.onContextMenuSubject.pipe();

    constructor() {
        const root = ApplicationContext.viewer?.container.parentElement;
        root?.addEventListener("keydown", (event) => {
            this.onKeyDownSubject.next(event);
        });
        root?.addEventListener("pointermove", (event) => {
            this.onPointerMoveSubject.next(event);
        });
        root?.addEventListener("contextmenu", (event) => {
            this.onContextMenuSubject.next(event);
        });
        root?.addEventListener("dblclick", (event) => {
            this.onDblclickSubject.next(event);
        });
    }
}

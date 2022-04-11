import { Remote, wrap } from "comlink";
import { ApplicationContext } from "../../../../Contexts/ApplicationContext";
import { WorkerFactory } from "../../../../WorkerFactory";
import {
    CommandReciver,
    CoreThreadCommands,
} from "../OffscreenRenderer/Core/CommandReciver";
import { CoreThreadCommand } from "../OffscreenRenderer/CoreThreadCommand";
import { MultipleOffscreenRenderer } from "./MultipleOffscreenRenderer";

export class MultipleOffscreenBuilder {
    private count: number = 1;
    setCanvasCount(count: number) {
        this.count = 1 > count ? 1 : count;
        return this;
    }

    build() {
        const viewer = ApplicationContext.viewer;
        if (!viewer) {
            throw new Error(
                "Can not access viewer on Application Context. Please call ApplicationContext.setViewer first."
            );
        }

        // prettier-ignore
        const 
            width = viewer.canvas.width,
            height = viewer.canvas.height,
            container = ApplicationContext.container,
            renderer = new MultipleOffscreenRenderer();

        for (let i = 0; i < this.count; i++) {
            const worker = WorkerFactory.createWorker("CommandReciver");

            const canvas = document.createElement("canvas");
            canvas.style.position = "absolute";

            container.appendChild(canvas);

            const offscreen = canvas.transferControlToOffscreen();
            offscreen.width = width;
            offscreen.height = height;

            CoreThreadCommand.excuteCommand(
                worker,
                CoreThreadCommands.INIT,
                { canvas: offscreen },
                [offscreen]
            );
            renderer.workerArray.push({
                worker: worker,
                wrapper: wrap<CommandReciver>(worker),
            });
        }

        return renderer;
    }
}

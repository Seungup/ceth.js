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
        count = count > 1 ? count : 1;
        return this;
    }

    build() {
        const viewer = ApplicationContext.viewer;
        if (!viewer) {
            throw new Error(
                "Can not access viewer on Application Context. Please call ApplicationContext.setViewer first."
            );
        }

        const width = viewer.canvas.width,
            height = viewer.canvas.height;

        let worker: Worker,
            canvas: HTMLCanvasElement,
            offscreen: OffscreenCanvas;

        const workerArray = new Array<{
            worker: Worker;
            wrapper: Remote<CommandReciver>;
        }>();

        const container = ApplicationContext.container;
        for (let i = 0; i < this.count; i++) {
            worker = WorkerFactory.createWorker("CommandReciver");

            canvas = document.createElement("canvas");
            canvas.style.position = "absolute";

            container.appendChild(canvas);

            offscreen = canvas.transferControlToOffscreen();
            offscreen.width = width;
            offscreen.height = height;

            CoreThreadCommand.excuteCommand(
                worker,
                CoreThreadCommands.INIT,
                { canvas: offscreen },
                [offscreen]
            );

            workerArray.push({
                worker: worker,
                wrapper: wrap<CommandReciver>(worker),
            });
        }

        return new MultipleOffscreenRenderer(workerArray);
    }
}

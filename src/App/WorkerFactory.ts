import { wrap, Remote, releaseProxy } from "comlink";
import { CommandReciver } from "./Components/Renderer/Template/OffscreenRenderer/Core/CommandReciver";

interface WorkerMap {
    CommandReciver: CommandReciver;
}
const WorkerURL = {
    CommandReciver: new URL(
        "./Components/Renderer/Template/OffscreenRenderer/Core/CommandReciver",
        import.meta.url
    ),
} as const;

type WorkerURL = typeof WorkerURL[keyof typeof WorkerURL];

export namespace WorkerWrapperMap {
    const workerMap = new WeakMap<Worker, Remote<CommandReciver>>();

    export const setWrapper = (
        worker: Worker,
        wrapper?: Remote<CommandReciver>
    ) => {
        if (!wrapper) {
            wrapper = wrap<CommandReciver>(worker);
        }
        workerMap.set(worker, wrapper);
    };

    export const getWrapper = (worker: Worker) => {
        return workerMap.get(worker);
    };

    export const removeWorker = (worker: Worker) => {
        if (workerMap.has(worker)) {
            workerMap.get(worker)?.[releaseProxy]();
            worker.terminate();
            workerMap.delete(worker);
            return true;
        }
        return false;
    };
}

export class WorkerFactory {
    /**
     * 웹 워커를 생성합니다.
     * @param workerClassName
     * @returns
     */
    static createWorker<T extends keyof WorkerMap>(workerClassName: T): Worker {
        const worker = new Worker(WorkerURL[workerClassName], {
            type: "module",
        });
        WorkerWrapperMap.setWrapper(worker);
        return worker;
    }

    /**
     * 웹 워커의 Warpper 를 생성합니다.
     * @param workerClassName
     * @returns
     */
    static createWorkerWrapper<T extends keyof WorkerMap>(
        workerClassName: T
    ): Remote<WorkerMap[T]> {
        const worker = WorkerFactory.createWorker(workerClassName);
        const wrapper = wrap<WorkerMap[T]>(worker);
        WorkerWrapperMap.setWrapper(worker, wrapper);
        return wrapper;
    }
}

import { wrap, Remote } from "comlink";
import { CommandReciver } from "./Components/Renderer/Template/OffscreenRenderer/Core/CommandReciver";
import { CommandReciverCacheRegister } from "./Components/Renderer/Template/OffscreenRenderer/Core/CommandReciverCacheRegister";

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

export namespace WorkerFactory {
    /**
     * 웹 워커를 생성합니다.
     * @param workerClassName
     * @returns
     */
    export const createWorker = <T extends keyof WorkerMap>(
        workerClassName: T
    ): Worker => {
        const worker = new Worker(WorkerURL[workerClassName], {
            type: "module",
        });
        registCache(workerClassName, worker);
        return worker;
    };

    /**
     * 웹 워커의 Warpper 를 생성합니다.
     * @param workerClassName
     * @returns
     */
    export const createWorkerWrapper = <T extends keyof WorkerMap>(
        workerClassName: T
    ): Remote<WorkerMap[T]> => {
        const worker = WorkerFactory.createWorker(workerClassName);
        const wrapper = wrap<WorkerMap[T]>(worker);
        registCache(workerClassName, worker, wrapper);
        return wrapper;
    };

    const registCache = <T extends keyof WorkerMap>(
        className: T,
        worker: Worker,
        wrapper?: Remote<WorkerMap[T]>
    ) => {
        switch (className) {
            case "CommandReciver":
                CommandReciverCacheRegister.regist(worker, wrapper);
                break;
            default:
                break;
        }
    };
}

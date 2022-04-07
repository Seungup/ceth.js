import { wrap, Remote } from 'comlink';
import type { CommandReciver } from './Renderer/Template/OffscreenRenderer/Core/CommandReciver';

interface WorkerMap {
    CommandReciver: CommandReciver;
}
const WorkerURL = {
    CommandReciver: new URL(
        './renderer/template/OffscreenRenderer/core/command-reciver',
        import.meta.url
    ),
} as const;

type WorkerURL = typeof WorkerURL[keyof typeof WorkerURL];

export class WorkerFactory {
    /**
     * 웹 워커를 생성합니다.
     * @param workerClassName
     * @returns
     */
    static createWorker<T extends keyof WorkerMap>(workerClassName: T): Worker {
        return new Worker(WorkerURL[workerClassName], { type: 'module' });
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
        return wrap<WorkerMap[T]>(worker);
    }
}

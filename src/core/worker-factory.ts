import { wrap, Remote } from "comlink";
import CoreThread from "./core-thread";

interface WorkerMap {
  CoreThread: CoreThread;
}
export const WorkerURL = {
  CoreThread: new URL("./core-thread", import.meta.url),
} as const;

export type WorkerURL = typeof WorkerURL[keyof typeof WorkerURL];

export class SingletonWorkerFactory {
  private static readonly workerMap = new Map<URL, Worker>();
  /**
   * 웹 워커를 가져옵니다.
   * @param workerClassName
   * @returns
   */
  static getWorker<T extends keyof WorkerMap>(workerClassName: T): Worker {
    let worker: Worker;
    const workerURL = WorkerURL[workerClassName];
    if (!this.workerMap.has(workerURL)) {
      worker = new Worker(workerURL, { type: "module" });
      this.workerMap.set(workerURL, worker);
    } else {
      worker = this.workerMap.get(workerURL)!;
    }
    return worker;
  }

  private static readonly wrapperMap = new Map<URL, Remote<any>>();
  /**
   * 웹 워커의 Warpper 를 가져옵니다.
   * @param workerClassName
   * @returns
   */
  static getWrapper<T extends keyof WorkerMap>(
    workerClassName: T
  ): Remote<WorkerMap[T]> {
    const worker = SingletonWorkerFactory.getWorker(workerClassName);
    const workerURL = WorkerURL[workerClassName];

    let wrapper: Remote<WorkerMap[T]>;
    if (!this.wrapperMap.has(workerURL)) {
      wrapper = wrap<WorkerMap[T]>(worker);
      this.wrapperMap.set(workerURL, wrapper);
    } else {
      wrapper = this.wrapperMap.get(workerURL)! as Remote<WorkerMap[T]>;
    }

    return wrapper;
  }
}

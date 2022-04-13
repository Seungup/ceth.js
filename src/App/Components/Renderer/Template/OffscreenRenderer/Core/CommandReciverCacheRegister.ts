import { releaseProxy, Remote, wrap } from "comlink";
import { CommandReciver } from "./CommandReciver";

export namespace CommandReciverCacheRegister {
    const workerMap = new WeakMap<Worker, Remote<CommandReciver>>();

    export const regist = (
        worker: Worker,
        wrapper?: Remote<CommandReciver>
    ) => {
        if (!wrapper) {
            wrapper = wrap<CommandReciver>(worker);
        }
        workerMap.set(worker, wrapper);
    };

    export const getRemote = (worker: Worker): Remote<CommandReciver> => {
        if (!workerMap.has(worker)) {
            console.warn(
                `${worker} was not in the map, set and get workerMap.`
            );
            workerMap.set(worker, wrap<CommandReciver>(worker));
        }
        return workerMap.get(worker)!;
    };

    export const remove = (worker: Worker) => {
        if (workerMap.has(worker)) {
            workerMap.get(worker)?.[releaseProxy]();
            worker.terminate();
            workerMap.delete(worker);
            return true;
        }
        return false;
    };
}

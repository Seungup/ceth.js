import { DataAccessor } from "./Accessor/DataAccessor";
import type { Accessor } from "./Accessor/DataAccessor";

export interface DataAccessorBuildData<T extends DataAccessor = any> {
    type: Accessor;
    create: () => T;
    update: (accessor: T) => void;
}

export class DataAccessorFactory {
    private static flyweights = new WeakMap<Accessor, DataAccessor>();

    static getCachedAccessor<T extends DataAccessor>(
        data: DataAccessorBuildData<T>
    ): T {
        if (!DataAccessorFactory.flyweights.has(data.type)) {
            DataAccessorFactory.flyweights.set(data.type, data.create());
        }

        const accessor = DataAccessorFactory.flyweights.get(data.type)! as T;
        data.update(accessor);

        return accessor;
    }
}

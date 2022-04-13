import type {
    AccessorClass,
    Accessor,
    DataAccessor,
} from "./Accessor/DataAccessor";

export interface DataAccessorBuildData<T extends DataAccessor = Accessor> {
    type: AccessorClass;
    create: () => T;
    update: (accessor: T) => void;
}

export class DataAccessorFactory {
    private static flyweights = new WeakMap<AccessorClass, DataAccessor>();

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

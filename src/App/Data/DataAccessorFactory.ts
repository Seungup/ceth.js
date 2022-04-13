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
    private static flyweights = new Array<DataAccessor>();

    static getCachedAccessor<T extends DataAccessor>(
        data: DataAccessorBuildData<T>
    ): T {
        let accessor: T,
            i = 0,
            len = DataAccessorFactory.flyweights.length;

        for (; i < len; i++) {
            if (DataAccessorFactory.flyweights[i] instanceof data.type) {
                accessor = <T>DataAccessorFactory.flyweights[i];
                data.update(accessor);
                return accessor;
            }
        }

        accessor = data.create();
        DataAccessorFactory.flyweights.push(accessor);
        data.update(accessor);
        return accessor;
    }
}

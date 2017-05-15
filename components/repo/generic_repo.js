'use strict';

module.exports = class GenericRepo {
    constructor(options, store) {
        this.schema = options.schema;
        this.store = Reflect.construct(store.get(), []);
        this.id = 0;
    }

    get(id) {
        return this.store.get(id.toString());
    }

    list(page, limit) {
        let keys = this.store.keys();
        let start = 0;
        if (page > 1) {
            start = page * 5;
        }
        if (keys.length < limit) {
            limit = keys.length;
        } else if (limit === 0) {
            limit = keys.length;
        }
        let result = [];
        for (let i = start; limit !== 0; i++) {
            let value = this.store.get(keys[i]);
            limit--;
            result.push(value);
        }
        return result;
    }

    create(data) {
        this.id++;
        data.id = this.id;
        this.store.set(this.id.toString(), data);
        return data;
    }

    update(id, data) {
        let genericData = this.store.get(id.toString());

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                genericData[key] = data[key];
            }
        }

        this.store.set(id.toString(), genericData);
        return genericData;
    }

    remove(id) {
        let deletedGenericData = this.store.get(id.toString());
        this.store.delete(id.toString());
        return deletedGenericData;
    }

};
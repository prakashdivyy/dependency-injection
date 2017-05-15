'use strict';

module.exports = class UserRepo {
    constructor(store) {
        this.store = Reflect.construct(store.get(), []);
        this.userId = 0;
    }

    get(userId) {
        return this.store.get(userId.toString());
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
        this.userId++;
        data.id = this.userId;
        this.store.set(this.userId.toString(), data);
        return data;
    }

    update(userId, data) {
        let dataUser = this.store.get(userId.toString());

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                dataUser[key] = data[key];
            }
        }

        this.store.set(userId.toString(), dataUser);
        return dataUser;
    }

    remove(userId) {
        let deletedUser = this.store.get(userId.toString());
        this.store.delete(userId.toString());
        return deletedUser;
    }

};
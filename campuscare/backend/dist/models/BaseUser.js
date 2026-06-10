"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUser = void 0;
class BaseUser {
    constructor(id, nama, email, role) {
        this.id = id;
        this.nama = nama;
        this.email = email;
        this.role = role;
    }
    getId() {
        return this.id;
    }
    getNama() {
        return this.nama;
    }
    getEmail() {
        return this.email;
    }
    getRole() {
        return this.role;
    }
}
exports.BaseUser = BaseUser;
//# sourceMappingURL=BaseUser.js.map
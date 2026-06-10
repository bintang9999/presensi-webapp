"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
const bcrypt_1 = __importDefault(require("bcrypt"));
async function seed() {
    const db = await (0, connection_1.initializeDatabase)();
    const email = 'admin@campuscare.com';
    const password = await bcrypt_1.default.hash('admin123', 10);
    const existingAdmin = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!existingAdmin) {
        await db.run('INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)', ['Admin CampusCare', email, password, 'admin']);
        console.log('Admin user created:');
        console.log('Email: admin@campuscare.com');
        console.log('Password: admin123');
    }
    else {
        console.log('Admin user already exists');
    }
    // await db.close(); // Not strictly needed since process exits
}
seed().catch(console.error);
//# sourceMappingURL=seed.js.map
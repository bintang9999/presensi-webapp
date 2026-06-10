"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const connection_1 = require("./database/connection");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/reports', reportRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});
async function startServer() {
    try {
        await (0, connection_1.initializeDatabase)();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await (0, connection_1.closeDatabase)();
    process.exit(0);
});
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map
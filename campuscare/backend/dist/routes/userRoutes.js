"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authMiddleware, auth_1.adminMiddleware, userController_1.getAllUsers);
router.put('/:id', auth_1.authMiddleware, auth_1.adminMiddleware, userController_1.updateUser);
router.delete('/:id', auth_1.authMiddleware, auth_1.adminMiddleware, userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map
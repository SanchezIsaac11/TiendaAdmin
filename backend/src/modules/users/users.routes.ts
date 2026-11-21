import { Router } from "express";
import { UserController } from "./users.controller.ts";
import { validateCreateUser, validateUserId, validateUpdateUser, validateUserName } from "./users.validators.ts";
import { authMiddleware } from "../../session/auth.middleware.ts";

export class UserRoutes {
    static get router(): Router {
        const router = Router();
        const userController = new UserController();

        router.get("/", authMiddleware("admin"), userController.getUsers);
        router.get("/me/:name", validateUserName, userController.getUserByName )
        router.get("/:id", validateUserId, userController.getUserById);
        router.post("/", authMiddleware("admin"), validateCreateUser, userController.createUser);
        router.put("/:id", authMiddleware("admin"), validateUserId, validateUpdateUser, userController.updateUserById);
        router.delete("/:id", authMiddleware("admin"), validateUserId, userController.deleteUserById);

        return router;
    }
}

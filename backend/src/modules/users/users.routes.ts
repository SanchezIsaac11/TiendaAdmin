import { Router } from "express";
import { UserController } from "./users.controller.ts";
import { UserValidator} from "./users.validators.ts";
import { authMiddleware } from "../../session/auth.middleware.ts";

export class UserRoutes {
    static get router(): Router {
        const router = Router();
        const userController = new UserController();

        router.get("/", authMiddleware("admin"), userController.getUsers);
        router.get("/me", userController.getCurrentUser );
        router.post("/login", userController.login);
        router.post("/logout", userController.logout);
        router.get("/:id", UserValidator.validateUserId, userController.getUserById);
        router.post("/", authMiddleware("admin"), UserValidator.validateCreateUser, userController.createUser);
        router.put("/:id", authMiddleware("admin"), UserValidator.validateUserId, UserValidator.validateUpdateUser, userController.updateUserById);
        router.delete("/:id", authMiddleware("admin"), UserValidator.validateUserId, userController.deleteUserById);

        return router;
    }
}

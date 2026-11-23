import { body, param, validationResult } from "express-validator";
import type { RequestHandler } from "express";

const validateRequest: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ message: "Invalid data", errors: errors.array() });
        return;
    }

    next();
};

const allowedFields = ["name", "password", "role"];
const allowedRoles = ["admin", "cashier"];

const validation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    switch (field) {
        case "name":
                return validator.isString().withMessage("Name must be a string")
                .notEmpty().withMessage("Name is required")
                .isLength({ min: 4, max: 255 }).withMessage("Name must be between 4 and 255 characters long");

        case "password":
                return validator.isString().withMessage("Password must be a string").trim()
                .notEmpty().withMessage("Password is required")
                .isLength({ max: 150 }).withMessage("Password must be less than 150 characters long");

        case "role":
                return validator.isString().withMessage("Role must be a string").trim()
                .notEmpty().withMessage("Role is required")
                .isIn(allowedRoles).withMessage("Role must be 'admin' or 'cashier'");

        default: throw new Error(`No validation defined for field: ${field}`);
    }
};
export class UserValidator {

    public static validateUserId = [
        param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
        validateRequest
    ];

    public static validateUserName = [
        validation("name", "param"),
        validateRequest
    ];

    public static validateCreateUser = [
        body().custom((value) => {
            if (!value || typeof value !== "object" || Array.isArray(value)) {
                throw new Error("Invalid data");
            }

            const fields = Object.keys(value);
            const invalidFields = fields.filter(
                (field) => !allowedFields.includes(field)
            );

            if (invalidFields.length > 0) {
                throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
            }

            return true;
        }),

        validation("name"),
        validation("password"),
        validation("role"),
        validateRequest
    ];

    public static validateUpdateUser = [
        body().custom((value) => {
            if (!value || typeof value !== "object" || Array.isArray(value)) {
                throw new Error("Invalid data");
            }

            const fields = Object.keys(value);

            if (fields.length === 0) {
                throw new Error("Must send at least one field to update");
            }

            const invalidFields = fields.filter(
                (field) => !allowedFields.includes(field)
            );

            if (invalidFields.length > 0) {
                throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
            }

            return true;
        }),

        validation("name", "body", true),
        validation("password", "body", true),
        validation("role", "body", true),
        validateRequest
    ];
}

import { body, param, validationResult } from "express-validator";
import type { RequestHandler } from "express";

const validateRequest: RequestHandler = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ message: "Los datos enviados no son válidos", errors: errors.array() });
        return;
    }

    next();
};

// Campos permitidos para crear y actualizar usuarios
const allowedFields = ["name", "password", "role"];
const allowedRoles = ["admin", "cashier"];

const nameValidation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    return validator.isString().withMessage("La contraseña debe ser texto")
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 4, max: 255 }).withMessage("La contraseña debe tener al menos 4 caracteres");
};

const passValidation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    return validator.isString().withMessage("El nombre debe ser texto").trim()
        .notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ max: 150 }).withMessage("El nombre no puede superar los 150 caracteres");
};

const roleValidation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    return validator.isString().withMessage("El rol debe ser texto").trim()
        .notEmpty().withMessage("El rol es obligatorio")
        .isIn(allowedRoles).withMessage("El rol debe ser 'admin' o 'cashier'");
};

// Validar el ID del usuario
export const validateUserId = [
    param("id").isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo"),
    validateRequest
];

export const validateUserName = [
    nameValidation("name", "param"),
    validateRequest
];

// Validar la creación de un usuario
export const validateCreateUser = [
    body().custom((value) => {
        if (!value || typeof value !== "object" || Array.isArray(value)) {
            throw new Error("Se deben enviar datos válidos");
        }

        const fields = Object.keys(value);
        const invalidFields = fields.filter((field) => !allowedFields.includes(field));

        if (invalidFields.length > 0) {
            throw new Error(`Campos no permitidos: ${invalidFields.join(", ")}`);
        }

        return true;
    }),

    nameValidation("name"),

    passValidation("password"),

    roleValidation("role"),

    validateRequest
];

// Validar la actualización de un usuario
export const validateUpdateUser = [
    body().custom((value) => {
        if (!value || typeof value !== "object" || Array.isArray(value)) {
            throw new Error("Se deben enviar datos para actualizar");
        }

        const fields = Object.keys(value);

        if (fields.length === 0) {
            throw new Error("Debes enviar al menos un campo para actualizar");
        }

        const invalidFields = fields.filter((field) => !allowedFields.includes(field));

        if (invalidFields.length > 0) {
            throw new Error(`Campos no permitidos: ${invalidFields.join(", ")}`);
        }

        return true;
    }),

    nameValidation("name", "body", true),

    passValidation("password", "body", true),

    roleValidation("role", "body", true),

    validateRequest
];

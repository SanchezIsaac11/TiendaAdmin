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

// Campos permitidos para crear y actualizar ventas
const allowedFields = ["folio", "total", "date", "cashier_id"];

// Validar el ID de la venta
export const validateSaleId = [
    param("id").isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo"),
    validateRequest
];

// Validar la creación de una venta
export const validateCreateSale = [
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

    body("folio")
        .isString().withMessage("El folio debe ser texto")
        .trim()
        .notEmpty().withMessage("El folio es obligatorio")
        .isLength({ max: 100 }).withMessage("El folio no puede superar los 100 caracteres"),

    body("total")
        .isDecimal({ decimal_digits: "0,2" }).withMessage("El total debe ser válido y tener máximo 2 decimales")
        .bail()
        .isFloat({ min: 0, max: 99999999.99 }).withMessage("El total está fuera del rango permitido")
        .toFloat(),

    body("date")
        .optional()
        .isISO8601().withMessage("La fecha debe tener un formato válido (ISO 8601)"),

    body("cashier_id")
        .isInt({ min: 1 }).withMessage("El ID del cajero debe ser un número entero positivo")
        .toInt(),

    validateRequest
];

// Validar la actualización de una venta
export const validateUpdateSale = [
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

    body("folio")
        .optional()
        .isString().withMessage("El folio debe ser texto")
        .trim()
        .notEmpty().withMessage("El folio no puede estar vacío")
        .isLength({ max: 100 }).withMessage("El folio no puede superar los 100 caracteres"),

    body("total")
        .optional()
        .isDecimal({ decimal_digits: "0,2" }).withMessage("El total debe ser válido y tener máximo 2 decimales")
        .bail()
        .isFloat({ min: 0, max: 99999999.99 }).withMessage("El total está fuera del rango permitido")
        .toFloat(),

    body("date")
        .optional()
        .isISO8601().withMessage("La fecha debe tener un formato válido (ISO 8601)"),

    body("cashier_id")
        .optional()
        .isInt({ min: 1 }).withMessage("El ID del cajero debe ser un número entero positivo")
        .toInt(),

    validateRequest
];


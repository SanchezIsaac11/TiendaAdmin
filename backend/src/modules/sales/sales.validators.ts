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

const allowedFields = ["folio", "total", "date", "cashier_id"];

const folioValidation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    return validator.isString().withMessage("Folio must be a string").trim()
        .notEmpty().withMessage("Folio is required")
        .isLength({ max: 100 }).withMessage("Folio must be 100 characters long")
};

const totalValidation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    return validator.isDecimal({ decimal_digits: "0,2" }).withMessage("The total must be a valid number with a maximum of 2 decimal place ").bail()
        .isFloat({ min: 0, max: 99999999.99 }).withMessage("Total out of range").toFloat();
};

const dateValidation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    return validator.optional().isISO8601().withMessage("Date must be a valid format (ISO 8601)");
};

const cashierIDValidation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    return validator.isInt({ min: 1 }).withMessage("Casher ID must be a valid positive integer").toInt();
};

export class SaleValidator{
    public static validateSaleId = [
            param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
            validateRequest
        ];

    public static validateCreateSale = [
        body().custom((value) => {
            if (!value || typeof value !== "object" || Array.isArray(value)) {
                throw new Error("Invalida data");
            }

            const fields = Object.keys(value);
            const invalidFields = fields.filter((field) => !allowedFields.includes(field));

            if (invalidFields.length > 0) {
                throw new Error(`Invalid Fields: ${invalidFields.join(", ")}`);
            }

            return true;
        }),

        folioValidation("folio"),
        totalValidation("total"),
        dateValidation("date"),
        cashierIDValidation("cashier_id"),
        validateRequest
    ];

    public static validateUpdateSale = [
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

        folioValidation("folio", "body", true),
        totalValidation("total", "body", true),
        dateValidation("date", "body", true),
        cashierIDValidation("cashier_id", "body", true),
        validateRequest
    ];

}


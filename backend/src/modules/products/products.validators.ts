import {body, param, validationResult } from "express-validator";

import type { RequestHandler } from "express";

const validateRequest: RequestHandler = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ message: "Los datos enviados no son válidos", errors: errors.array() });
        return;
    }

    next();
};

const allowedFields = [ "name", "price", "cost", "stock", "id_category", "barcode" ];

const categoryValidation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    return validator.isInt({ min: 1 }).withMessage("Category ID must be a positive valid integer");
};

const nameValidation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    return validator.isString().withMessage("El nombre debe ser texto").trim().notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ max: 150 }).withMessage("El nombre no puede superar los 150 caracteres");
};

const priceValidation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    return validator.isDecimal({ decimal_digits: "0,2" }).withMessage("El precio debe ser válido y tener máximo 2 decimales")
        .bail().isFloat({ min: 0, max: 99999999.99 }).withMessage("El precio está fuera del rango permitido").toFloat();
};

const costValidation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    return validator.isDecimal({ decimal_digits: "0,2" }).withMessage("El costo debe ser válido y tener máximo 2 decimales")
        .bail().isFloat({ min: 0, max: 99999999.99 }).withMessage("El costo está fuera del rango permitido").toFloat()
};

const stockValidation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    return validator.optional().isDecimal({ decimal_digits: "0,3" }).withMessage("El stock debe ser válido y tener máximo 3 decimales")
        .bail().isFloat({ min: 0, max: 9999999.999 }).withMessage("El stock está fuera del rango permitido").toFloat()
};

const barcodeValidation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    return validator.optional({ values: "falsy" }).isString().withMessage("El código de barras debe ser texto")
        .trim().isLength({ max: 50 }).withMessage("El código de barras no puede superar los 50 caracteres")
};

export class ProductValidator{
    public static validateProductId = [ param("id").isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo"), validateRequest ];

    public static validateCategoryId = [ categoryValidation("id_category", "param"), validateRequest ];

    public static validateCreateProduct = [
        body().custom((value) => {
                if ( !value || typeof value !== "object" || Array.isArray(value)) throw new Error("Se deben enviar datos válidos");

                const fields = Object.keys(value);
                const invalidFields = fields.filter( field => !allowedFields.includes(field) );

                if (invalidFields.length > 0) throw new Error(`Campos no permitidos: ${invalidFields.join(", ")}`);
                return true; 
            }),

        nameValidation("name"),
        priceValidation("price"),
        costValidation("cost"),
        categoryValidation("id_category"),
        stockValidation("stock"),
        barcodeValidation("barcode"),
        validateRequest
    ];

    public static validateUpdateProduct = [
        body().custom((value) => {
                if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Se deben enviar datos para actualizar");

                const fields = Object.keys(value);

                if (fields.length === 0) throw new Error("Debes enviar al menos un campo para actualizar");

                const invalidFields = fields.filter( field => !allowedFields.includes(field) );

                if (invalidFields.length > 0) throw new Error(`Campos no permitidos: ${invalidFields.join(", ")}`);

                return true;
            }),

        nameValidation("name", "body", true),
        priceValidation("price", "body", true),
        costValidation("cost", "body", true),
        categoryValidation("id_category", "body", true),
        stockValidation("stock", "body", true),
        barcodeValidation("barcode", "body", true),
        validateRequest
    ];

}

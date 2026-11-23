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

const validation = (field: string, location: "body" | "param" = "body", optional: boolean = false) => {
    const validator = location === "body" ? body(field) : param(field);

    if(optional) validator.optional();

    switch (field) {
        case "id_category":
                return validator.isInt({ min: 1 }).withMessage("Category ID must be a positive valid integer");

        case "name":
                return validator.isString().withMessage("Name must be a string").trim().notEmpty().withMessage("Name is required")
                .isLength({ max: 150 }).withMessage("Name must be 150 characters long");

        case "cost":
                return validator.isDecimal({ decimal_digits: "0,2" }).withMessage("Cost must be a valid number with a maximum of 2 decimal places")
                    .bail().isFloat({ min: 0, max: 99999999.99 }).withMessage("Cost out of range").toFloat();

        case "price":
                return validator.isDecimal({ decimal_digits: "0,2" }).withMessage("Price must be a valid number with a maximum of 2 decimal places")
                    .bail().isFloat({ min: 0, max: 99999999.99 }).withMessage("Price out of range").toFloat();

        case "stock":
                return validator.isDecimal({ decimal_digits: "0,3" }).withMessage("Stock must be a valid number with a maximum of 3 decimal places")
                    .bail().isFloat({ min: 0, max: 9999999.999 }).withMessage("Stock out of range").toFloat();

        case "barcode":
                return validator.optional({ values: "falsy" }).isString().withMessage("Barcode must be a string")
                    .trim().isLength({ max: 50 }).withMessage("Barcode must be 50 characters long");

        default: throw new Error(`No validation defined for field: ${field}`);
    }
};

export class ProductValidator{
    public static validateProductId = [ param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"), validateRequest ];

    public static validateCategoryId = [ validation("id_category", "param"), validateRequest ];

    public static validateCreateProduct = [
        body().custom((value) => {
                if ( !value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid data");

                const fields = Object.keys(value);
                const invalidFields = fields.filter( field => !allowedFields.includes(field) );

                if (invalidFields.length > 0) throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
                return true; 
            }),

        validation("name"),
        validation("price"),
        validation("cost"),
        validation("id_category"),
        validation("stock"),
        validation("barcode"),
        validateRequest
    ];

    public static validateUpdateProduct = [
        body().custom((value) => {
                if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid data for update");

                const fields = Object.keys(value);

                if (fields.length === 0) throw new Error("You must send at least one field to update");

                const invalidFields = fields.filter( field => !allowedFields.includes(field) );

                if (invalidFields.length > 0) throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);

                return true;
            }),

        validation("name", "body", true),
        validation("price", "body", true),
        validation("cost", "body", true),
        validation("id_category", "body", true),
        validation("stock", "body", true),
        validation("barcode", "body", true),
        validateRequest
    ];

}

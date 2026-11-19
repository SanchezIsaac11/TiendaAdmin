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

// Campos permitidos para crear y actualizar productos
const allowedFields = [ "name", "price", "cost", "stock", "id_category", "barcode" ];

// Validar el ID del producto
export const validateProductId = [
    param("id").isInt({ min: 1 }).withMessage("El ID debe ser un número entero positivo"),
    validateRequest
];

// Validar el ID de la categoría
export const validateCategoryId = [
    param("categoryId").isInt({ min: 1 }).withMessage("El ID de la categoría debe ser un número entero positivo"),
    validateRequest ];

// Validar la creación de un producto
export const validateCreateProduct = [

    body()
        .custom((value) => {

            if ( !value || typeof value !== "object" || Array.isArray(value)) throw new Error("Se deben enviar datos válidos");

            const fields = Object.keys(value);

            const invalidFields = fields.filter( field => !allowedFields.includes(field) );

            if (invalidFields.length > 0) throw new Error(`Campos no permitidos: ${invalidFields.join(", ")}`);
            return true;
        }),

    body("name").isString().withMessage("El nombre debe ser texto").trim().notEmpty().withMessage("El nombre es obligatorio")
        .isLength({ max: 150 }).withMessage("El nombre no puede superar los 150 caracteres"),

    body("price").isDecimal({ decimal_digits: "0,2" }).withMessage("El precio debe ser válido y tener máximo 2 decimales")
        .bail().isFloat({ min: 0, max: 99999999.99 }).withMessage("El precio está fuera del rango permitido").toFloat(),

    body("cost").isDecimal({ decimal_digits: "0,2" }).withMessage("El costo debe ser válido y tener máximo 2 decimales")
        .bail().isFloat({ min: 0, max: 99999999.99 }).withMessage("El costo está fuera del rango permitido").toFloat(),

    body("stock").optional().isDecimal({ decimal_digits: "0,3" }).withMessage("El stock debe ser válido y tener máximo 3 decimales")
        .bail().isFloat({ min: 0, max: 9999999.999 }).withMessage("El stock está fuera del rango permitido").toFloat(),

    body("id_category").isInt({ min: 1 }).withMessage("La categoría debe ser un ID entero positivo").toInt(),

    body("barcode").optional({ values: "falsy" }).isString().withMessage("El código de barras debe ser texto")
        .trim().isLength({ max: 50 }).withMessage("El código de barras no puede superar los 50 caracteres"),

    validateRequest
];

// Validar la actualización de un producto
export const validateUpdateProduct = [

    body()
        .custom((value) => {

            if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Se deben enviar datos para actualizar");

            const fields = Object.keys(value);

            if (fields.length === 0) throw new Error("Debes enviar al menos un campo para actualizar");

            const invalidFields = fields.filter(
                field => !allowedFields.includes(field)
            );

            if (invalidFields.length > 0) throw new Error(`Campos no permitidos: ${invalidFields.join(", ")}`);

            return true;
        }),

    body("name").optional().isString().withMessage("El nombre debe ser texto").trim().notEmpty()
        .withMessage("El nombre no puede estar vacío").isLength({ max: 150 })
        .withMessage("El nombre no puede superar los 150 caracteres"),

    body("price").optional().isDecimal({ decimal_digits: "0,2" }).withMessage("El precio debe ser válido y tener máximo 2 decimales")
        .bail().isFloat({ min: 0, max: 99999999.99 }).withMessage("El precio está fuera del rango permitido").toFloat(),

    body("cost").optional().isDecimal({ decimal_digits: "0,2" }).withMessage("El costo debe ser válido y tener máximo 2 decimales")
        .bail().isFloat({ min: 0, max: 99999999.99 }).withMessage("El costo está fuera del rango permitido").toFloat(),

    body("stock").optional().isDecimal({ decimal_digits: "0,3" }).withMessage("El stock debe ser válido y tener máximo 3 decimales")
        .bail().isFloat({ min: 0, max: 9999999.999 }).withMessage("El stock está fuera del rango permitido").toFloat(),

    body("id_category").optional().isInt({ min: 1 })
        .withMessage("La categoría debe ser un ID entero positivo").toInt(),

    body("barcode").optional({ values: "falsy" }).isString().withMessage("El código de barras debe ser texto")
        .trim().isLength({ max: 50 }).withMessage("El código de barras no puede superar los 50 caracteres"),

    validateRequest
];
const { body } = require("express-validator");

exports.createEventValidator = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),

  body("description")
    .optional()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),

  body("date")
    .notEmpty().withMessage("Date is required")
    .isISO8601().toDate().withMessage("Date must be a valid date"),

  body("capacity")
    .notEmpty().withMessage("Capacity is required")
    .isInt({ min: 1 }).withMessage("Capacity must be a positive integer"),
];

exports.updateEventValidator = [
  body("title")
    .optional()
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),

  body("description")
    .optional()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),

  body("date")
    .optional()
    .isISO8601().toDate().withMessage("Date must be a valid date"),

  body("capacity")
    .optional()
    .isInt({ min: 1 }).withMessage("Capacity must be a positive integer"),
];

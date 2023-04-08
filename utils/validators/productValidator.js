const { check } = require("express-validator")
const validatorMiddleware = require("../../middlewares/validatorMiddleware")
const Category = require("../../models/categoryModel")
const SubCategory = require("../../models/subCategoryModel")

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 characters")
    .notEmpty()
    .withMessage("Product required"),
  check("description")
    .isLength({ max: 2000 })
    .withMessage("Too long description")
    .notEmpty()
    .withMessage("Product description is required"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product quantity must be a number")
    .isLength({ max: 200000 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .isFloat()
    .custom((value, { req }) => {
      if (req.body.price < value) {
        throw new Error("priceAfterDiscount must be lower than price")
      }
      return true
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("color should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("color should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid Id format")
    .custom((value) =>
      Category.findById(value).then((category) => {
        if (!category) {
          return Promise.reject(new Error(`No category for this id: ${value}`))
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id format")
    .custom((value) =>
      SubCategory.find({ _id: { $exists: true, $in: value } }).then(
        (result) => {
          if (result.length < 1 || result.length !== value.length) {
            return Promise.reject(
              new Error(`No subcategory for this id: ${value}`)
            )
          }
        }
      )
    )
    .custom((value, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = []
          subcategories.forEach((subcategory) => {
            subCategoriesIdsInDB.push(subcategory._id.toString())
          })
          // check if subcategories ids in db include subcategories in req.body (true/false)
          // sol_1
          // const checker = (target, arr) => target.every((v) => arr.includes(v))
          // if (!checker(value, subCategoriesIdsInDB)) {
          //   return Promise.reject(
          //     new Error(`Subcategories not belong to category: ${value}`)
          //   )
          // }
          // or sol_2
          if (!value.every((v) => subCategoriesIdsInDB.includes(v))) {
            return Promise.reject(
              new Error(`Subcategories not belong to category: ${value}`)
            )
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("Invalid Id format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be above or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
]

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID format"),
  validatorMiddleware,
]

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID format"),
  validatorMiddleware,
]

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID format"),
  validatorMiddleware,
]

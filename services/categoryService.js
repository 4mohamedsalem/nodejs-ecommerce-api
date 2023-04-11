const asyncHandler = require("express-async-handler")
const ApiFeatures = require("../utils/apiFeatures")
const factory = require("./handlersFactory")

const Category = require("../models/categoryModel")

// @desc    Get List of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  // Build query
  const documentsCounts = await Category.countDocuments()
  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .filter()
    .paginate(documentsCounts)
    .sort()
    .limitFields()
    .search()

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures
  const categories = await mongooseQuery

  res
    .status(200)
    .json({ results: categories.length, paginationResult, data: categories })
})

// @desc    Get specific category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = factory.getOne(Category)

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = factory.createOne(Category)

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = factory.updateOne(Category)

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(Category)

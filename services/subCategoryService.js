const asyncHandler = require("express-async-handler")
const ApiFeatures = require("../utils/apiFeatures")
const factory = require("./handlersFactory")

const SubCategory = require("../models/subCategoryModel")

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested Route
  if (!req.body.category) req.body.category = req.params.categoryId
  next()
}

// @desc    Create subCategory
// @route   POST /api/v1/subcategories
// @access  Private
exports.createSubCategory = factory.createOne(SubCategory)

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {}
  if (req.params.categoryId) filterObject = { category: req.params.categoryId }
  req.filterObj = filterObject
  next()
}

// @desc    Get List of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = asyncHandler(async (req, res) => {
  // Build query
  const documentsCounts = await SubCategory.countDocuments()
  const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .filter()
    .paginate(documentsCounts)
    .sort()
    .limitFields()
    .search()

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures
  const subCategories = await mongooseQuery

  res.status(200).json({
    results: subCategories.length,
    paginationResult,
    data: subCategories,
  })
})

// @desc    Get specific subcategory by id
// @route   GET /api/v1/subcategories/:id
// @access  Public
exports.getSubCategory = factory.getOne(SubCategory)

// @desc    Update specific subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = factory.updateOne(SubCategory)

// @desc    Delete specific subcategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(SubCategory)

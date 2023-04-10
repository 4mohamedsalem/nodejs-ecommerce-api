const slugify = require("slugify")
const asyncHandler = require("express-async-handler")
const ApiError = require("../utils/apiError")
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
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  })
  res.status(201).json({ data: subCategory })
})

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
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const subCategory = await SubCategory.findById(id)
  if (!subCategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404))
  }
  res.status(200).json({ data: subCategory })
})

// @desc    Update specific subcategory
// @route   PUT /api/v1/subcategories/:id
// @access  Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const { name, category } = req.body

  const subCategory = await SubCategory.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  )

  if (!subCategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404))
  }
  res.status(200).json({ data: subCategory })
})

// @desc    Delete specific subcategory
// @route   DELETE /api/v1/subcategories/:id
// @access  Private
exports.deleteSubCategory = factory.deleteOne(SubCategory)

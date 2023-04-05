const slugify = require("slugify")
const asyncHandler = require("express-async-handler")
const ApiError = require("../utils/apiError")

const SubCategory = require("../models/subCategoryModel")

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

// @desc    Get List of subcategories
// @route   GET /api/v1/subcategories
// @access  Public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1
  const limit = req.query.limit * 1 || 5
  const skip = (page - 1) * limit // (2-1) * 5 = 5

  let filterObject = {}
  if (req.params.categoryId) filterObject = { category: req.params.categoryId }

  const subCategories = await SubCategory.find(filterObject)
    .skip(skip)
    .limit(limit)
  // .populate({ path: "category", select: "name -_id" })
  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories })
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
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const subCategory = await SubCategory.findByIdAndDelete(id)

  if (!subCategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404))
  }
  res.status(204).send()
})

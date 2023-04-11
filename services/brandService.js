const asyncHandler = require("express-async-handler")
const ApiFeatures = require("../utils/apiFeatures")
const factory = require("./handlersFactory")

const Brand = require("../models/brandModel")

// @desc    Get List of brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
  // Build query
  const documentsCounts = await Brand.countDocuments()
  const apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .filter()
    .paginate(documentsCounts)
    .sort()
    .limitFields()
    .search()

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures
  const brands = await mongooseQuery

  res
    .status(200)
    .json({ results: brands.length, paginationResult, data: brands })
})

// @desc    Get specific brand by id
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = factory.getOne(Brand)

// @desc    Create brand
// @route   POST /api/v1/categories
// @access  Private
exports.createBrand = factory.createOne(Brand)

// @desc    Update specific brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = factory.updateOne(Brand)

// @desc    Delete specific brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(Brand)

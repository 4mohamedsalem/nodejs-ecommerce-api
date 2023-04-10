const slugify = require("slugify")
const asyncHandler = require("express-async-handler")
const ApiError = require("../utils/apiError")
const ApiFeatures = require("../utils/apiFeatures")
const factory = require("./handlersFactory")

const Product = require("../models/productModel")

// @desc    Get List of products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  // Build query
  const documentsCounts = await Product.countDocuments()
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .filter()
    .paginate(documentsCounts)
    .sort()
    .limitFields()
    .search("Products")

  // Execute query
  const { mongooseQuery, paginationResult } = apiFeatures
  const products = await mongooseQuery

  res
    .status(200)
    .json({ results: products.length, paginationResult, data: products })
})

// @desc    Get specific product by id
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name -_id",
  })
  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404))
  }
  res.status(200).json({ data: product })
})

// @desc    Create product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title)
  const product = await Product.create(req.body)
  res.status(201).json({ data: product })
})

// @desc    Update specific product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  if (req.body.title) {
    req.body.slug = slugify(req.body.title)
  }

  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  })

  if (!product) {
    return next(new ApiError(`No product for this id ${id}`, 404))
  }
  res.status(200).json({ data: product })
})

// @desc    Delete specific product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(Product)

const multer = require("multer")
const sharp = require("sharp")
const { v4: uuidv4 } = require("uuid")
const asyncHandler = require("express-async-handler")

const ApiError = require("../utils/apiError")
const factory = require("./handlersFactory")
const Category = require("../models/categoryModel")

// @desc    Get List of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = factory.getAll(Category)

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

// 1- DiskStorage engine
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories")
//   },
//   filename: function (req, file, cb) {
//     // category-$(id)-Date.now-.jpg
//     const ext = file.mimetype.split("/")[1]
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`
//     cb(null, filename)
//   },
// })

// 2- MemoryStorage engine
const multerStorage = multer.memoryStorage()

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true)
  } else {
    cb(new ApiError("Only Images allowed", 400), false)
  }
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.uploadCategoryImage = upload.single("image")

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`)

  next()
})

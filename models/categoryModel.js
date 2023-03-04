const mongoose = require("mongoose")
// 1- Create Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    // A and B => url(shopping.com/a-and-b)
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true } //create two fields in DB (createdAt, updatedAt)
)

// 2- Create Model
const CategoryModel = new mongoose.model("Category", categorySchema)

module.exports = CategoryModel

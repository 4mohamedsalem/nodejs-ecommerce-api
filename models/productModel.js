const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Too short product title"],
      maxLength: [64, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minLength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      max: [200000, "Too long product price"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],

    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Mongoose query middleware
productSchema.pre(/find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  })
  next()
})

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`
    doc.imageCover = imageUrl
  }
  if (doc.images) {
    const imagesList = []
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`
      imagesList.push(imageUrl)
    })
    doc.images = imagesList
  }
}
// findOne, findAll and update
productSchema.post("init", (doc) => {
  setImageURL(doc)
})
// create
productSchema.post("save", (doc) => {
  setImageURL(doc)
})

module.exports = mongoose.model("Product", productSchema)

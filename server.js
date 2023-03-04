const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")

dotenv.config({ path: "config.env" })
const dbConnection = require("./config/database")
const categoryRoute = require("./routes/categoryRoute")

// Connect with db
dbConnection()

// express app
const app = express()

// Middleware
app.use(express.json())

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"))
  console.log(`mode: ${process.env.NODE_ENV}`)
}

// Mount Routes
app.use("/api/v1/categories", categoryRoute)

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(500).json({ err })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`)
})

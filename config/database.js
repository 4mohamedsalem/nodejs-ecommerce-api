const mongoose = require("mongoose")

const dbConnection = () => {
  mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`)
  })
  // .catch((err) => {
  //  console.error(`Database Error: ${Error}`)
  //  process.exit(1)
  // })
}

module.exports = dbConnection

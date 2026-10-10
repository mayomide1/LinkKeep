require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()

app.use(cors())
app.use(express.json())

const port = process.env.port

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    app.use(port, () => console.log(`listening on port ${PORT}`))
})
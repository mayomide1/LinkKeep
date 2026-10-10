const mongoose = require("mongoose")

const linkKeepSchema = new mongoose.Schema(
    {

    },
    {
        timestamps : true
    }
)

module.exports = mongoose.model("Link", linkKeepSchema)
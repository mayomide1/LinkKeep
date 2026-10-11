const mongoose = require("mongoose");

const linkURLSchema = new mongoose.Schema(
  {
    linkName: {
      type: String,
      default: "",
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
        type: String,
        required: true,
    }
  },
  { timestamps: true }
);

const labelSchema = new mongoose.Schema(
  {
    labelName: {
      type: String,
      required: true,
      trim: true,
    },
    links: {
      type: [linkURLSchema], 
      default: [],
    },
    date:{
        type: String,
        required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Label", labelSchema);
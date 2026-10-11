require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Label = require("./link");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/labels", async (req, res) => {
  try {
    const labels = await Label.find();
    res.status(200).json(labels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/label", async (req, res) => {
  try {
    const label = await Label.create({
      labelName: req.body.labelName,
      link: [],
      date: new Date().toLocaleDateString("en-Ca"),
    });
    res.status(200).json(label);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/label/:labelId", async (req, res) => {
  try {
    const { labelId } = req.params;
    const label = await Label.findByIdAndDelete(labelId);

    if (!label) {
      res.status(400).json({ message: "Label not found" });
      return;
    }

    res
      .status(200)
      .json({ label, message: "Label has been deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/label/:labelId/links", async (req, res) => {
  try {
    const { labelId } = req.params;
    const label = await Label.findById(labelId);
    res.status(200).json(label);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/label/:labelId/links", async (req, res) => {
  try {
    const { linkURL, linkName } = req.body;
    const { labelId } = req.params;
    const label = await Label.findById(labelId);

    if (!label) {
      res.status(200).json({ message: "label not found" });
      return;
    }

    if (!linkURL) {
      res.status(400).json({ message: "Enter a URL" });
      return;
    }

    label.links.push({
      url: linkURL,
      linkName: linkName,
      date: new Date().toLocaleDateString("en-Ca"),
    });

    await label.save();

    res.status(200).json(label);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/label/:labelId/links/:linkId", async (req, res) => {
  try {
    const { labelId, linkId } = req.params;
    const label = await Label.findById(labelId);

    if (!label) {
      res.status(200).json({ message: "label not found" });
      return;
    }

    const link = label.links.id(linkId);

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    link.deleteOne();

    await label.save();

    res.status(200).json({ label, message: "Link deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.port;

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
});

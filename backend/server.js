require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const Label = require("./link")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/upload/label", async (req, res) => {
    try{
        const label = await Label.find()
        res.status(200).json(label)

    }catch(error){
        res.status(500).json({error: error.message})
    }
})

app.post("/upload/label", async (req, res) => {
    try{
        const label = await Label.create({
            name: req.body.label,
            link:[],
            date: new Date().toLocaleDateString("en-Ca")
        })
        res.status(200).json(label)

    }catch(error){
        res.status(500).json({error: error.message})
    }

})

const PORT = process.env.port

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, () => console.log(`listening on port ${PORT}`))
})
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const database = require('./database');
const app = express();

const upload = multer({ dest: 'uploads/' });



app.use(express.static(path.join(__dirname, 'build')));

app.get('images/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const readStream = fs.createReadStream(`./uploads/${imageName}`);
    readStream.pipe(res);
});

app.post("/api/images", upload.single('image'), async (req, res) => {
    const imagePath = req.file.path;
    const description = req.body.description;

    const image = await database.addImage(imagePath, description)
    res.send({image});
});

app.get("/api/images", async (req, res) => {
    const images = await database.getImages();
    res.send({images});
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
    });

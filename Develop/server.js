const express = require('express');
const logger = require('morgan');
const mongoose = require("mongoose");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect(process.env.MONGOD_URI || 'mongod://localhost/budget', {
    useNewUrlParser: true,
    useFindAndModify: false
});

//routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});
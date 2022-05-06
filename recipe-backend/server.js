// define and import dependencies
const express = require('express');
const dotenv = require('dotenv').config();

// initalize express server and port
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());

// define routes
app.use('/recipe', require("./routes/recipeRoutes"));

// start he server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
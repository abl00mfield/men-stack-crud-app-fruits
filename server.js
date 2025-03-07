//dependencies
const dotenv = require("dotenv"); // require package
const express = require("express");
const mongoose = require("mongoose");
const Fruit = require("./models/fruit.js");
const methodOverride = require("method-override");
const morgan = require("morgan");

//initialize the express app
const app = express();

//config code
dotenv.config(); // Loads the environment variables from .env file

//middleware
//body parser middleware: this function reads the request body and
//decodes it into req.body so we can access the data
app.use(express.urlencoded({ extended: false }));
//method override reads the _method query parameter for information
//about DELETE or PUT requesets

app.use(methodOverride("_method"));
//morgan middleware
app.use(morgan("dev"));

//initialize connection to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`);
});

//Get /
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

//path to a page with a form
// GET /fruits/new
app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs");
});

// POST /fruits
app.post("/fruits", async (req, res) => {
  if (req.body.isReadyToEat === "on") {
    req.body.isReadyToEat = true;
  } else {
    req.body.isReadyToEat = false;
  }
  await Fruit.create(req.body);
  res.redirect("/fruits");
});

// GET /fruits
//index route, designed to show our list of fruits
app.get("/fruits", async (req, res) => {
  const allFruits = await Fruit.find({});
  //pass to render a context object, gives the page the information it needs
  res.render("fruits/index.ejs", { fruits: allFruits });
});

//Get
//show fruit for individual fruits
app.get("/fruits/:fruitId", async (req, res) => {
  const foundFruit = await Fruit.findById(req.params.fruitId);
  res.render("fruits/show.ejs", { fruit: foundFruit });
});

app.delete("/fruits/:fruitId", async (req, res) => {
  await Fruit.findByIdAndDelete(req.params.fruitId);
  res.redirect("/fruits");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

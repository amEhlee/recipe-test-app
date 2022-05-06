const router = require("express").Router();
const fs = require("fs");
const colors = require("colors");

// sample methods 
function getFileContents() {
  fs.readFile("../recipe-backend/resources/data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    recipieList = JSON.parse(data);
  });
}

function updateFileContents(givenNewList) {
  fs.writeFile(
    "../recipe-backend/resources/data.json",
    JSON.stringify(givenNewList),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
}

// load file file contents
let recipieList = {};
getFileContents();

// PART 1: GET ALL RECIPES
router.route("/").get((req, res) => {
  let jsonToReturn = {
    recipeNames: [],
  };

  recipieList.recipes.map((recipe) => {
    jsonToReturn.recipeNames.push(recipe.name);
  });

  console.log('successfully obtained all recipe names'.underline.blue) // outputs red underlined text
  res.json(jsonToReturn);
});

// PART 2 GET RECIPE BY GIVEN NAME
router.route("/details/:givenName").get((req, res) => {
  let recipeToReturn = {};

  recipieList.recipes.map((recipe) => {
    if (recipe.name === req.params.givenName) {
      recipeToReturn = {
        details: {},
      };
      recipeToReturn.details.ingredients = recipe.ingredients;
      recipeToReturn.details.numSteps = recipe.instructions.length;
    }
  });

  if (recipeToReturn.details !== undefined) {
    console.log('successfully obtained specific recipe information'.underline.blue) // outputs red underlined text
    res.json(recipeToReturn);
  } else {
    res.json({});
  }
});

// PART 3 POST NEW RECIPE
router.route("/").post((req, res) => {
  // extract recipe from body and add to json file
  let newRecipe = req.body;

  // use .some to check for revelant recipe
  if (!recipieList.recipes.some((recipe) => recipe.name === newRecipe.name)) {
    recipieList.recipes.push(newRecipe);

    // save written recipe
    updateFileContents(recipieList);

    // return success message
    console.log('successfully posted new recipe'.underline.blue) // outputs red underlined text
    res.status(201).json();
  }

  res.status(400).json({
    error: "Recipe already exists",
  });
});

// PART 4 UPDATE EXISTING RECIPE
router.route("/").put((req, res) => {
  // extract recipe from body and add to json file
  let newRecipe = req.body;
  console.log("trying new stuffz")

  for (let i = 0; i < recipieList.recipes.length; i++) {
    if (recipieList.recipes[i].name === newRecipe.name) {
      recipieList.recipes[i] = newRecipe;
      updateFileContents(recipieList);
      res.status(204).json();
      console.log('successfully updated prexisting recipe'.underline.blue) // outputs red underlined text
      return;
    }
  }

  res.status(400).json({
    error: "Recipe does not exist!",
  });
});

module.exports = router;

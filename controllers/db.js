// const DishModel = require("../models/Dish");
const DietLogModel = require("../models/DietLog");
const GoalsModel = require("../models/Goal");
const UserModel = require("../models/User");
const DietModel = require("../models/Diet");

const models = {
  // Dish: DishModel,
  DietLog: DietLogModel,
  Goals: GoalsModel,
  User: UserModel,
  Diet: DietModel
};

// Pass the following two keys in request body
// {
//     "collection": "Dish",
//     "query": {}
// }
exports.read = async function (req, res) {
  const { query, collection } = req.body;
  const model = models[collection];

  model.find(query, (error, docs) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(docs);
    }
  });
};

exports.readOnly = async function (req) {
  console.log(`REQUEST readOnly: ${JSON.stringify(req)}`);
  const { collection, query } = req;
  const model = models[collection]
  try {
    return await model.find(query);
  }
  catch (error) {
    console.error(`ERROR readOnly: ${error}`);
  }
};

// Pass the following two keys in request body
// {
//     "collection": "Dish",
//     "query": []
// }
exports.create = async function (req, res) {
  const { query, collection } = req.body;

  const model = models[collection];

  model.insertMany(query, (error, docs) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(docs);
    }
  });
};

// Pass the following two keys in request body
// {
//     "collection": "Dish",
//     "query": {}
// }
exports.del = async function (req, res) {
  const { query, collection } = req.body;
  if (!Object.keys(query).length) {
    res.status(200).send("Empty query provided!");
  } else {
    const model = models[collection];

    model.find(query).remove((error, acknowledgement) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(acknowledgement);
      }
    });
  }
};

// Pass the following key in request body
// {
//     "collection": "Dish",
// }
exports.emptyCollection = async function (req, res) {
  const { collection } = req.body;

  const model = models[collection];

  model.find({}).remove((error, acknowledgement) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(acknowledgement);
    }
  });
};

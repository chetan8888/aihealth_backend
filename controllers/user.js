const UserModel = require("../models/User");

exports.update = (req,res) => {
  const { filter, replacement } = req.body;
  UserModel.findOneAndUpdate(filter, replacement, (error,doc) => {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(doc);
    }
  })
} 
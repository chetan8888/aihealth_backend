const axios = require("axios");

const commonParams = {
  app_id: process.env.APP_ID,
  app_key: process.env.APP_KEY,
  type: "public",
};

// q is required in request body
exports.keywordSearch = (req, res) => {
  var config = {
    method: "get",
    url: "https://api.edamam.com/api/recipes/v2",
    headers: {},
    params: {
      ...commonParams,
      ...req.body
    }
  };

  axios(config)
    .then(function (response) {
      res.status(200).send(response.data);
    })
    .catch(function (error) {
      res.send(error);
      res.status(500).send(error);
    });
};

// id is required in request body
exports.recipe = async (req, res) => {
  var config = {
    method: "get",
    url: `https://api.edamam.com/api/recipes/v2/${req.body.id}`,
    headers: {},
    params: {
      ...commonParams,
      ...req.body
    }
  };

  axios(config)
    .then(function (response) {
      res.status(200).send(response.data);
    })
    .catch(function (error) {
      res.status(500).send(error);
    });
};

exports.topSearch = async (key) => {
  const config = {
    method: "get",
    url: "https://api.edamam.com/api/recipes/v2",
    headers: {},
    params: {
      ...commonParams,
      q: key
    }
  };
  try {
    const response = await axios(config);
    console.log("HITS", response.data.hits.length)
    if (response && response.data.hits.length) {
      return response.data.hits[0].recipe;
    }
    return undefined;
  }
  catch (err) {
    console.error(err);
    return null;
  }
};
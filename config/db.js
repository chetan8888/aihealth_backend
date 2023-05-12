const mongoose = require("mongoose");

async function connect() {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));

  db.once("open", function () {
    console.log("Connected successfully");
  });
}

module.exports = {
  connect,
};

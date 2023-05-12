const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./config/db");

// load env vars
dotenv.config({ path: "./config/config.env" });

//connect to the db
db.connect();

// route files
const auth = require("./routes/auth");
const recipe = require("./routes/recipe");
const dbRoute = require("./routes/db");
const diet = require("./routes/diet");
const report = require("./routes/report");
const recommend = require("./routes/recommend");
const user = require("./routes/user");
const goal = require("./routes/goal");

const app = express();

// Making Build Folder as Public
app.use(express.static(path.join(__dirname, "..", "client", "build")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// cors
app.use(cors());
// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Cookie parser
app.use(cookieParser());

// For python script using Node.js
// const { spawn } = require('child_process');

// const pythonScript = spawn('python3', ["./test.py", 'arg1', 'arg2', 'arg2']);

// pythonScript.stdout.on('data', (data) => {
//   // console.log(`stdout: ${data}`);
//   const result = data.toString().trim();
//   const words = result.split("\n");
//   console.log(words, words.length);
// });

// pythonScript.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`);
// });

// pythonScript.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });

// mount routers
app.use("/api/v1/auth", auth);
app.use("/api/v1/recipe", recipe);
app.use("/api/v1/db", dbRoute);
app.use("/api/v1/diet", diet);
app.use("/api/v1/report", report);
app.use("/api/v1/recommend", recommend);
app.use("/api/v1/user", user);
app.use("/api/v1/goal", goal);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

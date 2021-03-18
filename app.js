const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const auth_routes=require("./routes/auth_routes/auth");
const worker_routes=require("./routes/worker_routes/worker");
const manager_routes=require("./routes/manager_routes/manager");
const task_routes=require("./routes/task_routes/task");
const file_routes=require("./routes/file_routes/file");

dotenv.config();
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL_LOCAL,
    }),
  })
);

app.use("",auth_routes);
app.use("/worker",worker_routes);
app.use("/manager", manager_routes);
app.use("/task",task_routes);
app.use("/file",file_routes);


app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started");
});

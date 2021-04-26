const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const db = require("./app/models");
const Role = db.role;

// db.sequelize.sync();

db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and Resync Database with { force: false }");
  initial();
});

app.get("/", (req, res) => {
  res.json({ message: "Schlaf Project" });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/room.routes")(app);
require("./app/routes/lease.routes")(app);
require("./app/routes/bill.routes")(app);
require("./app/routes/income.routes")(app);
require("./app/routes/blog.routes")(app);
require("./app/routes/notify.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "owner",
  });

  Role.create({
    id: 3,
    name: "guest",
  });
}

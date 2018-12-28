const express = require("express");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("../db/db.js");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.json());

app.get("/pledges/:id", (req, res) => {
  db.select()
    .where({ id: req.params.id })
    .from("pledges")
    .then(result => {
      result[0].pledged = Number(result[0].pledged);
      res.status(200);
      result[0].devEnv = process.env.NODE_ENV;
      result[0].test = process.env.TEST;
      result[0].update = "true";
      res.json(result[0]);
    })
    .catch(err => {
      console.log("There was an error getting info from DB", err);
      res.sendStatus(500);
    });
});

app.post("/pledges", (req, res) => {
  db("pledges")
    .where({ id: req.body.id })
    .increment({
      pledged: req.body.pledge_amount,
      backer_count: Number(!req.body.hasBacked)
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      console.log("There was an error updating pledge amount in db: ", err);
      res.sendStatus(500);
    });
});

module.exports = app;

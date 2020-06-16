const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

const Datastore = require("nedb");
const db = new Datastore({ filename: "./storage.db" });
db.loadDatabase();

function fibonacci(n, memo = {}) {
  if (n in memo) {
    return memo[n];
  }
  if (n <= 1) {
    return 1;
  }
  return (memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo));
}

function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

app.get("/fibonacci/:number", async (req, res) => {
  await wait(600);
  const number = +req.params.number;
  if (number === 42) {
    return res.status(400).send("42 is the meaning of life");
  }
  if (number > 50) {
    return res.status(400).send("number can't be bigger than 50");
  }
  if (number < 1) {
    return res.status(400).send("number can't be smaller than 1");
  }
  const result = fibonacci(number);
  const obj = { number, result, createdDate: Date.now() };
  db.insert(obj, (err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(obj);
    }
  });
});

app.get("/getFibonacciResults", async (req, res) => {
  await wait(600);
  db.find({}, (err, docs) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send({ results: docs });
    }
  });
});

const PORT = 5050;
app.listen(5050, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

const router = require("express").Router();
const Test = require("../db/models/test");

router.get("/", async (req, res, next) => {
  try {
    const tests = await Test.findAll();
    res.send(tests);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let singleTest = await Test.findById(req.params.id);
    res.send(singleTest);
  } catch (error) {
    next(error);
  }
});

router.post("/student/:id", async function(req, res, next) {
  try {
    let newTest = await Test.create({where:

    }req.body);
    res.status(201).send(newTest);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

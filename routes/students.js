const router = require("express").Router();

// Call in the Model DIRECTLY
const Student = require("../db/models/student");

// (6) retrieves students via GET
// app.use("/students", students); from app.js
// ⤷ router.get("/student", code...)
router.get("/", async (req, res, next) => {
  try {
    // findByAll
    const allStudents = await Student.findAll();
    res.json(allStudents);
  } catch (error) {
    next(error);
  }
});

// single student by id route
router.get("/:id", async function(req, res, next) {
  try {
    // pull id from req.params.id by DIRECTLY passing it into .findById(req.params.id)
    const singleStudent = await Student.findById(req.params.id);
    // if student exists...
    if (singleStudent) {
      //..send that student as a response
      res.send(singleStudent);
    } else {
      //...else 404 that bitch
      res.status(404).send("Student not found");
    }
  } catch (err) {
    next(err);
  }
});

// create student instance
router.post("/", async function(req, res, next) {
  try {
    // pass in req.body DIRECTLY because it's ALREADY an object
    const newStudent = await Student.create(req.body);
    res.status(201).send(newStudent);
  } catch (error) {
    next(error);
  }
});

//update student instance
router.put("/:id", async function(req, res, next) {
  try {
    // pass in req.body DIRECTLY because it's ALREADY an object
    console.log(req.body);
    const updatedStudent = await Student.update(
      {
        firstName: req.body.firstName
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    res.status(200).send(updatedStudent);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

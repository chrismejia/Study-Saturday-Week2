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
    res.json(singleStudent);
  } catch (err) {
    res.status(404).send(err);
  }
});
//

module.exports = router;

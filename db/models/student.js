"use strict";

const Sequelize = require("sequelize");
const db = require("../db");

// Creating the student model based on specs
const Student = db.define("student", {
  // (1) includes `firstName`, `lastName`, and `email` fields
  // (2) requires first name
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // (3) requires last name
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  // (4) requires email
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      // (5) requires email to be in an email form
      isEmail: true
    }
  }
});

// Defining the hook `beforeCreate` as a class method (directly on the model)
// (6) beforeCreate hook should capitalize the first letters of the student's first name and last name
Student.beforeCreate((user, options) => {
  // this is currently a promise
  // capitalize the first letter of first and last name
  // console.log(user.firstName[0].toUpperCase());
  let fName = user.firstName;
  let lName = user.lastName;

  fName = fName[0].toUpperCase() + fName.slice(1);
  lName = lName[0].toUpperCase() + lName.slice(1);

  user.firstName = fName;
  user.lastName = lName;

  // returning the user object with modified properties
  return user;
});

// Student.beforeCreate

// => http://docs.sequelizejs.com/manual/tutorial/hooks.html

module.exports = Student;

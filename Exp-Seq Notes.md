# Study-Saturday 2: Express-Sequelize Guide

Version 1.2 by Christian Mejia

_\*\*NB: These are my review notes more than they are a definitive guide to Express/Sequelize. As such, there are bound to be errors or typos; if you see any, please let me know so that they can be addressed._

---

_If you haven't already tried this, [visit the repo](https://github.com/FullstackAcademy/Study-Saturday-Week2), fork/clone, then `git checkout cycle-1` to get started._

_Just want to see the answers? `git checkout solution`._

---

## The `Students` model

### 1 - Includes `firstName`, `lastName`, and `email` field definitions

Three parameters are explicitly ones we need to define here in our `Student` model.

The base we started with goes from...

```js
// Our base
const Student = db.define();

// becomes...

const Student = db.define("student", {
  // (1) includes `firstName`, `lastName`, and `email` fields
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  }
});
```

We're setting up our fields as objects of their own to allow for additional options _(like validations)_ to be set.

### 2,3,4 - Requires `firstName`, `lastName` and `email`

These three have the same implementation so we can address them together. `requires` in the spec can be read as, _"cannot be blank" or "must be defined"_. `allowNull` is just the tool for these jobs; set it to `false` to ensure that each of the three fields can not be blank.

```js
const Student = db.define("student", {
  firstName: {
    type: Sequelize.STRING,
    // (2) requires `firstName`
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    //(3) requires `lastName`
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    // (4) requires `email`
    allowNull: false
  }
});
```

### 5 - Requires `email` to be in an email form

This is specifically aimed at the `email` definition we've written so far.

```js
email: {
  type: Sequelize.STRING,
  allowNull: false
}
```

The same way that `allowsNull` ensures that we don't allow empty strings, `isEmail` will `validate` that anything submitted as an email is in fact an email.

```js
email: {
  type: Sequelize.STRING,
  allowNull: false,
  // validations other allowNull need to be placed in a separate validate block
  validate: {
  // (5) require email to be a proper email
    isEmail: true
  }
}
```

### 6 - Capitalizes the first and last name before saving to the db

The test asks for a `pre-create` hook. [Of the many Sequelize hooks available](http://docs.sequelizejs.com/manual/tutorial/hooks.html), `beforeCreate` will do the job for us here. [There are three ways to declare hooks](http://docs.sequelizejs.com/manual/tutorial/hooks.html#declaring-hooks); arguably the most straight forward is to add it directly to the `model` the same way you'd declare a class method.

#### Sequelize Hook Method Example

```js
//   Model  Hook  Row Object
//   ↙       ↓       ↓
Student.someHook(student => {
  /* All fields defined on the model are available in the callback via the row object.

      - student.firstName
      - student.lastName
      - student.email
  */
});
```

We can just grab the row object, modify its `.properties` and return the whole user object again - no need to worry about individually returning modified fields.

```js
Student.beforeCreate(student => {
  // Grab first and last name for ease of use
  const nameFirst = student.firstName;
  const nameLast = student.lastName;

  // Capitalize the first letter of each; tag on the rest of the original string
  student.firstName = nameFirst[0].toUpperCase() + nameFirst.slice(1);
  student.lastName = nameLast[0].toUpperCase() + nameLast.slice(1);
});
```

---

## The `Tests` model

### 7 – Includes subject and grade field definitions

Combined with 8,9 below for brevity.

### 8,9 – Requires subject and grade

```js
const Test = db.define();

// becomes...

const Test = db.define("tests", {
  subject: {
    // (7) includes subject
    type: Sequelize.STRING,
    // (8) requires grade
    allowNull: false
  },
  grade: {
    // (7) includes grade
    type: Sequelize.INTEGER,
    // (9) requires grade
    allowNull: false
  }
});
```

### 10 – Belongs to a Student

[There are 'one-to-one', 'one-to-many' and 'many-to-many' associations in Sequelize.](http://sequelize-guides.netlify.com/association-types/) Here, the test spells out which **'one-to-one'** it's looking for, **belongsTo**.

```js
Test.belongsTo(Student);
```

That one line will create `magic methods`; important because of what the test spec will be looking to do on line 178.

```js
/*01_models_test.js:178*/ return createdTest.setStudent(createdStudent);
```

---

## `Student` Routes

One important thing to note about the `student` routes is that the app is using `'/students'` in the students route file:

```js
/*app.js:15*/ app.use("/students", students);
```

This means all student routes have a default starting point of `'/students'`, _**not**_ `'/'`.

e.g. Entering `'/students'` will result in `'/students/students'`; something to keep in mind if you think your code is right but it's not passing the tests.

### `GET /students`

### **↳ 11 - retrieves all the students**

Anytime we make a database call, we want to use a combo of `async/await` and `try/catch` blocks to ensure that we have all the necessary information before proceeding.

On `'/students'`, we want to `findAll` students and send them back in the response.

```js
router.get("/", async (req, res, next) => {
  try {
    const students = await Student.findAll();
    res.send(students);
  } catch (error) {
    next(error);
  }
});
```

### `GET /students/:id`

### ↳ 12 – Can retrieve a single student by their id

The `:id` in `GET /students/:id` is our clue that we're dealing with `params` here. `params` are found on the `request` object with the param name being whatever has a colon in front of it in the route; in this case `:id`.

We can pull the student's id via `req.params.id` use it to `findById` to narrow our `response` down to a single student.

```js
router.get("/:id", async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id);
    res.send(student);
  } catch (error) {
    next(error);
  }
});
```

### ↳ 13 – Returns a 404 if student does not exist in DB

An `if/else` inside the `try` block will help us handle what to do with our `findById`:

- **success**: the student exists, respond with the student
- **failure**: no student with id exists; respond with 404 and message

We can structure it out like so:

```js
router.get("/:id", async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.id);

    if (student) {
      // success
      res.send(student);
    } else {
      // failure
      res.status(404).send("Student not found");
    }
  } catch (error) {
    next(error);
  }
});
```

### `POST /students`

### ↳ 14 – Can create a new Student instance

We want to create a new `student` with the information from the request body...

```js
let student = await Student.create(req.body);
```

and then respond with a `201 (Created)` and send back the created `student`.

```js
res.status(201).send(student);
```

Stick these inside the `try` block in the usual route setup using the `POST` method and you're good to go.

```js
router.post("/", async (req, res, next) => {
  try {
    let student = await Student.create(req.body);
    res.status(201).send(student);
  } catch (err) {
    next(err);
  }
});
```

### `PUT /students/:id`

### ↳ 15 – Allows us to update a Student instance

`Model.update()` can be tricky to setup right; it takes in two objects:

- the first: the info you want to update
- the second contains:
  - the query defining `where` to look for instances to update
  - `returning: true` – this tells `.update` to not just update, but also return the updated instance to you to do whatever with
  - `plain: true` – this tells `.update` _all returned things_ are just plain objects

_NB: if the last two don't make sense, just know that setting both to `true` allows you to have the updated info to `respond` with._

#### Model update setup example

```js
try {
  let updatedInfo = await Model.update(
    { selectedFieldToUpdate: changedValue },
    {
      where: {
        someField: matchesOldValueOrParam
      },
      returning: true,
      plain: true
    }
  );
} catch (err) {
  next(err);
}
```

Additionally, we're also pulling some elements from other route methods we've already defined:

- `req.params.id`: we're pulling a variable from the route address to use here in the same way we did we handled the `GET /:id` route (see **#12**).
- `req.body`: the information in the request body is conveniently already an object in the format we need so we can use in the `.update` (see **#14**).

We can throw in all the above plus a `res.send(updatedStudentInfo)`...

```js
router.put("/:id", async (req, res, next) => {
  try {
    let updatedStudentInfo = await Student.update(req.body, {
      where: { id: req.params.id },
      returning: true,
      plain: true
    });
    res.send(updatedStudentInfo);
  } catch (err) {
    next(err);
  }
});
```

...run the test again and...

```js
AssertionError: expected undefined to equal 'Salty'
```

...it fails.

Something in `updatedStudentInfo` is `undefined` and it's failing the spec. A quick `console.log(updatedStudentInfo)` reveals that `updatedStudentInfo` is actually an array of two things:

```js
[ undefined,          //<- first array entry
  student {           //<- second array entry
    dataValues:
     { id: 14,
       firstName: 'Salty',
       lastName: 'Potts',
       email: 'saltn@pepper.com',
       createdAt: 2018-10-08T23:24:54.179Z,
       updatedAt: 2018-10-08T23:24:54.202Z },
  // truncated here; lots of other entries in 'student' obj...
  }
```

Looks like we want **just** the second array entry, the `student` object, to respond with.

```js
router.put("/:id", async (req, res, next) => {
  try {
    let updatedStudentInfo = await Student.update(req.body, {
      where: { id: req.params.id },
      returning: true,
      plain: true
    });
    res.send(updatedStudentInfo[1]); // <-- Second entry in array
  } catch (err) {
    next(err);
  }
});
```

Sure enough, the spec now passes.

### `DELETE /students/:id`

### ↳ 16 – Can delete a Student instance

I'll never forget this one because even though the method says `DELETE`, we'll be `destroy`ing this poor student. We want to `destroy` the student whose `id` matches the one pulled from the route. A `204 No Content` is appropriate here since we're not looking for content in the response.

```js
router.delete("/:id", async (req, res, next) => {
  try {
    await Student.destroy({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});
```

Say good bye, Charlie Brown.

---

## `Test` Routes

These tests are mostly rehashings of earlier `Student` route problems. References where appropriate.

### `GET /tests`

### ↳ 17 – Retrieves all tests

A direct callback to **#11**. Use `async/await` with `try/catch` blocks and you're good. Switch out `student` for `test`.

**Keys:** `.findAll`

### `GET /tests/:id`

### ↳ 18 – Gets the test instance by id

Another two part `GET` request in the same vein as **#12**. Replace `student` with `test` and it's the same exact answer as before.

**Keys:** `findById`, `req.params.id`, `if/else`

### `POST /tests/student/:studentId`

### ↳ 19 – Creates a new Test instance for a Student

Not as straightforward as the last two. This one has a couple of steps we have to follow:

1. Find the `student` in the DB
2. Create the `test` with the `req.body`
3. Assign the `test` to the `student`
3a. remember the association from **#10?** ➔ `Test.belongsTo(Student)`
3b. `.setStudent()` finally gets to prove its usefulness
4. Finally, send back a `201` with the created and assigned `studentTest`

```js
router.post("/student/:studentId", async (req, res, next) => {
  try {
    let student = await Student.findById(req.params.studentId); // 1
    let test = await Test.create(req.body); // 2
    let studentTest = await test.setStudent(student); // 3
    res.status(201).send(studentTest); // 4
  } catch (err) {
    next(err);
  }
});
```

### `DELETE /tests/:id`

### ↳ 20 – Deletes an instance of test by its id

Homestretch. Made even sweeter by the fact that this last one is a rehash of **#16**. For the last time, replace `student` with `test`.

**Keys:** `.destroy`, `{where block}`, `req.params.id`, `.sendStatus(204)`

---

**If you made it this far, thanks for reading and I hope it helped you the way writing this out helped me. Hit me up on Slack.**

## 🏁 FIN 🏁

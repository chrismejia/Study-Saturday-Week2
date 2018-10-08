# Study-Saturday 2: Express-Sequelize Guide

### **Version 1.1 by Christian Mejia**

## ![Visit the Study-Saturday 2 repo](https://dl1.cbsistatic.com/i/r/2017/04/06/719fd995-db78-4f39-b386-f0b3769a6644/thumbnail/64x64/b1f2be5a659b10a7d8a39bca6763e5b4/imgingest-1709774419801055667.png "Visit the Study-Saturday 2 repo") To see the solution code all written out, [visit the repo](https://github.com/FullstackAcademy/Study-Saturday-Week2), then `git checkout solution`.

## The `Students` model

### 1 - Includes `firstName`, `lastName`, and `email` field definitions

Three parameters are explicitly ones we need to defines here in our Student model.

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

We're setting up our fields as objects of their own to allow for additional options (like validations) to be set.

### 2,3,4 - Requires `firstName`, `lastName` and `email`

These three all have the same implementation so we can address them all together. 'requires' in the spec can be read as, _"cannot be blank" or "must be defined"_. `allowNull` is just the tool for these jobs; set it to `false` to ensure that each of the three fields can not be blank.

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

This is specifically aimed at the email definition we've written so far.

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

The test asks for a `pre-create` hook. [Of the many Sequelize hooks available](http://docs.sequelizejs.com/manual/tutorial/hooks.html), `beforeCreate` will do the job for us here. There are three ways to declare hooks; arguably the most straight forward is to add it directly to the `model` the same way you'd declare a class method.

#### Method 3 – as a class method

```js
Student.beforeCreate((student, options) => {

  });
});
```

We can just grab the user object, modify its `.properties` and return the whole user object again - no need to worry about directly returning modified strings.

```js
Student.beforeCreate(student => {
  const nameFirst = student.firstName;
  const nameLast = student.lastName;

  student.firstName = nameFirst[0].toUpperCase() + nameFirst.slice(1);
  student.lastName = nameLast[0].toUpperCase() + nameLast.slice(1);
});
```

---

## The `Tests` model

### 7 – Includes subject and grade field definitions

See #1 above.

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

### 10 – Associates the Test as belonging to a Student

```js
Test.belongsTo(Student);

// seriously, that simple
```

## Routes – Student Section

### 11 – Can retrieve all students

### 12 – Can retrieve a single student by their id

### 13 – Returns a 404 if student does not exist in DB

### 14 – Can create a new Student instance

### 15 – Allows us to update a Student instance

### 16 – Can delete a Student instance

## Routes – Test Section

### 17 – Can retrieve all tests

### 18 – Can retrieve a specific Test instance

### 19 – Can create a new Test instance for a Student

### 20 – Can delete a Test instance

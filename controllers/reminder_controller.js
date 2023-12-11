// change database location
// change "cindy"
// look at each function and integrate
// import authenticated user from user controller
// req.user.reminders
const fs = require("fs")

let database = require("../models/userModel").database;
// let authUser = require("../controllers/userController").getUserByEmailIdAndPassword

let remindersController = {
  list: (req, res) => {
    res.render("reminder/index", { reminders: req.user.reminders });
  },


  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: req.user.reminders });
    }
  },

  create: (req, res) => {
    console.log(req.file)
    let reminder = {
      id: req.user.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
      cover: ""
    };

    // Case 1: User uploads image
    if (req.file) {
      fs.rename(req.file.path, "public/uploads/" + req.file.originalname, () => {
            reminder.cover = "/uploads/" + req.file.originalname
            console.log(reminder.cover)
      })
    }

    // if (req.file) {
    //   reminder.cover = "public/uploads/" + req.file.originalname
    // }

    // Case 2: User checks random cover checkbox
    if (req.body.randomCover == "true") {
      fetch("https://api.unsplash.com/photos/random")
        .then(response => response.json())
        .then(data => {
          reminder.cover = data.urls[0].full
        }).then(console.log(data))
    }

    // Case 3: user chooses nothing, just empty string
    req.user.reminders.push(reminder);
    res.redirect("/reminder/" + req.params.id);
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  update: (req, res) => {
    reminderToEdit = req.params.id;
    for (let reminder of req.user.reminders) {
      if (reminder.id == reminderToEdit) {
        reminder.title = req.body.title;
        reminder.description = req.body.description;
        
        if (req.body.completed == "true") {
          reminder.completed = true;
        }
        else {
          reminder.completed = false;
        }
      }
    }
    res.redirect("/reminder/" + req.params.id);
  },

  delete: (req, res) => {
    let reminderToDelete = req.params.id;
    let arrayIndexNumber = reminderToDelete - 1;
    req.user.reminders.splice(arrayIndexNumber, 1);
    res.render("reminder/index", { reminders: req.user.reminders });
  }}


module.exports = remindersController;

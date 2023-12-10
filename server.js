// remider for self - must also make changes in the views so users information is shown
// fs rename.rename
// req.file.filename
// req.file.originalname



const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const path = require("path");
const reminderController = require("./controllers/reminder_controller")
const port = process.env.port || 8000;

// add multer
const multer = require("multer")
const upload = multer({ dest: "public/uploads" })

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

const passport = require("./middleware/passport");
const ensure = require("./middleware/checkAuth").ensureAuthenticated
const authRoute = require("./routes/authRoute");
const indexRoute = require("./routes/indexRoute");

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log(req.session.passport);
  next();
});

// change to render user homepage (reminder index views) - Jordan
app.use("/", indexRoute);

// look at usermodels, change code to sift new database.js, not usermodels database - Jordan
app.use("/auth", authRoute);

// 
// app.use("/admin", indexRoute);

// Imported routes from original file
// ensure authenticated - in middleware = ensure
app.get("/reminders", ensure, reminderController.list);
app.get("/reminder/new", ensure, reminderController.new);
app.get("/reminder/:id", ensure, reminderController.listOne);
app.get("/reminder/:id/edit", ensure, reminderController.edit);
app.post("/reminder/", upload.single('cover'),  ensure, reminderController.create);
// ⭐ Implemented in Sprint 1 - Jordan
app.post("/reminder/update/:id", ensure, reminderController.update);
app.post("/reminder/delete/:id", ensure, reminderController.delete);





app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});

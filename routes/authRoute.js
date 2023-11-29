const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));


// if successful login, send to reminders ejs
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/reminder/index",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

// route to destroy a session - Kody
router.get("/destroy/:sid", (req, res) => {
  const sid = req.params.sid
  req.sessionStore.destroy(sid, (err) => {
    if (err) {
      console.log(err);
    }
  })
  res.redirect("/admin")
})

module.exports = router;

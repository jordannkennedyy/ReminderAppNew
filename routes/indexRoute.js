const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const { Session } = require("express-session")

router.get("/", (req, res) => {
  res.send("welcome");
});

// change to render user homepage (reminder index views) Jordan
router.get("/views/index", ensureAuthenticated, (req, res) => {
  res.render("index", {
    user: req.user,
  });
});

// Admin page for admin users - Kody
router.get("/admin", isAdmin, (req, res) => {
  req.sessionStore.all((err, sessions) => {
    const parsedSessions = JSON.parse(JSON.stringify(sessions))
   
    res.render("dashboard", { 
      user: req.user, 
      sessions: parsedSessions
    })
  })
})

module.exports = router;

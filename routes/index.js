var express = require('express');
var router = express.Router();
const userModel = require("./users")
const addRemider = require("./add")
const passport = require("passport")
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

router.get("/", isLoggedIn, function (req, res) {
  userModel.find()
    .then(function (all) {
      res.render("index", { all })
    })
})

router.post("/register", function (req, res) {
  const userData = new userModel({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    mobile: req.body.mobile
  })
  userModel.register(userData, req.body.password)
    .then(function (registerUser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile")
      })
    }).catch(function (err) {
      res.redirect("/login")
    })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function (req, res) { })

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) throw err;
    res.redirect("/login")
  });
})

router.get("/login", function (req, res) {
  res.render("login")
})

router.get("/add", async function (req, res) {
  // await userModel.findOne({ _id: req.params.id })
  res.render("add")
})

router.post("/:id/add", isLoggedIn, function (req, res) {
  addRemider.create({
    date: req.body.date,
    subject: req.body.subject,
    textarea: req.body.textarea,
    email: req.body.email,
    mobile: req.body.mobile,
    sms: req.body.sms,
    days: req.body.days
  }).then(function (data) {
    res.redirect("/list")
  }).catch(function (e) {
    res.send(e)
  })
})

router.get("/list", isLoggedIn, function (req, res) {
  addRemider.find()
    .then(function (data) {
      res.render("list", { data })
    })
})

router.get('/delete/:id', async function (req, res, next) {
  addRemider.findOneAndDelete({ _id: req.params.id })
    .then(function (data) {
      res.redirect("/profile")
    })
});


router.get("/dis", function (req, res) {
  res.render("dis");

})
router.get("/en", function (req, res) {
  res.render("en")
})

router.get("/:id/update", function (req, res) {
  res.render("update")
})

router.post('/:id/update', isLoggedIn, function (req, res, next) {
  addRemider.updateOne(
    {
      date: req.body.date,
      subject: req.body.subject,
      textarea: req.body.textarea,
      email: req.body.email,
      mobile: req.body.mobile,
      sms: req.body.sms,
      days: req.body.days
    }
  )
    .then(function (data) {
      res.redirect("/list")
    })
})

router.get("/register", function (req, res) {
  res.render("register")
})

router.get("/profile", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user })
    .then(function (foundUser) {
      res.render("profile", { foundUser })
    })
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login")
}

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) throw err;
    res.redirect("/")
  });
});


module.exports = router;

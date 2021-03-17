const isLoggedInManager = (req, res, next) => {
  if (req.session.user && req.session.user.access === "manager") {
    next();
  } else {
    res.redirect("/login");
  }
};
const isLoggedInWorker = (req, res, next) => {
  if (req.session.user && req.session.user.access === "worker") {
    next();
  } else {
    res.redirect("/login");
  }
};

module.exports.isLoggedInManager = isLoggedInManager;
module.exports.isLoggedInWorker = isLoggedInWorker;

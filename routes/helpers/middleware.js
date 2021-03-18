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

const isLoggedInCommon=(req,res,next)=>{
  if(req.session.user){
    res.redirect(`/${req.session.user.access}/dashboard`);
  }else{
    next();
  }
}

module.exports.isLoggedIn={
  manager:isLoggedInManager,
  worker:isLoggedInWorker,
  common:isLoggedInCommon
}

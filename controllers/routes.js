module.exports = function(app,product,User,Cart){

app.get("/",loggedIn,function(req,res){
  product.find({},function(err,result){
    if(err) res.send("error occured");
    res.render("home",{"products": result});
  });
});

app.get("/product",loggedIn,function(req,res){
  product.findById(req.query.id,function(err,result){
    res.render("product",{product : result});
  });
});


function loggedIn(req, res, next) {

    if (req.isAuthenticated()){
      return next();

    } else {
        res.redirect('/login');
    }
}

app.get("/login", function(req,res){
  res.render("login" , { message : req.flash("login")});
});

app.get("/signup", function(req,res){

	res.render("signup", {err: "", message: ""});

});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect('/');
});

app.get("/addToCart",loggedIn,function(req,res){
  var product = new Cart({
    user_id : req.user._id,
    product_id : req.params.id,
  });

  product.save(function(){
    console.log("Product added to Cart");
    res.redirect("/");
  });

});

};

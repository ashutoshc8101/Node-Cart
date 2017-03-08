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
    product_id : req.query.id,
  });

  product.save(function(){
    console.log("Product added to Cart");
    res.redirect("/cart");
  });

});


app.get("/cart",loggedIn,function(req,res){
  var products = [];
  var count = 0;
  Cart.find({'user_id' : req.user._id},function(err,result){
      if(result.length > 0){
      for(i=0;i<result.length;i++){
        product.findById(result[i].product_id, function(err,data){
          products.push(data);
          count++;
          if(count === result.length){
            console.log(products);
            res.render("cart",{'products': products, "req":req});
          }
        });
      }
    }else{
      res.render("cart",{"products": false, "req":req});
    }
  });
});

app.get("/removeProduct",loggedIn,function(req,res){

  Cart.findOneAndRemove({"user_id": req.user._id, "product_id" : req.query.id },function(err,result){
    res.redirect("/cart");
  });

});


};

/* jshint esversion: 6 */
module.exports = function(app,braintree,Cart,product,Order,Transaction){

  var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "y4gcr9vq3y99mc9t",
    publicKey: "h2tmd3xmx5tgzr6c",
    privateKey: "e0ad3b3a3c8813bdedfba89d1f7ea835"
  });

  function loggedIn(req, res, next) {

      if (req.isAuthenticated()){
        return next();

      } else {
          res.redirect('/login');
      }
  }

  app.get("/checkout",loggedIn,function(req,res){

    var products = [];
    var count = 0;
    Cart.find({'user_id' : req.user._id},function(err,result){
        if(result.length > 0){
        for(i=0;i<result.length;i++){
          product.findById(result[i].product_id, function(err,data){
            products.push(data);
            count++;
            if(count === result.length){

              gateway.clientToken.generate({}, function (err, response) {

                res.render("checkout",{'products': products, "token" : response.clientToken});

              });
            }
          });
        }
      }else{
        res.redirect("/");
      }
    });



  });

  app.post("/checkout",loggedIn,function(req,res){

    var products = [];
    var count = 0;
    Cart.find({'user_id' : req.user._id},function(err,result){
        if(result.length > 0){
        for(i=0;i<result.length;i++){
          product.findById(result[i].product_id, function(err,data){
            products.push(data);
            count++;
            if(count === result.length){
              var amount = 0;
              for(i=0;i<products.length;i++){
                amount += products[i].Price;
              }
              var nonceFromTheClient = req.body.payment_method_nonce;
               gateway.transaction.sale({
                amount: amount,
                paymentMethodNonce: nonceFromTheClient,
                options: {
                  submitForSettlement: true
                }
              }, function (err, result) {
                var productId = [];
                for(i=0;i<products.length;i++){
                  productId.push({product_id : products[i]._id});
                }
                if(result.success){
                  var trans_id = result.transaction.id;
                  var trans = new Transaction({
                    user_id : req.user._id,
                    transaction_id: result.transaction.id,
                    createdAt : result.transaction.createdAt,
                  });
                  trans.save(function(err,data){

                    var order = new Order({
                      user_id : req.user._id,
                      transaction_id : result.transaction.id,
                      Reciever_Name : req.body.Name,
                      Reciever_Email : req.body.email,
                      Reciever_Contact : req.body.contact,
                      Reciever_Address : req.body.address,
                      Reciever_PIN : req.body.pin,
                      Products : productId,
                    });

                    order.save(function(err,result){
                      if(err) throw err;
                      Cart.remove({"user_id": req.user._id},function(err,result){
                        res.send("Transaction Done.");
                      });
                    });


                  });


                }
              });
            }
          });
        }
      }else{
        res.redirect("/");
      }
    });

  });

};

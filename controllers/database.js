/*jshint esversion:6 */
const mongoose = require('mongoose');

// Connecting to databse //
mongoose.connect("mongodb://localhost/shoppingCart");

mongoose.connection.once("open",function(req,res){
  console.log("Connected to mongoDB");
});

// Creating Schema //

var CartSchema = mongoose.Schema({
  user_id : mongoose.Schema.Types.ObjectId,
  product_id : mongoose.Schema.Types.ObjectId,
});

var mySchema = mongoose.Schema({
  Title : String,
  Description : String,
  Price : Number,
  Image : String,
  Stock : Number,
});

var UserSchema = mongoose.Schema({
  Username: String,
  Email: String,
  Password : String,
});

var OrderProductIdSchema = mongoose.Schema({
  product_id : mongoose.Schema.Types.ObjectId,
});

var OrderSchema = mongoose.Schema({
  user_id : mongoose.Schema.Types.ObjectId,
  transaction_id : String,
  Reciever_Name : String,
  Reciever_Email : String,
  Reciever_Contact : String,
  Reciever_Address : String,
  Reciever_PIN : String,
  Products : [OrderProductIdSchema],
});



var transactionSchema = mongoose.Schema({
  user_id : mongoose.Schema.Types.ObjectId,
  transaction_id: String,
  createdAt : String,
});

var Cart = mongoose.model("Cart",CartSchema);
var product = mongoose.model("product", mySchema);
var User = mongoose.model("User",UserSchema);
var Order = mongoose.model("Order",OrderSchema);
var Transaction = mongoose.model("Transaction",transactionSchema);

module.exports = [product,User,Cart,Order,Transaction];

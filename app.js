var express = require('express'); // Get the library
var bodyParser = require('body-parser'); // Lets use body parser
var mongoose = require('mongoose'); // Get the mongoose library

var app = express(); // Create app object
// lets define a schema to be used with the Shirt model
var shirtSchema = mongoose.Schema({
 sex    : {type: String},// required: true},
 design : {type: String},// required: true},
 color  : {type: String},// required: true},
 size   : {type: String},// required: true}
 qty    : {type: Number} // required: true}
});
// lets create a Shirt model using the abovementioned shirtSchema
var Shirt = mongoose.model('Shirt', shirtSchema);

// Lets setup a connection to mongo from mongoose
mongoose.connect('mongodb://localhost/shirtOverstock');
// create a mongoose connection object to attach event listener
var db = mongoose.connection;
// let's attach an event listener for connection errors
db.on('error', console.error.bind(console, 'connection error:'));
// let's attach an event listener to run one time when the connection opens
db.once('open', function(someData){
 console.log('COOL! we are connected to mongo');
});

// Let's put a shirt in the database
Shirt.create({
  sex   :'Unisex',
  design: 'ABC123',
  color : 'purple',
  size  : 'XL',
  qty   : 3
  }, function(err,shirtThatGotSaved){
 if (err) {
   //log the error so the developer understands there is an error
   console.log('Error saving shirt', err);
   alert('Error saving shirt', err);
   // exit out of this function with return
   return;
 }
 else {
   console.log('successfully saved ' + shirtThatGotSaved);
 }
});

// Middleware
app.use(function(request, response, next){
 console.log('request received %s %s ', request.method, request.url); // string interpolation
 next(); //continuation
});

app.use(bodyParser.json());

app.get('/', function(request, response){
 response.sendFile(__dirname + '/index_jquery.html');
});

// lets GET a list of all our shirts
app.get('/shirts', function(request, response){
 Shirt.find({}, function(err, shirts){
 if(err){
   console.log(err);
   return;
 }
 response.json(shirts);
 });
});

// lets POST request - CREATE a new shirt through Postman
app.post('/shirts', function(request,response){
 console.log(request.body);
 // Let's put a shirt in the database
 Shirt.create(request.body, function(err,shirtThatGotSaved){
   if (err) {
     //log the error so the developer understands there is an error
     console.log(err);
     // exit out of this function with return
     return;
   }
   else {
     console.log('successfully saved ' + shirtThatGotSaved);
     response.json(shirtThatGotSaved)
   }
 });
});

// lets GET an individual shirt by id
app.get('/shirts/:id', function(request, response){
 //lets find the shirt using mongoose
 Shirt.findOne({_id: request.params.id}, function(err, shirt){
   if(err){
     console.log(err);
     return
   }
   response.json(shirt);
 });
});

// lets DELETE an individual shirt by id
app.delete('/shirts/:id', function(request, response){
 Shirt.findOneAndRemove({_id: request.params.id}, function(err, shirt){
   if(err) {
     console.log(err);
     return;
   }
   console.log('successfully destroyed shirt with id ', request.params.id);
   response.json({'message':"successfully deleted"})
   // response.redirect(200, '/shirts');
 });
});

// patch (jimmy did not show how to update a shirt)
app.patch('/shirts/:id', function(request, response){
 var shirtToBeUpdated;
 shirts.forEach(function(el){
   // debugger
   if (el.id === Number(request.params.id)) {
   console.log(request.params);
   console.log('we found the shirt ' + el.name);
   shirtToBeUpdated = shirts.indexOf(el);
   console.log((shirts[shirtToBeUpdated]).name = "NEW BOOK NAME")
   }
 });
 response.json(shirts);
});

// server
app.listen(3000, function(){
 console.log('Server started!!'); //messages in the server
});

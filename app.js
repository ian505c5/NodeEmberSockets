
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = module.exports = express();
var io = require('socket.io').listen(app.listen(port))


var data =   /* sample recipe data */
    [
        {"title": "Gazpacho",
            "ingredients": "Ingredients: 2 onions, 2 garlic cloves peeled and minced, 1 cup of chopped green pepper, 2 cups water, 2 teaspoons salt, 1/3 teaspoon black pepper, 1/3 cup red wine vinegar, 1 cup peeled and chopped cucumber, 5 tablespoons olive oil",
            "directions": "Combine the onions, garlic, green peppers and tomatoes. Force through a sieve or puree in a blender. Add the salt, pepper and paprika. Add the olive oil gradually, beating steadily. Add the vinegar and water and stir well. Season to taste. Refrigerate and chill for at least two hours"},
        {"title": "Balsamic Mushrooms",
            "directions": "Place all ingredients in a (preferably nonstick) pan and let sit for a few minutes. Then cook covered over medium heat for about three minutes until they are soft. Remove the cover and cook until the liquid is almost gone, then serve.",
            "ingredients": "12 mushrooms, 1/4 cup balsamic vinegar, 1/8 cup red wine"}
    ];
var port = process.env.PORT || 3000;
console.log("Listening on port"+port);
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  //app.use(express.cookieParser('your secret here'));
  //app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname+'/build')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/recipes', function(req, res) {
    res.send(data);
});


//SET up Instagram
Instagram = require('instagram-node-lib');

Instagram.set('client_id', '8ee1ba3320fb4f58bc25261e0f56542c');
Instagram.set('client_secret', 'efb38cf744ab415fbfc4d3e1b734907b');
Instagram.set('callback_url', 'http://fathomless-basin-1390.herokuapp.com/callback');
Instagram.set('redirect_url', 'http://fathomless-basin-1390.herokuapp.com/');
Instagram.set('maxSockets', 10);

Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: 'dogs',
  aspect: 'media',
  callback_url: 'http://fathomless-basin-1390.herokuapp.com/callback',
  type: 'subscription',
  id: '#'
});

io.sockets.on('connection', function(socket){
  Instagram.tags.recent({
    name: 'dogs',
    complete: function(data){
      socket.emit('firstShow', { firstShow: data });
    }
  });
});
app.get('/callback', function(req,res){
  var handshake = Instagram.subscriptions.handshake(req, res);
});
app.post('/callback', function(req, res){
  var data = req.body;

  data.forEach(function(tag){
    var url = 'https://api.instagram.com/v1/tags/'+tag.object_id+'/media/recent?client_id=8ee1ba3320fb4f58bc25261e0f56542c';
    sendMessage(url);
  });
});

function sendMessage(url){
  io.sockets.emit('show', { show: url });
};

http.createServer(app);

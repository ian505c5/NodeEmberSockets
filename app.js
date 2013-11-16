
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , https = require('https')
  , path = require('path');
  var port = process.env.PORT || 3000;
  var app = module.exports = express();
  var server = http.createServer(app);
  var io = require('socket.io').listen(server);
  server.listen(port)

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


//SET up Instagram
Instagram = require('instagram-node-lib');

Instagram.set('client_id', '8ee1ba3320fb4f58bc25261e0f56542c');
Instagram.set('client_secret', 'efb38cf744ab415fbfc4d3e1b734907b');
Instagram.set('callback_url', 'http://embernode.herokuapp.com/callback');
Instagram.set('redirect_url', 'http://embernode.herokuapp.com/');
Instagram.set('maxSockets', 10);

Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: 'dogs',
  aspect: 'media',
  callback_url: 'http://embernode.herokuapp.com/callback',
  type: 'subscription',
  id: '#'
});

io.configure(function(){
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
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
  console.log('handshake');
  var handshake = Instagram.subscriptions.handshake(req, res);
});

app.post('/callback', function(request, response){
  // request.body is a JSON already parsed
  request.body.forEach(function(tag){
    // Every notification object contains the id of the geography
    // that has been updated, and the photo can be obtained from
    // that geography
    https.get({
      host: 'api.instagram.com',
      path: 'https://api.instagram.com/v1/tags/'+tag.object_id+'/media/recent?client_id=8ee1ba3320fb4f58bc25261e0f56542c'
    }, function(res){
      var raw = "";

      res.on('data', function(chunk) {
        raw += chunk;
      });

      // When the whole body has arrived, it has to be a valid JSON, with data,
      // and the first photo of the date must to have a location attribute.
      // If so, the photo is emitted through the websocket
      res.on('end', function() {
        var response = JSON.parse(raw);
        if(response['data'].length > 0 && response['data'][0]['location'] != null) {
          sendMessage(raw);
        } else {
          console.log('no response');
        }
      });

    });
  });

  response.writeHead(200);
});

function sendMessage(raw){
  io.sockets.emit('show', { show: raw });
};



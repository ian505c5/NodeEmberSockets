
/*
 * GET home page.
 */

exports.index = function(req, res){
 	var handshake = Instagram.subscriptions.handshake(req, res);
  	res.sendfile('./build/index.html');
};
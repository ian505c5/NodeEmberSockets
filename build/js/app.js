var socket = io.connect('http://fathomless-basin-1390.herokuapp.com');	
TestApp = Ember.Application.createWithMixins({
	
	ready: function() {  // this triggers an AJAX call to Clojure REST interfac	
		var mostRecent = function(){
			socket.on('firstShow', function(data){
				console.log(data);
			});
		}

		mostRecent();
	}
});


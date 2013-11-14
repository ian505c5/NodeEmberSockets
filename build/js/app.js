
TestApp = Ember.Application.createWithMixins({
	
	ready: function() {  // this triggers an AJAX call to Clojure REST interfac	
		var mostRecent = function(){
			var socket = io.connect();	
			socket.on('firstShow', function(data){
				console.log(data);
			});
		}

		mostRecent();
	}
});


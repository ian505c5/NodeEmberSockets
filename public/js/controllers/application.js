TestApp.ApplicationController = Ember.Controller.extend({
  init: function(){
  	var socket = io.connect('http://localhost:3000');

	var mostRecent = function(){
		var that = this;
		socket.on('firstShow', function(data){
			var	poop = data.firstShow;
			$(poop).each(function(){
				var img = document.createElement('img');
				$(img).attr('src', this.images.standard_resolution.url);
				$('.images-container').append(img);
			})
		});
	}

	var getData = function() {
	    var self = this;	    
	    socket.on('show', function(data) {
	        var url = JSON.parse(raw);
	        console.log(url);
	    });
	}

	mostRecent();
	getData();

  }
});



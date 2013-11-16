TestApp.ApplicationController = Ember.Controller.extend({
  init: function(){
  	var socket = io.connect();

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
	        var url = JSON.parse(data);
	        var img = document.createElement('img');
			$(img).attr('src', url.data[0].images.low_resolution.url);
			$('.images-container').append(img);
	    });
	}

	mostRecent();
	getData();

  }
});



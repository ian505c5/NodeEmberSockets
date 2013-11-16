TestApp.ApplicationController = Ember.Controller.extend({
  init: function(){
	var mostRecent = function(){
		var that = this;
		var socket = io.connect('http://localhost');	
		socket.on('firstShow', function(data){
			that.instaData = data;
		});
	}

	var getData = function() {
	    var self = this;
	    socket.on('show', function(data) {
	        var url = data.show;
	        $.ajax({
	            url: url,
	            type: 'POST',
	            crossDomain: true,
	            dataType: 'jsonp'
	        }).done(function (data) {
	            console.log(data);
	        }); 
	    });
	}

	mostRecent();
	getData();

  }
});



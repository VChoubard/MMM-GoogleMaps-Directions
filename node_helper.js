var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({


    socketNotificationReceived: function(notification, payload) {
        if (notification == "HTTP_GET") {
            this.httpGet(payload);
        }
    },

    httpGet: function(params) {
        var https = require('https');
        //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
        var options = {
          host: 'maps.googleapis.com',
          path: '/maps/api/directions/json?key=' + params.apikey + '&origin=' + params.origin + '&destination=' + params.destination + '&mode=' + params.mode
        };

        console.log(options.path);

        https.get(options, function(response) {
            var str = '';
            //another chunk of data has been recieved, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been recieved, so we just print it out here
            response.on('end', function () {
                this.sendSocketNotification("HTTP_GET", JSON.parse(str));
            }.bind(this));
        }.bind(this));
    }
});



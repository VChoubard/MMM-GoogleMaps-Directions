Module.register("MMM-GoogleMaps-Directions",{
    // Default module config.
    defaults: {
        apikey: 'your_api_key',
        origin: 'your_origin_here',
        destination: 'your_origin_here',
        baseurl: 'https://maps.googleapis.com/maps/api/directions/json?key=',
        mode: 'transit'
    },



    start: function() {
        this.loaded = false;
        this.steps = [];
        this.event = {};
        setInterval(function() {
            this.updateDom(); // no speed defined, so it updates instantly.
        }.bind(this), 1000);
    },

    getDom: function() {
        var divWrapper = document.createElement("div");
        var ulWrapper = document.createElement("ul");
        var innerDiv = document.createElement("div");

        if (this.event.startDate) {
            var timeLeft = new Date(this.event.startDate).toString('H:mm:ss');
            innerDiv.innerHTML = timeLeft;
            divWrapper.appendChild(innerDiv);
        }
        divWrapper.appendChild(ulWrapper);
        for (var index = 0; index < this.steps.length; index++) {
            var step = this.steps[index];
            var liWrapper = document.createElement("li");
            liWrapper.innerHTML = step.html_instructions;
            ulWrapper.appendChild(liWrapper);
        }


        return divWrapper;
    },

    getStyles: function() {
        return [
            this.file('MMM-GoogleMaps-Directions-Directions.css')
        ]
    },

    notificationReceived: function(notification, payload, sender) {
        if (notification === "CALENDAR_EVENTS" && sender.name === "calendar") {
            if (payload) {
                this.event = payload[0];
                this.config.destination = encodeURI(this.event.location);
                this.config.origin = encodeURI(this.config.origin);
                this.sendSocketNotification("HTTP_GET", this.config);
            }

        }
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "HTTP_GET") {
            if (payload.status === "OK") {
                this.steps = payload.routes[0].legs[0].steps
            }
        }

    },
});
(function () {
    'use strict';
    
    function WeatherInterface() {
        var html;
        var network = new Lampa.Reguest();

        this.create = function () {
            html = $('<div class="weather-widget">' +
                    '<div class="weather-temp" id="weather-temp"> </div>' +
                    '<div class="weather-condition" id="weather-condition"></div>' +
                    '</div>');
        };

        this.getWeatherData = function () {
            var lat = 47.8388; // Широта Запорожья
            var lon = 35.1396; // Долгота Запорожья
            var API_KEY = "46a5d8546cc340f69d9123207242801";
            var url = 'http://api.weatherapi.com/v1/current.json?key=' + API_KEY + '&q=' + lat + ',' + lon + '&lang=ru&aqi=no';

            network.clear();
            network.timeout(5000);
            network.silent(url, processWeatherData, processError);
        };

        function processWeatherData(result) {
            var data2 = result.current;
            var temp = Math.floor(data2.temp_c); // Температура
            console.log("Погода", "Температура: " + temp);
            var condition = data2.condition.text; // Обстановка
            console.log("Погода", "Обстановка: " + condition);

            $('#weather-temp').text(temp + '°');
            $('#weather-condition').text(condition).toggleClass('long-text', condition.length > 10);
        }

        function processError() {
            console.log('Error retrieving weather data');
        }

        this.getWeather = function () {
            this.getWeatherData();
        };

        this.render = function () {
            return html;
        };

        this.destroy = function () {
            if (html) {
                html.remove();
                html = null;
            }
        };
    }

    var weatherInterface = new WeatherInterface();
    var isTimeVisible = true;

    $(document).ready(function () {
        setTimeout(function(){
            weatherInterface.create();
            var weatherWidget = weatherInterface.render();
            $('.head__time').after(weatherWidget);

            function toggleDisplay() {
                if (isTimeVisible) {
                    $('.head__time').hide();
                    $('.weather-widget').show();
                } else {
                    $('.head__time').show();
                    $('.weather-widget').hide();
                }
                isTimeVisible = !isTimeVisible;
            }

            setInterval(toggleDisplay, 10000);

            weatherInterface.getWeather();

            $('.weather-widget').hide();
            var width_element = document.querySelector('.head__time');
            console.log(width_element.offsetWidth);
            $('.weather-widget').css('width', width_element.offsetWidth + 'px');
            $('.head__time').css('width', width_element.offsetWidth + 'px');
        }, 5000);
    });
})();

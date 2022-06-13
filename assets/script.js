var citySearchEl = document.querySelector("#cityName");
var prevCitiesEl = document.querySelector("#previous");
var currentEl = document.querySelector("#current");
var citySearchName = document.querySelector("#searched-name");
var formEl = document.querySelector("#form");
var prevCityEl = document.querySelector("#prevCity");

var hide = function () {
    var hidden = document.querySelector(".hide");
    hidden.style.display = "none";
};

var formHandler = function (event) {
    event.preventDefault();
    var city = citySearchEl.value.trim();

    if (city) {
        getCoord(city);
        currentEl.textContent = "";
        citySearchEl.value = "";
        var prevBtn = document.createElement("button");
        prevBtn.innerHTML = city
        prevBtn.setAttribute("class", "btn prevCity");
        prevBtn.setAttribute("id", "prevCity");
        prevCitiesEl.append(prevBtn);
        localStorage.setItem("city", city);
        
    } else {
        alert("please enter a city");
    }
};

var buttonHandler = function (event) {
    console.log("button clicked");
    currentEl = "";
    var city = event.target.innerHTML;
    console.log(city);

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=7603d8e28781b21e8f2815d93189974e";
    var response = fetch(apiUrl)

    fetch(apiUrl).then(function (response) {
        // console.log(response);
        response.json().then(function (data) {
            console.log(data);
            useCoord(data.coord.lat, data.coord.lon, data.name);
        })
    });

};

var getCoord = function (city) {
    var city = citySearchEl.value.trim();
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=7603d8e28781b21e8f2815d93189974e";
    var response = fetch(apiUrl)

    fetch(apiUrl).then(function (response) {
        // console.log(response);
        response.json().then(function (data) {
            console.log(data);
            useCoord(data.coord.lat, data.coord.lon, data.name);
        })
    });
};

var useCoord = function (lat, lon, city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7603d8e28781b21e8f2815d93189974e"
    var response = fetch(apiUrl)
    fetch(apiUrl).then(function (response) {
        console.log(response);
        response.json().then(function (data) {
            // console.log(data);
            // console.log(city);
            renderWeather(city, data);
            fiveDay(data);
        })
    })
};

var renderWeather = function (cityName, cityData) {
    console.log(cityData);
    citySearchName.textContent = cityName
    var currentTemp = document.createElement("p");
    var currentWind = document.createElement("p");
    var currentHumidity = document.createElement("p");
    var currentUvEl = document.createElement("p");
    var currentIcon = document.createElement("img");
    var currentDate = document.createElement("h3");
    var date = cityData.current.dt

    currentDate.innerHTML = dayjs.unix(date).format('MM/DD/YYYY');
    currentEl.appendChild(currentDate);


    currentTemp.textContent = "Temp: " + cityData.current.temp + " °F";
    currentEl.appendChild(currentTemp);


    currentWind.textContent = "Wind speed: " + cityData.current.wind_speed + " mph";
    currentEl.appendChild(currentWind);


    currentHumidity.textContent = "Humidity: " + cityData.current.humidity + "%";
    currentEl.append(currentHumidity)


    currentUvEl.textContent = "UV index: " + cityData.current.uvi;
    currentEl.appendChild(currentUvEl);

    var colorCode = function () {
        if (cityData.current.uvi < 3) {
            currentUvEl.setAttribute("class", "card low");
        } else if (cityData.current.uvi >= 3 || cityData.current.uvi <= 6) {
            currentUvEl.setAttribute("class", "card medium");
        } else if (cityData.current.uvi > 6) {
            currentUvEl.setAttribute('class', 'card high');
        }
    };



    var storedData = JSON.stringify(cityData);
    localStorage.setItem(cityName, storedData);
    colorCode();

};


var fiveDay = function (data) {
    for (let i = 0; i < 5; i++) {
        var date = data.daily[i].dt
        var fiveDayTemp = document.createElement("p");
        var fiveDayWind = document.createElement("p");
        var fiveDayHumidity = document.createElement("p");
        var fiveDayIcon = document.createElement("img");
        var fiveDayDate = document.createElement("h3");

        fiveDayDate.innerHTML = dayjs.unix(date).format('M/D/YYYY');
        document.querySelector("#day-" + (i + 1)).appendChild(fiveDayDate)

        fiveDayIcon.setAttribute("src", "http://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png");
        document.querySelector("#day-" + (i + 1)).appendChild(fiveDayIcon);

        fiveDayTemp.textContent = "Temperature: " + data.daily[i].temp.day + " °F";
        document.querySelector("#day-" + (i + 1)).appendChild(fiveDayTemp);

        fiveDayWind.textContent = "Wind Speed: " + data.daily[i].wind_speed + " mph";
        document.querySelector("#day-" + (i + 1)).appendChild(fiveDayWind);

        fiveDayHumidity.textContent = "Humidity: " + data.daily[i].humidity + "%";
        document.querySelector("#day-" + (i + 1)).appendChild(fiveDayHumidity);




    }
};

var loadCities = function() { 
    for (i = 0; i < prevCitiesEl.length; i++) {
        var city = localStorage.getItem(i);
        prevBtn.innerHTML = city
        prevBtn.setAttribute("class", "btn prevCity");
        prevBtn.setAttribute("id", "prevCity");
        prevCitiesEl.append(prevBtn);     
    }
};

prevCitiesEl.addEventListener("click", buttonHandler);
formEl.addEventListener("submit", formHandler);
hide();

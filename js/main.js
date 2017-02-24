"use strict";
//namespaces
var APP4CAST_PAGE = {};
var APP4CAST_DATA = {};
//
APP4CAST_DATA.position = "45.4215,-75.6972";     //Default Value
APP4CAST_DATA.googleLocation = "Ottawa";  //Default Value
//
APP4CAST_DATA.getGeoLocation = function () {
    //
    var options = {
        enableHighAccuracy: false,  //No GPS
        timeout: 1000 * 30,         //1000 times 30 = 30 seconds
        maximumAge: 1000 * 60 * 60  //1000 * 60 * 60 = 1 hour
    };
    //
    function success(pos) {
        //
        var crd = pos.coords;
        APP4CAST_DATA.position = crd.latitude+","+crd.longitude;
        // console.log(crd.latitude);
        // console.log(crd.longitude);
        // console.log(APP4CAST_DATA.position);
        APP4CAST_DATA.getGoogleAPIData();
        APP4CAST_DATA.getExternalData();
        //
    };
    //
    function error(err) {
        var errors = {
            1: 'Sorry your browser did not have permissions to get your location.',
            2: 'Unable to determine your location.',
            3: 'Location request took too long.'
        };
        console.log("Error getGeoLocation: " + errors[error.code] + "... " + err.message );
        APP4CAST_DATA.position = "45.4215,-75.6972";
        APP4CAST_DATA.getExternalData();
    };
    //
    navigator.geolocation.getCurrentPosition(success, error, options);
    //
};
//
APP4CAST_DATA.getExternalData = function () {
    //
    let url =  "./php/forecast.php";
    if (APP4CAST_DATA.position != null){
        url += "?latlng="+APP4CAST_DATA.position;
    }
    //
    let headers = new Headers();
    headers.append("Content-Type", "text/plain");
    headers.append("Accept", "application/json; charset=utf-8");
    //
    let params = {
        method: 'GET',
        mode: 'cors',
        headers: headers
    };
    let req = new Request(url, params);
    //
    //
    //
    fetch(req).then(function(response){   // fetch("./db/test.json").then(function(response){
        //
        return response.json();
        //
    }).then(function(jData){
        //
        APP4CAST_PAGE.buildPage(jData);
        //
    }).catch(function(err){
        //
        alert("MESSAGE: "+err.message)
    });
};
//
APP4CAST_DATA.getGoogleAPIData = function () {
    //get location name
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ APP4CAST_DATA.position;
    //
    fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(jsonResponse){
            if (jsonResponse.status == "OK"){
                APP4CAST_DATA.googleLocation = jsonResponse.results[0].address_components[2].short_name;
                if (APP4CAST_DATA.googleLocation.indexOf("-") != -1){
                    APP4CAST_DATA.googleLocation = APP4CAST_DATA.googleLocation.substr(0,APP4CAST_DATA.googleLocation.indexOf("-"));
                }
            } else {
                APP4CAST_DATA.googleLocation = "Ottawa";
            }
        })
        .catch( function(error){
            APP4CAST_DATA.googleLocation = "Ottawa";
            console.log("Error: getGoogleAPIData - "+error);
        });
}
//
APP4CAST_PAGE.buildPage = function (jsonData) {
    //
    let dTemp = ("°C");
    //
    let header = document.querySelector("header");
    //
    let banner = APP4CAST_PAGE.createNewDOM("div","banner","","");
    let h1 = APP4CAST_PAGE.createNewDOM("h1","","","24<span>cast</span>");
    let iconW = APP4CAST_PAGE.createNewDOM("i","wi "+APP4CAST_PAGE.findIconClass(jsonData.currently.icon),"iconW","");
    let summW = APP4CAST_PAGE.createNewDOM("p","summW","",jsonData.currently.summary);
    let icoTW = APP4CAST_PAGE.createNewDOM("i","wi "+APP4CAST_PAGE.findIconClass("temp"),"icoTW","");
    let icoSW = APP4CAST_PAGE.createNewDOM("i","wi "+APP4CAST_PAGE.findIconClass("temp"),"icoSW","");
    let tempW = APP4CAST_PAGE.createNewDOM("p","temp","tempW",Math.round(jsonData.currently.temperature));
    let sensW = APP4CAST_PAGE.createNewDOM("p","temp","sensW",Math.round(jsonData.currently.apparentTemperature));
    let locaW = APP4CAST_PAGE.createNewDOM("p","locaW","",APP4CAST_DATA.googleLocation);
    let hourW = APP4CAST_PAGE.createNewDOM("p","hourW","",moment(new Date(jsonData.currently.time * 1000)).format("MMM Do YYYY, ha"));
    let curWeather = APP4CAST_PAGE.createNewDOM("div","curWeather","","");
    let buttons = APP4CAST_PAGE.createNewDOM("div","buttons","","");
    let iconT = APP4CAST_PAGE.createNewDOM("i","wi "+APP4CAST_PAGE.findIconClass("temp"),"iconT","");
    let iconD = APP4CAST_PAGE.createNewDOM("i","wi "+APP4CAST_PAGE.findIconClass("day"),"iconD"," ");
    //
    icoTW.title = "Temperature scale (Fahrenheit/Celsius)";
    icoSW.title = "Check Next/Preview day's temperature";
    //
    buttons.appendChild(iconT);
    buttons.appendChild(iconD);
    //
    tempW.appendChild(icoTW);
    sensW.appendChild(icoSW);
    //
    curWeather.appendChild(locaW);
    curWeather.appendChild(summW);
    curWeather.appendChild(tempW);
    curWeather.appendChild(sensW);
    //
    banner.appendChild(h1);
    banner.appendChild(buttons);
    banner.appendChild(iconW);
    banner.appendChild(curWeather);
    header.appendChild(banner);
    //
    let main = document.querySelector("main");
    let wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    //
    jsonData.hourly.data.forEach(function (item, index) {
        if (index > 0) {
            //
            let sysDate = new Date(item.time * 1000);
            let padHour = APP4CAST_PAGE.applyPad(APP4CAST_PAGE.toogleDayHours(sysDate.getHours()),"0");
            //
            let cBox = APP4CAST_PAGE.createNewDOM("div", index+" "+padHour+" box "+item.icon,"","");
            let iBox = APP4CAST_PAGE.createNewDOM("div","iconBox","","");
            let tBox = APP4CAST_PAGE.createNewDOM("div","textBox","","");
            let summ = APP4CAST_PAGE.createNewDOM("p","","summ",item.summary);
            let hour = APP4CAST_PAGE.createNewDOM("p","","hour",moment(sysDate).format("MMM Do YYYY, ha"));
            let ico1 = APP4CAST_PAGE.createNewDOM("i","wi "+APP4CAST_PAGE.findIconClass("temp"),"icon1","");
            let ico2 = APP4CAST_PAGE.createNewDOM("i","wi "+APP4CAST_PAGE.findIconClass("temp"),"icon2","");
            let temp = APP4CAST_PAGE.createNewDOM("p","temp","temp",Math.round(item.temperature));
            let sens = APP4CAST_PAGE.createNewDOM("p","temp","sens",Math.round(item.apparentTemperature));
            let icon = APP4CAST_PAGE.createNewDOM("i","wi "+APP4CAST_PAGE.findIconClass(item.icon),"","");
            let spnT = APP4CAST_PAGE.createNewDOM("span","","","Temp");
            let spnS = APP4CAST_PAGE.createNewDOM("span","","","Feels like");
            //
            //Define objects for each view mode
            if (index <= Math.floor(jsonData.hourly.data.length/2)) {
                cBox.classList.add("active");
            }
            if (index == 0 || padHour%6==0) {
                cBox.classList.add("low");
            }
            if (index == 0 || padHour%4==0) {
                cBox.classList.add("medium");
            }
            if (index == 0 || padHour%3==0) {
                cBox.classList.add("high");
            }
            //
            temp.appendChild(ico1);
            temp.appendChild(spnT);
            sens.appendChild(ico2);
            sens.appendChild(spnS);
            //
            iBox.appendChild(icon);
            // iBox.appendChild(icnC);
            //
            tBox.appendChild(hour);
            tBox.appendChild(summ);
            tBox.appendChild(temp);
            tBox.appendChild(sens);
            //
            cBox.appendChild(tBox);
            cBox.appendChild(iBox);
            //
            // console.log(cBox.className);
            wrapper.appendChild(cBox);
            //
            // return (index == APP4CAST_PAGE.TOT_DIVS-1);
            //
        }
    });
    main.appendChild(wrapper);
    //
    document.querySelector("#iconD").addEventListener("click", function () {
        if (document.getElementById("iconD").classList.contains("wi-direction-right")) { //current day
            //
            document.getElementById("iconD").classList.remove("wi-direction-right");
            document.getElementById("iconD").classList.add("wi-direction-left");
            //
        }else{
            //
            document.getElementById("iconD").classList.remove("wi-direction-left");
            document.getElementById("iconD").classList.add("wi-direction-right");
            //
        }
        let listEl = document.querySelectorAll(".wrapper>div");
        listEl.forEach(function (item) {
            if (item.classList.contains("active")) {
                item.classList.remove("active");
            }else{
                item.classList.add("active");
            }
        });
    });
    //
    document.querySelector("#iconT").addEventListener("click", function () {
        let iconClass = null;
        let iconNew = null;
        if (document.getElementById("iconT").classList.contains("wi-celsius")) { //current day
            //
            iconClass = "wi-celsius";
            iconNew = "wi-fahrenheit";
            //
        }else{
            //
            iconClass = "wi-fahrenheit";
            iconNew = "wi-celsius";
            //
        }
        let listEl = document.querySelectorAll("."+iconClass);
        listEl.forEach(function (item) {
            item.classList.remove(iconClass);
            item.classList.add(iconNew);
        });
        //
        let listTemp = document.querySelectorAll(".temp");
        listTemp.forEach(function (item) {
            let curNumber = null;
            let newNumber = 0;
            let newText = null;
            if (item.innerHTML.indexOf("<") != -1){
                curNumber = item.innerHTML.substr(0,item.innerHTML.indexOf("<"));
            }
            if (iconNew == "wi-fahrenheit") {
                newNumber = Math.round(curNumber * 9/5 + 32);
            }else{
                newNumber = Math.round((curNumber - 32) * (5 / 9));
            }
            newText = item.innerHTML.replace(curNumber,newNumber);
            item.innerHTML = newText;
            // item.innerText.replace(item.innerText,String(Numberitem.innerText*-1));
        })
    });
    document.getElementById("loadingBox").style.display = "none";
};
APP4CAST_PAGE.createNewDOM = function (evType, evClass, evID, evContent) {
    //
    let elem = document.createElement(evType);
    elem.className = evClass;
    elem.id = evID;
    elem.innerHTML = evContent;
    return elem;
    //
};
//
APP4CAST_PAGE.toogleDayHours = function (hours) {
    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }
    return hours;
};
//
APP4CAST_PAGE.applyPad = function (target, pad, sizePad, position) {
    //
    let addPad = "";
    let pSize = 2;
    let tSize = target.toString().length;
    //
    if ((sizePad != null || sizePad != undefined) && sizePad+1 > pSize) {
        pSize = sizePad;
    };
    //
    if ((target == null || target == undefined) && pSize <= tSize) {
        return target;
    };
    //
    for (var i=1; i<=(pSize-tSize); i++) {
        addPad += pad;
    };
    if ((position != null || position != undefined) && position.toUpperCase() == "R") {
        return (target + addPad);
    }else{
        return (addPad + target);
    };
};
//
APP4CAST_PAGE.findIconClass = function (icon) {
    switch (icon) {
        case 'temp':
        case 'sens':
            return "wi-celsius";
        case 'day':
            return "wi-direction-right";
        case 'rain':
            return "wi-rain";
        case  'snow':
            return "wi-snow";
        case  'sleet':
            return "wi-sleet";
        case  'hail':
            return "wi-hail";
        case  'wind':
            return "wi-strong-wind";
        case  'fog':
            return "wi-fog";
        case  'cloudy':
            return "wi-cloudy";
        case  'partly-cloudy-day':
            return "wi-day-cloudy";
        case  'partly-cloudy-night':
            return "wi-night-alt-cloudy";
        case  'clear-day':
            return "wi-day-sunny";
        case  'clear-night':
            return "wi-night-clear";
        case [0,1,2,3,4,5,6,7,8,9,10,11,12].indexOf(icon):
            return "wi-time-"+icon;
        default:
            return "wi-thermometer";
    }
};
//
APP4CAST_PAGE.init = function () {
    //
    if( navigator.geolocation ){
        //
        APP4CAST_DATA.getGeoLocation();
        //
    }else{
        //browser does not support geolocation api
        APP4CAST_DATA.getGoogleAPIData();
        APP4CAST_DATA.getExternalData();
        //
    };
    //
};
//
// document.addEventListener("DOMContentLoaded",robsonscm.createDiv);
document.addEventListener("DOMContentLoaded",function () {
    //
    APP4CAST_PAGE.init();
    //
});
//
//

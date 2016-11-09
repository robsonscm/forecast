/**
 * Created by Robson on 2016-11-08.
 */


    //
    // let df = new DocumentFragment();
    // for () {
    //     let d = APP4CAST_PAGE.createNewDOM("div", "banner");
    //     df.appendChild(d);
    // };


let icnT = document.createElement("i");
let icnS = document.createElement("i");
let icnH = document.createElement("i");
let icnW = document.createElement("i");
// let ampm = (sysDate.getHours() > 12 ? "pm" : "am");
// let fullDate = utilities.applyPad(sysDate.getMonth()+1,"0") + "-" + utilities.applyPad(sysDate.getDay(),"0") + "-" + sysDate.getFullYear();
// icon.innerHTML = item.icon;
// utilities.findIconClass(item.icon);
// icnT.classList.add("wi");
// icnT.classList.add(utilities.findIconClass("temp"));
// icnS.classList.add("wi");
// icnS.classList.add(utilities.findIconClass("sens"));
// icnH.classList.add("wi");
// icnH.classList.add(utilities.findIconClass("humi"));
// icnW.classList.add("wi");
// icnW.classList.add(utilities.findIconClass("wind"));
// tBox.style.display = "none";
//
// hour.appendChild(icnC);
// temp.appendChild(icnT);
// sens.appendChild(icnS);
// humi.appendChild(icnH);
// wind.appendChild(icnW);
// summ.appendChild(icon);
// hour.appendChild(icnC);
// tBox.appendChild(icnC);
//
// tBox.appendChild(icnT);
// tBox.appendChild(icnS);
// tBox.appendChild(icnH);
// tBox.appendChild(icnW);

//
// jsonData.hourly.data.forEach(function (item) {
//     let forecast = {};
//     forecast["time"] = item.time;
//     forecast["summary"] = item.summary;
//     forecast["icon"] = item.icon;
//     forecast["precipIntensity"] = item.precipIntensity;
//     forecast["precipProbability"] = item.precipProbability;
//     forecast["temperature"] = item.temperature;
//     forecast["apparentTemperature"] = item.apparentTemperature;
//     forecast["dewPoint"] = item.dewPoint;
//     forecast["humidity"] = item.humidity;
//     forecast["windSpeed"] = item.windSpeed;
//     forecast["windBearing"] = item.windBearing;
//     forecast["visibility"] = item.visibility;
//     forecast["cloudCover"] = item.cloudCover;
//     forecast["pressure"] = item.pressure;
//     forecast["ozone"] = item.ozone;
//     objData.hourlyForcast.push(forecast);
//     // objData.hourlyForcast.push([item.time, forecast]);
// });




var output= document.querySelector("#output");
var url = "//griffis.edumedia.ca/test.json";
// starting a URL with "//" means use http or https
//whichever the HTML page used.

//check if the browser supports fetch
try{
    //use fetch
    fetch(url, {mode:'cors',method:'POST'})
        .then(function(response){
            output.innerHTML = "fetch is supported<br/>";
            output.innerHTML += "HTTP Status: " + response.status + "<br/>";
            return response.json();
        })
        .then(function(data){
            output.innerHTML += JSON.stringify(data) + "<br/>";
        })
        .catch(function(err){
            //failed to get the data
            output.innerHTML += "Failed to get the url.<br/>"
        });
}catch(e){
    output.innerHTML = "fetch is NOT supported<br/>";
    output.innerHTML += "Using XMLHttpRequest<br/>";
    //use XMLHttpRequest
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.addEventListener("load", function(ev){
        output.innerHTML += "HTTP Status: " + xhr.status + "<br/>";
        output.innerHTML += xhr.responseText + "<br/>";
    });
    xhr.addEventListener("error", function(ev){
        output.innerHTML += "Failed to get the data.<br/>";
    });
    xhr.send(null);
}
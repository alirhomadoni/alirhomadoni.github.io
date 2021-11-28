var map = L.map('map',{
  minZoom: 2,
  maxZoom: 20
}).setView([-6.892477,107.579566],8);
L.tileLayer('https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=M5m4NpxeLlROSyodQi1E',{
    attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    crossOrigin: true,
    nowWrap : false
}).addTo(map);

// Radar 
var radarIcon = L.icon({
    iconUrl : 'img/antena.png',
    iconSize :[30,30]
})
var airplaneIcon = L.icon({
    iconUrl : 'img/airplane-4-64.png',
    iconSize :[30,30]
})
var markerRadar=L.marker([-6.892477,107.579566],{icon : radarIcon}).addTo(map);


var circle = L.circle([-6.892477,107.579566],{
    color : 'red',
    radius: 463000,
    fillColor :'#f03',
    fillOpacity : 0.09
}).addTo(map);

var axios = require("axios").default;


var options = {
  method: 'GET',
  url: 'https://adsbexchange-com1.p.rapidapi.com/json/lat/-6.892477/lon/107.579566/dist/250/',
  headers: {
    'x-rapidapi-host': 'adsbexchange-com1.p.rapidapi.com',
    'x-rapidapi-key': '929f9562f8mshe1694c65b42c096p13a5e4jsna1f8a323b025'
  }
};

             //  pass the number of iterations as an argument

var i = 1;                  //  set your counter to 1
let x =0 ;
var marker=[];
var trackAircraft =[];
var tempmarker=[];
var data =[];
let memory = [];
var showTrackStatus= false;

function myLoop() {         //  create a loop function
  setTimeout(function() {   //  call a 3s setTimeout when the loop is called
    axios.request(options).then(function (response) {
    data = response.data.ac;
    console.log("Panjanga Memory");
    console.log(memory.length);
    if (memory.length==0){
      for (let y = 0; y < data.length; y++) {
        if (data[y].spd && data[y].trak &&data[y].icao && data[y].lat &&data[y].lon && data[y].alt){
          let speed = parseFloat(data[y].spd);
          let track =  parseFloat(data[y].trak);
          let icao  = data[y].icao;
          let latitude = parseFloat(data[y].lat);
          let longitude = parseFloat(data[y].lon);
          let altitude = parseInt(data[y].alt);
          let history = [[latitude,longitude]];
          memory.push([icao,speed,altitude,latitude,longitude,track,history]);
          console.log ("tulis baru df nya 1");
          console.table(memory);
        
          marker[(y)]=L.marker([latitude,longitude],{icon : airplaneIcon,rotationAngle: memory[y][5]});
          marker[(y)].bindTooltip(memory[y][0] + "<br>" + memory[y][1] + " knots<br>"+ memory[y][2] + " ft" , {permanent: false ,offset: [10, 10] });
          marker[y].addTo(map).on('click', function(e) {
            console.log("you are clicking this marker "+memory[y][0])
            console.log(e.latlng);
            trackAircraft[y].addTo(map);
        });
          

          console.log("plotting aircraft icon 1");
          console.log(marker);
          if(showTrackStatus){
            var polyline = new L.Polyline(memory[y][6], {
              color: 'red',
              opacity: 1,
              weight: 1,
              clickable: false
            });
            trackAircraft.push(polyline);
            trackAircraft[y].addTo(map);
          }else{
            var polyline = new L.Polyline(memory[y][6], {
              color: 'red',
              opacity: 1,
              weight: 1,
              clickable: false
            });
            trackAircraft.push(polyline);
          }
          console.log(trackAircraft);
        } 
      }
    }else{
      console.log("time to update");
      //update data di dataframe

      for (let y = 0; y < data.length; y++) {
          //if ((data[y].call == df["call"].values[i] && data[y].call!=undefined && df["call"].values[i] !=undefined)|| (data[y].sqk == df["sqk"].values[i] && data[y].sqk!=undefined && df["sqk"].values[i] !=undefined) ||(data[y].icao == df["icao"].values[i] && data[y].icao!=undefined && df["icao"].values[i] !=undefined))
          if (data[y].spd && data[y].trak &&data[y].icao && data[y].lat &&data[y].lon && data[y].alt){
            let b= [];
          for (let index =0; index<memory.length ; index++)
          {
            b.push(memory[index][0]); //kolom icao untuk dicek
          }
          console.log("List ICAO");
          console.table(b);
          if (b.includes((data[y].icao))){
            
            let i = b.indexOf((data[y].icao));
            console.log("index yang diupdate adalah : ")
            console.log(i);
            memory[i][1] = parseFloat(data[y].spd);
            memory[i][2] = parseInt(data[y].alt);
            memory[i][3] = parseFloat(data[y].lat);
            memory[i][4] = parseFloat(data[y].lon);
            memory[i][5] = parseFloat(data[y].trak);
            (memory[i][6]).push([memory[i][3],memory[i][4]]);
            lat = memory[i][3];
            lng= memory[i][4];

            console.log("sudah di update");
            console.table(memory);
            
            marker[i].removeFrom(map);
            //L.polyline(memory[y][6], {color: 'red'}).addTo(map);
            marker[(i)]=L.marker([lat,lng],{icon : airplaneIcon,rotationAngle: memory[i][5]});
            marker[(i)].bindTooltip(memory[i][0] + "<br>" + memory[i][1] + " knots<br>"+ memory[i][2] + " ft" , {permanent: false ,offset: [10, 10] });
            marker[i].addTo(map).on('click', function(e) {
              console.log("you are clicking this marker " +memory[i][0]);
              console.log(e.latlng);
              trackAircraft[i].addTo(map);
          });
            
           
        
            console.log("plotting aircraft icon 2");
            console.log(marker);
            console.log(trackAircraft);
          }

          for (let i = 0; i < memory.length; i++) {
            if(showTrackStatus){
              map.removeLayer(trackAircraft[i]);
              var polyline = new L.Polyline(memory[i][6], {
                color: 'red',
                opacity: 1,
                weight: 1,
                clickable: false
              });
              trackAircraft[i]=(polyline);
              trackAircraft[i].addTo(map);
            }else{
              map.removeLayer(trackAircraft[i]);
              var polyline = new L.Polyline(memory[i][6], {
                color: 'red',
                opacity: 1,
                weight: 1,
                clickable: false
              });
              trackAircraft[i]=(polyline);
            }
            
          }
          
        }else{
          if (data[y].spd && data[y].trak &&data[y].icao && data[y].lat &&data[y].lon && data[y].alt){
            
            console.log("add data baru");
          
            memory.push([data[y].icao,parseFloat(data[y].spd),parseInt(data[y].alt),parseFloat(data[y].lat),parseFloat(data[y].lon),parseFloat(data[y].trak),[parseFloat(data[y].lat),parseFloat(data[y].lon)]]);
            let i = memory.length-1;
            console.table(memory);
            
            marker[(i)]=L.marker([data[y].lat,data[y].lon],{icon : airplaneIcon,rotationAngle: data[y].trak});
            marker[(i)].bindTooltip(memory[i][0] + "<br>" + memory[i][1] + " knots<br>"+ memory[i][2] + " ft" , {permanent: false ,offset: [10, 10] });
            marker[i].addTo(map).on('click', function(e) {
              console.log("you are clicking this marker "+memory[i][0])
              console.log(e.latlng);
              trackAircraft[i].addTo(map);
          });
            
            
            console.log("plotting aircraft icon 3 ");
            console.log(marker);

            if(showTrackStatus){
              var polyline = new L.Polyline(memory[i][6], {
                color: 'red',
                opacity: 1,
                weight: 1,
                clickable: false
              }).addTo(map);
              trackAircraft.push(polyline);
              
            }else{

            var polyline = new L.Polyline(memory[i][6], {
              color: 'red',
              opacity: 1,
              weight: 1,
              clickable: false
            });
            trackAircraft.push(polyline);
            
          }
          console.log(trackAircraft);
            
          }
        } 
      }
    }
    var button = document.getElementById("refreshButton");
    button.onclick= function(){
      if (showTrackStatus){
        console.log("Hide Track............");
        button.innerHTML = "Show Track";
        showTrackStatus = false;
        trackAircraft.forEach(function (item) {
          item.addTo(map);
          console.log(item);
      });
       

      }else{
        console.log("Show Track............");
        button.innerHTML = "Hide Track";
        showTrackStatus = true;
        trackAircraft.forEach(function (item) {
          map.removeLayer(item);
          console.log(item);
      }); 
      }
    }
    
  }).catch(function (error) {
    console.error(error);
    });//  your code here
    i++;                    //  increment the counter
    if (i < Infinity) {           //  if the counter < 10, call the loop function
      myLoop();             //  ..  again which will trigger another 
    }                       //  ..  setTimeout()
  }, 10000)
}
for (let y = 0; y < marker.length; y++) {
  marker[y].on('mouseover', markerOnClick(memory[y][0])); 
}

function markerOnClick(s)
{
  console.log("hi. you clicked the marker" + s);
}

myLoop();
   


(function() {
  // save these original methods before they are overwritten
  var proto_initIcon = L.Marker.prototype._initIcon;
  var proto_setPos = L.Marker.prototype._setPos;

  var oldIE = (L.DomUtil.TRANSFORM === 'msTransform');

  L.Marker.addInitHook(function () {
      var iconOptions = this.options.icon && this.options.icon.options;
      var iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
      if (iconAnchor) {
          iconAnchor = (iconAnchor[0] + 'px ' + iconAnchor[1] + 'px');
      }
      this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom' ;
      this.options.rotationAngle = this.options.rotationAngle || 0;

      // Ensure marker keeps rotated during dragging
      this.on('drag', function(e) { e.target._applyRotation(); });
  });

  L.Marker.include({
      _initIcon: function() {
          proto_initIcon.call(this);
      },

      _setPos: function (pos) {
          proto_setPos.call(this, pos);
          this._applyRotation();
      },

      _applyRotation: function () {
          if(this.options.rotationAngle) {
              this._icon.style[L.DomUtil.TRANSFORM+'Origin'] = this.options.rotationOrigin;

              if(oldIE) {
                  // for IE 9, use the 2D rotation
                  this._icon.style[L.DomUtil.TRANSFORM] = 'rotate(' + this.options.rotationAngle + 'deg)';
              } else {
                  // for modern browsers, prefer the 3D accelerated version
                  this._icon.style[L.DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
              }
          }
      },

      setRotationAngle: function(angle) {
          this.options.rotationAngle = angle;
          this.update();
          return this;
      },

      setRotationOrigin: function(origin) {
          this.options.rotationOrigin = origin;
          this.update();
          return this;
      }
  });
})();
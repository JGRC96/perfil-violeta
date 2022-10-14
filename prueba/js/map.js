


var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 13,
  center: {lat: 19.749709, lng: -99.177082}
});


google.maps.event.addDomListener(window, 'load');
let poligonosMap = {};
let poligonosId = [];
var _markersMapLabel = {}; 


function savePolygon(_polygonId, _colorPolygon, _textPolygon, _type){
  let coords = getPolygonCoords(_polygonId);
  let colorPolygon = document.getElementById(_colorPolygon).value;
  let labelPolygon = document.getElementById(_textPolygon).value;
  let stringCoords = '';

  poligonosMap[_polygonId].setOptions({strokeColor: colorPolygon, fillColor: colorPolygon});
  stringCoords += '[';
  for(let i=0; i<coords.length; i++){
    if(i<coords.length-1){
      stringCoords += `[${coords[i][0]}, ${coords[i][1]}],`;
    }else{
      stringCoords += `[${coords[i][0]}, ${coords[i][1]}]`;
    }
  }
  stringCoords += ']';

  let xhr = new XMLHttpRequest();
  xhr.open("POST", `${currentHost}/geocercas/add`);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = ()=>{
    let response = JSON.parse(xhr.responseText)['response']
    if(response === 'success'){
      Swal.fire({
        position: 'bottom-end',
        icon: response,
        title: JSON.parse(xhr.responseText)['msg'],
        showConfirmButton: false,
        timer: 1500
      });
    }else{
      Swal.fire({
        position: 'bottom-end',
        icon: response,
        title: JSON.parse(xhr.responseText)['msg'],
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
  
  xhr.send(`{
    "id": "${_polygonId}",
    "coords": "${stringCoords}", 
    "color": "${colorPolygon}", 
    "label": "${labelPolygon}",
    "type": "${_type}"
  }`);
}

function agregarPoligono(_typePolygon){
  let idpoligono = document.getElementById('form_idpoligono').value;
  let color = document.getElementById('form_colorpolygon').value;
  let label = document.getElementById('form_textopoligono').value;

  let htmlthrebutton = ``;

  if(_typePolygon == 'Region' || _typePolygon == 'Cuadrante' || _typePolygon == 'Circuito'){
  }else{
    htmlthrebutton = `<a class="btn btn-sm btn-success mx-2" href="${currentHost}/redes-vecinales/miembros/${idpoligono}" target="_blank">Miembros</a>`;
  }

  if(poligonosMap[idpoligono]){
    Swal.fire({
      position: 'bottom-end',
      icon: 'error',
      title: 'El ID del poligono ya existe.',
      showConfirmButton: false,
      timer: 1500
    });
  }else{
    poligonosMap[idpoligono] = new google.maps.Polygon({
      paths: [{lat: 19.781587, lng: -99.170145}, {lat: 19.750365, lng: -99.169635}, {lat: 19.766633, lng: -99.164470}, {lat: 19.781587, lng: -99.170145}],
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.4,
      editable: true,
      draggable: true,
    });
    poligonosMap[idpoligono].setMap(map);

    

    map.setZoom(16);
    let divListPolygons = document.getElementById('accordionGeocercas');
    divListPolygons.innerHTML += `
    <div class="accordion-item">
      <h2 class="accordion-header" id="heading_${idpoligono}">
        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${idpoligono}" aria-expanded="true" aria-controls="collapse${idpoligono}">Geocerca ${idpoligono}</button>
      </h2>
      <div id="collapse${idpoligono}" class="accordion-collapse collapse show" aria-labelledby="heading${idpoligono}" data-bs-parent="#accordionGeocercas">
        <div class="accordion-body">
          <div class="row">
            <div class="col-sm-6">
              <label for="form_idpoligono_${idpoligono}">ID: </label>
              <input class="form-control form-control-sm" type="text" value="${idpoligono}" id="form_idpoligono_${idpoligono}" disabled>
            </div>
            <div class="col-sm-6">
              <label for="form_colorpoligono_${idpoligono}">Color: </label>
              <input type="color" class="form-control form-control-sm" id="form_colorpoligono_${idpoligono}" value="${color}">
            </div>
            <div class="col-sm-12">
              <label for="form_textopoligono_${idpoligono}">Label: </label>
              <input class="form-control form-control-sm" type="text" id="form_textopoligono_${idpoligono}" value="${label}">
            </div>
            <div class="col-sm-12 mt-4">
              <textarea class="form-control" value="" id="textarealocations_${idpoligono}" cols="30" rows="10" placeholder="Aqui puedes poner el array de cordenadas(Opcional)\nEj: [ [19.33243, -99.43543] ]" onkeyup="formatPolygon(this.value, '${idpoligono}', '${color}')"></textarea>
            </div>
            <div class="col-sm-12 mt-2" id="message_polygon_${idpoligono}"></div>
          </div>
          <div class="d-flex justify-content-center mt-2">
            <div class="btn btn-sm btn-danger mx-2">Eliminar</div>
            <div class="btn btn-sm btn-primary mx-2" onclick="savePolygon('${idpoligono}', 'form_colorpoligono_${idpoligono}', 'form_textopoligono_${idpoligono}', '${_typePolygon}')">Guardar</div>
            ${htmlthrebutton}
          </div>
        </div>
      </div>
    </div>`;
    refactorLocationsOnChanguePolygon(idpoligono); 


    google.maps.event.addListener(poligonosMap[idpoligono] , 'click', function () {
       
    });

    google.maps.event.addListener(poligonosMap[idpoligono], 'dragend', function() {
      refactorLocationsOnChanguePolygon(idpoligono)
    });

    google.maps.event.addListener(poligonosMap[idpoligono].getPath(), 'set_at', function() {
      refactorLocationsOnChanguePolygon(idpoligono)
    });
    google.maps.event.addListener(poligonosMap[idpoligono].getPath(), 'insert_at', function() {
      refactorLocationsOnChanguePolygon(idpoligono)
    });
  }
}


//Display Coordinates below map
function getPolygonCoords(_idpoligono) {
  let len = poligonosMap[_idpoligono].getPath().getLength();
  let coords = [];
  for (let i = 0; i < len; i++) {
    // coords.push(poligonosMap[_idpoligono].getPath().getAt(i).toUrlValue(5));
    coords.push([parseFloat(poligonosMap[_idpoligono].getPath().getAt(i).toUrlValue(5).split(',')[0]), parseFloat(poligonosMap[_idpoligono].getPath().getAt(i).toUrlValue(5).split(',')[1])])
  }
  return coords;
}

function formatPolygon(geo, _polygonId, _color){
  document.getElementById(`message_polygon_${_polygonId}`).innerHTML = ``;  
  let geoPoints = JSON.parse(geo);
  let _reformatpolygonPaths = [];
  
  for(let i = 0; i<geoPoints.length; i++){
    _reformatpolygonPaths.push({lat: geoPoints[i][0], lng: geoPoints[i][1]});
    if(geoPoints[i][0]<0){
      document.getElementById(`message_polygon_${_polygonId}`).innerHTML = `<div class="alert alert-danger" role="alert">Error Array: Formato Invalido, Posición ${i} (La latitud no puede tener un valor negativo)</div>`;
    }
    if(geoPoints[i][1]>0){
      document.getElementById(`message_polygon_${_polygonId}`).innerHTML = `<div class="alert alert-danger" role="alert">Error Array: Formato Invalido, Posición ${i} (La longitud no puede tener un valor positivo)</div>`;
    }
  }
  poligonosMap[_polygonId].setPaths(_reformatpolygonPaths)
}

function CargaDePoligonos(_typePolygon){
  let htmlthrebutton = ``;
  let divListPolygons = document.getElementById('accordionGeocercas');
  let xhr = new XMLHttpRequest();
  xhr.open("POST", `${currentHost}/geocercas`);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = ()=>{
    let response = JSON.parse(xhr.responseText)['dataresponse']
    response.forEach(element => {
      if(_typePolygon == 'Region' || _typePolygon == 'Cuadrante' || _typePolygon == 'Circuito'){
      }else{
        htmlthrebutton = `<a class="btn btn-sm btn-success mx-2" href="${currentHost}/redes-vecinales/miembros/${element['id_poligono']}" target="_blank">Miembros</a>`;
      }
      divListPolygons.innerHTML += `
      <div class="accordion-item" onclick="centerPolygon('${element['id_poligono']}')">
        <h2 class="accordion-header" id="heading_${element['id_poligono']}">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${element['id_poligono']}" aria-expanded="true" aria-controls="collapse$${element['id_poligono']}">Geocerca ${element['id_poligono']}</button>
        </h2>
        <div id="collapse${element['id_poligono']}" class="accordion-collapse collapse " aria-labelledby="heading${element['id_poligono']}" data-bs-parent="#accordionGeocercas">
          <div class="accordion-body">
            <div class="row">
              <div class="col-sm-6">
                <label for="form_idpoligono_${element['id_poligono']}">ID: </label>
                <input class="form-control form-control-sm" type="text" value="${element['id_poligono']}" id="form_idpoligono_${element['id_poligono']}" disabled>
              </div>
              <div class="col-sm-6">
                <label for="form_colorpoligono_${element['id_poligono']}">Color: </label>
                <input type="color" class="form-control form-control-sm" id="form_colorpoligono_${element['id_poligono']}" value="${element['color']}">
              </div>
              <div class="col-sm-12">
                <label for="form_textopoligono_">Label: </label>
                <input class="form-control form-control-sm" type="text" id="form_textopoligono_${element['id_poligono']}" value="${element['label']}">
              </div>
              <div class="col-sm-12 mt-4">
                <textarea class="form-control" value="" id="textarealocations_${element['id_poligono']}" cols="30" rows="10" placeholder="Aqui puedes poner el array de cordenadas(Opcional)\nEj: [ [19.33243, -99.43543] ]" onkeyup="formatPolygon(this.value, '${element['id_poligono']}', '${element['color']}')"></textarea>
              </div>
              <div class="col-sm-12 mt-2" id="message_polygon_${element['id_poligono']}"></div>
            </div>
            <div class="d-flex justify-content-center mt-2">
              <div class="btn btn-sm btn-danger mx-2">Eliminar</div>
              <div class="btn btn-sm btn-primary mx-2" onclick="savePolygon('${element['id_poligono']}', 'form_colorpoligono_${element['id_poligono']}', 'form_textopoligono_${element['id_poligono']}', '${element['tipo']}')">Guardar</div>
              ${htmlthrebutton}
            </div>
          </div>
        </div>
      </div>`;
      let locations = JSON.parse(element['coordinates']);
      var boundspolygon = new google.maps.LatLngBounds();
      let setPaths = [];
      let setlocationsformatttextarea = '[\n'; //set initialize array
      for(let i=0; i<locations.length; i++){

        //initialize push values for array
        if(i==locations.length-1){
          setlocationsformatttextarea += `\t[${locations[i][0]}, ${locations[i][1]}]\n`;
        }else{
          setlocationsformatttextarea += `\t[${locations[i][0]}, ${locations[i][1]}],\n`;
        }
        //end push values for array

        setPaths.push({lat: locations[i][0], lng: locations[i][1]}); //set path array
        boundspolygon.extend(new google.maps.LatLng(locations[i][0], locations[i][1]));
      }
      setlocationsformatttextarea+= ']'; //end array

      //SET array text locations to textarea 
      document.getElementById(`textarealocations_${element['id_poligono']}`).innerHTML = setlocationsformatttextarea.toString();

      //Add polygon to array polygons list
      poligonosMap[element['id_poligono']] = new google.maps.Polygon({
        paths: setPaths,
        strokeColor: element['color'],
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: element['color'],
        fillOpacity: 0.4,
        editable: true,
        draggable: true,
      });

      //Listeners for google maps polygons
      google.maps.event.addListener(poligonosMap[element['id_poligono']] , 'click', function (event) {
        map.setZoom(16);
        map.setCenter(boundspolygon.getCenter());
        setLabelPolygon(element['label'], boundspolygon.getCenter());
      });

      
      google.maps.event.addListener(poligonosMap[element['id_poligono']], 'dragend', function() {
        refactorLocationsOnChanguePolygon(element['id_poligono'])
      });

      google.maps.event.addListener(poligonosMap[element['id_poligono']].getPath(), 'set_at', function() {
        refactorLocationsOnChanguePolygon(element['id_poligono'])
      });
      google.maps.event.addListener(poligonosMap[element['id_poligono']].getPath(), 'insert_at', function() {
        refactorLocationsOnChanguePolygon(element['id_poligono'])
      });

      poligonosMap[element['id_poligono']].setMap(map);
    });
  };
  xhr.send(`{"tipo": "${_typePolygon}"}`);
}


function refactorLocationsOnChanguePolygon(_id_polygon){
  let onchanguePolygonLocations = getPolygonCoords(_id_polygon);

  let setlocationsformatttextarea = '['; //end array
  for(let i=0; i<onchanguePolygonLocations.length; i++){

    //initialize push values for array
    if(i==onchanguePolygonLocations.length-1){
      setlocationsformatttextarea += `\t[${onchanguePolygonLocations[i][0]}, ${onchanguePolygonLocations[i][1]}]\n`;
    }else{
      setlocationsformatttextarea += `\t[${onchanguePolygonLocations[i][0]}, ${onchanguePolygonLocations[i][1]}],\n`;
    }
    //end push values for array
  }
  setlocationsformatttextarea+= ']'; //end array

  //SET array text locations to textarea 
  document.getElementById(`textarealocations_${_id_polygon}`).innerHTML = setlocationsformatttextarea.toString();
}


function CargaDePoligonosConsola(_typePolygon){
  removePolygonsConsola();
  let xhr = new XMLHttpRequest();
  xhr.open("POST", `${currentHost}/geocercas`);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = ()=>{
    let response = JSON.parse(xhr.responseText)['dataresponse']
    response.forEach(element => {
      let locations = JSON.parse(element['coordinates']);
      let setPaths = [];
      for(let i=0; i<locations.length; i++){
        setPaths.push({lat: locations[i][0], lng: locations[i][1]});
      }

      // console.log(setPaths)
      if(!poligonosMap[element['id_poligono']]){
        poligonosMap[element['id_poligono']] = new google.maps.Polygon({
          paths: setPaths,
          strokeColor: element['color'],
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: element['color'],
          fillOpacity: 0.4,
          editable: false,
          draggable: false,
        });
        poligonosMap[element['id_poligono']].setMap(map);
        poligonosId.push(element['id_poligono']);
      }
    });
  };
  xhr.send(`{"tipo": "${_typePolygon}"}`);
}

function removePolygonsConsola(){
  for(let i=0; i<poligonosId.length; i++){
    poligonosMap[poligonosId[i]].setMap(null);
  }
  poligonosId = [];
  poligonosMap = {};
}

function set_count_polygons(_typePolygon, _spanCountId){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", `${currentHost}/geocercas`);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = ()=>{
    let response = JSON.parse(xhr.responseText)['dataresponse']
    document.getElementById(`${_spanCountId}`).innerHTML = response.length;
  };
  xhr.send(`{"tipo": "${_typePolygon}"}`);
}


function centerPolygon(_polygonId){//LOcalizar Marcador
  map.setZoom(16);
  map.setCenter(new google.maps.LatLng(getPolygonCoords(_polygonId)[0][0], getPolygonCoords(_polygonId)[0][1]));
}
function setLabelPolygon(_labelText, _center){
  var myLatlng = _center;
  var labelId = 'centertext';
  
  if(_markersMapLabel[labelId]){
    _markersMapLabel[labelId].setMap(null);
  }
  _markersMapLabel[labelId] = new MapLabel({
    text: _labelText,
    position: myLatlng,
    map: map,
    fontSize: 18,
    strokeWeight: 8
  });
  _markersMapLabel[labelId].set('position', myLatlng);
}

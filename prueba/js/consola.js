


firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();


var _markers = {};
var _markersMapLabel = {};
var _unidades = [];
var stringmarkertype1 = 'https://i.ibb.co/9y7LMQy/to-left-up.png';
var stringmarkertype2 = 'https://i.ibb.co/s29kczZ/to-right-up.png';
var stringmarkertype3 = 'https://i.ibb.co/7VLdh6V/to-left-down.png';
var stringmarkertype4 = 'https://i.ibb.co/R6BtXgd/to-right-down.png';


//Datos infowindow
const infowindow = new google.maps.InfoWindow();

function setInfoWindow(_marker, datos){
  google.maps.event.addListener(_marker, 'click',
    function(){
      infowindow.close();//hide the infowindow
      infowindow.setContent(`
        <h5>Unidad ${datos.unidad}</h5>
        <h6>Usuario: ${datos.authName}<h6>
        <h6>N° Empleado: ${datos.authUid}<h6>
        <h6>En Geocerca: Sin definir</h6>
        <h6>
        <a href="mongoscratch.com/route/record/${datos.unidad}" target="_blank" class="btn btn-sm btn-primary"><i class="fas fa-route"></i> Trazar Ruta</a>
        <a href="mongoscratch.com/route/record/${datos.unidad}" target="_blank" class="btn btn-sm btn-danger"><i class="fas fa-camera"></i> Camaras</a>
        </h6>
      `);//update the content for this marker
      infowindow.open({
        anchor: _markers[datos.unidad],
        map,
        shouldFocus: true,
      });//"move" the info window to the clicked marker and open it
    }
  );
}


// Datos de localizacion del dispositivo de emergencias
const firstlocationsUnidadesEmergencias = firebase.database().ref('location/emergencias');
firstlocationsUnidadesEmergencias.on('child_added', (snapshot) => {
  let listadounidades = document.getElementById('listado_unidades');
  const datos = snapshot.val();
  // console.log(datos)
  if(_markers[datos.unidad]){
  }else{
    _unidades.push(datos.unidad);
    _markers[datos.unidad] = new google.maps.Marker({
      position: {lat: datos.location.latitude, lng: datos.location.longitude},
      map: map,
      label: {
        text: datos.unidad,
        color: '#fff',
        fontSize: '19px',
        fontWeight: 'bold',
        className: datos.location.speed > 0 ? 'label-map-style-online' : 'label-map-style-offline'
      },
      icon: (datos.location.direction > 0 & datos.location.direction <= 90) ? stringmarkertype2 : (datos.location.direction > 90 & datos.location.direction <= 180) ? stringmarkertype4 : (datos.location.direction > 180 & datos.location.direction <=270) ? stringmarkertype3 : stringmarkertype1,
    });
    _markers[datos.unidad].setPosition(new google.maps.LatLng( datos.location.latitude, datos.location.longitude ));
    setInfoWindow(_markers[datos.unidad], datos);
    listadounidades.innerHTML += `<tr class="text-capitalize" id="list_unidades_policia${datos.unidad}">
      <td id="list_unidades_gpstime_${datos.unidad}">${datos.location.gpstime}</td>
      <td id="list_unidades_fencing_${datos.unidad}">${datos.inside == undefined ? 'Sin Asignar' : datos.inside ? 'Dentro' : 'Fuera'}</>
      <td>${datos.unidad}</td>
      <td>${datos.tipo}</td>
      <td id="list_unidades_speed_${datos.unidad}">${datos.location.speed} KM/H</td>
      <td class="text-center"><button class="btn btn-sm btn-outline-primary" onclick="moveCameraMarker('${datos.unidad}')"><i class="fa-solid fa-magnifying-glass-location"></i></button></td>
    </tr>`;
  }
});


const locationsUnidadesEmergencias = firebase.database().ref('location/emergencias');
locationsUnidadesEmergencias.on('child_changed',function(data){
  let datos = data.val();
  if(_markers[datos.unidad]){
    _markers[datos.unidad].setPosition(new google.maps.LatLng( datos.location.latitude, datos.location.longitude ));
    document.getElementById(`list_unidades_fencing_${datos.unidad}`).innerHTML = `${datos.inside}`;
    document.getElementById(`list_unidades_gpstime_${datos.unidad}`).innerHTML = datos.location.gpstime;
    document.getElementById(`list_unidades_speed_${datos.unidad}`).innerHTML = `${datos.location.speed} KM/H`;
  }else{
    _markers[datos.unidad] = new google.maps.Marker({
      position: {lat: datos.location.latitude, lng: datos.location.longitude},
      label: {
        text: datos.unidad,
        color: '#fff',
        fontSize: '19px',
        fontWeight: 'bold',
        className: datos.location.speed > 0 ? 'label-map-style-online' : 'label-map-style-offline'
      },
      map: map,
      icon: stringmarkertype1,
    });
    _markers[datos.unidad].setPosition(new google.maps.LatLng( datos.location.latitude, datos.location.longitude ));
  }
});
// END Datos de localizacion del dispositivo de emergencias

var audioAlertMP3 = new Audio('audio/alert.mp3');

//Datos de localizacion de los usuarios de boton
firebase.database().ref('location/boton').on('child_added', (snapshot) => {
  console.log('AGREGAR')

  const datos = snapshot.val();
  if(datos.nueva){
    audioAlertMP3.play();
    Swal.fire({
      position: 'bottom-end',
      icon: 'info',
      title: 'Nueva alerta recibida',
      showConfirmButton: false,
      timer: 1500
    });
  }
  
  _markers[datos.user_id.toString()] = new google.maps.Marker({
    position: {lat: datos.location.latitude, lng: datos.location.longitude},
    map: map,
    title: 'Boton',
    icon: {
      path:  google.maps.SymbolPath.CIRCLE,
      strokeColor : "#cc1d1d",
      strokeWeight : 15,
      fillColor: "#FFFFFF",
      scale: 10,
      shadow : null,
    },
  });
  _markers[datos.user_id.toString()].setPosition(new google.maps.LatLng( datos.location.latitude, datos.location.longitude ));
  getAlertByUID(datos.user_id);
});

firebase.database().ref('location/boton').on('child_changed',function(data){
  console.log('MODIFICADO')
  let datos = data.val();
  

  if(_markers[datos.user_id.toString()]){
    _markers[datos.user_id.toString()].setPosition(new google.maps.LatLng( datos.location.latitude, datos.location.longitude ));
  }else{
    _markers[datos.user_id.toString()] = new google.maps.Marker({
      position: {lat: datos.location.latitude, lng: datos.location.longitude},
      map: map,
      title: 'Boton',
      icon: {
        path:  google.maps.SymbolPath.CIRCLE,
        strokeColor : "#cc1d1d",
        strokeWeight : 15,
        fillColor: "#FFFFFF",
        scale: 10,
        shadow : null,
      },
    });
    _markers[datos.user_id.toString()].setPosition(new google.maps.LatLng( datos.location.latitude, datos.location.longitude ));
    getAlertByUID(datos.user_id.toString());
  }
});
firebase.database().ref('location/boton').on('child_removed',function(data){
  console.log('REMOVER')
  let datos = data.val();
  
  _markers[datos.user_id].setMap(null)
  document.getElementById(`alertID_${datos.user_id}`).remove()

  audioAlertMP3.pause();
  audioAlertMP3.currentTime = 0;
});

//End Datos de localizacion de los usuarios de boton


function getAlertByUID(_userid){
  let dataForm = {
    uid: _userid
  };
  let xhr = new XMLHttpRequest();
  xhr.open('POST', `${currentHost}/consola/alertas`);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function() {
    if (xhr.status != 200) { // analiza el estado HTTP de la respuesta
      // ej. 404: No encontrado
      Swal.fire({
          position: 'bottom-end',
          icon: 'error',
          title: `Error ${xhr.status}`,
          text: `${xhr.statusText}`,
          showConfirmButton: false,
          timer: 1500
      });
    } else { // muestra el resultado
      let datadoc = JSON.parse(xhr.response)['dataresponse'];

      $('#accordionListAlerts').append(`<div class="accordion-item mb-2" id="alertID_${datadoc.userid}">
        <h2 class="accordion-header" id="flush-heading${datadoc.userid}">
          <button class="accordion-button collapsed text-light bg-warning" id="button_class_header${datadoc.id}" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${datadoc.userid}" aria-expanded="false" aria-controls="flush-collapse${datadoc.userid}">
            ${datadoc.nombre} : Emergencia ${datadoc.tipo_alerta}
          </button>
        </h2>
        <div id="flush-collapse${datadoc.userid}" class="accordion-collapse collapse" aria-labelledby="flush-headin${datadoc.userid}">
          <div class="accordion-body">
            <h6><b>Teléfono:</b> ${datadoc.telefono}</h6>
            <h6><b>Contacto 1:</b> ${datadoc.nombrecontacto1} - - - -${datadoc.telefonocontacto1}</h6>
            <h6><b>Contacto 2:</b> ${datadoc.nombrecontacto2} - - - -${datadoc.telefonocontacto2}</h6>
            <h6 id="patrullas_label${datadoc.id}"><b>Patrullas Asignadas:</b></h6><br>
            <select class="form-select form-select-sm selectUDP_${datadoc.userid} patrullaselect" aria-label="Seleccion de Patrulla" id="patrullas_select_${datadoc.userid}">
              <option value='null' selected>Selecciona una patrulla</option>
              <option value='testunidad'>Test Unidad</option>
            </select>
            <div class="text-center">
              <button class="mt-2 btn btn-sm btn-primary" onclick="asignarPatrulla('${datadoc.userid}')">Asignar Patrulla</button>
              <button class="mt-2 btn btn-sm btn-outline-warning" onclick="moveCameraMarker('${datadoc.userid}')"><i class="fa-solid fa-magnifying-glass-location"></i> Localizar </button>
              <button class="mt-2 btn btn-sm btn-outline-danger" onclick="cerrarAlerta('${datadoc.userid}')"><i class="fa-solid fa-magnifying-glass-location"></i> Cerrar Alerta </button>
            </div>
          </div>
        </div>
      </div>`);
    }
  };
  xhr.onerror = function() { // solo se activa si la solicitud no se puede realizar
    alert(`Error de red`);
  };
  xhr.send(JSON.stringify(dataForm))
}


function moveCameraMarker(userid){//LOcalizar Marcador
  map.setZoom(20);
  map.setCenter(new google.maps.LatLng(_markers[userid].getPosition().lat(), _markers[userid].getPosition().lng()));
}


function asignarPatrulla(_userid){
  // console.log(document.getElementById(`patrullas_select_${_userid}`).value);
  firebase.database().ref(`location/emergencias/${document.getElementById(`patrullas_select_${_userid}`).value}`).update({'alertuserid': _userid});
}

function cerrarAlerta(_userid){
  // console.log(document.getElementById(`patrullas_select_${_userid}`).value);
  // firebase.database().ref(`location/emergencias/${document.getElementById(`patrullas_select_${_userid}`).value}`).update({'alertuserid': null});
  firebase.database().ref(`location/boton/${_userid}`).update({'removeremote': true});

  let xhr = new XMLHttpRequest();
  xhr.open('POST', `${currentHost}/alertas/closebyop`);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function() {
    if (xhr.status != 200) { // analiza el estado HTTP de la respuesta
    } else { // muestra el resultado
      Swal.fire({
        position: 'bottom-end',
        icon: 'info',
        title: JSON.parse(xhr.response),
        showConfirmButton: false,
        timer: 1500
      });
      firebase.database().ref(`location/boton/${_userid}`).remove();
    }
  };
  xhr.onerror = function() { // solo se activa si la solicitud no se puede realizar
    alert(`Error de red`);
  };
  xhr.send(JSON.stringify({'userid': _userid}))
}
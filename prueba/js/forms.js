function sendForm(idForm, idbuttonform, isreset){
    const button_sumbit = document.getElementById(`${idbuttonform}`);
    button_sumbit.disabled = true;
    console.log(idbuttonform)


    let form = document.querySelector(`#${idForm}`);
    let data = new FormData(form);
    let dataForm = {};
    let actionForm = document.getElementById(idForm).action;
    let methodForm = document.getElementById(idForm).method;

    for (let entry of data) {
        dataForm[entry[0]] = entry[1];
    }
    console.log(dataForm)
    console.log(actionForm)
    console.log(methodForm)

    let xhr = new XMLHttpRequest();
    xhr.open(methodForm, actionForm);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        if (xhr.status != 200) { // analiza el estado HTTP de la respuesta
            Swal.fire({
                position: 'bottom-end',
                icon: 'success',
                title: `Error ${xhr.status}`,
                text: `${xhr.statusText}`,
                showConfirmButton: false,
                timer: 1500
            });
        } else { // muestra el resultado
            Swal.fire({
                position: 'bottom-end',
                icon: 'success',
                text: `${JSON.parse(xhr.response)['msg']}`,
                showConfirmButton: false,
                timer: 1500
            });
        }
        button_sumbit.disabled = false;
        if(isreset){
            form.reset();
        }
    };
    xhr.onerror = function() { // solo se activa si la solicitud no se puede realizar
        alert(`Error de red`);
    };
    xhr.send(JSON.stringify(dataForm))
}


function guardarUsuariosBotonRedVecinal(_id_red_vecinal, userid){
    let type_action = '';
    if(document.getElementById(`checkboxmembers${userid}`).checked){
        type_action = 'remove';
    }else{
        type_action = 'add';
    }
    let dataForm = {
        userid: userid,
        action: type_action
    };
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `${currentHost}/redes-vecinales/miembros/${_id_red_vecinal}/update`);
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
            Swal.fire({
                position: 'bottom-end',
                icon: 'success',
                title: JSON.parse(xhr.response)['msg'],
                showConfirmButton: false,
                timer: 500
            });
        }
    };
    xhr.onerror = function() { // solo se activa si la solicitud no se puede realizar
        alert(`Error de red`);
    };
    xhr.send(JSON.stringify(dataForm));
}

function deleteUDE(_numero_empleado){
    let dataForm = {
        numero_empleado: _numero_empleado,
    };

    Swal.fire({
        title: 'Estas Seguro?',
        text: "Esta acción no es reversible!",
        icon: 'warning',
        position: 'top-end',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
        if (result.isConfirmed) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', `${currentHost}/usuarios/emergencias/delete`);
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
                    Swal.fire({
                        position: 'bottom-end',
                        icon: 'success',
                        title: JSON.parse(xhr.response)['msg'],
                        showConfirmButton: false,
                        timer: 500
                    });
                    document.getElementById(`recordtable_${_numero_empleado}`).innerHTML = '';
                }
            };
            xhr.onerror = function() { // solo se activa si la solicitud no se puede realizar
                alert(`Error de red`);
            };
            xhr.send(JSON.stringify(dataForm));
        }
    });
}

function updateform(name, noempleado, telefono, tipousuario, unidadresguardada, rfc){
    let update_form_name = document.getElementById('update_form_name');
    let update_form_numero_empleado= document.getElementById('update_form_numero_empleado');
    let update_form_phonenumber = document.getElementById('update_form_phonenumber');
    let update_form_rfc = document.getElementById('update_form_rfc');


    document.getElementById('update_form_name').value = name;
    document.getElementById('update_form_numero_empleado').value = noempleado;
    document.getElementById('update_form_phonenumber').value = telefono;
    document.getElementById('update_form_rfc').value = rfc;
}


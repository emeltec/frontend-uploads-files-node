const URLBASE = "http://localhost:3000";

/** FILES UPLOAD */

function element(el) {
  return document.getElementById(el);
}

function upload() {
  var file = element("file").files[0];
  var formdata = new FormData();
  formdata.append("file", file);
  var ajax = new XMLHttpRequest();
  ajax.upload.addEventListener("progress", progressHandler, false);
  ajax.addEventListener("load", completeHandler, false);
  ajax.addEventListener("error", errorHandler, false);
  ajax.addEventListener("abort", abortHandler, false);
  ajax.open("POST", "http://localhost:3000/upload");
  ajax.send(formdata);
}

function progressHandler(event) {
  element("loadedtotal").innerHTML = "Cargado " + event.loaded + " bytes de " + event.total;
  var percent = (event.loaded / event.total) * 100;
  element("progressBar").value = Math.round(percent);
  element("status").innerHTML = Math.round(percent) + "% subiendo... por favor espere";
  if (percent == 100) {
    getFiles();
  }
}

function completeHandler(event) {
  element("status").innerHTML = JSON.parse(event.target.responseText).mensaje;
  element("progressBar").value = 0;
}

function errorHandler(event) {
  element("status").innerHTML = "Subida fallida";
}

function abortHandler(event) {
  element("status").innerHTML = "Subida cancelada";
}


/**  FILES LIST */

const filesList = document.querySelector('#files_list');

window.addEventListener('DOMContentLoaded', () => {
  getFiles();
})

const getFiles = () => {
  fetch(URLBASE + '/files')
    .then(data => data.json())
    .then(response => {
      let files = response.files;
      renderFiles(files);
    })
}

const renderFiles = (files) => {
  console.log(files)
  let filesHTML = '';
  files.forEach((file, index) => {
    filesHTML += `
      <div class="item-file">
        <img src="${URLBASE}/${file}" width="300" />
        <div class="form-content">
          <span>${file}</span>
          <div class="form-edit" id="form-edit-${index}" style="display:none">
            <input type="text" id="${index}" placeholder="Nuevo nombre">
            <button onclick="updateFile('${file}','${index}')">&#10004</button>
            <button onclick="hideFormEdit(${index})">&#10006</button>
          </div>
          <div>
            <button type="button" onclick="deleteFile('${file}')">Eliminar</button>
            <button type="button" onclick="showFormEdit(${index})">Editar</button></div>
        </div>
      </div>`
  });
  filesList.innerHTML = filesHTML;
}

const deleteFile = (fileName) => {
  fetch(URLBASE + '/files/' + fileName)
    .then(data => data.json())
    .then(response => {
      console.log(response);
      getFiles();
    })
}

const updateFile = (fileName, index) => {
  let newName = document.getElementById(index).value;
  
  if (newName.length > 0) {
    const splited = fileName.split('.');
    const extension = splited[splited.length - 1];
    newName = `${newName}.${extension}`;
  
    fetch(`${URLBASE}/files/${fileName}/${newName}`)
      .then(data => data.json())
      .then(response => {
        console.log(response);
        getFiles();
      })
  }
  
}

const showFormEdit = (idx) => {
  const formEdit = document.getElementById('form-edit-' + idx);
  formEdit.style.display = 'block';
}

const hideFormEdit = (idx) => {
  const formEdit = document.getElementById('form-edit-' + idx);
  formEdit.style.display = 'none';
}

/* document.addEventListener('click', (e) => {

  if(e.target.matches('#btnEdit')){
    console.log(node)
  }
}) */
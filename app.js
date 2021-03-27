const urlBase = "http://localhost:3000";

fetch()
  .then(data => data.json())
  .then(data => console.log(data))
  .catch(err => console.log(err))

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
    element("loadedtotal").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
    var percent = (event.loaded / event.total) * 100;
    element("progressBar").value = Math.round(percent);
    element("status").innerHTML = Math.round(percent) + "% uploaded... please wait";
    if(percent == 100){
        getFiles();
    }
}

function completeHandler(event) {
    element("status").innerHTML = event.target.responseText;
    element("progressBar").value = 0;
}

function errorHandler(event) {
    element("status").innerHTML = "Upload Failed";
}

function abortHandler(event) {
    element("status").innerHTML = "Upload Aborted";
}


/**  FILES LIST */

const filesList = document.querySelector('#files_list');

window.addEventListener('DOMContentLoaded', () => {
    getFiles();
})

const getFiles = () => {
    fetch(urlBase+'/files')
    .then(data => data.json())
    .then(response => {
        let files = response.files;
        renderFiles(files);
    })
}


const deleteFile = (fileName) => {
    console.log(fileName)
    fetch(urlBase+'/files/'+fileName)
    .then(data => data.json())
    .then(response => {
        console.log(response);
        getFiles();
    })
}

const renderFiles = (files) => {
    let filesHTML = '';
    files.forEach(file => {
        filesHTML += `
        <div class="file">
            <img src="${urlBase}/${file}" width="300" />
            <div>
                <span>Name: ${file} </span>
                <button type="button" onclick="deleteFile('${file}')">Eliminar</button>
            </div>
        </div>`
    });
    filesList.innerHTML = filesHTML;
}
console.log(document.getElementById("skl1"));
function dragStart(event) {
  event.dataTransfer.setData("Text", event.target.id);
  //console.log(document.getElementById(event.target.id)); 
}
function allowDrop(event) {
  console.log(event.target);
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("Text");
  event.target.appendChild(document.getElementById(data));
  event.dataTransfer.clearData("Text");
}

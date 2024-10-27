console.log(document.getElementById("skl1"));

$(document).ready(function(){
  
  let hovercount = 1;
  $(".sklSlot").hover(
    
    function selectAudio(event){
      console.log("Running");
      hovercount++;
      if(hovercount%2==0){
      var select = new Audio('https://github.com/warmest-soup/warmest-soup.github.io/raw/refs/heads/main/Assets/Audio/AbilitySelect.mp3');
      select.play();
      console.log(hovercount);
      
    };
  });
});


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
  var equip = new Audio('https://github.com/warmest-soup/warmest-soup.github.io/raw/refs/heads/main/Assets/Audio/AbilityDrop.mp3');
  equip.play();
}

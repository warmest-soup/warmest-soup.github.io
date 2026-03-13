function allowDrop(event) {
    event.preventDefault();
}
var dataCache = [];
function itemReady(event) {
    event.dataTransfer.setData("Text", event.target);
    dataCache = event.target;
    console.log("Load Item: " + dataCache); 
}
function itemCombine(event) {
    document.getElementById("IngList").insertAdjacentHTML("beforeend", "<div class='mixedItem'>"+dataCache.innerText+"</div>"
    ); 
    
    
    var effects=dataCache.dataset.effects.split(","); 
    var i=0;
    while(i<effects.length){
        document.getElementById("Effects").insertAdjacentHTML("beforeend", "<div class='mixedEffect'>"+effects[i]+"</div>" 
    );        
        i++;
    } 
    
    var causes=dataCache.dataset.causes.split(","); 
    i=0;
    while(i<causes.length){
        document.getElementById("Causes").insertAdjacentHTML("beforeend", "<div class='mixedCause'>"+causes[i]+"</div>"    
    );        
        i++;
    } 
    //Consolidate lists
    var fxList=Array.from(document.getElementById("Effects").children)
    
    var consolidatedList=[];
    
    i=0;
    var j=0;
    while(i<fxList.length){
        j=0;
        var criteria = fxList[i].innerText.match(/\w+ ?\w*/)[0];
        var totalBuff=0;
        while(j<fxList.length){
            if(criteria==fxList[j].innerText.match(/\w+ ?\w*/)[0]){
                totalBuff=totalBuff+parseInt(fxList[j].innerText.match(/[+-]\d+/)[0]);
            }
            j++;
        } 
        if(totalBuff>=0){totalBuff="+"+totalBuff}
        consolidatedList.push("<div class='mixedEffect'>"+criteria+totalBuff+"</div>")
        
        i++;
    } 
    consolidatedList=[...new Set(consolidatedList)];
    document.getElementById("Effects").innerHTML="Effects: ";
    consolidatedList.forEach((x)=>{
        document.getElementById("Effects").insertAdjacentHTML("beforeend",x); 
    })
    //^Effects
    //Causes
    var csList=Array.from(document.getElementById("Causes").children)
    
    consolidatedList=[];
    
    i=0;
    j=0;
    while(i<csList.length){
        j=0;
        criteria = csList[i].innerText.match(/\w+ ?\w*/)[0];
        totalBuff=0;
        while(j<csList.length){
            if(criteria==csList[j].innerText.match(/\w+ ?\w*/)[0]){
                if(csList[j].innerText.match(/[+-]\d+/)){
                    totalBuff=totalBuff+parseInt(csList[j].innerText.match(/[+-]\d+/)[0])
                } else totalBuff=totalBuff+1; 
            }
            j++;
        }
        if(totalBuff>=0){totalBuff="+"+totalBuff}
        consolidatedList.push("<div class='mixedCause'>"+criteria+totalBuff+"</div>")
        
        i++;
    } 
    consolidatedList=[...new Set(consolidatedList)];
    document.getElementById("Causes").innerHTML="Causes: ";
    consolidatedList.forEach((x)=>{
        document.getElementById("Causes").insertAdjacentHTML("beforeend",x);   
    })
    
    
} 
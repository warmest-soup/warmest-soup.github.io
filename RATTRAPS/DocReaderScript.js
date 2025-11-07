/*generate and format links*/{
    var glossaryContent = document.getElementById("Glossary");
    var keyTerms = document.getElementById("Glossary")
        .innerText.split(" ");

    var formatTerms = keyTerms.map((x) => {
        x =
            "<a href='#" + x + "'>" +
            (keyTerms.indexOf(x) + 1) + ". " +
            x + "</a>";
        return x;
    });
    glossaryContent.innerHTML = formatTerms.join("");
}

/*Format all key terms*/{
    var mainText=document.getElementById("mainText");
    var mainFormat=mainText.innerHTML;
     
    //Word exceptions
    var wordSearches=Array.from(keyTerms);
    function updateTerm(id, func){
        wordSearches[keyTerms.indexOf(id)]=func;
    }
    
    updateTerm("Direction", "Direct");
    updateTerm("Char-Sheet", "Sheet");
    updateTerm("Checks", "Check");
    updateTerm("Traits", "Trait");
    updateTerm("Abilities", "Abilit");
    updateTerm("Skills", "Skill");
    updateTerm("Insights", "Insight");
    updateTerm("Battle-Ticket", "Ticket");
    updateTerm("Armor-Grids", "Grid");
    updateTerm("Retirement", "Retire");
    updateTerm("Penalty", "Penalt");
    updateTerm("Incumbents", "Incumbent");
    
    wordSearches.forEach((x)=>{
        var l1=x.substring(0,1);
        var termIndex=wordSearches.indexOf(x)+1;
        var xl=x.substring(1); 
        
        var replacement=
        "<a style='display:inline-block;' href=#"+keyTerms[termIndex-1]+"><i>$3"+xl+"$4<sup>"+termIndex+"</sup></i></a>";
         
        var pattern = new RegExp(
           `((?<!(\"|>|-))(${l1}|${l1.toLowerCase()})${xl}(y|ies|sets|s|'s|es|ed|ment|ion|ing)?)(?!:|s:)`,"g" 
        );
        
        
        mainFormat=mainFormat.replace(
          pattern ,
          replacement
        );
    });
    mainText.innerHTML=mainFormat;
}

/*Format terms entries*/{
    var entries = Array.from(document.getElementsByClassName("Term"));
    entries.forEach((x)=>{
        if(x.parentNode.parentNode.id=="definitions"){
            x.innerText=(keyTerms.indexOf(x.id)+1)+". "+x.innerHTML;
        }
        
    });
}

/*Exectional Exceptions like Deaths/Dies*/{
    mainText.innerHTML=mainText.innerHTML.replace( 
        /(?<!>)([Dd]ie|[Dd]eath)(s?)/g,"<a style='display:inline-block;' href='#Death'><i>$1$2<sup>"+keyTerms.indexOf("Death")+"</sup></i></a>");
}


console.log(mainText.innerHTML);
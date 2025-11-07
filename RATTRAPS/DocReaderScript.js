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
    
    wordSearches[4]="Direct";
    wordSearches[9]="Sheet";
    wordSearches[11]="Check";
    wordSearches[12]="Trait";
    wordSearches[13]="Abilit";
    wordSearches[14]="Skill";
    wordSearches[15]="Insight";
    wordSearches[23]="Ticket";
    wordSearches[29]="Grid";
    wordSearches[31]="Retire";
     
    wordSearches.forEach((x)=>{
        var l1=x.substring(0,1);
        var termIndex=wordSearches.indexOf(x)+1;
        var xl=x.substring(1); 
        
        var replacement=
        "<a style='display:inline-block;' href=#"+keyTerms[termIndex-1]+"><i>$3"+xl+"$4<sup>"+termIndex+"</sup></i></a>";
         
        var pattern = new RegExp(
           `((?<!(\"|>|-))(${l1}|${l1.toLowerCase()})${xl}(y|ies|sets|s|'s|es|ed|ment|ion|ing)?)(?!<|:|s:)`,"g" 
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
        if(x.parentNode.id=="definitions"){
            x.innerText=(keyTerms.indexOf(x.id)+1)+". "+x.innerHTML;
        }
        
    });
}

/*Exectional Exceptions like Deaths/Dies*/{
    mainText.innerHTML=mainText.innerHTML.replace( 
        /([Dd]ie|[Dd]eath)(s?)/g,"<a style='display:inline-block;' href='#Death'><i>$1$2<sup>"+keyTerms.indexOf("Death")+"</sup></i></a>");
}


console.log(mainText.innerHTML);
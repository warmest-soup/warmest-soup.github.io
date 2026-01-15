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
    var mainText = document.getElementById("mainText");
    var mainFormat = mainText.innerHTML;

    //Word exceptions
    var wordSearches = Array.from(keyTerms);
    function updateTerm(id, func) {
        wordSearches[keyTerms.indexOf(id)] = func;
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
    updateTerm("Classes", "Class");
    updateTerm("Bonuses", "Bonus");
    updateTerm("Techniques", "Technique");
    updateTerm("Toxicity", "Toxic");
    updateTerm("Round", "---");
    updateTerm("Memory", "Memor");
    updateTerm("Time", "Hour");
    updateTerm("Shape-Mod.", "Shape");
    updateTerm("Entities", "Entit");
    updateTerm("Power-Lvl", "Power"); 
    updateTerm("Attacks", "Attack"); 
    updateTerm("Battle-Ticket", "Ticket"); 
    updateTerm("Spaces", "Space"); 
    updateTerm("Climbing", "Climb"); 
    updateTerm("Jumping", "Jump"); 
    updateTerm("Movement", "Move"); 
    updateTerm("Dashing", "Dash"); 
    updateTerm("Destabilized", "Destabilize"); 
    updateTerm("Injuries", "Injur"); 
    updateTerm("Health-Points", "HP"); 
    updateTerm("Bleeding", "Bleed"); 
    updateTerm("Retirement", "Retire"); 
    updateTerm("Mundanity", "Mundan"); 
    updateTerm("Ethereality", "Ethereal"); 
    updateTerm("Objects", "Object"); 
    updateTerm("Potency", "Potenc");
    updateTerm("Properties", "Propert");
    updateTerm("Materials", "Material"); 
    updateTerm("Mutation", "Mutat");
    updateTerm("Custom-Tech", "Custom");
    updateTerm("Relevance", "Relevan");
    


    wordSearches.forEach((x) => {
        var l1 = x.substring(0, 1);
        var termIndex = wordSearches.indexOf(x) + 1;
        var xl = x.substring(1);

        var replacement =
            "<a style='display:inline-block;' href=#" + keyTerms[termIndex - 1] + "><i>$3" + xl + "$4<sup>" + termIndex + "</sup></i></a>";

        var pattern = new RegExp(
            `((?<!(\"|>|-|\\w))(${l1}|${l1.toLowerCase()})${xl}(y|ies|sets|s|'s|y's|es|ed|e|t|ce|ful|ment|ity|led|ions|ion|ing|al|d)?)(?!:|s:|or|ment:|=")`, "g"
        );  


        mainFormat = mainFormat.replace(
            pattern,
            replacement
        );
    });
    mainText.innerHTML = mainFormat;
}

/*Format terms entries*/{
    var entries = Array.from(document.getElementsByClassName("Term"));
    entries.forEach((x) => {
        if (x.parentNode.parentNode.id == "definitions") {
            x.innerText = (keyTerms.indexOf(x.id) + 1) + ". " + x.innerHTML;
        }

    });
}

/*Exectional Exceptions like Deaths/Dies*/{
    //Death
    mainText.innerHTML = mainText.innerHTML.replace(
        /(?<!>|")([Dd]ie|[Dd]eath)(s?)(?!\w|-|:)/g, "<a style='display:inline-block;' href='#Death'><i>$1$2<sup>" + keyTerms.indexOf("Death") + "</sup></i></a>"
    );

    //DP
    updateTerm("Death-Points", "DP");
    mainText.innerHTML = mainText.innerHTML.replace(
        /(?<!>)DP(?!<)/g, "<a style='display:inline-block;' href='#Death-Points'><i>DP<sup>" + keyTerms.indexOf("Death-Points") + "</sup></i></a>"
    );
    // Combat Round "Rounding"
    updateTerm("Round", "Round");
    mainText.innerHTML = mainText.innerHTML.replace(
        /(?<!id=\"|\w|>)(R|r)ound(s)?(?!:)\b/g, "<a style='display:inline-block;' href='#Round'><i>$1ound<sup>" + keyTerms.indexOf("Round") + "</sup></i></a>");  
        

}

/*UrlHighlight*/{

    var reader = document.getElementById("reader");


    function highlight() {
        var Hilights = Array.from(document.getElementsByClassName("Highlight"));
        Hilights.forEach((x) => x.classList.remove("Highlight"));

        document.getElementById(window.location.hash.substring(1)).classList.add("Highlight");

        reader.scrollBy({
            top: -window.innerHeight * .05,
            behavior: "smooth"
        });
    };


    if(window.location.hash){highlight();}
    window.addEventListener('hashchange', function (){
        highlight();
    })
}


//console.log(mainText.innerHTML); 
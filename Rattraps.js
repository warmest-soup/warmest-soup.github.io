//Calculate EXP goal for next level of trait
function expGoalCalc(real, exp, goal) {
  if (real.value) {
    let numbers = real.value.match(/\d+/g);
    let parsedNumbers = numbers.map((num) => parseInt(num, 10));
    var traitLv = Math.min(...parsedNumbers);
    var expGoal = (traitLv + 1) * 10;
    if ((traitLv || traitLv === 0) && traitLv < 5 && traitLv >= 0) {
      var outputTxt = "/" + expGoal;
      exp.style.display = "inline";
      goal.innerText = outputTxt;
    } //
    if ((traitLv || traitLv === 0) && traitLv >= 5) {
      var outputTxt = "★";
      exp.style.display = "none";
      goal.innerText = outputTxt;
    }
  }
}
//Character Level
function levelCalc() {
  var reals = document.getElementsByClassName("realTrait");
  var ranks = document.getElementsByClassName("Rank");

  var i = 0;
  var traitTotal = 0;
  while (i < reals.length) {
    traitTotal = traitTotal + parseInt(reals[i].value);
    i++;
  }
  i = 0;
  var abilTotal = 0;
  while (i < ranks.length) {
    if (ranks[i].value) {
      abilTotal =
        abilTotal +
        ranks[i].value
          .match(/\d+/g)
          .reduce((acc, curr) => parseInt(acc) + parseInt(curr), 0);
    }
    i++;
  }
  if (traitTotal) {
    document.getElementById("CharacterLevel").innerText =
      abilTotal + traitTotal - 22;
  }
}
//Calculate Functional Trait values
function funcTraits() {
  var reals=document.getElementsByClassName("realTrait");
  var catBonuses=document.getElementsByClassName("CatBonus")
  var traitBonuses=document.getElementsByClassName("traitBonus")
  var traitFuncs=document.getElementsByClassName("traitFunc")
  
  var i=0;
  var j=0;
  while(i<reals.length){
    traitFuncs[i].innerText=parseInt(reals[i].value)+parseInt(traitBonuses[i].value)+parseInt(catBonuses[Math.floor(j)].value); 
    if(parseInt(traitFuncs[i].innerText)>6){traitFuncs[i].innerText=6}
    if(parseInt(traitFuncs[i].innerText)<0){traitFuncs[i].innerText=0}
    
    j=j+0.334;
    i++;
  }
}

//Function Calls
document
  .getElementById("CharacterSheet")
  .addEventListener("input", function (event) {
    //Exp Calculator
    if (event.target.classList.contains("realTrait")) {
      expGoalCalc(
        event.target,
        event.target.parentNode.parentNode.children[0].children[0],
        event.target.parentNode.parentNode.children[0].children[1]
      );
    }
    //Character Level
    if (
      event.target.classList.contains("realTrait") ||
      event.target.classList.contains("Rank")
    ) {
      levelCalc();
    }
    //Category Bonuses real, catBonus, traitBonus, traitFunc)
    if (event.target.id.includes("Bonus") ||event.target.classList.contains("realTrait") ) {
      funcTraits();
    }
  console.log(event.target.parentNode.parentNode)
  });

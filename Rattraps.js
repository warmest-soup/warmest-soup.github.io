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


//Function Calls
document.getElementById("CharacterSheet").addEventListener("input", function(event){
  //Exp Calculator
  if(event.target.classList.contains("realTrait")){
    expGoalCalc(event.target,
       event.target.parentNode.parentNode.children[0].children[0],
                event.target.parentNode.parentNode.children[0].children[1]);
  }
});

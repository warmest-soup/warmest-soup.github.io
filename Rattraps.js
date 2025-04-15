/*Operations to perform on load*/ {
  var SatBars = document.getElementsByClassName("satBar");
  var barDups = SatBars.length - 4;
  fedStatus();
  document.getElementById("SaveIndicator").style.background="cyan"
}

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
  var reals = document.getElementsByClassName("realTrait");
  var catBonuses = document.getElementsByClassName("CatBonus");
  var traitBonuses = document.getElementsByClassName("traitBonus");
  var traitFuncs = document.getElementsByClassName("traitFunc");

  var adjFunc;
  var i = 0;
  var j = 0;
  while (i < reals.length) {
    adjFunc =
      parseInt(reals[i].value) +
      parseInt(traitBonuses[i].value) +
      parseInt(catBonuses[Math.floor(j)].value);
    if (adjFunc) {
      traitFuncs[i].innerText = adjFunc;
    }
    if (parseInt(traitFuncs[i].innerText) > 6) {
      traitFuncs[i].innerText = 6;
    }
    if (parseInt(traitFuncs[i].innerText) < 0) {
      traitFuncs[i].innerText = 0;
    }

    j = j + 0.334;
    i++;
  }
}
//Card Limits
function cardLimits() {
  var stamVal = parseInt(document.getElementById("staFunc").innerText);
  var intelVal = parseInt(document.getElementById("intFunc").innerText);
  var wildMax = Math.min(stamVal, intelVal) * 5;
  document.getElementById("WildCardTotal").innerText = " / " + wildMax;

  //Secondary
  var wildMax = Math.abs(stamVal - intelVal) * 5;
  document.getElementById("2ndCardTotal").innerText = " / " + wildMax;
  if (stamVal > intelVal) {
    document.getElementById("card2Type").textContent = "SKL Cards";
    document.getElementById("Cards2").style.display = "inline";
  }
  if (stamVal < intelVal) {
    document.getElementById("card2Type").textContent = "INS Cards";
    document.getElementById("Cards2").style.display = "inline";
  }
  if (stamVal == intelVal) {
    document.getElementById("card2Type").textContent = "-";
    document.getElementById("Cards2").style.display = "none";
  }
}
//sat bar functionality
function satBarFill(bar, value) {
  value = parseInt(value.value);
  var hungerMax = parseInt(document.getElementById("conFunc").innerText) * 10;
  var scale = hungerMax / value;
  var fillHeight = 26.5 / scale;

  if (value > hungerMax) {
    bar.children[0].style.height = "26.5em";
    bar.style.border = "solid, red, .15em";
  } else {
    bar.children[0].style.height = fillHeight + "em";
    bar.style.border = "solid, black, .15em";
  }
  if (value < hungerMax / 2) {
    bar.children[0].style.backgroundColor = "red";
  } else {
    bar.children[0].style.backgroundColor = "black";
  }
  if (value == 0 && bar.id != "stBar") {
    bar.style.border = "solid red .15em";
  }
}
//add Toxic Bars
function dupBar() {
  var newBar = document.getElementById("Toxic").cloneNode(true);
  var button = document.getElementById("dupButton");
  var madeBar = document.getElementById("SatMiddle").appendChild(newBar);

  barDups = SatBars.length - 4;
  madeBar.children[1].children[0].id = "Dup" + barDups;

  var newInput = document.getElementById("Dup" + barDups);
  button.parentNode.appendChild(button);

  //Toxic.push(newInput);

  barDups++;
}
//Weight Handling
function weightGoalCalc() {
  var exp = document.getElementById("wgtExp");
  var real = document.getElementById("wgtReal");
  var goal = document.getElementById("wgtGoal");

  if (real.value && 1 < real.value && real.value < 5) {
    var level = parseInt(real.value);
    var expGoal = Math.abs(level - 3) * 10 + 30;
    goal.innerText = "/" + expGoal;
  } else if (real.value) {
    expGoal = 50;
    goal.innerText = "/" + expGoal;
  }

  //FunctionalTraits
  var bonus = document.getElementById("wgtBonus");
  var func = document.getElementById("wgtFunc");
  var invBonus = "";
  var adjFunc = parseInt(real.value) + parseInt(bonus.value);

  if (invBonus) {
    adjFunc = adjFunc + parseInt(invBonus.value);
  }
  if (adjFunc || adjFunc === 0) {
    func.innerHTML = Math.max(adjFunc, 0);
  }
}

var underfed = false;
var overfed = false;
function fedStatus() {
  var hunger = parseInt(document.getElementById("HungerVal").value);
  var hungerMax = parseInt(document.getElementById("conFunc").innerText) * 10;
  var hungerMin = hungerMax / 2;

  if (hunger < hungerMin && hunger) {
    underfed = true;
  } else {
    underfed = false;
  }
  if (hunger > hungerMax && hunger) {
    overfed = true;
  } else {
    overfed = false;
  }
}

function weightExp() {
  var real = document.getElementById("wgtReal");
  var goal = document.getElementById("wgtGoal");
  var exp = document.getElementById("wgtExp");
  var hungerMax = parseInt(document.getElementById("conFunc").innerText) * 10;
  var hungerMin = hungerMax / 2;
  var hunger = parseInt(document.getElementById("HungerVal").value);
  goal = parseInt(goal.innerText.slice(1));

  console.log(hungerMin);
  if (hunger < hungerMin && hunger && !underfed) {
    underfed = true;
    exp.value--;
    if (exp.value * -1 >= goal && real.value > 1) {
      real.value = parseInt(real.value) - 1;
      exp.value = -1;
      weightGoalCalc();
    }
  }
  if (hunger > hungerMax && hunger && !overfed) {
    exp.value++;
    if (exp.value >= goal && real.value < 5) {
      real.value = parseInt(real.value) + 1;
      exp.value = 0;
      weightGoalCalc();
    }
  }
  fedStatus();
}
//PassTime
function passHour() {
  var Hour=document.getElementById("CurrentHour");
  var Hunger = document.getElementById("HungerVal");
  var Water = document.getElementById("WaterVal");
  var Sleep = document.getElementById("SleepVal");
  var Toxic = document.getElementById("ToxicVal");
  
  var newHour = parseInt(Hour.innerText) + 1;
  /*Sat Decay*/ {
    //Temp Modification
    var coldModded = 1;
    var hotModded = 1;
    if (document.getElementById("coldMultiplier").innerText > 0) {
      coldModded = document.getElementById("coldMultiplier").innerText;
    } else if (document.getElementById("hotMultiplier").innerText > 0) {
      hotModded = document.getElementById("hotMultiplier").innerText;
    }
    Hunger.value = Hunger.value - coldModded;
    if (Hunger.value < 0) {
      Hunger.value = 0;
    }
    Water.value = Water.value - hotModded;
    if (Water.value < 0) {
      Water.value = 0;
    }
    Sleep.value--;
    if (Sleep.value < 0) {
      Sleep.value = 0;
    }
    //Additional Toxic Bars
    var t = 0;
    while (t < Toxic.length) {
      Toxic[t].value--;
      satBarFill(Toxic[t].parentNode.children[1], Toxic[t]);
      t++;
    }
    /*Preventing Primary 
      Toxic from becoming negative (Additional Toxics can be negative)*/
    if (Toxic[0].value < 0) {
      Toxic[0].value = 0;
    }
    //Adjust Bar Sizes
    satBarFill(
      document.getElementById("shBar"),
      document.getElementById("HungerVal")
    );
    satBarFill(
      document.getElementById("swBar"),
      document.getElementById("WaterVal")
    );
    satBarFill(
      document.getElementById("szBar"),
      document.getElementById("SleepVal")
    );
    satBarFill(
      document.getElementById("stBar"),
      document.getElementById("ToxicVal")
    );
    weightExpGain(
      document.getElementById("wgtReal"),
      document.getElementById("wgtExp"),
      document.getElementById("wgtGoal"),
      Hunger,
      document.getElementById("conFunc")
    );
  }
  if (newHour > 23) {
    dayCount();
    expDecay();
  }
  newHour = newHour % 24;
  Hour.innerText = String(newHour).padStart(2, "0");
}
//Sleep functionality
function sleep() {
  var sleepVal = document.getElementById("TimeToSleep");
  var sleepHours = parseInt(sleepVal.value);
  var newHour = parseInt(Hour.innerText) + sleepHours;
  if (
    confirm(
      "CAREFUL!\nAre you sure you want to sleep for " +
        sleepHours +
        " Hours?\nYou should only proceed if you've already woken up."
    )
  ) {
    /*Sat Decay*/ {
      //TempModifier
      var coldModded = sleepHours;
      var hotModded = sleepHours;
      if (document.getElementById("coldMultiplier").innerText > 0) {
        coldModded =
          sleepHours * document.getElementById("coldMultiplier").innerText;
      } else if (document.getElementById("hotMultiplier").innerText > 0) {
        hotModded =
          sleepHours * document.getElementById("hotMultiplier").innerText;
      }
      console.log(document.getElementById("coldMultiplier").innerText);

      Hunger.value = Hunger.value - Math.ceil(coldModded / 2);
      if (Hunger.value < 0) {
        Hunger.value = 0;
      }
      Water.value = Water.value - Math.ceil(hotModded / 2);
      if (Water.value < 0) {
        Water.value = 0;
      }
      Sleep.value = parseInt(Sleep.value) + sleepHours * 2;
      if (Sleep.value < 0) {
        Sleep.value = 0;
      }
      //Additional Toxic Bars
      var t = 0;
      while (t < Toxic.length) {
        Toxic[t].value = Toxic[t].value - Math.ceil(sleepHours / 2);
        satBarFill(Toxic[t].parentNode.children[1], Toxic[t]);
        t++;
      }
      //Preventing Primary Toxic from becoming negative (Additional Toxics can be negative)
      if (Toxic[0].value < 0) {
        Toxic[0].value = 0;
      }
      //Adjust Bar Sizes
      satBarFill(
        document.getElementById("shBar"),
        document.getElementById("HungerVal")
      );
      satBarFill(
        document.getElementById("swBar"),
        document.getElementById("WaterVal")
      );
      satBarFill(
        document.getElementById("szBar"),
        document.getElementById("SleepVal")
      );
      satBarFill(
        document.getElementById("stBar"),
        document.getElementById("ToxicVal")
      );
      weightExpGain(
        document.getElementById("wgtReal"),
        document.getElementById("wgtExp"),
        document.getElementById("wgtGoal"),
        Hunger,
        document.getElementById("conFunc")
      );
    }

    var daysPassed = Math.floor(newHour / 24);
    if (newHour > 23) {
      while (daysPassed > 0) {
        dayCount();
        expDecay();
        daysPassed--;
      }
    }
    newHour = newHour % 24;
    Hour.innerText = String(newHour).padStart(2, "0");
    sleepVal.value = 0;
  }
}

//Function Calls
document
  .getElementById("CharacterSheet")
  .addEventListener("change", function (event) {
    if (
      //Exp Calculator
      event.target.classList.contains("realTrait")
    ) {
      expGoalCalc(
        event.target,
        event.target.parentNode.parentNode.children[0].children[0],
        event.target.parentNode.parentNode.children[0].children[1]
      );
    }
    if (
      //Character Level
      event.target.classList.contains("realTrait") ||
      event.target.classList.contains("Rank")
    ) {
      levelCalc();
    }
    if (
      //Functional Trait Values
      event.target.id.includes("Bonus") ||
      event.target.classList.contains("realTrait")
    ) {
      funcTraits();
      cardLimits();

      //Functional trait based functions
      fedStatus();
      weightExp();

      var i = 0;
      while (i < SatBars.length) {
        satBarFill(
          SatBars[i],
          SatBars[i].parentNode.parentNode.children[1].children[0]
        );
        i++;
      }
    }
    if (
      //Sat bar functions
      event.target.parentNode.classList.contains("satVal")
    ) {
      satBarFill(event.target.parentNode.children[1], event.target);
      weightGoalCalc();
      weightExp();
    }
    if (
      //Sat bar functions
      event.target.id.includes("dup")
    ) {
      satBarFill(event.target.parentNode.children[1], event.target);
    }
    if (event.target.id.includes("wgt")) {
      weightGoalCalc();
    }

    //console.log(event.target.id.includes("wgt"))
  document.getElementById("SaveIndicator").style.background="yellow"
  });

/*Initial calls*/ {
  funcTraits();
  cardLimits();
  weightGoalCalc();

  var i = 0;
  while (i < SatBars.length) {
    satBarFill(
      SatBars[i],
      SatBars[i].parentNode.parentNode.children[1].children[0]
    );
    i++;
  }
}

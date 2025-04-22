//Operations to perform on load
var SatBars = document.getElementsByClassName("satBar");
var barDups = SatBars.length - 4;
var Slots = document.getElementsByClassName("AbilSlot");
var abilities = document.getElementsByClassName("Ability");
var Ranks = document.getElementsByClassName("Rank");
var Exp = document.getElementsByClassName("EXPvalue");
var TraitRanks = document.getElementsByClassName("realTrait");
var worldTemp = 0;

document.getElementById("SaveIndicator").style.background = "cyan";

function initializeSheet() {
  SatBars = document.getElementsByClassName("satBar");
  barDups = SatBars.length - 4;
  worldTemp = 0;

  Slots = document.getElementsByClassName("AbilSlot");
  abilities = document.getElementsByClassName("Ability");
  Ranks = document.getElementsByClassName("Rank");
  Exp = document.getElementsByClassName("EXPvalue");
  TraitRanks = document.getElementsByClassName("realTrait");

  fedStatus();
  carryWeight();
  funcTraits();
  cardLimits();
  weightGoalCalc();
  slotMemoryLimits();
  carryWeight();

  var i = 0;
  while (i < SatBars.length) {
    satBarFill(
      SatBars[i],
      SatBars[i].parentNode.parentNode.children[1].children[0]
    );
    i++;
  }
  document.getElementById("SaveIndicator").style.background = "cyan";
}

//Declarations
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
  indirectChange();
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
function remBar() {
  indirectChange();
  var sat = document.getElementById("SatMiddle");
  var barsToGo = barDups;
  if (barDups > 0) {
    sat.children[sat.children.length - 2].remove();
    barDups--;
  }
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
//Day Counter
function dayCount() {
  var day = document.getElementById("currentDay");
  var newDay = parseInt(day.innerText) + 1;
  day.innerText = String(newDay).padStart(4, "0");
}
//Manual Event Trigger for non-inputs
function indirectChange() {
  document.getElementById("SaveIndicator").style.background = "yellow";
}
//PassTime
function passHour() {
  indirectChange();
  var Hour = document.getElementById("CurrentHour");
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

    var t = 3;
    while (t < SatBars.length) {
      SatBars[t].parentNode.children[0].value--;
      satBarFill(SatBars[t], SatBars[t].parentNode.children[0]);

      t++;
    }
    /*Preventing Primary 
      Toxic from becoming negative (Additional Toxics can be negative)*/
    if (SatBars[3].parentNode.children[0].value < 0) {
      SatBars[3].parentNode.children[0].value = 0;
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
    weightExp();
  }
  if (newHour > 23) {
    dayCount();
    expDecay();
  }
  newHour = newHour % 24;
  Hour.innerText = String(newHour).padStart(2, "0");

  //increment Weather
  worldTemp();
}
//ExpDecay
function expDecay() {
  var exp = document.getElementsByClassName("EXPvalue");
  var secSklMem = Math.min(
    parseInt(document.getElementById("spdFunc").innerText),
    parseInt(document.getElementById("dexFunc").innerText)
  );
  var secInsMem = Math.min(
    parseInt(document.getElementById("wisFunc").innerText),
    parseInt(document.getElementById("intFunc").innerText)
  );
  var i = 0;
  while (i < exp.length) {
    if (exp[i].className.includes("aexp")) {
      if (
        exp[i].parentNode.parentNode.parentNode.parentNode.className.includes(
          "Forgotten"
        ) &&
        exp[i].parentNode.parentNode.parentNode.id.includes("Skill")
      ) {
        exp[i].value = exp[i].value - (5 - secSklMem) - 1;
        if (exp[i].value < -1) {
          exp[i].value = -1;
        }
      } else if (
        exp[i].parentNode.parentNode.parentNode.parentNode.className.includes(
          "Forgotten"
        ) &&
        exp[i].parentNode.parentNode.parentNode.id.includes("Insight")
      ) {
        exp[i].value = exp[i].value - (5 - secInsMem) - 1;
        if (exp[i].value < -1) {
          exp[i].value = -1;
        }
      } else {
        exp[i].value--;
        if (exp[i].value < -1) {
          exp[i].value = -1;
        }
      }
    } else {
      exp[i].value--;
      if (exp[i].value < -1) {
        exp[i].value = -1;
      }
    }
    i++;
  }
}
//Sleep functionality
function sleep() {
  indirectChange();
  var Hour = document.getElementById("CurrentHour");
  var Hunger = document.getElementById("HungerVal");
  var Water = document.getElementById("WaterVal");
  var Sleep = document.getElementById("SleepVal");
  var Toxic = document.getElementById("ToxicVal");
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
      var t = 3;
      while (t < SatBars.length) {
        SatBars[t].parentNode.children[0].value =
          SatBars[t].parentNode.children[0].value - Math.ceil(sleepHours / 2);
        satBarFill(SatBars[t], SatBars[t].parentNode.children[0]);

        t++;
      }
      /*Preventing Primary 
      Toxic from becoming negative (Additional Toxics can be negative)*/
      if (SatBars[3].parentNode.children[0].value < 0) {
        SatBars[3].parentNode.children[0].value = 0;
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
      weightExp(
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

  //incrementWeather
  worldTemp();
}
//Open windows (Imported As is)
var openWinlettes = 0;
function openWinlette(winID) {
  if (winID.style.display === "none" || winID.style.display === "") {
    winID.style.display = "block";
    winID.style.zIndex = String(openWinlettes);
    openWinlettes++;
  } else {
    winID.style.display = "none";
  }
}
function togSec(target, section) {
  if (target.checked) {
    section.style.display = "flex";
  } else {
    section.style.display = "none";
  }
}
//add new abilities
function addAbillity() {
  var type;
  if (document.getElementById("Atype").checked) {
    type = "Skill";
  } else {
    type = "Insight";
  }
  var name = document.getElementById("Aname").value;
  var des = document.getElementById("Ades").value;

  if (type && name && des) {
    var i = 0;
    var aID = abilities.length;
    while (i < Slots.length) {
      if (Slots[i].className.includes("openAbil")) {
        var NewAbil =
          "<span id='" +
          type +
          aID +
          "' class='Ability' draggable='true' ondragstart='abilDragStart(event)'><div><span><input class='SingleInputNUM EXPvalue SaveInput aexp' placeholder='0' /><span class='abilGoal'>/0</span>|</span><Button onClick='openWinlette(" +
          type +
          aID +
          "Info)'>" +
          name +
          "</Button><span>|<input class='SingleInputNUM SaveInput Rank' placeholder='0' /></span></div><pre id='" +
          type +
          aID +
          "Info' class='AbilityInfo'>" +
          des +
          "</pre></span>";

        Slots[i].classList.remove("openAbil");
        Slots[i].insertAdjacentHTML("afterBegin", NewAbil);

        let Rank = abilities[aID].children[0].children[2].children[0];
        let aExp = abilities[aID].children[0].children[0].children[0];
        let aGoal = abilities[aID].children[0].children[0].children[1];

        expGoalCalc(Rank, aExp, aGoal);
        abilities[aID].children[0].children[2].children[0].addEventListener(
          "input",
          function () {
            expGoalCalc(Rank, aExp, aGoal);
            levelCalc(TraitRanks, Ranks);
          }
        );

        i = Slots.length;
      }
      i++;
    }
    openWinlette(addAbilWindow);
    document.getElementById("Aname").value = "";
    document.getElementById("Ades").value = "";
  } else {
    window.alert("Some fields were left blank.");
  }
}
//Open Skill index (Needs to redirect to github site!)1
function openIndex() {
  let newWindow = window.open("", "_blank");
  newWindow.document.write(
    "<iframe src='https://docs.google.com/document/d/e/2PACX-1vRA3LIVvco5Lc4NR9Dxi-Krf13BdxfAH6CXNXLG1f-cvnalKG1SydpMTYj4Vl0Z29lTwRtKG3JrQq9o/pub?embedded=true'  style='top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;' allowfullscreen></iframe> "
  );
}
//Open Rule Book (Needs to redirect to github site!)
function openRules() {
  let newWindow = window.open("", "_blank");
  newWindow.document.write(
    "<iframe src='https://docs.google.com/spreadsheets/d/e/2PACX-1vQ4bLLyQ1JlPZddxvJGvM2rugr-L4OnbdX4bHG092FUk8QLNGEMxAtHsBQByo47EG051ltYlDcVILd9/pubhtml?widget=true&amp;headers=false' style='top: 0; left: 0; width: 50%; height: 50%; position: absolute; border: 1em;'></iframe> ></iframe>"
  );
}
//Color Ability Slots based on memory
function slotMemoryLimits(abil, dropTarget) {
  spd = parseInt(document.getElementById("spdFunc").innerText);
  dex = parseInt(document.getElementById("dexFunc").innerText);
  int = parseInt(document.getElementById("intFunc").innerText);
  wis = parseInt(document.getElementById("wisFunc").innerText);
  var slots = Slots;
  var priSklMem = Math.min(spd, dex);
  var priInsMem = int;
  var secSklMem = Math.max(spd, dex);
  var secInsMem = wis;
  var SKLmemory = priSklMem * 5;
  var INSmemory = priInsMem * 5;
  var aKey = [];

  var i = 0;
  //Create key for ability decay to run later
  while (i < abilities.length) {
    if (abilities[i].parentNode.className.includes("Forgotten")) {
      aKey.push(true);
    } else {
      aKey.push(false);
    }
    i++;
  }
  //Assign Forgotten&Haze tags
  i = 0;
  while (i < slots.length) {
    slots[i].classList.remove("Hazed");
    slots[i].classList.remove("Forgotten");
    i++;
  }
  i = 0;
  while (i < 50) {
    if (i <= SKLmemory) {
      slots[i].style = "background-color:white;";
    }
    if (i >= SKLmemory) {
      slots[i].style = "background-color:#bbb;";
      if (slots[i].classList[2] != "Hazed") {
        slots[i].classList.add("Forgotten");
      }
    }
    if (i >= SKLmemory && i + 1 <= SKLmemory + secSklMem) {
      slots[i].style = "background-color:#ddd;";
      slots[i].classList.add("Hazed");
      slots[i].classList.remove("Forgotten");
    }
    i++;
  }
  while (i < 100) {
    if (i <= INSmemory + 50) {
      slots[i].style = "background-color:white;";
    }
    if (i >= INSmemory + 50) {
      slots[i].style = "background-color:#bbb;";
      if (slots[i].classList[2] != "Hazed") {
        slots[i].classList.add("Forgotten");
      }
    }
    if (i >= INSmemory + 50 && i + 1 <= INSmemory + secInsMem + 50) {
      slots[i].style = "background-color:#ddd;";
      slots[i].classList.add("Hazed");
      slots[i].classList.remove("Forgotten");
    }
    i++;
  }
  if (abil && dropTarget.className.includes("Forgotten")) {
    var forgotA = document.getElementById(abil);
    if (!forgotA.parentNode.className.includes("Forgotten")) {
      var exp = document.getElementById(abil).children[0].children[0]
        .children[0];
      exp.value = parseInt(exp.value * 0.8);
    }
  }
  if (!abil) {
    i = 0;
    while (i < abilities.length) {
      if (!aKey[i] && abilities[i].parentNode.className.includes("Forgotten")) {
        var exp = abilities[i].children[0].children[0].children[0];
        exp.value = parseInt(exp.value * 0.8);
      }
      i++;
    }
  }
}
function abilExp() {
  var i = 0;
  while (i < abilities.length) {
    let Rank = abilities[i].children[0].children[2].children[0];
    let aExp = abilities[i].children[0].children[0].children[0];
    let aGoal = abilities[i].children[0].children[0].children[1];

    expGoalCalc(Rank, aExp, aGoal);
    levelCalc();
    i++;
  }
}
//Range Output display
function rangeReadout(range, out) {
  out.innerText = range.value;
  thermoBarFunc(worldTemp);
  indirectChange();
}
//Thermo Bar Functionality
function thermoBarFunc(temp) {
  var bar = document.getElementById("ThermBar");
  var fill = document.getElementById("ThermFill");

  var effects = bar.parentNode.parentNode.children[0].children;
  var context = parseInt(
    document.getElementById("TempContextReadout").innerText
  );
  var barScale = 35 / (conFunc.innerText * 5);
  var tempState = Math.abs(Math.round((temp + context) / conFunc.innerText));
  var barHeight = (temp + context) * barScale + 35 / 2;

  fill.style.height = barHeight + "em";

  if (barHeight < 0) {
    fill.style.height = "0em";
  }

  if (barHeight > (35 / 5) * 3) {
    effects[1].style.color = "red";
    bar.style.borderColor = "red";
    document.getElementById("hotMultiplier").innerText = tempState + 1;
    document.getElementById("hotFx").innerText = tempState;
  } else {
    effects[1].style.color = "black";
    bar.style.borderColor = "black";
    document.getElementById("hotMultiplier").innerText = 0;
    document.getElementById("hotFx").innerText = 0;
  }
  if (barHeight > (35 / 5) * 4) {
    effects[0].style.color = "red";
    document.getElementsByClassName("burnFx")[0].innerText = tempState - 1;
    document.getElementsByClassName("burnFx")[1].innerText = tempState - 1;
  } else {
    effects[0].style.color = "black";
    document.getElementsByClassName("burnFx")[0].innerText = 0;
    document.getElementsByClassName("burnFx")[1].innerText = 0;
  }
  if (barHeight < (35 / 5) * 2) {
    effects[3].style.color = "blue";
    bar.style.borderColor = "blue";
    document.getElementById("coldMultiplier").innerText = tempState + 1;
    document.getElementById("coldFx").innerText = tempState;
  } else if (barHeight < (35 / 5) * 3) {
    effects[3].style.color = "black";
    bar.style.borderColor = "black";
    document.getElementById("coldMultiplier").innerText = 0;
    document.getElementById("coldFx").innerText = tempState;
  }
  if (barHeight < (35 / 5) * 1) {
    effects[4].style.color = "blue";
    document.getElementsByClassName("freezeFx")[0].innerText = tempState - 1;
    document.getElementsByClassName("freezeFx")[1].innerText = tempState - 1;
  } else if (barHeight < (35 / 5) * 3) {
    effects[4].style.color = "black";
    document.getElementsByClassName("freezeFx")[0].innerText = 0;
    document.getElementsByClassName("freezeFx")[1].innerText = 0;
  }
}
//Manage Notes Pages
function newPage(action) {
  var notes = document.getElementById("notesPages");
  var pageTotal = document.getElementById("pageTotal");
  //Add a page
  if (action.match("add")) {
    var newPage =
      "<div id=Page" +
      (notes.children.length + 1) +
      "' class='notesPage'><textArea class='UserNote SaveInputSP' style='resize:none;' spellcheck='false'></textArea><div>Page " +
      (notes.children.length + 1) +
      "</div></div>";

    notes.children[notes.children.length - 1].insertAdjacentHTML(
      "afterEnd",
      newPage
    );
    pageTotal.innerText = String(parseInt(pageTotal.innerText) + 1).padStart(
      2,
      "0"
    );
  }
  //Remove a page
  if (action.match("remove") && notes.children.length > 1) {
    notes.children[notes.children.length - 1].remove();
    pageTotal.innerText = String(parseInt(pageTotal.innerText) - 1).padStart(
      2,
      "0"
    );
  }
}
// Carry Weight
function carryWeight() {
  var carryLimit = document.getElementById("CarryWeight");
  carryLimit.innerText =
    parseInt(document.getElementById("strFunc").innerText) * 25;
}
//setHandedness
function setHand() {
  var dd = document.getElementById("HandDropdown");
  var d0 =
    "<select id='HandDropdown' class='SaveInputSP'onchange='setHand()'> <option id='Unset'>Unset</option> <option id='Left'>Left</option><option id='Right'>Right</option></select>";
  var newSelect = event.target.value;

  dd.outerHTML = d0;
  document.getElementById(newSelect).outerHTML =
    "<option id='" + newSelect + "' selected>" + newSelect + "</option>";
}
//Duplicate the tech & armor sections when making new armor items
function dupSection(target) {
  newSection = target.parentNode.cloneNode("true");
  target.parentNode.parentNode.appendChild(newSection);
}
//Remove New Tech slots when creating items
function NewItemTechRemove(target) {
  if (target.parentNode.parentNode.children.length > 1) {
    target.parentNode.remove();
  }
}
//Create new Inventory Items
function createItem() {
  var itemStats = document.getElementsByClassName("ItemStat");
  var itemName = document.getElementById("itemName").value;

  document
    .getElementById("INVcolumn3")
    .insertAdjacentHTML(
      "beforeend",
      "<div id='" +
        itemName +
        "' class='INV item' data-size='" +
        itemStats[0].value +
        "' data-weight='" +
        itemStats[1].value +
        "' draggable='true' ondragstart='INVDragStart(event)'>" +
        itemName +
        "</div>"
    );
  var newItem = document.getElementById(itemName);

  if (document.getElementById("isWeapon").checked) {
    var weaponStats = Array.from(
      document.getElementsByClassName("newWeaponStat")
    ).map((x) => x.value);
    var weaponData = "";
    weaponStats.map((x) => (weaponData = weaponData + x + ", "));
    weaponData = weaponData.slice(0, -2);

    Array.from(document.getElementsByClassName("newWeaponStat")).map(
      (x) => (x.value = "")
    );

    newItem.setAttribute("data-weaponStats", weaponData);
  }
  if (document.getElementById("isArmor").checked) {
    //Coverage
    var armorCoverage = Array.from(
      document.getElementsByClassName("naSpotCover")
    ).map((x) => {
      if (x.checked == true) {
        return "tt";
      } else {
        return "f";
      }
    });
    var armorCoverData = "";
    armorCoverage.map((x) => (armorCoverData = armorCoverData + x + ", "));
    armorCoverData = armorCoverData.slice(0, -2);

    Array.from(document.getElementsByClassName("naSpotCover")).map(
      (x) => (x.checked = false)
    );

    newItem.setAttribute("data-Coverage", armorCoverData);

    //Stats
    var armorStats = Array.from(
      document.getElementsByClassName("NewArmorStat")
    ).map((x) => x.value);
    var armorData = "";
    armorStats.map((x) => (armorData = armorData + x + ", "));
    armorData = armorData.slice(0, -2);

    Array.from(document.getElementsByClassName("NewArmorStat")).map(
      (x) => (x.value = "")
    );

    newItem.setAttribute("data-armorStats", armorData);
  }
  if (document.getElementById("hasTech").checked) {
    var itemTech = Array.from(document.getElementsByClassName("iTech")).map(
      (x) => x.value
    );
    var techData = "";
    itemTech.map((x) => (techData = techData + x + ", "));
    techData = techData.slice(0, -2);

    Array.from(document.getElementsByClassName("iTech")).map(
      (x) => (x.value = "")
    );

    newItem.setAttribute("data-itemTech", techData);
  }
  if (document.getElementById("isInventory").checked) {
    var invStats = Array.from(document.getElementsByClassName("invData")).map(
      (x) => x.value
    );
    var invData = "";
    invStats.map((x) => (invData = invData + x + ", "));
    invData = invData.slice(0, -2);

    Array.from(document.getElementsByClassName("invData")).map(
      (x) => (x.value = "")
    );

    newItem.setAttribute("data-invStats", invData);
  }

  openWinlette(NewItemWin);
}
//World Temperature


//End of declarations

//Function Calls and Event Listeners
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
      slotMemoryLimits();

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
      event.target.parentNode &&
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
    if (event.target.classList.contains("Rank")) {
      abilExp();
    }

    //console.log(event.target);
    document.getElementById("SaveIndicator").style.background = "yellow";
  });

/*Drag & Drop Functions*/ {
  function allowDrop(event) {
    event.preventDefault();
  }

  //variables
  var leftBehind = "";
  //Abilities D&D
  function abilDragStart(event) {
    leftBehind = event.target.parentNode;
    event.dataTransfer.setData("Text", event.target.id);
  }

  function abilDrop(event) {
    event.preventDefault();

    tClasses = event.target.className;
    if (tClasses.includes("openAbil")) {
      var data = event.dataTransfer.getData("Text");

      slotMemoryLimits(
        Slots,
        spdFunc,
        dexFunc,
        intFunc,
        wisFunc,
        event.dataTransfer.getData("Text"),
        event.target
      );

      event.target.appendChild(document.getElementById(data));
      event.dataTransfer.clearData("Text");
      event.target.classList.remove("openAbil");
      document.getElementById(leftBehind.id).classList.add("openAbil");
    }
  }
  function removeAbility(event) {
    var target = document.getElementById(event.dataTransfer.getData("text"));
    target.remove();
    document.getElementById(leftBehind.id).classList.add("openAbil");
    var i = 0;
    while (i < abilities.length) {
      if (abilities[i].id.includes(target.id)) {
        abilities.splice(i, 1);
      }
      i++;
    }
    i = 0;
    while (i < Ranks.length) {
      if (Ranks[i].parentNode.parentNode.id.includes(target.id)) {
        Ranks.splice(i, 1);
      }
      i++;
    }
    levelCalc(TraitRanks, Ranks);
  }

  //Inventory
  var INVdropType = "";
  //Quick Items
  function QIDragStart(event) {
    event.dataTransfer.setData("Text", event.target.value);
    INVdropType = "QI";
  }

  var itemPickUp = "";
  function INVDragStart(event) {
    INVdropType = "INV";
    itemPickUp = event.target;
  }

  function INVDrop(event) {
    event.preventDefault();
    //Validate Target
    if (event.target.classList.contains("INVopen")) {
      //Quick Item Drop Function
      if (INVdropType == "QI") {
        var input = document.getElementById("QuickItem").value;
        if (input) {
          var qEntry = input.split(",");
          if (qEntry.length < 2 && qEntry[1]) {
            qEntry[1] = 0;
            qEntry[2] = 0;
          } else if (qEntry.length < 3 && qEntry[2]) {
            qEntry[2] = 0;
          }

          var qItem =
            "<div class='QuickMadeItem INV' data-size='" +
            parseInt(qEntry[1]) +
            "' data-weight='" +
            parseInt(qEntry[2]) +
            "' draggable='true' onDragstart='INVDragStart(event)'>" +
            qEntry[0] +
            "</div>";

          event.target.insertAdjacentHTML("beforeend", qItem);
        }
        document.getElementById("QuickItem").value = "";
      }

      //Standard Item Dropsv
      if (INVdropType == "INV") {
        var itemClone = itemPickUp.outerHTML;
        event.target.insertAdjacentHTML("beforeend", itemClone);
        itemPickUp.remove();
      }
    } //Valid Target
  }

  function INVremove(event) {
    var target = document.getElementById(event.dataTransfer.getData("text"));
    itemPickUp.remove();
  }
}

//Initialize
initializeSheet();

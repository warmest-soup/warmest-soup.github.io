//Operations to perform on load
var SatBars = document.getElementsByClassName("satBar");
var barDups = SatBars.length - 4;
var Slots = document.getElementsByClassName("AbilSlot");
var abilities = document.getElementsByClassName("Ability");
var Ranks = document.getElementsByClassName("Rank");
var Exp = document.getElementsByClassName("EXPvalue");
var TraitRanks = document.getElementsByClassName("realTrait");
var worldTemp;
var allPockets = document.getElementsByClassName("invContainer");
var pktWeights = document.getElementsByClassName("INVconWGT");

document.getElementById("SaveIndicator").style.background = "cyan";

var s1 = document.getElementById("TackColumn");
var s2 = document.getElementById("ResColumn");
s1.addEventListener("scroll", twoScroll, false);
s2.addEventListener("scroll", oneScroll, false);

function initializeSheet() {
  SatBars = document.getElementsByClassName("satBar");
  barDups = SatBars.length - 4;
  worldTemp = document.getElementById("Temperature").getAttribute("temp") || 0;
  console.log(worldTemp); 

  Slots = document.getElementsByClassName("AbilSlot");
  abilities = document.getElementsByClassName("Ability");
  Ranks = document.getElementsByClassName("Rank");
  Exp = document.getElementsByClassName("EXPvalue");
  TraitRanks = document.getElementsByClassName("realTrait");

  updateMap(document.getElementById("map"));
  fedStatus();
  carryWeight();
  funcTraits();
  cardLimits();
  colorTrait();
  weightGoalCalc();
  slotMemoryLimits();
  carryWeight();
  carryLimit();
  weaponDamage();
  btCalc();
  limbDebuffColor();
  timeBG();
  setSheetColor();
  setBG();
  invBonus();
  moneyCalc();
  dpCalc();
  moments();

  forecast();
  thermoBarFunc();

  var i = 0;
  while (i < SatBars.length) {
    satBarFill(
      SatBars[i],
      SatBars[i].parentNode.parentNode.children[1].children[0]
    );
    i++;
  }

  s1 = document.getElementById("TackColumn");
  s2 = document.getElementById("ResColumn");
  s1.addEventListener("scroll", twoScroll, false);
  s2.addEventListener("scroll", oneScroll, false);
  document.getElementById("SaveIndicator").style.background = "cyan";
}

//Declarations
//Calculate EXP goal for next level of trait
function expGoalCalc(real, exp, goal) {
  //Declarations for five-star tags
  var traitTable = goal.parentNode.parentNode.parentNode;
      var tableRow = goal.parentNode.parentNode
      var tagIndex=Array.from(tableRow.parentNode.children).indexOf(tableRow);
  
  
  if (real.value) {
    let numbers = real.value.match(/\d+/g) || 0;
    let parsedNumbers = Array.from(numbers).map((num) =>
      parseInt(num || 0, 10)
    );
    var traitLv = Math.min(...parsedNumbers);
    var expGoal = (traitLv + 1) * 10;
    if ((traitLv || traitLv === 0) && traitLv < 5 && traitLv >= 0) {
      var outputTxt = "/" + expGoal;
      exp.style.display = "inline";
      goal.innerText = outputTxt;
      
      //5-Star Tag
      if(traitTable.parentNode.id == "TraitTable"){
        traitTable.children[tagIndex].classList.remove("five-star");
        traitTable.children[tagIndex+1].classList.remove("five-star"); 
        goal.style.display="inline"   
        goal.style.transform="scale(1)"      
      } else {
        traitTable.children[tagIndex].classList.remove("five-star");
      }
      
      
    }
    if ((traitLv || traitLv === 0) && traitLv >= 5) {
      var outputTxt = "★";
      exp.style.display = "none";
      goal.innerText = outputTxt;
        
       
      //5-Star Tag
      if(traitTable.parentNode.id == "TraitTable"){
        traitTable.children[tagIndex].classList.add("five-star");
        traitTable.children[tagIndex+1].classList.add("five-star"); 
        goal.style.display="inline-block"  
        goal.style.transform="scale(1.3)"      
      } else {
        traitTable.children[tagIndex].classList.add("five-star");
      }
      
    }
    if (
      real.value.toLowerCase().includes("c") ||
      real.value.toLowerCase().includes("p")
    ) {
      var outputTxt = " T ";
      exp.style.display = "none";
      goal.innerText = outputTxt;
      real.parentNode.parentNode.parentNode.parentNode.classList.add(
        "technique"
      );
      
      //5-Star Tag
      if(traitTable.parentNode.id == "TraitTable"){
        traitTable.children[tagIndex].classList.remove("five-star");
        traitTable.children[tagIndex+1].classList.remove("five-star"); 
        goal.style.display="inline"   
        goal.style.transform="scale(1)"      
      } else {
        traitTable.children[tagIndex].classList.remove("five-star");
      }
    } else
      real.parentNode.parentNode.parentNode.parentNode.classList.remove(
        "technique"
      );
  }
}
//Character Level
function levelCalc() {
  var reals = document.getElementsByClassName("realTrait");
  var ranks = Array.from(document.getElementsByClassName("Rank")).filter(
    (x) =>
      !x.value.toLowerCase().includes("c") &&
      !x.value.toLowerCase().includes("p")
  );

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
      //Level offset
      abilTotal + traitTotal - 13;
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
    if (adjFunc | adjFunc==0) {
      traitFuncs[i].innerText = adjFunc;
    }
    if (parseInt(traitFuncs[i].innerText) >= 6) {
      traitFuncs[i].innerText = 6;
    }
    if (parseInt(traitFuncs[i].innerText) <= 0) {
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

  barDups = SatBars.length - 5;
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

  timeBG();
  //rust traits
  var decayables=document.getElementsByClassName("decayTarget");
  var i=0;
  while(i<decayables.length){
    rustify(decayables[i]);
    i++;
  }
  //increment Weather
  //worldTemp();
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
      //console.log(document.getElementById("coldMultiplier").innerText);

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

  timeBG();
  //rust traits
  var decayables=document.getElementsByClassName("decayTarget");
  var i=0;
  while(i<decayables.length){
    rustify(decayables[i]);
    i++;
  }
  //incrementWeather
  weather(sleepHours);
}
//Open windows (Imported As is)
var openWinlettes = 1;
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
          type + "\n" +
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
//Open Skill index
function openIndex() {
  window.open("https://warmest-soup.github.io/RATTRAPS/TechIndex", "_blank");
}
//Open Rule Book
function openRules() {
  window.open("https://warmest-soup.github.io/RATTRAPS/RuleBook", "_blank");
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
    if (i >= SKLmemory) {
      if (slots[i].classList[2] != "Hazed") {
        slots[i].classList.add("Forgotten");
      }
    }
    if (i >= SKLmemory && i + 1 <= SKLmemory + secSklMem) {
      slots[i].classList.add("Hazed");
      slots[i].classList.remove("Forgotten");
    }
    i++;
  }
  while (i < 100) {
    if (i >= INSmemory + 50) {
      if (slots[i].classList[2] != "Hazed") {
        slots[i].classList.add("Forgotten");
      }
    }
    if (i >= INSmemory + 50 && i + 1 <= INSmemory + secInsMem + 50) {
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
  thermoBarFunc();
  indirectChange();
}
//Thermo Bar Functionality
function thermoBarFunc() {
  var temp = parseFloat(document.getElementById("Temperature").getAttribute("temp"))/10;
  var wind = parseFloat(document.getElementById("Temperature").getAttribute("wind"));
  var windBar = parseFloat(document.getElementById("Temperature").getAttribute("windBar"));
  var bar = document.getElementById("ThermBar");
  var fill = document.getElementById("ThermFill");
  var ins = parseInt(document.getElementById("InsRes").innerText)/10;
  var abs = parseInt(document.getElementById("AbsRes").innerText);
  
  var windAdjust;
  if(windBar>=wind){
    windAdjust=Math.max(0, (wind-abs)*5);
  } else windAdjust=0;
  
  var effects = bar.parentNode.parentNode.children[0].children;
  var context = parseInt(
    document.getElementById("TempContextReadout").innerText
  );
  var barScale = 35 / (conFunc.innerText * 5);
  var tempState = Math.abs(Math.round((temp + context + ins - windAdjust) / conFunc.innerText));
  var barHeight = (temp + context + ins - windAdjust) * barScale + 35 / 2;
  console.log(barHeight);

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
//setHandednes
function saveDropdown(dd) {
  var chosen = dd.value;

  var thisOption = Array.from(dd.children).findIndex((x) =>
    x.outerHTML.includes(chosen)
  );
  var current = Array.from(dd.children).findIndex((x) =>
    x.outerHTML.includes("selected")
  );
  if (current != -1) {
    dd[current].removeAttribute("selected");
  }
  dd[thisOption].setAttribute("selected", "");
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
        itemName.trim() +
        "' class='INV item' data-size='" +
        itemStats[0].value +
        "' data-weight='" +
        itemStats[1].value +
        "' draggable='true' ondragstart='INVDragStart(event)'>" +
        itemName +
        "</div>"
    );
  var newItem = document.getElementById("INVcolumn3").lastChild;

  //Set inv Size..
  assignInvSize(newItem);
  if (parseInt(newItem.dataset.weight)) {
    newItem.style.backgroundColor = "lightgray";
    newItem.style.boxShadow = "inset .2em -.1em .4em 0em gray";
  }

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

    newItem.style.boxShadow = "inset .2em -.3em .4em 0em maroon";
    newItem.style.background = "rgb(100% 30% 30%)";
    newItem.style.textShadow =
      "0em 0em .1em red,0em 0em .1em red,0em 0em .1em red";
    newItem.style.border = "solid red 0.1em";
  }
  if (document.getElementById("isArmor").checked) {
    //Coverage
    var armorCoverage = Array.from(
      document.getElementsByClassName("naSpotCover")
    );

    if (!armorCoverage.every((x) => x.checked == false)) {
      armorCoverage = armorCoverage.map((x) => {
        if (x.checked == true) {
          return "tt";
        } else {
          return "f";
        }
      });

      var armorCoverData = "";
      armorCoverage.map((x) => (armorCoverData = armorCoverData + x + ", "));
      armorCoverData = armorCoverData.slice(0, -2);

      //reset diagram inputs
      Array.from(document.getElementsByClassName("naSpotCover")).map(
        (x) => (x.checked = false)
      );

      newItem.setAttribute("data-Coverage", armorCoverData);
    }

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

    newItem.style.backgroundColor = "rgb(80% 60% 10%)";
    newItem.style.boxShadow = "inset .2em -.3em .4em 0em maroon";
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

    newItem.style.border = "solid blue 0.1em";
    newItem.style.boxShadow = "inset .2em -.3em .4em 0em blue";
    newItem.style.color = "white";
  }
  if (document.getElementById("isInventory").checked) {
    //get inv stats in array
    var invStats = Array.from(
      document.getElementsByClassName("invData")
    ).map((x) => x.value.trim());

    //split key into pockets
    var pktCount = invStats.length / 3;

    //reformat to multiple pockets
    var p = 0;
    var pockets = [];
    while (p < pktCount) {
      //every Pocket
      pockets[p] = [];
      pockets[p][0] = itemName + " " + invStats[0 + p * 3];

      var i = 0;
      while (i < parseInt(invStats[1 + p * 3])) {
        pockets[p].push("<div class='INVopen INVslot'></div>");
        i++;
      }
      pockets[p].push(
        "<div class='invContainerBot'> <span class='INVconWGT'>0 /</span><span class='INVconLimit'>" +
          invStats[2 + p * 3] +
          "</span></div>"
      );

      p++;
    }
    //Pack Data
    var i = 0;
    while (i < pockets.length) {
      newItem.setAttribute(
        "data-" + pockets[i][0].toLowerCase().replaceAll(" ", ""),
        pockets[i].join("○ ")
      );
      i++;
    }
    //Unload stats from INVData
    i = 0;
    while (i < pktCount) {
      invStats.splice(1 + i, 2);
      invStats[i] = itemName + " " + invStats[i];
      i++;
    }

    newItem.setAttribute("data-invstats", invStats.join("○ "));

    newItem.style.backgroundColor = "rgb(70% 0% 60%)";
    newItem.style.boxShadow = "inset .2em -.3em .4em 0em rgb(20% 0% 30%)";
  }

  newItem.style.fontWeight = "bolder";
  openWinlette(NewItemWin);
}
//Removal warnings
function remWarning(rem) {
  rem.style.color = "black";
  rem.style.border = "solid black .2em";
  rem.style.background = "red";
}
function remWarningReset(rem) {
  rem.removeAttribute("style");
}
//assign inventory size
function assignInvSize(item) {
  var itemSize = item.dataset.size
    .split(",")
    .reduce((acc, x) => parseInt(acc) + parseInt(x));
  if (parseInt(itemSize)) {
    item.style.padding = "0em .2em " + (itemSize * 1.6 - 1.3 + 0.1) + "em .2em";
    item.style.minWidth = "6.5em";
    item.style.maxWidth = "6.5em";
    item.style.marginTop = "-.1em";
    item.style.marginLeft = "-.3em";
  } else {
    item.style.padding = "";
    item.style.minWidth = "";
    item.style.maxWidth = "";
    item.style.marginTop = "";
    item.style.marginLeft = "";
  }
}
//set INV pocket weight
function PKTweight() {
  var i = 0;
  var j;
  while (i < allPockets.length) {
    j = 1;
    var weights = [];
    var pktLoad;
    var pktLimit;
    var pktReadout;
    

    while (j < allPockets[i].children.length - 1) {
      var slot = allPockets[i].children[j];

      if (slot) {
        var contWgt = slot.outerHTML.match(
          /data-weight="\d+"|data-weight=&quot;\d+&quot;/g
        );
        if (contWgt) weights = weights.concat(contWgt);
      }
      j++;
    }

    if (weights[0]) {
      pktLoad = weights.map((x) => parseInt(x.match(/\d+/)));
      if (pktLoad)
        allPockets[i].getElementsByClassName("INVconWGT")[0].innerText =
          pktLoad.reduce((acc, x) => acc + x) + " / ";
    } else
      allPockets[i].getElementsByClassName("INVconWGT")[0].innerText = "0 /";
    
    pktLoad=parseInt(allPockets[i].getElementsByClassName("INVconWGT")[0].innerText);
    pktLimit=parseInt(allPockets[i].getElementsByClassName("INVconLimit")[0].innerText);
    
    if(pktLoad<pktLimit){
      allPockets[i].getElementsByClassName("INVconLimit")[0].parentNode.style.color="black";
    }else allPockets[i].getElementsByClassName("INVconLimit")[0].parentNode.style.color="red";

    i++;
  }
}
//INV Bonus
function invBonus(){
  var load = parseFloat(document.getElementById("LoadWeight").innerText);
  var limit = parseFloat(document.getElementById("CarryWeight").innerText);
  var weight=document.getElementById("wgtFunc");
  
  var encumberance=Math.floor(load/limit);
  
  if(encumberance){
    document.getElementById("wgtFunc").style.color="red";
    weight.innerText=(
      parseInt(document.getElementById("wgtReal").value) +
      parseInt(document.getElementById("wgtBonus").value) +
      encumberance   );
  } else{
    document.getElementById("wgtFunc").style.color="black";
    weight.innerText=(
      parseInt(document.getElementById("wgtReal").value) +
      parseInt(document.getElementById("wgtBonus").value));
  }
  
}
//Populate Resistances
function addRes(item) {
  var resistances = document.getElementById("ResColumn").children[0]
    .children[0];

  if (item.dataset["armorstats"]) {
    //add resistances 3,4,5, & 6

    var armor = item.dataset.armorstats.split(", ");
    //replace blanks with zeroes
    armor = armor.map((x) => {
      if (!x) {
        x = 0;
      }
      return x;
    });

    resistances.insertAdjacentHTML(
      "beforeEnd",
      "<tr><td class='ins'>" +
        armor[3] +
        "</td><td class='abs'>" +
        armor[4] +
        "</td><td class='cnd'>" +
        armor[5] +
        "</td><td class='bri'>" +
        armor[6] +
        "</td></tr>"
    );
  } else {
    //add Spacer
    resistances.insertAdjacentHTML("beforeEnd", "<tr></tr>");
  }
  if (item.dataset["itemtech"]) {
    //add black rows to space for tech.
    var techs = item.dataset.itemtech.split(", ");

    var i = 0;
    while (i < techs.length) {
      resistances.insertAdjacentHTML("beforeEnd", "<tr></tr>");
      i++;
    }
  }
  resCalc();
}
function removeRes(item) {
  var resistances = document.getElementById("ResColumn").children[0].children[0]
    .children;
  var tack = document.getElementById("TackColumn");
  var targetSlot = Array.from(tack.children).indexOf(item);

  //remove tech spacersh
  if (item.dataset["itemtech"]) {
    var techs = item.dataset.itemtech.split(", ");

    var i = 0;
    while (i < techs.length + 1) {
      resistances[targetSlot].remove();
      i++;
    }
  } else {
    //remove self spacer
    resistances[targetSlot].remove();
  }
  resCalc();
}
//SetINV Carryweight
function carryWeight() {
  var weight=document.getElementById("InvStats");
  var limit=parseInt(document.getElementById("CarryWeight").innerText);
  var load = Array.from(pktWeights).map((x) => parseInt(x.innerText));
  var loadTotal=load.reduce(
    (acc, x) => acc + x,
    0
  );
  document.getElementById("LoadWeight").innerText = loadTotal;
  if(limit>=loadTotal){
    weight.style.color="black";
    invBonus();
  }else{
    weight.style.color="red";
    invBonus();
  }
}
function carryLimit() {
  var charWgtLimit = document.getElementById("CarryWeight");
  var strVal = parseInt(document.getElementById("strFunc").innerText);
  charWgtLimit.innerText = strVal * 25;
}
//unify Equipment scrollbars
function oneScroll(e) {
  s1.scrollTop = s2.scrollTop;
}
function twoScroll(e) {
  s2.scrollTop = s1.scrollTop;
}
//Resistance caluclation
function resCalc() {
  var ins = Array.from(document.getElementsByClassName("ins")).reduce(
    (acc, x) => acc + parseInt(x.innerText),
    0
  );
  var abs = Array.from(document.getElementsByClassName("abs")).reduce(
    (acc, x) => acc + parseInt(x.innerText),
    0
  );
  var cndVals = Array.from(document.getElementsByClassName("cnd"));
  var cnd = Math.round(
    cndVals.reduce((acc, x) => acc + parseInt(x.innerText), 0) / cndVals.length
  );
  if (!cnd) {
    cnd = 0;
  }

  var briVals = Array.from(document.getElementsByClassName("bri"));
  var bri = Math.round(
    briVals.reduce((acc, x) => acc + parseInt(x.innerText), 0) / briVals.length
  );
  if (!bri) {
    bri = 0;
  }

  document.getElementById("InsRes").innerText = ins;
  document.getElementById("AbsRes").innerText = abs;
  document.getElementById("CndRes").innerText = cnd;
  document.getElementById("BriRes").innerText = bri;
}
//Unequipping
function unequip() {
  //Unequip functionq
  if (leftBehind.id === "TackColumn") {
    //inventory handler
    if ("invstats" in itemPickUp.dataset) {
      //Get INV IDs
      var invData = itemPickUp.dataset.invstats.split("○ ");

      var k = 0;
      var inceptionCheck = false;
      while (k < invData.length) {
        if (invData[k] == event.target.parentNode.id) {
          inceptionCheck = true;
          leftBehind = "";
        }
        k++;
      }
      if (inceptionCheck) {
        inceeded = true;
        return true;
      }
      var j = 0;
      while (j < invData.length) {
        var pkt = document.getElementById(invData[j]);

        var contents = Array.from(pkt.children).map((x) =>
          x.outerHTML.replace(/○/g, "•")
        );
        var wgtLimit = contents[contents.length - 1];

        contents[0] = pkt.children[0].innerHTML.trim();
        contents[contents.length - 1] =
          pkt.children[contents.length - 1].outerHTML;

        contents = contents.join("○ ");

        var accSizes = contents.match(
          /data-size="\d+"|data-size=&quot;\d+&quot;/g
        );

        var sizesSum;
        if (accSizes) {
          sizesSum = accSizes.map((x) => parseInt(x.match(/\d+/)));
          sizesSum = sizesSum.reduce((acc, x) => acc + x);

          itemPickUp.dataset.size += ", " + sizesSum;
        }
        assignInvSize(itemPickUp);

        itemPickUp.dataset[
          pkt.children[0].innerHTML.toLowerCase().replaceAll(" ", "")
        ] = contents;

        pkt.remove();
        j++;
      }
    }

    //Tech handler
    if (itemPickUp.dataset["itemtech"]) {
      Array.from(
        document.getElementsByClassName(itemPickUp.id + "Tech")
      ).forEach((x) => x.remove());
    }

    //ArmorGrid Handler
    if (itemPickUp.dataset["coverage"]) {
      var laids = document.getElementById("LAids").children;
      var hdids = document.getElementById("HDids").children;
      var raids = document.getElementById("RAids").children;
      var llids = document.getElementById("LLids").children;
      var bdids = document.getElementById("BDids").children;
      var rlids = document.getElementById("RLids").children;

      var i = 0;
      while (i < 5) {
        if (laids[i].innerText == " " + itemPickUp.id) {
          //get actual column values
          var armorColumn = Array.from(
            document.getElementsByClassName(laids[i].classList)
          );

          armorColumn[0].innerText = "";

          var j = 1;
          while (j < 6) {
            armorColumn[j].children[0].checked = false;
            armorColumn[j].children[0].removeAttribute("checked");
            armorColumn[j].style.background = "transparent";
            j++;
          }
          armorColumn[6].innerText = " ";
          armorColumn[7].innerText = " ";
          armorColumn[8].innerText = " ";
        }
        i++;
      }
      i = 0;
      while (i < 5) {
        if (hdids[i].innerText == " " + itemPickUp.id) {
          //get actual column values
          var armorColumn = Array.from(
            document.getElementsByClassName(hdids[i].classList)
          );

          armorColumn[0].innerText = "";

          var j = 1;
          while (j < 6) {
            armorColumn[j].children[0].checked = false;
            armorColumn[j].children[0].removeAttribute("checked");
            armorColumn[j].style.background = "transparent";
            j++;
          }
          armorColumn[6].innerText = " ";
          armorColumn[7].innerText = " ";
          armorColumn[8].innerText = " ";
        }
        i++;
      }
      i = 0;
      while (i < 5) {
        if (raids[i].innerText == " " + itemPickUp.id) {
          //get actual column values
          var armorColumn = Array.from(
            document.getElementsByClassName(raids[i].classList)
          );

          armorColumn[0].innerText = "";

          var j = 1;
          while (j < 6) {
            armorColumn[j].children[0].checked = false;
            armorColumn[j].children[0].removeAttribute("checked");
            armorColumn[j].style.background = "transparent";
            j++;
          }
          armorColumn[6].innerText = " ";
          armorColumn[7].innerText = " ";
          armorColumn[8].innerText = " ";
        }
        i++;
      }
      i = 0;
      while (i < 5) {
        if (llids[i].innerText == " " + itemPickUp.id) {
          //get actual column values
          var armorColumn = Array.from(
            document.getElementsByClassName(llids[i].classList)
          );

          armorColumn[0].innerText = "";

          var j = 1;
          while (j < 6) {
            armorColumn[j].children[0].checked = false;
            armorColumn[j].children[0].removeAttribute("checked");
            armorColumn[j].style.background = "transparent";
            j++;
          }
          armorColumn[6].innerText = " ";
          armorColumn[7].innerText = " ";
          armorColumn[8].innerText = " ";
        }
        i++;
      }
      i = 0;
      while (i < 5) {
        if (bdids[i].innerText == " " + itemPickUp.id) {
          //get actual column values
          var armorColumn = Array.from(
            document.getElementsByClassName(bdids[i].classList)
          );

          armorColumn[0].innerText = "";

          var j = 1;
          while (j < 6) {
            armorColumn[j].children[0].checked = false;
            armorColumn[j].children[0].removeAttribute("checked");
            armorColumn[j].style.background = "transparent";
            j++;
          }
          armorColumn[6].innerText = " ";
          armorColumn[7].innerText = " ";
          armorColumn[8].innerText = " ";
        }
        i++;
      }
      i = 0;
      while (i < 5) {
        if (rlids[i].innerText == " " + itemPickUp.id) {
          //get actual column values
          var armorColumn = Array.from(
            document.getElementsByClassName(rlids[i].classList)
          );

          armorColumn[0].innerText = "";

          var j = 1;
          while (j < 6) {
            armorColumn[j].children[0].checked = false;
            armorColumn[j].children[0].removeAttribute("checked");
            armorColumn[j].style.background = "transparent";
            j++;
          }
          armorColumn[6].innerText = " ";
          armorColumn[7].innerText = " ";
          armorColumn[8].innerText = " ";
        }
        i++;
      }
    }

    removeRes(itemPickUp);
    //end of unequip
    leftBehind = "";
  }
  return false;
}
//Weapon Damage calculation
function weaponDamage() {
  //CharStats
  var str = parseInt(document.getElementById("strFunc").innerText);
  var dex = parseInt(document.getElementById("dexFunc").innerText);
  var spd = parseInt(document.getElementById("spdFunc").innerText);
  //Sharpness
  var edg = parseInt(document.getElementById("shpEdg").value);
  var pnt = parseInt(document.getElementById("shpPnt").value);
  //Weapon Stats
  var lng = parseInt(document.getElementById("wepLng").innerText);
  var wgt = parseInt(document.getElementById("wepWgt").innerText);
  var bal = parseInt(document.getElementById("wepBal").innerText);
  //Shaoe Modifiers
  var swg = parseInt(document.getElementById("swgMod").innerText);
  var thr = parseInt(document.getElementById("thrMod").innerText);
  var power = parseInt(document.getElementById("PowerReadout").innerText);
  //Damage Sections
  var swingDam = document.getElementById("SwingVal");
  var thrustDam = document.getElementById("ThrustVal");

  swingDam.innerText = Math.round(
    ((spd * (lng + wgt) * (dex + edg) * (power * power + 7)) / 16) *
      (1 + 0.5 * swg)
  );
  thrustDam.innerText = Math.round(
    (((spd + dex) * (dex + pnt) * (power * power + 7)) / 16) * (1 + 0.5 * thr)
  );

  //attack card cost
  var cardCost = document.getElementById("AtkCost");
  if (power < 3) {
    cardCost.innerText = 3 - power;
  } else if (power > 3) {
    cardCost.innerText = power - 3;
  } else cardCost.innerText = 0;

  //0 & 5 power warning
  if (power == 1 || power == 5) {
    document.getElementById("PowerLevel").style.color = "red";
  } else document.getElementById("PowerLevel").style.color = "black";
}
//change equipped weapon
function weaponListUpdate() {
  //saved equipped item incase it doesn't need to change
  var currentEquip = document.getElementById("WeaponList").value;

  //look through tack for weapon stats
  var tackedWeapons = Array.from(
    document.getElementById("TackColumn").children
  ).filter((x) => x.dataset["weaponstats"]);

  //clear all items in drop down (this will remove unequipped items)
  var weaponList = document.getElementById("WeaponList").children;
  while (1 < weaponList.length) {
    weaponList[1].remove();
  }
  //re-populate dropdown list with IDs
  var i = 0;
  while (i < tackedWeapons.length) {
    document
      .getElementById("WeaponList")
      .insertAdjacentHTML(
        "beforeEnd",
        "<option value='" +
          tackedWeapons[i].id +
          "'>" +
          tackedWeapons[i].id +
          "</option>"
      );

    if (tackedWeapons[i].id == currentEquip) {
      document.getElementById("WeaponList").value = currentEquip;
    }

    i++;
  }
}
function weaponSwitch() {
  //Sharpness
  var edg = document.getElementById("shpEdg");
  var pnt = document.getElementById("shpPnt");
  var ret = document.getElementById("WepRet");
  //Weapon Stats
  var lng = document.getElementById("wepLng");
  var wgt = document.getElementById("wepWgt");
  var bal = document.getElementById("wepBal");
  var rng = document.getElementById("WepRng");
  var dt = document.getElementById("wepDT");
  //Shape Modifiers
  var swg = document.getElementById("swgMod");
  var thr = document.getElementById("thrMod");
  //load weapon stats
  if (document.getElementById("WeaponList").value == "Unarmed") {
    rng.innerText = 1;
    dt.innerText = "000";
    ret.innerText = 0;
    edg.value = 2;
    pnt.value = 2;
    lng.innerText = 1;
    wgt.innerText = 1;
    bal.innerText = 0;
    swg.innerText = "+0";
    thr.innerText = "+0";
    document.getElementById("chipDT").innerText = "000";

    var preChips = document.getElementsByClassName("Chip");

    //remove previous chips

    while (0 < preChips.length) {
      preChips[0].remove();
    }
  } else {
    var weapon = document
      .getElementById("TackColumn")
      .querySelector("#" + document.getElementById("WeaponList").value);

    var wepStats = Array.from(weapon.dataset.weaponstats.split(", "));
    //assign Values
    rng.innerText = wepStats[0];
    dt.innerText = wepStats[1];
    ret.innerText = wepStats[2];
    edg.value = wepStats[3];
    pnt.value = wepStats[4];
    lng.innerText = wepStats[5];
    wgt.innerText = wepStats[6];
    bal.innerText = wepStats[7];
    swg.innerText = wepStats[8];
    thr.innerText = wepStats[9];
    document.getElementById("chipDT").innerText = Math.round(
      parseInt(wepStats[1]) / 2
    )
      .toString()
      .padStart(3, "0");

    //fill Chips
    //check for saved chip data
    var chips = document.getElementById("chips").children;
    var preChips = document.getElementsByClassName("Chip");

    //remove previous chips

    while (0 < preChips.length) {
      preChips[0].remove();
    }

    var k = 0;
    while (k < 2) {
      //check for chip data
      if (weapon.dataset["chips"]) {
        //load chip Data
        var oldChips = weapon.dataset.chips.split(",");
        var f = 0;
        while (f < oldChips.length / 2) {
          if (oldChips[f + (k * oldChips.length) / 2] == "true") {
            chips[k].children[chips[k].children.length - 1].insertAdjacentHTML(
              "beforeBegin",
              "<input type='checkbox' class='Chip' checked>"
            );
          } else {
            chips[k].children[chips[k].children.length - 1].insertAdjacentHTML(
              "beforeBegin",
              "<input type='checkbox' class='Chip'>"
            );
          }
          f++;
        }
      } else {
        var i = 0;
        while (i < wepStats[2]) {
          chips[k].children[0].insertAdjacentHTML(
            "afterEnd",
            "<input type='checkbox' class='Chip'>"
          );
          i++;
        }
      }
      k++;
    }
  }
  weaponDamage();
}
function saveChips() {
  var weapon = document
    .getElementById("TackColumn")
    .querySelector("#" + document.getElementById("WeaponList").value);

  var chips = Array.from(document.getElementsByClassName("Chip")).map((x) => {
    if (x.checked) {
      return true;
    } else return false;
  });
  chips.join(", ");
  weapon.dataset.chips = chips;
}
function saveSharp(){
  var equipped=document.getElementById("WeaponList").value;
  var weapon=document.getElementById(equipped);
  var current=document.getElementsByClassName("shpIn");
  //3=e 4=p
  var stats=weapon.dataset.weaponstats.split(", ");
  stats[3]=current[0].value;
  stats[4]=current[1].value;
  weapon.dataset.weaponstats=stats.join(", ");
}
//Damage
function damageCalc() {
  var armor = document.getElementById(event.target.id.substring(6)).children;
  var damage = parseInt(event.target.value);
  var limbId = event.target.id.substring(6).slice(0, -1) + "armor";
  var end = parseInt(document.getElementById("endFunc").innerText);
  var con = parseInt(document.getElementById("conFunc").innerText);

  if (damage) {
    i = 5;
    while (i > 0) {
      if (armor[i - 1].children[0].checked) {
        var stats = document.getElementsByClassName(limbId + i);
        damage =
          damage -
          parseInt(stats[6].innerText) / (6 - parseInt(stats[7].innerText));
      }

      i--;
    }
    damage = Math.round(damage - (end * 10) / (6 - con));
    event.target.dataset.damage = Math.max(0, damage);
  } else event.target.dataset.damage = 0;
  //Damage Total
  var taken = document.getElementById(
    event.target.id.substring(6).slice(0, -1) + "taken"
  );
  var repel = document.getElementById(
    event.target.id.substring(6).slice(0, -1) + "repel"
  );
  var dmgInputs = [
    document.getElementById(event.target.id.slice(0, -1) + 1),
    document.getElementById(event.target.id.slice(0, -1) + 2),
    document.getElementById(event.target.id.slice(0, -1) + 3),
    document.getElementById(event.target.id.slice(0, -1) + 4),
    document.getElementById(event.target.id.slice(0, -1) + 5)
  ];

  var dmgTotal = dmgInputs.reduce(
    (acc, x) => acc + (parseInt(x.dataset["damage"]) || 0),
    0
  );
  var initialDmg = dmgInputs.reduce(
    (acc, x) => acc + (parseInt(x.value) || 0),
    0
  );

  taken.innerText = dmgTotal;

  if (taken.innerText == "0") {
    taken.innerText = "Take";
    taken.style.color = "gray";
  } else taken.style.color = "red";
  repel.innerText = Math.max(
    (parseInt(initialDmg) || 0) - (parseInt(dmgTotal) || 0),
    0
  );
  if (repel.innerText == "0") {
    repel.innerText = "Repel";
  }
}
function btCalc() {
  var bts = Array.from(document.getElementsByClassName("BT"));
  var con = parseInt(document.getElementById("conFunc").innerText) || 0;
  var end = parseInt(document.getElementById("endFunc").innerText) || 0;
  var spd = parseInt(document.getElementById("spdFunc").innerText) || 0;
  var dex = parseInt(document.getElementById("dexFunc").innerText) || 0;

  //Bleed Threshold
  bts.forEach((x) => (x.innerText = con * 10));

  //Limb EDTs
  var limbEDT = Array.from(document.getElementsByClassName("limbEDT"));
  limbEDT.forEach((x) => (x.innerText = end * 5));
  //Head EDT
  document.getElementById("HDEDT").innerText = end * 10;
  //Body EDT
  document.getElementById("BDEDT").innerText = end * 2;
  //DropDT
  var dropDt = Array.from(document.getElementsByClassName("dropDT"));
  dropDt.forEach((x) => (x.innerText = dex * 2));
  //TripDT
  var dropDt = Array.from(document.getElementsByClassName("tripDT"));
  dropDt.forEach((x) => (x.innerText = spd * 2));
  //head CDT
  document.getElementById("HDCDT").innerText = con * 2;
  //Body CDT
  document.getElementById("BDCDT").innerText = con * 5;
}
function limbDebuffColor() {
  var limbs = Array.from(document.getElementsByClassName("PrimaryDebuff"));
  var i = 0;
  while (i < limbs.length) {
    if (limbs[i].value == "🜂") {
      limbs[i].parentNode.parentNode.parentNode.parentNode.style.background =
        "linear-gradient(salmon,white 75%)";
      limbs[i].style.background = "maroon";
    } else if (limbs[i].value == "🜄") {
      limbs[i].parentNode.parentNode.parentNode.parentNode.style.background =
        "linear-gradient(skyblue,white 75%)";
      limbs[i].style.background = "skyblue";
    } else if (limbs[i].value == "🜁") {
      limbs[i].parentNode.parentNode.parentNode.parentNode.style.background =
        "linear-gradient(yellow,white 75%)";
      limbs[i].style.background = "khaki";
    } else if (limbs[i].value == "🜃") {
      limbs[i].parentNode.parentNode.parentNode.parentNode.style.background =
        "linear-gradient(gray,white 75%)";
      limbs[i].style.background = "gray";
    } else {
      limbs[i].parentNode.parentNode.parentNode.parentNode.style.background =
        "white";
      limbs[i].style.background = "white";
    }
    i++;
  }
}
function dtLightUp() {
  var damage = Array.from(document.getElementsByClassName("dmgTaken"));
  var i = 0;
  while (i < damage.length) {
    var edt =
      damage[i].parentNode.parentNode.parentNode.parentNode.children[0]
        .children[0].children[0];
    var secDT =
      damage[i].parentNode.parentNode.parentNode.parentNode.children[3]
        .children[2].children[0];
    var bt =
      damage[i].parentNode.parentNode.parentNode.parentNode.children[3]
        .children[0].children[1].children[1];
    var dmgVal = parseInt(damage[i].innerText) || 0;

    //EDT
    if (dmgVal > parseInt(edt.innerText)) {
      edt.style.color = "red";
    } else edt.style.color = "rgb(0 0 0 / 50%)";
    //BT
    if (dmgVal > parseInt(bt.innerText)) {
      bt.style.color = "red";
    } else bt.style.color = "rgb(0 0 0 / 50%)";
    //2DT
    if (dmgVal > parseInt(secDT.innerText)) {
      secDT.style.color = "red";
    } else secDT.style.color = "rgb(0 0 0 / 50%)";

    i++;
  }
}
function updateArmorBreaks() {
  var armor = document.getElementById(
    document
      .getElementsByClassName(event.target.parentNode.classList[0])[0]
      .innerText.trim()
  );
  if (!armor) return;
  var coverage = armor.dataset.coverage.split(", ");
  var spot =
    Array.from(event.target.parentNode.parentNode.parentNode.children).indexOf(
      event.target.parentNode.parentNode
    ) - 1;
  var limb = event.target.parentNode.classList[0].slice(0, 2);
  var state;
  if (event.target.checked) {
    event.target.setAttribute("checked", "");
    state = "t";
  } else {
    event.target.removeAttribute("checked");
    state = "f";
  }

  if (limb == "HD") {
    coverage[spot] = "t" + state;
  } else if (limb == "LA") {
    coverage[spot + 5] = "t" + state;
  } else if (limb == "BD") {
    coverage[spot + 10] = "t" + state;
  } else if (limb == "LL") {
    coverage[spot + 15] = "t" + state;
  } else if (limb == "RL") {
    coverage[spot + 20] = "t" + state;
  } else if (limb == "RA") {
    coverage[spot + 25] = "t" + state;
  }

  armor.dataset.coverage = coverage.join(", ");
}
function permanantBleed() {
  var check = event.target;
  var num = event.target.parentNode.children[1];

  var bleedRow = event.target.parentNode;

  if (check.checked) {
    bleedRow.style.background = "red";
    bleedRow.style.boxShadow = "0em -.3em 0em 0em red, 0em .2em .7em 0em red";
    bleedRow.style.borderRadius = ".3em";
    num.style.background = "salmon";
  } else {
    bleedRow.removeAttribute("style");
    num.removeAttribute("style");
  }
}
function injuryStatus(){
  var limbs=document.getElementsByClassName("InjuryDisplay");
  var selects=Array.from(document.getElementsByClassName("agInjuryStatus"));
  var injury = [selects[0], selects[2],selects[1],selects[4],selects[3],selects[5]];
  
  var i=0;
  while(i<limbs.length){
      if(injury[i].value=="Fine"){
        limbs[i].removeAttribute("style");
        limbs[i].style.textDecoration="none";
        limbs[i].style.color="black";
      } else if(injury[i].value=="INJ"){
        limbs[i].removeAttribute("style");
        limbs[i].style.textDecoration="line-through";
        limbs[i].style.color="red";
      } else if(injury[i].value=="CRP"){
        limbs[i].style.textDecoration="line-through";
        limbs[i].style.color="black";
        limbs[i].style.background="red";
    }
    i++
  }
}
//Time BG
function timeBG() {
  var hour = parseInt(document.getElementById("CurrentHour").innerText);
  var brightness = 0;
  var contrast = 0;
  var invert = 0;
  var hue = 0;

  if (5 < hour && hour < 18) {
      invert = 0;
    } else invert = 100;
  if (-1 < hour && hour < 13) {
    //get brighter start from darkest
    // DAY
    brightness = Math.round(100 + 2 * (hour - 7) ** 2);
    contrast = Math.round(100 + 1.4 * (hour - 6) ** 2);
    hue = Math.round(45 - 3.75 * hour);

    var setting =
      "brightness(" +
      brightness +
      "%) contrast(" +
      contrast +
      "%) invert(" +
      invert +
      "%) hue-rotate(" +
      hue +
      "deg)";
    
  } else {
    //NIGHT
    hour = 12 - (hour - 12);
    brightness = Math.round(100 + 2 * (hour - 7) ** 2);
    contrast = Math.round(100 + 1.4 * (hour - 6) ** 2);
    hue = Math.round(45 - 3.75 * hour);

    var setting =
      "brightness(" +
      brightness +
      "%) contrast(" +
      contrast +
      "%) invert(" +
      invert +
      "%) hue-rotate(" +
      hue +
      "deg)";
    
  }
  
  document.body.style.backdropFilter = setting;
}
//customcolors
function setSheetColor(){
  var userHue=document.getElementById("CustomColor").dataset.userhue;
  var userBri=document.getElementById("CustomColor").dataset.userbri;
  var userOpa=document.getElementById("CustomColor").dataset.useropa;
  var color="hsl("+userHue+" 30% "+userBri+" / "+userOpa+")"
  
  var userHue2=document.getElementById("CustomColor").dataset.userhue2;
  var color2="hsl("+userHue2+"deg 15% 60%)"
  
  document.documentElement.style.setProperty("--userColor", color);
  document.documentElement.style.setProperty("--darkCol", color2);
}
function changeUserColor(hue,bri,opa){
  document.getElementById("CustomColor").dataset.userhue=hue+"deg";
  document.getElementById("CustomColor").dataset.userbri=bri+"%";
  document.getElementById("CustomColor").dataset.useropa=opa+"%";
  setSheetColor();
}
function changeUserColor2(hue){
  document.getElementById("CustomColor").dataset.userhue2=hue;
  setSheetColor();
}
function setBG(){
  var moving=document.getElementById("CustomColor").dataset.bg;
  if(moving=="true"){ document.documentElement.style.backgroundImage="url('https://github.com/warmest-soup/warmest-soup.github.io/blob/main/Assets/Images/SheetGBG.png?raw=true')";
} else {
    document.documentElement.style.backgroundImage="url('https://warmest-soup.github.io/Assets/Images/Sheet%20Grand%20BG.png')";
  };
}
function userBG(){
  var BG=document.getElementById("userBG").checked;
  
  if(BG){
    document.getElementById("CustomColor").dataset.bg="true";
  } else document.getElementById("CustomColor").dataset.bg="false";
  
  setBG();
}
//Money Total
function moneyCalc(){
  var moneyDisplay=document.getElementById("moneyTracker");
  var invContents=document.getElementById("invDisContents").innerHTML;
  
  var moneyVals=invContents.match(/\$\d+\.?\d{0,2}|\d{0,2}¢/g)||["0"];
  moneyVals=moneyVals.map((x)=> {
    if(x.includes("¢")){
      return parseFloat(x)/100;
    } else return parseFloat(x.replace("$",""));
  })
  var moneyTotal=moneyVals.reduce((acc, x)=>acc+(x || 0) ,0);
  
  moneyDisplay.placeholder="$"+moneyTotal.toFixed(2)+"¢";
  
}
//quirks
function quirkColor(){
  var inc=event.target;
  if(inc.value.toUpperCase()=="A"){
    inc.classList.add("advantage");
    inc.classList.remove("quirk");
    inc.classList.remove("penalty");
  } else if(inc.value.toUpperCase()=="P"){
    inc.classList.add("penalty");
    inc.classList.remove("quirk");
    inc.classList.remove("advantage");
  } else if(inc.value.toUpperCase()=="Q"){
    inc.classList.add("quirk");
    inc.classList.remove("advantage");
    inc.classList.remove("penalty");
  } else {
    inc.value="";
    inc.classList.remove("advantage");
    inc.classList.remove("quirk");
    inc.classList.remove("penalty");
  }
}
//Trait Coloring.
function rustify(rusty){
  var leadRow=rusty.parentNode.parentNode;
  var header=leadRow.parentNode;
  var targetIndex=Array.from(header.children).indexOf(leadRow);
  if(rusty.value==-1){
    header.children[targetIndex].classList.add("Rusty");
    header.children[targetIndex+1].classList.add("Rusty");
  } else {
    header.children[targetIndex].classList.remove("Rusty");
    header.children[targetIndex+1].classList.remove("Rusty");
  }
}
//DP assignment
function dpCalc(){
  var con=document.getElementById("conFunc").innerText;
  document.getElementById("DPTotal").innerText="/"+con;
}
//greater Bleed Light
function greaterBleed(){
  var greatBleed=document.getElementById("FatalBleedCounter");
  if(greatBleed.value>0){
    greatBleed.parentNode.classList.add("Bleeding");
  } else greatBleed.parentNode.classList.remove("Bleeding");
}
//save checkbox
function toggleCheck(box){
  if(box.checked==true){
    box.setAttribute("checked","true");
  } else box.setAttribute("checked","false");
}
//moments handling
function moments(){
  //get combat moments, speed func, and combat speed modifier
  var moments=Array.from(document.getElementsByClassName("moment"));
  var actions=moments.map((x)=> x.children[1].value);
  var hitMom=moments.map((x)=> x.children[2].checked);
  var spd=parseInt(document.getElementById("spdFunc").innerText);
  var roundBonus=parseInt(document.getElementById("spdComBonus").value);
  
  //total speed
  var spdTotal=spd+roundBonus;
  //clear combat moments
  moments.forEach((x)=> x.remove());
  
  if(spdTotal>actions.length){
    var j=0;
    while(j<spdTotal){
      actions.push("");
      j++;
    }
  }
  
  //loop to create new moments, with logged actions preserved.
  var i=0;
  while(i<spdTotal){
    document.getElementById("ComMoments").insertAdjacentHTML("beforeEnd",
            "<div class='moment'>"+
            "<div class='actionCounter'>〇</div>"+
            "<input class='action SaveInput' type='text' value='"+actions[i]+"'>"+
            "<input class='hitMom' type='checkbox' onChange='toggleCheck(this)'>"+
            "</div>");
    if(hitMom[i]){
      document.getElementById("ComMoments").children[i]
        .children[2].setAttribute("checked","checked");
    }
    
    i++;
  }
  momentAwareness();
  actIndicator();
  hitMoment();
}
function momentAwareness(){
  var per=parseInt(document.getElementById("perFunc").innerText);
  var perBonus=parseInt(document.getElementById("perComBonus").value);
  var moments=Array.from(document.getElementsByClassName("moment"));
  var perTotal=per+perBonus;
  if(perTotal>5){perTotal=5;} else if(perTotal<1){perTotal=1}
  var missingPer=6-perTotal;
  
  moments.forEach((x)=>{
    if((Math.floor((moments.indexOf(x)+1)/missingPer))%2==0){
      x.classList.add("perChunk");
    } else {x.classList.remove("perChunk");}
  });
  
}
function actIndicator(){
  //if event is in an action field
  var momentField=document.getElementsByClassName("action");
  //navigate nodes to indicator
  var indicator=document.getElementsByClassName("actionCounter");
  //set based on event contents.
  var i=0;
  while(i<momentField.length){
    if(momentField[i].value && momentField[i].value!="-"){  
      indicator[i].innerText="⬤";
    } else indicator[i].innerText="〇";
    
    if(momentField[i].value=="-"){
      momentField[i].parentNode.style.filter="brightness(50%)"
    } else momentField[i].parentNode.removeAttribute("style");
    
    i++;
  }
  actionCounter();
}
function actionCounter(){
  //get both sides of the action counter
  var taken=document.getElementById("aTaken");
  var limit=document.getElementById("aMax");
  var dex=parseInt(document.getElementById("dexFunc").innerText);
  var dexBonus=parseInt(document.getElementById("dexComBonus").value);
  
  var dexTotal=dex+dexBonus;
  
  limit.innerText=dexTotal;
  limit=parseInt(limit.innerText);
  
  //get all moment values
  var indicators=Array.from(document.getElementsByClassName("actionCounter"));
  
  //count used moments.
  var takenTally=indicators.filter(x => x.innerText=="⬤");
  
  taken.innerText=takenTally.length;
  taken=parseInt(taken.innerText);
  //compare used actions to limit, and turn red if over.
  if(taken>limit){
    document.getElementById("actionCounter").style.background="red";
    document.getElementById("actionCounter").style.color="white";
    takenTally.forEach((x)=> x.parentNode.classList.add("tooManyAct"));
  } else {
    document.getElementById("actionCounter").removeAttribute("style");
    indicators.forEach((x)=> x.parentNode.classList.remove("tooManyAct"));
  } 
}
function nextRound(){
  if(confirm("Are you sure you want to proceed to the next round, and recieve damage from Lesser Bleeds?")){
    //Put up a warning to confirm they meant to hit next..
  //clear all ticket spaces, including temporary buffs.l
  Array.from(document.getElementsByClassName("action"))
    .forEach((x)=>x.value="");
    
    Array.from(document.getElementsByClassName("hitMom"))
    .forEach((x)=>x.checked=false);
  
  
  document.getElementById("dexComBonus").value="+0";
  saveDropdown(document.getElementById("dexComBonus"));
  document.getElementById("spdComBonus").value="+0";
  saveDropdown(document.getElementById("spdComBonus"));
  document.getElementById("perComBonus").value="+0";
  saveDropdown(document.getElementById("perComBonus"));
  //iterate lesser bleeds and reduce them if they aren't permanant.
  actIndicator();
  actionCounter();
  moments();
  momentAwareness();
  
  //Lesser Bleeds
  var bleeds=Array.from(document.getElementsByClassName("LesserBleed"));
  var hp=document.getElementById("HP");
  
  var bloodLoss=bleeds.filter((x)=> x.value !="");
  
  hp.value=hp.value-bloodLoss.length;
  bleeds.forEach((x)=>{
    if(!x.parentNode.children[0].checked && x.value){
      x.value--;
    }
    if(x.value==0)(x.value="");
  })
  
  //Iterate Round Count
  var round = document.getElementById("roundCount");
  if(round.value){
    round.value = parseInt(round.value)+1;     
  } 
  }

}
function hitMoment(){
  var hitMarks=Array.from(document.getElementsByClassName("hitMom"));
  
  hitMarks.forEach((x)=>{
    if(x.checked){
      x.parentNode.classList.add("hitMoment");
    }else x.parentNode.classList.remove("hitMoment");
  })
  
}
//maps
function updateMap(map){
  var currentMap=document.getElementById("currentMap").value;
  map.outerHTML="<iframe id='map' src='https://docs.google.com/spreadsheets/d/1HgNWlmeqJEn36UjhSAx_NUbUqYozAYtUztbsXuJC21Q/htmlembed/sheet?gid="+currentMap+"'></iframe></div>"
}
function addMap(name, id){
  if(id.value && name.value){
    var mapList=document.getElementById("currentMap");
    mapList.insertAdjacentHTML("beforeEnd",
                               "<option value='"+id.value+"'>"+name.value+"</option>"
                              );
    id.value="";
    name.value="";
  }
}
// files
function useFile(file){
  file.children[1].toggleAttribute("Hidden")
} 
// Trait Color display
function colorTrait(){
  var traits = Array.from(document.getElementsByClassName("traitFunc"));
  
  traits.forEach((x)=>{
    var value= parseInt(x.innerText);
    
    x.style.background="hsl(from var(--darkCol) h s "+
    ((100/6 * value)+10)
    +"% /100%)";
    
  });
  
}
//Load empty sheet
function blankSheet(){
  fetch("https://warmest-soup.github.io/RATTRAPS/BlankSheet.txt")
  .then(x => x.text())
  .then(x => {
    if(confirm("Loading a new sheet will discard all unsaved changes to the currently loaded sheet. \n\nAre you sure you'd like to load a blank sheet?")){
      var content = document.getElementById("subSheet");
      content.innerHTML=x;
      initializeSheet();
    }
  }) 
}
//set time & day
function setTime(){
  var time = document.getElementById("CurrentHour");
  
  var newTime = prompt("(The GM will be notified of this change) \n Change hour to:");
  newTime=parseInt(newTime);
  if(!newTime){newTime=time.innerText;} 
  time.innerText=String(newTime).padStart(2,"0");
  weather(document.getElementById("CurrentHour")); 
}
function setDay(){
  var day = document.getElementById("currentDay");
  
  var newDay = prompt("(The GM will be notified of this change) \n Change Day count to:");
  newDay=parseInt(newDay);
  if(!newDay){newDay=day.innerText;}
  day.innerText=String(newDay).padStart(4,"0");
  weather(document.getElementById("CurrentHour"));
}



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
      colorTrait();

      //Functional trait based functions
      fedStatus();
      weightExp();
      carryLimit();
      slotMemoryLimits();
      weaponDamage();
      btCalc();
      dpCalc();
      thermoBarFunc();

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
    if (event.target.classList.contains("shpIn")) {
      weaponDamage();
    }
    if (event.target.id === "WeaponList") {
      weaponSwitch();
      weaponDamage();
    }
    if (event.target.classList.contains("Chip")) {
      saveChips();
    }
    if (event.target.id.includes("DmgRec")) {
      damageCalc();
      dtLightUp();
    }
    if (event.target.classList.contains("PrimaryDebuff")) {
      limbDebuffColor();
    }
    if (
      event.target.parentNode.parentNode
      .parentNode.parentNode.classList =="armorGrid") {
      updateArmorBreaks();
    }
    if (event.target.classList.contains("BleedState")) {
      permanantBleed();
    }
    if(event.target.classList.contains("agInjuryStatus")){
      injuryStatus();
    }
    if(event.target.classList.contains("shpIn")){
      saveSharp();
    }
    if(event.target.classList.contains("incSpot")){
      quirkColor();
    }
    if(event.target.id.includes("Exp")){
      rustify(event.target);
    }
    if(event.target.id.includes("FatalBleedCounter")){
      greaterBleed();
    }
    if(event.target.id.includes("spd") ||
      event.target.id=="athBonus"){
      moments();
    }
    if(event.target.id.includes("per") ||
       event.target.id=="aweBonus"){
      momentAwareness();
    }
    if(event.target.classList.contains("action")){
      actIndicator();
    }
    if(event.target.id.includes("dex") ||
      event.target.id=="athBonus"){
        actionCounter();
      }
    if(event.target.classList.contains("hitMom")){
      hitMoment();
    }

    //console.log(event.target);
    document.getElementById("SaveIndicator").style.background = "yellow";
  });
//inventory Event Listener
document
  .getElementById("CharacterSheet")
  .addEventListener("INVChanged", function (event) {
    PKTweight();
    carryWeight();
    weaponListUpdate();
    weaponSwitch();
    moneyCalc();
    thermoBarFunc();
  });

/*Drag & Drop Functions..*/ {
  function allowDrop(event) {
    event.preventDefault();
  }

  //variables
  var leftBehind = "";
  //Abilities D&Dd
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

      if (leftBehind.classList.contains("technique")) {
        leftBehind.classList.remove("technique");
        event.target.classList.add("technique");
      }

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
  const invChange = new Event("INVChanged", { bubbles: true });
  var INVdropType = "";
  var itemPickUp = "";
  //Quick Items
  function QIDragStart(event) {
    event.dataTransfer.setData("Text", event.target.value);
    INVdropType = "QI";
  }

  function INVDragStart(event) {
    //console.log("INVDrag function ran.");
    event.dataTransfer.setData("Text", event.target.value);

    INVdropType = "INV";
    itemPickUp = event.target;
    leftBehind = event.target.parentNode;
  }

  //Inventory Drag n Drop
  function INVDrop(event) {
    //console.log("INVDrop Function ran.");

    event.preventDefault();

    //Validate Target
    if (
      (INVdropType == "QI") & event.target.classList.contains("INVopen") ||
      event.target.classList.contains("INVopen") &
        !(
          itemPickUp.classList.contains("invContainer") &
          !event.target.classList.contains("INVcols")
        )
    ) {
      //Quick Item Drop Function
      if (INVdropType == "QI") {
        var input = document.getElementById("QuickItem").value;
        var qItem = "";
        if (input) {
          var qEntry = input.split(",");
          if (qEntry.length < 2 && qEntry[1]) {
            qEntry[1] = 0;
            qEntry[2] = 0;
          } else if (qEntry.length < 3 && qEntry[2]) {
            qEntry[2] = 0;
          }

          qItem =
            "<div class='item INV QuickItem' data-size='" +
            parseInt(qEntry[1]) +
            "' data-weight='" +
            parseInt(qEntry[2]) +
            "' draggable='true' onDragstart='INVDragStart(event)'>" +
            qEntry[0] +
            "</div>";

          event.target.insertAdjacentHTML("beforeend", qItem);
        }
        var madeItem = event.target.children[event.target.children.length - 1];

        assignInvSize(madeItem);
        if (parseInt(qEntry[1])) {
          madeItem.style.backgroundColor = "lightgray";
          madeItem.style.boxShadow = "inset .2em -.1em .4em 0em gray";
        }
      }

      //unequip.
      var inceeded = false;
      inceeded = unequip();
      if (inceeded) {
        return;
      }

      //Standard Item Dropsv
      if (INVdropType == "INV") {
        itemPickUp.classList.remove("Equipped");
        var itemClone = itemPickUp.outerHTML;
        event.target.insertAdjacentHTML("beforeend", itemClone);
        itemPickUp.remove();
      }
      event.target.dispatchEvent(invChange);
    }
  }

  function INVremove(event) {
    var target = document.getElementById(event.dataTransfer.getData("text"));
    unequip();
    itemPickUp.remove();
    event.target.dispatchEvent(invChange);
  }

  //Drop Change Quick Items
  function QiEdit(event) {
    if (itemPickUp.classList.contains("QuickItem")) {
      var qiData = [itemPickUp.innerText];
      if (itemPickUp.dataset.size != "NaN") {
        qiData.push(itemPickUp.dataset.size);
      }
      if (itemPickUp.dataset.weight != "NaN") {
        qiData.push(itemPickUp.dataset.weight);
      }

      var qiTextForm = qiData.join(", ");
      document.getElementById("QuickItem").value = qiTextForm;
      itemPickUp.remove();
    }
    event.target.dispatchEvent(invChange);
  }

  //Equipping Items
  function equipDrop(event) {
    event.preventDefault();

    if (
      (INVdropType !== "QI") &
      !itemPickUp.classList.contains("Equipped") &
      !itemPickUp.classList.contains("invContainer")
    ) {
      itemPickUp.classList.add("Equipped");
      document.getElementById("TackColumn").appendChild(itemPickUp);

      //Act on item's Data Sets
      if (itemPickUp.dataset["invstats"]) {
        //Get INV IDs
        var invData = itemPickUp.dataset.invstats.split("○ ");

        var j = 0;
        while (j < invData.length) {
          var pkt = itemPickUp.dataset[
            invData[j].toLowerCase().replaceAll(" ", "")
          ].split("○ ");

          //Create Pocket
          document
            .getElementById("INVcolumn1")
            .insertAdjacentHTML(
              "beforeend",
              "<div id='" +
                pkt[0] +
                "' class='INV invContainer' draggable='true' ondragstart='INVDragStart(event)'> <div class='invContainerTop'> " +
                pkt[0].replaceAll("-", " ") +
                " </div>"
            );
          //Drawing slots
          var i = 1;
          while (i < pkt.length) {
            document
              .getElementById(pkt[0])
              .children[
                document.getElementById(pkt[0]).children.length - 1
              ].insertAdjacentHTML("afterend", pkt[i].replace(/•/g, "○"));
            i++;
          }
          j++;
        }

        PKTweight();
        //reset size
        var trueSize = itemPickUp.dataset.size.split(", ")[0];
        itemPickUp.dataset.size = trueSize;
      } //End of INV action

      //Act on item's Tech
      if (itemPickUp.dataset["itemtech"]) {
        var tCol = document.getElementById("TackColumn");
        var techs = itemPickUp.dataset.itemtech.split(", ");

        var i = 0; //
        while (i < techs.length) {
          tCol.insertAdjacentHTML(
            "beforeEnd",
            "<div class=' tech " +
              itemPickUp.id +
              "Tech" +
              "'>" +
              techs[i] +
              "</div>"
          );
          i++;
        }
      }

      //Act on item's Armor Stats
      if (itemPickUp.dataset["coverage"]) {
        var laids = document.getElementById("LAids").children;
        var hdids = document.getElementById("HDids").children;
        var raids = document.getElementById("RAids").children;
        var llids = document.getElementById("LLids").children;
        var bdids = document.getElementById("BDids").children;
        var rlids = document.getElementById("RLids").children;
        var coverage = itemPickUp.dataset["coverage"].split(", ");
        var armorStat = itemPickUp.dataset["armorstats"].split(", ");

        //la
        var i = 0;
        while (i < 5) {
          if (
            !laids[i].innerText &&
            coverage.slice(5, 10).some((x) => x.includes("t"))
          ) {
            //get actual column values nh
            var armorColumn = Array.from(
              document.getElementsByClassName(laids[i].classList)
            );
            //assign info
            laids[i].innerText = " " + itemPickUp.id;
            var j = 5;
            while (j < 10) {
              if (coverage[j][0] == "t") {
                armorColumn[j - 4].children[0].parentNode.style.background =
                  "rgb(0 0 0 /25%)";
              }
              if (coverage[j][1] == "t") {
                armorColumn[j - 4].children[0].checked = "true";
                armorColumn[j - 4].children[0].setAttribute("checked", "");
              } else armorColumn[j - 4].children[0].removeAttribute("checked");
              j++;
            }

            armorColumn[6].innerText = armorStat[0];
            armorColumn[7].innerText = armorStat[1];
            armorColumn[8].innerText = armorStat[2];

            i = 5;
          }
          i++;
        }
        //hd
        i = 0;
        while (i < 5) {
          if (
            !hdids[i].innerText &&
            coverage.slice(0, 5).some((x) => x.includes("t"))
          ) {
            //get actual column values
            var armorColumn = Array.from(
              document.getElementsByClassName(hdids[i].classList)
            );
            //assign info
            hdids[i].innerText = " " + itemPickUp.id;
            var j = 0;
            while (j < 5) {
              if (coverage[j][0] == "t") {
                armorColumn[j + 1].children[0].parentNode.style.background =
                  "rgb(0 0 0 /25%)";
              }
              if (coverage[j][1] == "t") {
                armorColumn[j + 1].children[0].checked = "true";
                armorColumn[j + 1].children[0].setAttribute("checked", "");
              } else armorColumn[j + 1].children[0].removeAttribute("checked");
              j++;
            }

            armorColumn[6].innerText = armorStat[0];
            armorColumn[7].innerText = armorStat[1];
            armorColumn[8].innerText = armorStat[2];

            i = 5;
          }
          i++;
        }
        //ra
        i = 0;
        while (i < 5) {
          if (
            !raids[i].innerText &&
            coverage.slice(25, 30).some((x) => x.includes("t"))
          ) {
            //get actual column values
            var armorColumn = Array.from(
              document.getElementsByClassName(raids[i].classList)
            );
            //assign info
            raids[i].innerText = " " + itemPickUp.id;
            var j = 25;
            while (j < 30) {
              if (coverage[j][0] == "t") {
                armorColumn[j - 24].children[0].parentNode.style.background =
                  "rgb(0 0 0 /25%)";
              }
              if (coverage[j][1] == "t") {
                armorColumn[j - 24].children[0].checked = "true";
                armorColumn[j - 24].children[0].setAttribute("checked", "");
              } else armorColumn[j - 24].children[0].removeAttribute("checked");
              j++;
            }

            armorColumn[6].innerText = armorStat[0];
            armorColumn[7].innerText = armorStat[1];
            armorColumn[8].innerText = armorStat[2];

            i = 5;
          }
          i++;
        }
        //ll
        i = 0;
        while (i < 5) {
          if (
            !llids[i].innerText &&
            coverage.slice(15, 20).some((x) => x.includes("t"))
          ) {
            //get actual column values
            var armorColumn = Array.from(
              document.getElementsByClassName(llids[i].classList)
            );
            //assign info
            llids[i].innerText = " " + itemPickUp.id;
            var j = 15;
            while (j < 20) {
              if (coverage[j][0] == "t") {
                armorColumn[j - 14].children[0].parentNode.style.background =
                  "rgb(0 0 0 /25%)";
              }
              if (coverage[j][1] == "t") {
                armorColumn[j - 14].children[0].checked = "true";
                armorColumn[j - 14].children[0].setAttribute("checked", "");
              } else armorColumn[j - 14].children[0].removeAttribute("checked");
              j++;
            }

            armorColumn[6].innerText = armorStat[0];
            armorColumn[7].innerText = armorStat[1];
            armorColumn[8].innerText = armorStat[2];

            i = 5;
          }
          i++;
        }
        //bd
        i = 0;
        while (i < 5) {
          if (
            !bdids[i].innerText &&
            coverage.slice(10, 15).some((x) => x.includes("t"))
          ) {
            //get actual column values
            var armorColumn = Array.from(
              document.getElementsByClassName(bdids[i].classList)
            );
            //assign info
            bdids[i].innerText = " " + itemPickUp.id;
            var j = 10;
            while (j < 15) {
              if (coverage[j][0] == "t") {
                armorColumn[j - 9].children[0].parentNode.style.background =
                  "rgb(0 0 0 /25%)";
              }
              if (coverage[j][1] == "t") {
                armorColumn[j - 9].children[0].checked = "true";
                armorColumn[j - 9].children[0].setAttribute("checked", "");
              } else armorColumn[j - 9].children[0].removeAttribute("checked");
              j++;
            }

            armorColumn[6].innerText = armorStat[0];
            armorColumn[7].innerText = armorStat[1];
            armorColumn[8].innerText = armorStat[2];

            i = 5;
          }
          i++;
        }
        //rl
        i = 0;
        while (i < 5) {
          if (
            !rlids[i].innerText &&
            coverage.slice(20, 25).some((x) => x.includes("t"))
          ) {
            //get actual column values
            var armorColumn = Array.from(
              document.getElementsByClassName(rlids[i].classList)
            );
            //assign info
            rlids[i].innerText = " " + itemPickUp.id;
            var j = 20;
            while (j < 25) {
              if (coverage[j][0] == "t") {
                armorColumn[j - 19].children[0].parentNode.style.background =
                  "rgb(0 0 0 /25%)";
              }
              if (coverage[j][1] == "t") {
                armorColumn[j - 19].children[0].checked = "true";
                armorColumn[j - 19].children[0].setAttribute("checked", "");
              } else armorColumn[j - 19].children[0].removeAttribute("checked");
              j++;
            }

            armorColumn[6].innerText = armorStat[0];
            armorColumn[7].innerText = armorStat[1];
            armorColumn[8].innerText = armorStat[2];

            i = 5;
          }
          i++;
        }
      }

      //end
      addRes(itemPickUp);
      itemPickUp = "";
    }
    event.target.dispatchEvent(invChange);
  }
} //End of Declarations

//Initialize
initializeSheet();

//cookie Log-in
function lastLog(){
  if(document.cookie.includes("lastLog")){
    var user=document.getElementById("User");
    var key=document.getElementById("Key");
    
    //Substring must be the number of letters of the Cookie name and the = sign.
    var lastUser=document.cookie.split("-")[0].substring(8);
    var lastKey=document.cookie.split("-")[1];
  
    user.value=lastUser;
    key.value=lastKey;
    jsLoad();
  }
  
}
lastLog();
/*notes
- greater bleed light up
- dp needs to set it's own max
- bg custom settings don't save
*/
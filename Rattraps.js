var content = document.getElementById("subSheet");
function jsSave(){
google.script.run.Save(content.innerHTML);
}

function update(data){
console.log("Data in Update:  "+data)
content.innerHTML=data;
}
function jsLoad(){
google.script.run.withSuccessHandler(update).Load();
console.log("jsLoad Ran")
}


//Declare Array variables
var barDups = 0;

  Toxic = [document.getElementById("ToxicVal")]
  var Exp = Array.from(document.querySelectorAll(".EXPvalue"));
  var TraitRanks = Array.from(document.querySelectorAll(".realTrait"));
  var abilities = Array.from(document.querySelectorAll(".Ability"));
  var Ranks = Array.from(document.querySelectorAll(".Rank"));
  var Slots = Array.from(document.querySelectorAll(".AbilSlot"));
  var invBonus = 0; //Needed for Weight classn

  var worldTemp = 0; //Need to define this with serve world info!


/*Array Variables*/ 
function updateVariablesOnLoad() {
  var barDups = 0;

  Toxic = [document.getElementById("ToxicVal")]
  var Exp = Array.from(document.querySelectorAll(".EXPvalue"));
  var TraitRanks = Array.from(document.querySelectorAll(".realTrait"));
  var abilities = Array.from(document.querySelectorAll(".Ability"));
  var Ranks = Array.from(document.querySelectorAll(".Rank"));
  var Slots = Array.from(document.querySelectorAll(".AbilSlot"));
  var invBonus = 0; //Needed for Weight classn

  var worldTemp = 0; //Need to define this with serve world info!
}








/*Function declarations*/ {
  //Declaring Exp handling function.s
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
  //weight managemenet
  function weightGoalCalc(real, exp, goal) {
    if (real.value && 1 < real.value && real.value < 5) {
      var level = parseInt(real.value);
      var expGoal = Math.abs(level - 3) * 10 + 30;
      goal.innerText = "/" + expGoal;
    } else if (real.value) {
      expGoal = 50;
      goal.innerText = "/" + expGoal;
    }
  }
  function weightCatBonus(real, invBonus, bonus, func) {
    var adjFunc = parseInt(real.value) + parseInt(bonus.value);
    if (invBonus) {
      adjFunc = adjFunc + parseInt(invBonus.value);
    }
    if (adjFunc || adjFunc === 0) {
      func.innerHTML = Math.max(adjFunc, 0);
    }
  }
  //Set fed status for weight exp
  function setFedStatus(goal, hMax) {
    hMax = hMax.innerText * 10;
    var hMin = hMax / 2;
    document.getElementById("HungerVal") = document.getElementById("HungerVal").value;
    goal = parseInt(goal.innerText.slice(1));
    if (document.getElementById("HungerVal") < hMin && document.getElementById("HungerVal") && !underfed) {
      underfed = true;
    }
    if (document.getElementById("HungerVal") > hMax && document.getElementById("HungerVal") && !overfed) {
      overfed = true;
    }
    if (document.getElementById("HungerVal") >= hMin && document.getElementById("HungerVal") <= hMax) {
      underfed = false;
      overfed = false;
    }
  }
  //Use Fed Status to calc Weight exp
  function weightExpGain(real, exp, goal, hMax) {
    hMax = hMax.innerText * 10;
    var hMin = hMax / 2;
    document.getElementById("HungerVal") = document.getElementById("HungerVal").value;
    goal = parseInt(goal.innerText.slice(1));

    if (document.getElementById("HungerVal") < hMin && document.getElementById("HungerVal") && !underfed) {
      underfed = true;
      exp.value--;
      if (exp.value * -1 >= goal && real.value > 1) {
        real.value = parseInt(real.value) - 1;
        exp.value = 0;
        weightGoalCalc(wgtReal, wgtExp, wgtGoal);
      }
    }
    if (document.getElementById("HungerVal") > hMax && document.getElementById("HungerVal") && !overfed) {
      overfed = true;
      exp.value++;
      if (exp.value >= goal && real.value < 5) {
        real.value = parseInt(real.value) + 1;
        exp.value = 0;
        weightGoalCalc(wgtReal, wgtExp, wgtGoal);
      }
    }
    if (document.getElementById("HungerVal") >= hMin && document.getElementById("HungerVal") <= hMax) {
      underfed = false;
      overfed = false;
    }
  }
  //Character Level
  function levelCalc(reals, ranks) {
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
  //Declaring Trait Category Bonus functions.
  function catBonus(real, catBonus, traitBonus, traitFunc) {
    var adjFunc =
      parseInt(real.value) +
      parseInt(catBonus.value) +
      parseInt(traitBonus.value);
    if (adjFunc) {
      traitFunc.innerHTML = Math.max(Math.min(adjFunc, 6), 0);
      wildCalc(document.getElementById("staFunc"), document.getElementById("intFunc"));
      secCardCalc(document.getElementById("staFunc"), document.getElementById("intFunc"));
      if (barDups > 0) {
        var sat = document.getElementById("SatMiddle");
        var barsToGo = barDups;
        while (barsToGo > 0) {
          satBarFill(
            sat.children[sat.children.length - barsToGo - 1].children[1]
              .children[2],
            sat.children[sat.children.length - barsToGo - 1].children[1]
              .children[0]
          );
          barsToGo--;
        }
      }
    }
  }
  //Display Wild Card Limit
  function wildCalc(stam, intel) {
    var stamVal = parseInt(stam.innerText);
    var intelVal = parseInt(intel.innerText);
    var wildMax = Math.min(stamVal, intelVal) * 5;
    document.getElementById("WildCardTotal").innerText = " / " + wildMax;
  }
  //Display Special Card Limit
  function secCardCalc(stam, intel) {
    var stamVal = parseInt(stam.innerText);
    var intelVal = parseInt(intel.innerText);
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
    madeBar.children[1].children[0].id = "Dup" + barDups;

    var newInput = document.getElementById("Dup" + barDups);
    button.parentNode.appendChild(button);

    newInput.addEventListener("change", function () {
      satBarFill(
        madeBar.children[1].children[1],
        madeBar.children[1].children[0]
      );
    });
    Toxic.push(newInput);

    barDups++;
  }
  //Remove Toxic Bars
  function remBar() {
    var sat = document.getElementById("SatMiddle");
    var barsToGo = barDups;
    if (barDups > 0) {
      sat.children[sat.children.length - 2].remove();
      barDups--;
    }
  }
  //PassTime
  function passHour() {
    var newHour = parseInt(document.getElementById("CurrentHour").innerText) + 1;
    /*Sat Decay*/ {
      //Temp Modification
      var coldModded = 1;
      var hotModded = 1;
      if (document.getElementById("coldMultiplier").innerText > 0) {
        coldModded = document.getElementById("coldMultiplier").innerText;
      } else if (document.getElementById("hotMultiplier").innerText > 0) {
        hotModded = document.getElementById("hotMultiplier").innerText;
      }
      document.getElementById("HungerVal").value = document.getElementById("HungerVal").value - coldModded;
      if (document.getElementById("HungerVal").value < 0) {
        document.getElementById("HungerVal").value = 0;
      }
      document.getElementById("WaterVal").value = document.getElementById("WaterVal").value - hotModded;
      if (document.getElementById("WaterVal").value < 0) {
        document.getElementById("WaterVal").value = 0;
      }
      document.getElementById("SleepVal").value--;
      if (document.getElementById("SleepVal").value < 0) {
        document.getElementById("SleepVal").value = 0;
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

      );
      satBarFill(
        document.getElementById("swBar"),

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
        document.get
      
      );
    }
    if (newHour > 23) {
      dayCount();
      expDecay();
    }
    newHour = newHour % 24;
    document.getElementById("CurrentHour").innerText = String(newHour).padStart(2, "0");
  }
  //Sleep functionality
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
  //Day Counter
  function dayCount() {
    var day = document.getElementById("currentDay");
    var newDay = parseInt(day.innerText) + 1;
    day.innerText = String(newDay).padStart(4, "0");
  }
  //ExpDecay
  function expDecay() {
    var exp = Array.from(document.querySelectorAll(".EXPvalue"));
    var i = 0;
    while (i < exp.length) {
      console.log(exp[i].value);
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
  //Assign event Listenrs to Abilitiessss
  function abilExp() {
    var i = 0;
    while (i < abilities.length) {
      let Rank = abilities[i].children[0].children[2].children[0];
      let aExp = abilities[i].children[0].children[0].children[0];
      let aGoal = abilities[i].children[0].children[0].children[1];

      expGoalCalc(Rank, aExp, aGoal);
      abilities[i].children[0].addEventListener("input", function () {
        expGoalCalc(Rank, aExp, aGoal);
        levelCalc(TraitRanks, Ranks);
      });
      i++;
    }
  }
  //Open windows
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
          abilities.push(document.getElementById(type + aID));
          Ranks.push(Slots[i].children[0].children[0].children[2].children[0]);

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
  function slotMemoryLimits(slots, spd, dex, int, wis, abil, dropTarget) {
    spd = parseInt(spd.innerText);
    dex = parseInt(dex.innerText);
    int = parseInt(int.innerText);
    wis = parseInt(wis.innerText);
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
        if (
          !aKey[i] &&
          abilities[i].parentNode.className.includes("Forgotten")
        ) {
          var exp = abilities[i].children[0].children[0].children[0];
          exp.value = parseInt(exp.value * 0.8);
        }
        i++;
      }
    }
  }
  //Range Output display
  function rangeReadout(range, out) {
    out.innerText = range.value;
    thermoBarFunc(worldTemp, document.getElementById("ThermBar"), document.getElementById("ThermFill"));
  }
  //Thermo Bar Functionality
  function thermoBarFunc(temp, bar, fill) {
    var effects = bar.parentNode.parentNode.children[0].children;
    var context = parseInt(
      document.getElementById("TempContextReadout").innerText
    );
    var barScale = 35 / (document.getElementById("conFunc").innerText * 5);
    var tempState = Math.abs(Math.round((temp + context) / document.getElementById("conFunc").innerText));
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
    carryLimit.innerText = document.getElementById("strFunc").innerText * 25;
  }
  //Toggle Secttons
  function toggleSection(state, section) {}
  //Duplicate the tech section when making new armor items
  function dupSection(target){
    newSection=target.parentNode.cloneNode("true");
    target.parentNode.parentNode.appendChild(newSection);
  }
  //Remove New Tech slots when creating items
  function NewItemTechRemove(target){
    if(target.parentNode.parentNode.children.length>1){
     target.parentNode.remove() 
    }
  }
} //End of declarations

/*Function Calls*/ {
  /*Initial exp goal Assignments*/ {
    expGoalCalc(document.getElementById("strReal"), document.getElementById("strExp"), document.getElementById("strGoal"));
    expGoalCalc(document.getElementById("dexReal"), document.getElementById("dexExp"), document.getElementById("dexGoal"));
    expGoalCalc(document.getElementById("spdReal"), document.getElementById("spdExp"),  document.getElementById("spdGoal"));
    expGoalCalc(document.getElementById("perReal"), document.getElementById("perExp"), document.getElementById("perGoal"));
    expGoalCalc(document.getElementById("chaReal"), document.getElementById("chaExp"), document.getElementById("chaGoal"));
    expGoalCalc(document.getElementById("navReal"), document.getElementById("navExp"), document.getElementById("navGoal"));
    expGoalCalc(document.getElementById("endReal"), document.getElementById("endExp"), document.getElementById("endGoal"));
    expGoalCalc(document.getElementById("conReal"), document.getElementById("conExp"), document.getElementById("conGoal"));
    expGoalCalc(document.getElementById("staReal"), document.getElementById("staExp"), document.getElementById("staGoal"));
    expGoalCalc(document.getElementById("intReal"), document.getElementById("intExp"), document.getElementById("intGoal"));
    expGoalCalc(document.getElementById("wisReal"), document.getElementById("wisExp"), document.getElementById("wisGoal"));
    expGoalCalc(document.getElementById("knoReal"), document.getElementById("knoExp"), document.getElementById("knoGoal"));
    //weight goal calc
    weightGoalCalc(wgtReal, wgtExp, wgtGoal);
    //Ability Exp Initial Assignment
    abilExp();

    //Level Calculation
    levelCalc(TraitRanks, Ranks);
  }
  /*Initial assignments of Func trait values*/ {
    catBonus(document.getElementById("strReal"), document.getElementById("athBonus"), document.getElementById("strBonus"), document.getElementById("strFunc"));
    catBonus(document.getElementById("dexReal"), document.getElementById("athBonus"), document.getElementById("dexBonus"), document.getElementById("dexFunc"));
    catBonus(document.getElementById("spdReal"), document.getElementById("athBonus"), document.getElementById("spdBonus"), document.getElementById("spdFunc"));
    catBonus(document.getElementById("perReal"), document.getElementById("aweBonus"), document.getElementById("perBonus"), document.getElementById("perFunc"));
    catBonus(document.getElementById("chaReal"), document.getElementById("aweBonus"), document.getElementById("chaBonus"),  document.getElementById("chaFunc"));
    catBonus(document.getElementById("navReal"), document.getElementById("aweBonus"), document.getElementById("navBonus"), document.getElementById("navFunc"));
    catBonus(document.getElementById("endReal"), document.getElementById("bodBonus"), document.getElementById("endBonus"), document.getElementById("endFunc"));
    catBonus(document.getElementById("conReal"), document.getElementById("bodBonus"), document.getElementById("conBonus"), document.getElementById("conFunc"));
    catBonus(document.getElementById("staReal"), document.getElementById("bodBonus"), document.getElementById("staBonus"), document.getElementById("staFunc"));
    catBonus(document.getElementById("intReal"), document.getElementById("mndBonus"), document.getElementById("intBonus"), document.getElementById("intFunc"));
    catBonus(document.getElementById("wisReal"), document.getElementById("mndBonus"), document.getElementById("wisBonus"), document.getElementById("wisFunc"));
    catBonus(document.getElementById("knoReal"), document.getElementById("mndBonus"), document.getElementById("knoBonus"), document.getElementById("knoFunc"));
    weightCatBonus(wgtReal, invBonus, wgtBonus, wgtFunc);
  }
  //Initials
  carryWeight();
  /*Initial assignment of Ability Memory*/ {
    slotMemoryLimits(Slots, document.getElementById("spdFunc"), document.getElementById("dexFunc"), document.getElementById("intFunc"), document.getElementById("wisFunc"));
  }
  /*Initial assignment of Exp Decay Factors*/ {
    var secSklMem = Math.min(document.getElementById("spdFunc").innerText, document.getElementById("dexFunc").innerText);
    var secInsMem = Math.min(document.getElementById("intFunc").innerText, document.getElementById("wisFunc").innerText);
  }
  /*Weight Management EXP initial set (Testing Only)*/ {
    weightExpGain(
      document.getElementById("wgtReal"),
      document.getElementById("wgtExp"),
      document.getElementById("wgtGoal"),
      document.getElementById("HungerVal"),
      document.getElementById("conFunc")
    );
  }
  /*Initial Assaignment of Card Limits*/ {
    wildCalc(document.getElementById("staFunc"), document.getElementById("intFunc"));
    secCardCalc(document.getElementById("staFunc"), document.getElementById("intFunc"));
    //These are also called inside the category Bonus
    //function, as those set the functional trait values
    // and thus are the only way to get the CURRENT TraitFunc
  }
  /*event listener fot the Real Traits*/ {


    //!!! THIS IS NEW !!!
    document.getElement.ById("subSheet").addEventListener("input", function (event){
if (event.target.id==="strReal"){
    expGoalCalc(document.getElementById("strReal"), document.getElementById("strExp"), document.getElementById("strGoal"));
      catBonus(document.getElementById("strReal"), document.getElementById("athBonus"), document.getElementById("strBonus"), document.getElementById("strFunc"));
      levelCalc(TraitRanks, Ranks);
    carryWeight();

  } else if (event.target.id==="dexReal"){
    expGoalCalc(document.getElementById("dexReal"), document.getElementById("dexExp"), document.getElementById("dexGoal"));
      catBonus(document.getElementById("dexReal"), document.getElementById("athBonus"), document.getElementById("dexBonus"), document.getElementById("dexFunc"));
      levelCalc(TraitRanks, Ranks);
      slotMemoryLimits(Slots, document.getElementById("spdFunc"), document.getElementById("dexFunc"), document.getElementById("intFunc"), document.getElementById("wisFunc"));
      secSklMem = Math.min(document.getElementById("spdFunc").innerText, document.getElementById("dexFunc").innerText);
  }

})

//!!! END OF NEW CONTENT !!!


    document.getElementById("spdReal").addEventListener("input", function () {
      expGoalCalc(document.getElementById("spdReal"), document.getElementById("spdExp"),  document.getElementById("spdGoal"));
      catBonus(document.getElementById("spdReal"), document.getElementById("athBonus"), document.getElementById("spdBonus"), document.getElementById("spdFunc"));
      levelCalc(TraitRanks, Ranks);
      slotMemoryLimits(Slots, document.getElementById("spdFunc"), document.getElementById("dexFunc"), document.getElementById("intFunc"), document.getElementById("wisFunc"));
      secSklMem = Math.min(document.getElementById("spdFunc").innerText, document.getElementById("dexFunc").innerText);
    });
    document.getElementById("perReal").addEventListener("input", function () {
      expGoalCalc(document.getElementById("perReal"), document.getElementById("perExp"), document.getElementById("perGoal"));
      catBonus(document.getElementById("perReal"), document.getElementById("aweBonus"), document.getElementById("perBonus"), document.getElementById("perFunc"));
      levelCalc(TraitRanks, Ranks);
    });
    document.getElementById("chaReal").addEventListener("input", function () {
      expGoalCalc(document.getElementById("chaReal"), document.getElementById("chaExp"), document.getElementById("chaGoal"));
      catBonus(document.getElementById("chaReal"), document.getElementById("aweBonus"), document.getElementById("chaBonus"),  document.getElementById("chaFunc"));
      levelCalc(TraitRanks, Ranks);
    });
    document.getElementById("navReal").addEventListener("input", function () {
      expGoalCalc(document.getElementById("navReal"), document.getElementById("navExp"), document.getElementById("navGoal"));
      catBonus(document.getElementById("navReal"), document.getElementById("aweBonus"), document.getElementById("navBonus"), document.getElementById("navFunc"));
      levelCalc(TraitRanks, Ranks);
    });
    document.getElementById("endReal").addEventListener("input", function () {
      expGoalCalc(document.getElementById("endReal"), document.getElementById("endExp"), document.getElementById("endGoal"));
      catBonus(document.getElementById("endReal"), document.getElementById("bodBonus"), document.getElementById("endBonus"), document.getElementById("endFunc"));
      levelCalc(TraitRanks, Ranks);
    });
    document.getElementById("conReal").addEventListener("input", function () {
      expGoalCalc(document.getElementById("conReal"), document.getElementById("conExp"), document.getElementById("conGoal"));
      catBonus(document.getElementById("conReal"), document.getElementById("bodBonus"), document.getElementById("conBonus"), document.getElementById("conFunc"));
      levelCalc(TraitRanks, Ranks);
      thermoBarFunc(worldTemp, document.getElementById("ThermBar"), document.getElementById("ThermFill"));

      satBarFill(document.getElementById("shBar"), document.getElementById("HungerVal"));
      satBarFill(document.getElementById("swBar"), document.getElementById("WaterVal"));
      satBarFill(document.getElementById("szBar"), document.getElementById("SleepVal"));
      satBarFill(document.getElementById("stBar"), Toxic[0]);
    });
    document.getElementById("staReal").addEventListener("input", function () {
      expGoalCalc(document.getElementById("staReal"), document.getElementById("staExp"), document.getElementById("staGoal"));
      catBonus(document.getElementById("staReal"), document.getElementById("bodBonus"), document.getElementById("staBonus"), document.getElementById("staFunc"));
      wildCalc(document.getElementById("staFunc"), document.getElementById("intFunc"));
      levelCalc(TraitRanks, Ranks);
    });
    document.getElementById("intReal").addEventListener("input", function () {
      expGoalCalc(document.getElementById("intReal"), document.getElementById("intExp"), document.getElementById("intGoal"));
      catBonus(document.getElementById("intReal"), document.getElementById("mndBonus"), document.getElementById("intBonus"), document.getElementById("intFunc"));
      levelCalc(TraitRanks, Ranks);
      slotMemoryLimits(Slots, document.getElementById("spdFunc"), document.getElementById("dexFunc"), document.getElementById("intFunc"), document.getElementById("wisFunc"));
      secInsMem = Math.min(document.getElementById("intFunc").innerText, document.getElementById("wisFunc").innerText);
    });
    document.getElementById("wisReal").addEventListener("input", function () {
      expGoalCalc(document.getElementById("wisReal"), document.getElementById("wisExp"), document.getElementById("wisGoal"));
      catBonus(document.getElementById("wisReal"), document.getElementById("mndBonus"), document.getElementById("wisBonus"), document.getElementById("wisFunc"));
      levelCalc(TraitRanks, Ranks);
      slotMemoryLimits(Slots, document.getElementById("spdFunc"), document.getElementById("dexFunc"), document.getElementById("intFunc"), document.getElementById("wisFunc"));
      secInsMem = Math.min(document.getElementById("intFunc").innerText, document.getElementById("wisFunc").innerText);
    });
    document.getElementById("knoReal").addEventListener("input", function () {
      expGoalCalc(document.getElementById("knoReal"), document.getElementById("knoExp"), document.getElementById("knoGoal"));
      catBonus(document.getElementById("knoReal"), document.getElementById("mndBonus"), document.getElementById("knoBonus"), document.getElementById("knoFunc"));
      levelCalc(TraitRanks, Ranks);
      thermoBarFunc(document.getElementById("knoReal"), document.getElementById("ThermBar"), document.getElementById("ThermFill"));
    });
    wgtReal.addEventListener("input", function () {
      weightGoalCalc(wgtReal, wgtExp, wgtGoal);
      weightCatBonus(wgtReal, invBonus, wgtBonus, wgtFunc);
      levelCalc(TraitRanks, Ranks);
    });
  }
  /*Event Listeners for category bonueses*/ {
    document.getElementById("athBonus").addEventListener("input", function () {
      catBonus(document.getElementById("strReal"), document.getElementById("athBonus"), document.getElementById("strBonus"), document.getElementById("strFunc"));
      catBonus(document.getElementById("dexReal"), document.getElementById("athBonus"), document.getElementById("dexBonus"), document.getElementById("dexFunc"));
      catBonus(document.getElementById("spdReal"), document.getElementById("athBonus"), document.getElementById("spdBonus"), document.getElementById("spdFunc"));
      slotMemoryLimits(Slots, document.getElementById("spdFunc"), document.getElementById("dexFunc"), document.getElementById("intFunc"), document.getElementById("wisFunc"));
      secSklMem = Math.min(document.getElementById("spdFunc").innerText, document.getElementById("dexFunc").innerText);
      carryWeight();
    });
    document.getElementById("aweBonus").addEventListener("input", function () {
      catBonus(document.getElementById("perReal"), document.getElementById("aweBonus"), document.getElementById("perBonus"), document.getElementById("perFunc"));
      catBonus(document.getElementById("chaReal"), document.getElementById("aweBonus"), document.getElementById("chaBonus"),  document.getElementById("chaFunc"));
      catBonus(document.getElementById("navReal"), document.getElementById("aweBonus"), document.getElementById("navBonus"), document.getElementById("navFunc"));
    });
    document.getElementById("bodBonus").addEventListener("input", function () {
      catBonus(document.getElementById("endReal"), document.getElementById("bodBonus"), document.getElementById("endBonus"), document.getElementById("endFunc"));
      catBonus(document.getElementById("conReal"), document.getElementById("bodBonus"), document.getElementById("conBonus"), document.getElementById("conFunc"));
      catBonus(document.getElementById("staReal"), document.getElementById("bodBonus"), document.getElementById("staBonus"), document.getElementById("staFunc"));
      thermoBarFunc(worldTemp, document.getElementById("ThermBar"), document.getElementById("ThermFill"));
      satBarFill(
        document.getElementById("shBar"),

      );
      satBarFill(
        document.getElementById("swBar"),

      );
      satBarFill(
        document.getElementById("szBar"),
        document.getElementById("SleepVal")
      );
      satBarFill(
        document.getElementById("stBar"),
        document.getElementById("ToxicVal")
      );
    });
    document.getElementById("mndBonus").addEventListener("input", function () {
      catBonus(document.getElementById("intReal"), document.getElementById("mndBonus"), document.getElementById("intBonus"), document.getElementById("intFunc"));
      catBonus(document.getElementById("wisReal"), document.getElementById("mndBonus"), document.getElementById("wisBonus"), document.getElementById("wisFunc"));
      catBonus(document.getElementById("knoReal"), document.getElementById("mndBonus"), document.getElementById("knoBonus"), document.getElementById("knoFunc"));
      slotMemoryLimits(Slots, document.getElementById("spdFunc"), document.getElementById("dexFunc"), document.getElementById("intFunc"), document.getElementById("wisFunc"));
      secInsMem = Math.min(document.getElementById("intFunc").innerText, document.getElementById("wisFunc").innerText);
    });
  }
  /*Event Listener for Trait Bonuses*/ {
    document.getElementById("strBonus").addEventListener("input", function () {
      catBonus(document.getElementById("strReal"), document.getElementById("athBonus"), document.getElementById("strBonus"), document.getElementById("strFunc"));
      carryWeight();
    });
    document.getElementById("dexBonus").addEventListener("input", function () {
      catBonus(document.getElementById("dexReal"), document.getElementById("athBonus"), document.getElementById("dexBonus"), document.getElementById("dexFunc"));
      slotMemoryLimits(Slots, document.getElementById("spdFunc"), document.getElementById("dexFunc"), document.getElementById("intFunc"), document.getElementById("wisFunc"));
      secSklMem = Math.min(document.getElementById("spdFunc").innerText, document.getElementById("dexFunc").innerText);
    });
    document.getElementById("spdBonus").addEventListener("input", function () {
      catBonus(document.getElementById("spdReal"), document.getElementById("athBonus"), document.getElementById("spdBonus"), document.getElementById("spdFunc"));
      slotMemoryLimits(Slots, document.getElementById("spdFunc"), document.getElementById("dexFunc"), document.getElementById("intFunc"), document.getElementById("wisFunc"));
      secSklMem = Math.min(document.getElementById("spdFunc").innerText, document.getElementById("dexFunc").innerText);
    });
    document.getElementById("perBonus").addEventListener("input", function () {
      catBonus(document.getElementById("perReal"), document.getElementById("aweBonus"), document.getElementById("perBonus"), document.getElementById("perFunc"));
    });
    document.getElementById("chaBonus").addEventListener("input", function () {
      catBonus(document.getElementById("chaReal"), document.getElementById("aweBonus"), document.getElementById("chaBonus"),  document.getElementById("chaFunc"));
    });
    document.getElementById("navBonus").addEventListener("input", function () {
      catBonus(document.getElementById("navReal"), document.getElementById("aweBonus"), document.getElementById("navBonus"), document.getElementById("navFunc"));
    });
    document.getElementById("endBonus").addEventListener("input", function () {
      catBonus(document.getElementById("endReal"), document.getElementById("bodBonus"), document.getElementById("endBonus"), document.getElementById("endFunc"));
    });
    document.getElementById("conBonus").addEventListener("input", function () {
      catBonus(document.getElementById("conReal"), document.getElementById("bodBonus"), document.getElementById("conBonus"), document.getElementById("conFunc"));
      satBarFill(
        document.getElementById("swBar"),

      );
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
      thermoBarFunc(worldTemp, document.getElementById("ThermBar"), document.getElementById("ThermFill"));
    });
    document.getElementById("staBonus").addEventListener("input", function () {
      catBonus(document.getElementById("staReal"), document.getElementById("bodBonus"), document.getElementById("staBonus"), document.getElementById("staFunc"));
    });
    document.getElementById("intBonus").addEventListener("input", function () {
      catBonus(document.getElementById("intReal"), document.getElementById("mndBonus"), document.getElementById("intBonus"), document.getElementById("intFunc"));
      slotMemoryLimits(Slots, document.getElementById("spdFunc"), document.getElementById("dexFunc"), document.getElementById("intFunc"), document.getElementById("wisFunc"));
      secInsMem = Math.min(document.getElementById("intFunc").innerText, document.getElementById("wisFunc").innerText);
    });
    document.getElementById("wisBonus").addEventListener("input", function () {
      catBonus(document.getElementById("wisReal"), document.getElementById("mndBonus"), document.getElementById("wisBonus"), document.getElementById("wisFunc"));
      slotMemoryLimits(Slots, document.getElementById("spdFunc"), document.getElementById("dexFunc"), document.getElementById("intFunc"), document.getElementById("wisFunc"));
      secInsMem = Math.min(document.getElementById("intFunc").innerText, document.getElementById("wisFunc").innerText);
    });
    document.getElementById("knoBonus").addEventListener("input", function () {
      catBonus(document.getElementById("knoReal"), document.getElementById("mndBonus"), document.getElementById("knoBonus"), document.getElementById("knoFunc"));
    });
    wgtBonus.addEventListener("input", function () {
      weightGoalCalc(wgtReal, wgtExp, wgtGoal);
      weightCatBonus(wgtReal, invBonus, wgtBonus, wgtFunc);
    });
  }
  /*Initial Sat Assignments (Must be called AFTER Func is set)*/ {
    satBarFill(document.getElementById("shBar"), document.getElementById("HungerVal"));
    satBarFill(document.getElementById("swBar"), document.getElementById("WaterVal"));
    satBarFill(document.getElementById("szBar"), document.getElementById("SleepVal"));
    satBarFill(document.getElementById("stBar"), Toxic[0]);
  }
  /*Event Listeners for Sat Values.*/ {
    document.getElementById("HungerVal").addEventListener("change", function () {
      satBarFill(document.getElementById("shBar"), document.getElementById("HungerVal"));
      weightExpGain(
        document.getElementById("wgtReal"),
        document.getElementById("wgtExp"),
        document.getElementById("wgtGoal"),
        document.getElementById("HungerVal"),
        document.getElementById("conFunc")
      );
    });
    document.getElementById("WaterVal").addEventListener("change", function () {
      satBarFill(document.getElementById("swBar"), document.getElementById("WaterVal"));
    });
    document.getElementById("SleepVal").addEventListener("change", function () {
      satBarFill(document.getElementById("szBar"), document.getElementById("SleepVal"));
    });
    Toxic[0].addEventListener("change", function () {
      satBarFill(document.getElementById("stBar"), Toxic[0]);
    });
  }
  /*Initial Temperatue Bar assignment*/ {
    thermoBarFunc(worldTemp, document.getElementById("ThermBar"), document.getElementById("ThermFill"));
  }
}

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
        document.getElementById("spdFunc"),
        document.getElementById("dexFunc"),
        document.getElementById("intFunc"),
        document.getElementById("wisFunc"),
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



//Notes!!!
//Dont forget to set up Money Total in ID when the Inventory's done.
//SaveInput and SaveInputSP need to update their defaults with user inputs for the GAS saves to work fully.
//Need to add GAS save functions to here, or otherwise presever them, as well as the css & JS external Links

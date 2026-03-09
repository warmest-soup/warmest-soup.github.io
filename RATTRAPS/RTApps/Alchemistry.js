function colorAtoms() {
    Array.from(document.getElementsByClassName("Atom")).forEach((x) => {
        if (x.innerText) {
            x.style.background = "black";
            x.style.color = "white"
        } else {
            x.style.background = "white";
            x.style.color = "black"
        }
    })
}
colorAtoms();

function scanProperties(mole) {
    mole.parentNode.children[2].innerHTML="";
    var atoms = Array.from(mole.children).map((x) => x.innerText)
    atoms = atoms.map(x => x === "" ? "$" : x);

    var patterns = [];
    patterns.push(atoms[0] + atoms[1] + atoms[2]);
    patterns.push(atoms[3] + atoms[4] + atoms[5]);
    patterns.push(atoms[6] + atoms[7] + atoms[8]);

    patterns.push(atoms[0] + atoms[3] + atoms[6]);
    patterns.push(atoms[1] + atoms[4] + atoms[7]);
    patterns.push(atoms[2] + atoms[5] + atoms[8]);

    patterns.push(atoms[3] + atoms[1]);
    patterns.push(atoms[6] + atoms[4] + atoms[2]);
    patterns.push(atoms[7] + atoms[5]);

    patterns.push(atoms[1] + atoms[5]);
    patterns.push(atoms[0] + atoms[4] + atoms[8]);
    patterns.push(atoms[3] + atoms[7]);

    var properties = [];
    patterns.forEach((x) => {
        if (x.match(/\w{1,3}[+-/•]\d*/)) {
            properties.push(x.match(/\w{1,3}[+\-/•]\d*|\w{1,3}(?!)/)[0])
        }
    })
    properties.forEach((x, i) => {
        if (x.match(/[+-/•](?!\d)/)) {
            properties[i] = x + "1";
        }
    })
    properties = [...new Set(properties)]

    console.log(properties)
    var keyAc = ['Ath', 'Dx', 'Sp', 'St', 'Bod', 'Cn', 'Ed', 'Sa', 'Awe', 'Pr', 'Ca', 'Nv', 'Mnd', 'It', 'Ws', 'Ko', 'Wgt', 'Crd', 'Ht', 'P', 'R', 'HP', 'Sz', 'Ins', 'Abs', 'Cnd', 'Bri', 'DT', 'PD', 'Els', 'Bp', 'Ig',];
    var keyTerm = ['Athleticism', 'Dex', 'Spd', 'Str', 'Body', 'Con', 'End', 'Sta', 'Awareness', 'Per', 'Cha', 'Nav', 'Mind', 'Int', 'Wis', 'Kno', 'Weight', 'Cards', 'Heat', 'Power', 'Retention', 'Health', 'Size', 'Insulation', 'Absorbance', 'Conductivity', 'Brilliance', 'DT', 'Padding', 'Elasticity', 'Boiling Point', 'Ignition Point',];

    var j = 0;
    var k = 0;
    var cards=[];
    while (j < properties.length) {
        k=0;
        while (k < keyAc.length) {
            if (properties[j].match(keyAc[k])) {

                cards.push("<div class='pro'>" + keyTerm[k] + " " + properties[j].match(/[+-/•]\d*/)[0] + "</div>");
            }
            k++;
        }
        j++
    }
    
    var condensedCards = [...new Set(cards)]
    condensedCards.forEach((x)=> mole.parentNode.children[2].insertAdjacentHTML("beforeend", x));


}
Array.from(document.getElementsByClassName("Molecule")).forEach(x => scanProperties(x));

function allowDrop(event) {
    event.preventDefault();
}
var dataCache = [];
function AlchemDrag(event) {
    event.dataTransfer.setData("Text", event.target);
    dataCache = Array.from(event.target.children)
}
function AlchemDrop(event) {

    var applyTarget;
    if (event.target.classList.contains("Atom")) {
        applyTarget = event.target.parentNode;
    } else applyTarget = event.target;


    var targetMole = applyTarget.children;

    var i = 0;
    while (i < targetMole.length) {
        if (dataCache[i].innerText && !targetMole[i].innerText) {
            targetMole[i].innerText = dataCache[i].innerText;
            dataCache[i].innerText = "";
        }
        if (!parseInt(dataCache[i].innerText)
            && !parseInt(targetMole[i].innerText)) {

        }
        i++;
    }
    colorAtoms();
    Array.from(document.getElementsByClassName("Molecule")).forEach(x => scanProperties(x));
}

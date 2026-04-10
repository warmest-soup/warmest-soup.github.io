var blocks = Array.from(document.getElementsByTagName("blockquote"));
var Recovery = document.getElementById("DataRecovery");
Recovery.insertAdjacentHTML("beforeend", "<div>" + blocks.length + "<div>");


blocks.forEach((x) => {
    Recovery.appendChild(x)
});

var abilities = ["woodsman", "Cavalier", "athlete", "survivalist", "tactician", "libraneist", "soothsayer", "illustrator", "grappler", "archery", "combatant"];
var values = [];

var i = 0;


while (i < abilities.length) {
    var criteria = new RegExp(`[+]\\d+\\s${abilities[i]}`, 'ig');
    console.log(criteria) 
    blocks.forEach((x) => {
        if (x.innerText.match(criteria)) {
            values.push(x.innerText.match(criteria))
        }
    });
    i++;
}

console.log(values)
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


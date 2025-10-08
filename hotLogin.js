
var urldata=new URLSearchParams(window.location.search);

var charSheet=document.getElementById("GAScontent");
var sheetSource=charSheet.getAttribute("src");

if(urldata.get("hlgU")&&urldata.get("hlgK")){
  charSheet.setAttribute("src",
    sheetSource + "?hlgU=" + urldata.get("hlgU") + "&hlgK=" + urldata.get("hlgK")
  );
}

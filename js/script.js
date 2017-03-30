var form = document.getElementById('lone-form');

form.addEventListener("submit", processForm);

function trimslash(str) {
  return str.replace(/^\/+|\/+$/g, '');
}

function assignSummary(text) {
  document.getElementById("summary").innerHTML = text;
}
function processForm(e) {
    e.preventDefault();

    var title = document.getElementById("wiki-title").value;
    var language = document.getElementById("lang-opt").value;

    var url = "https://" + language + ".wikipedia.org/api/rest_v1/page/summary/" + trimslash(title);
    console.log(trimslash(title));
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(this.response);
        console.log(res);
        document.getElementById("heading").innerHTML = "<h4>" + res.title + "</h4>";
        var summary = res.extract.length == 0 ? "Nothing to display" : res.extract;
        assignSummary("<p>" + summary + "</p>");

      } else if (this.status == 404){

        assignSummary("<h3>Page not found.</h3>");
      } else {

        setTimeout(function() { assignSummary("<h3>Bad request.</h3>"); } , 3000);
      }
    };
    req.open("GET", url, true);

    req.send();
    return false;

}

var form = document.getElementById('lone-form');

form.addEventListener("submit", processForm);

function trimslash(str) {
  return str.replace(/^\/+|\/+$/g, '');
}

function assignExtract(text) {
  document.getElementById("extract").innerHTML = text;
}
function processForm(e) {
    e.preventDefault();

    var title = document.getElementById("wiki-title").value;
    var language = document.getElementById("lang-opt").value;

    //var url = "https://" + language + ".wikipedia.org/api/rest_v1/page/summary/" + trimslash(title);

    var searchurl = "https://" + language + ".wikipedia.org/w/api.php?action=opensearch&prop=text&format=json&origin=*&search=" + trimslash(title);

    var req = new XMLHttpRequest();
    req.onload = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(this.response);

        var title = res[1][0];

        var extracturl = "https://" + language + ".wikipedia.org/w/api.php?format=json&action=query&prop=extracts&titles=" + title + "&origin=*&redirects";

        var extractreq = new XMLHttpRequest();

          extractreq.onload = function () {
                if (this.readyState == 4 && this.status == 200) {

                    var extractres = JSON.parse(this.response);
                    var objkey = Object.keys(extractres.query.pages)[0];
                    exobj = extractres.query.pages[objkey];
                    //console.log(exobj.title);
                    //console.log(exobj.extract);
                    document.getElementById("heading").innerHTML = "<h4>" + exobj.title + "</h4>";
                    assignExtract(exobj.extract);

                    setTimeout(function(){console.log(document.getElementById("extractcontainer").innerHTML);},9000);

                } else if (this.status == 404) {
                    assignExtract("<h3>extract not found.</h3>")
                }
          };

          extractreq.onerror = function() {
            assignExtract("<h3>Error occured while extracting contents.</h3>");
          };
          extractreq.open("GET", extracturl, true);

          extractreq.send();

      } else if (this.status == 404){
          assignExtract("<h3>Page not found.</h3>");
      } else if (this.readyState == 4) {
          assignExtract("<h3>Bad request.</h3>");
      }
    };

    req.onerror = function() {
      assignExtract("<h3>Error Occured.</h3>")
    };
    req.open("GET", searchurl, true);

    req.send();
    return false;

}

// Variáveis globais
var instance = M.FloatingActionButton.getInstance(elem);

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, options);
});

function Regexinator() {
    let str = document.getElementById('input-string').value;
    let patt = document.getElementById('input-regex').value;
    //let patt1 = /patt1/i;
    let result;
    if (result = str.match(patt)) {
        document.getElementById('result-regex').innerHTML = result;
    } else {
        document.getElementById('result-regex').innerHTML = 'No match detected';
    }

}
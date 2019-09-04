// Variáveis globais

function Regexinator() {
    let str = document.getElementById('RegexString').value;
    let patt = document.getElementById('RegexGrammar').value;
    //let patt1 = /patt1/i;
    let result;
    let title = "Resultado";

    if(patt == "" || str == ""){

    } else if (result = str.match(patt)) {
        result = "Match: "+result;
        document.getElementById('result-regex-title').innerHTML = title;
        document.getElementById('result-regex').innerHTML = result;
    } else {
        result = "Match: No match detected";
        document.getElementById('result-regex-title').innerHTML = title;
        document.getElementById('result-regex').innerHTML = result;
    }

}

function multipleRegexinator() {
    let str = [];
    for(let i = 1; i <= 4; i++){
        str[i] = document.getElementById(i).value;
    }

    let patt = document.getElementById('RegexGrammar').value;
    // let patt = /patt1/i;
    let auxiliar_patt = "Gramática: "+patt;
    let result;

    if(patt == "" || patt == null || patt == undefined){
        document.getElementById('multiple-regex-grammar').innerHTML = 'Gramática não inserida, não pode analizar null';
    } else {
        document.getElementById('multiple-regex-grammar').innerHTML = auxiliar_patt;
    }

    for(let j = 1; j <=4; j++){
        if (patt == "" || str == "") {

        } else if (result = str[j].match(patt)) {
            result = "Match[" + j + "]: "+result;
            document.getElementById('multiple-result-regex'+j).innerHTML = result;
        } else {
            result = "Match[" + j + "]: " + "No match detected";
            document.getElementById('multiple-result-regex'+j).innerHTML = result;
        }
    }

}
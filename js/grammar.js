//Variáveis globais
// Variáveis constantes para as tableas
const $tableID = $('#table');
const $BTN = $('#export-btn');
const $EXPORT = $('#export');
// Criando vetores de objetos
var patt = [];
var str = [];
var grammar = [];
// Contadores para o vetor de objetos
var counter_multiple_inputs = 0;
var table_count = 0;
var str_count = 0;
var patt_count = 0;
var grammar_count = 0;

// JQuery perguntando se deseja sair, mesmo com coisas não salvas
$(document).ready(function () {
    var form = $('#meu-form-id'),
        original = form.serialize()

    form.submit(function () {
        window.onbeforeunload = null
    })

    window.onbeforeunload = function () {
        if (form.serialize() != original)
            return 'Tem certeza que deseja sair?'
    }
})

$tableID.on('click', '.table-remove', function () {
    $(this).parents('tr').detach();
});

$tableID.on('click', '.table-up', function () {
    const $row = $(this).parents('tr');
    if ($row.index() === 1) {
        return;
    }

    $row.prev().before($row.get(0));
});

$tableID.on('click', '.table-down', function () {

    const $row = $(this).parents('tr');
    $row.next().after($row.get(0));
});

// A few jQuery helpers for exporting only
jQuery.fn.pop = [].pop;
jQuery.fn.shift = [].shift;

$BTN.on('click', () => {

    const $rows = $tableID.find('tr:not(:hidden)');
    const headers = [];
    const data = [];

    // Get the headers (add special header logic here)
    $($rows.shift()).find('th:not(:empty)').each(function () {

        headers.push($(this).text().toLowerCase());
    });

    // Turn all existing rows into a loopable array
    $rows.each(function () {
        const $td = $(this).find('td');
        const h = {};

        // Use the headers from earlier to name our hash keys
        headers.forEach((header, i) => {

            h[header] = $td.eq(i).text();
        });

        data.push(h);
    });

    // Output the result
    $EXPORT.text(JSON.stringify(data));
});

function decreaseCounter() {
    if (table_count < 0)
        table_count = 0;

    table_count--;
}

function addTable() {
    let table = `
                <tr id="table${table_count}">
                    <td id="Terminal${table_count}" class="pt-3-half" contenteditable="true"></td>
                    <td id="arrow${table_count}" class="pt-3-half disable_td no-select">-></td>
                    <td id="Grammar${table_count}" class="pt-3-half" contenteditable="true"></td>
                    <td>
                        <span class="table-remove"><button type="button"
                            class="btn btn-danger btn-rounded btn-sm my-0" onclick="decreaseCounter()">Remover</button></span>
                    </td>
                </tr>
                `;
    $('#main-grammar-container').append(table);
    table_count = table_count + 1;
}

function addStringObj(str) {
    if (str != undefined && str != "") {
        str[i] = str;
    } else {
        alert("Objeto vazio");
    }
}

function isLowerCase(str) {
    return str == str.toLowerCase() && str != str.toUpperCase();
}


/* LÓGICA DE VERIFICAÇÃO */

$("#btn-verify").click(function () {
    let trees = createGrammarTree();
})



//CRIAR OBJETO
function createGrammarTree() {
    let trees = [];
    let tempgrammar = [];
    let final_string = [];

    for (let i = 0; i < table_count; i++) {
        tempgrammar.push(
            {
                indice: $(`#Terminal${i}`).text(),
                terminal: $(`#Grammar${i}`).text()[0],
                variavel: $(`#Grammar${i}`).text()[1],
            }
        );
    }
    //FORMAR NODOS
    tempgrammar.forEach((element, index) => {
        let contain = false;
        trees.forEach((node) => {
            if (node.indice == element.indice)
                contain = true;
        })
        if (!contain) {
            trees.push({ indice: element.indice, filhos: [] });
        }
    })// S A B
    // S -> aA
    // A -> bB
    // B -> c
    //FORMOU OBJETOS: [{indice: S, terminal: a, variavel: A}, {indice: A, terminal: b, variavel: B }, {indice: B, terminal:c, variavel: null}]
    //FORMOU NODOS: S A B

    /* ✓ X
                ELEMENT1[S,a,A]» N0[S]
                       IF(N0.indice == ELEMENT1.indice && ELEMENT1.terminal != null){
                                    X N0.indice é igual, mas terminal não é nulo
                       }ELSE IF (N0.indice == ELEMENT1.indice){
                                        SN0[S] 
                            SN0.indice é igual a ELEMENT1.variavel? | X
                                        SN1[A] 
                            SN1.indice é igual a ELEMENT1.variavel? | ✓
                                -> NO[S, [{a, SN1=N1}]]
                                        SN1[B] 
                            SN2.indice é igual a ELEMENT1.variavel? | X
                       }
                      N1[A]
                            IF(N1.indice == ELEMENT1.indice && ELEMENT1.terminal != null){
                                    X N1.indice é diferente 
                              }ELSE IF (N1.indice == ELEMENT1.indice){
                            X N1.indice é diferente 
                        }
                      N2[B]
                            IF(N2.indice == ELEMENT1.indice && ELEMENT1.terminal != null){
                                    X N2.indice é diferente 
                              }ELSE IF (N1.indice == ELEMENT1.indice){
                            X N2.indice é diferente 
                        }
                        
                     FIM RESULTA EM: N0[S, [{a, N1}]] 
      ELEMENT2[A,b,B]» N0[S]
                          
                     
               
    */
    tempgrammar.forEach((element, index) => {
        trees.forEach((node) => {
            if (node.indice == element.indice && element.variavel == null) {
                node.filhos.push({ terminal: element.terminal, variavel: null });
            } else if (node.indice == element.indice) {
                trees.forEach((subnode) => {
                    if (subnode.indice == element.variavel) {
                        node.filhos.push({ terminal: element.terminal, variavel: subnode });
                    }
                })
            }
        })
    })

    console.log(trees);
    return trees;
}

//PREPARA PRA ANALISAR
function grammarAnalyser(grammarObj) {
    let indice = "";
    let expressao = "";
    let expressao_usuario = $('#Expression').val();
    let contador_expressao_usuario = 0;
    let contador = 0;
    /*for(let i = 0; i < grammar_tree.length; i++) {
        indice = grammar_tree[i].indice;
        if(indice == grammar_tree[i].indice) {
            let j = 0;
            expressao += grammar_tree[i].string[j];
        } 
    //console.log(expressao);
    }
    */
    alert(grammarAnalyserRec(grammarObj, expressao_usuario, grammarObj[0].indice, 0));
}

let contador = 0;
//ALGORITIMO DE ANALISE
function grammarAnalyserRec(grammar, entrada_usuario, variavel_atual, contador_entrada) {
    //ITERAÇÃO
    //S -> b		| 1a: flag false; 
    //S -> aA		| 1a: flag false; 
    //A -> vazio	| 1a: flag false
    //Entrada: a

    if (grammar[contador].indice == variavel_atual && grammar[contador].flag == false) {
        console.log(grammar[contador].indice);
        console.log(contador);
        if (entrada_usuario[contador_entrada] == grammar[contador].terminal) {
            contador_entrada++;
            contador++;
            grammar[contador].flag = true;
            console.log(grammar);
            console.log(entrada_usuario);
            console.log(grammar[contador].indice);
            console.log(contador_entrada);
            grammarAnalyserRec(grammar, entrada_usuario, grammar[contador].indice, contador_entrada);
        } else {
            contador++;
            grammarAnalyserRec(grammar, entrada_usuario, grammar[contador].indice, contador_entrada);
        }
    }

    return contador_entrada;
}



function adicionarInput() {
    counter_multiple_inputs += 1;
    $('.modal-div-strings').append(`
    
    <div class="input-group mb-3">
            <div class="input-group-prepend">
            <span class="input-group-text no-select" id="inputGroup-sizing-default">Entrada ${counter_multiple_inputs} </span>
        </div>
        <input type="text" class="form-control" id="RegexString${counter_multiple_inputs}" aria-label="Default"
            aria-describedby="inputGroup-sizing-default">
    </div>
    `);
}

function multipleGrammarRegexinator() {
    let local_groups = new Array();
    let parenteses = "()";

    let str = new Array();

    for (let i = 1; i <= counter_multiple_inputs; i++) {
        str[i] = document.getElementById('RegexString' + i).value;
    }

    let patt = document.getElementById('RegexGrammarModal').value;
    // let patt = /patt1/i;
    let auxiliar_patt = "Gramática: " + patt;
    let result;

    if (patt == "" || patt == null || patt == undefined) {
        document.getElementById('multiple-regex-grammar').innerHTML = 'Gramática não inserida, não pode analizar null';
    } else {
        for (let j = 1; j <= counter_multiple_inputs; j++) {
            if (patt == "" || str == "") {

            } else if (result = str[j].match(patt)) {
                $('#RegexString' + j).html(result);
                $('#RegexString' + j).css('background-color', '#17ff4d66')

            } else {
                $('#RegexString' + j).html(result);
                $('#RegexString' + j).css('background-color', 'rgba(255, 23, 23, 0.4)')

            }
        }
    }
}


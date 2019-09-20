//Variáveis globais
// Variáveis constantes para as tableas
const $tableID = $('#table');
const $BTN = $('#export-btn');
const $EXPORT = $('#export');
// Criando vetores de objetos
var trees_global;
//var str = [];
// Contadores para o vetor de objetos
var counter_multiple_inputs = 0;
var table_count = 0;
var str_count = 0;

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

// JQuery para as tabelas
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

/* LÓGICA DE VERIFICAÇÃO */

$("#btn-create").click(function () {
    trees_global = createGrammarTree();
    ////console.log(trees_global);
})

//PREPARA PRA ANALISAR
$("#btn-verify").click(function () {
    let entrada_usuario = document.getElementById('Expression').value;

    trees_global = createGrammarTree();
    ////console.log(trees_global);
    //alert(entrada_usuario);
    ////console.log(grammarAnalyser(trees_global[0], entrada_usuario, 0, 0));

    /*for(let i = 0; i <= entrada_usuario.length; i++) {
        if (entrada_usuario[i] == "" && entrada_usuario[i] != "λ"){
            entrada_usuario[i] += ("λ");
        }
    }*/
    
    if (grammarAnalyser(trees_global[0], entrada_usuario, 0, 0)) {
        $('#Expression').css('background-color', '#17ff4d66')

    } else {
        $('#Expression').css('background-color', 'rgba(255, 23, 23, 0.4)')
    }
})  
//FIM DO PREPARA PRA ANALISAR

$("#btn-multiple-verify").click(function () {
    trees_global = createGrammarTree();
    multipleGrammarAnalyser(trees_global);
})

//CRIAR OBJETO
function createGrammarTree() {
    let trees = [];
    let tempgrammar = [];
    

    for (let i = 0; i < table_count; i++) {
        tempgrammar.push(
            {
                indice: $(`#Token${i}`).text(),
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
    })

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

    return trees;
}
//FIM DO CRIAR OBJETOS

//ALGORITIMO DE ANALISE
function grammarAnalyser(trees, entrada_usuario, contador_entrada, indice_atual) {
    //console.log("[ITERAÇÃO]")
    ////console.log(trees)
    for(let i = 0; i < trees.filhos.length; i++){
        
        if(trees.filhos[i].terminal == entrada_usuario[contador_entrada]){
            ////console.log("|-> Primeiro if | ", entrada_usuario.length-1, contador_entrada, trees.filhos[i].variavel)
            if(entrada_usuario.length-1 == contador_entrada && trees.filhos[i].variavel == null){
                return true;
            }else if(entrada_usuario.length-1 != contador_entrada && trees.filhos[i].variavel != null){
                return grammarAnalyser(trees.filhos[i].variavel, entrada_usuario, contador_entrada+1, indice_atual)
            }
        }else{

        }
    }
    return false;
    
}
//FIM DO ALGORIMOT DE ANÁLISE

//ANÁLISE MULTIPLA
function multipleGrammarAnalyser(trees_global) {

    let str = new Array();

    for (let i = 1; i <= counter_multiple_inputs; i++) {
        str[i] = document.getElementById('RegexString' + i).value;
        //str[i] += "λ";
    }

    // let patt = /patt1/i;
    let result;
    //let multiple_tree = createGrammarTree();
    for (let j = 1; j <= counter_multiple_inputs; j++) {
        result = grammarAnalyser(trees_global[0], str[j], 0, 0);
        if (result == true) {
            $('#RegexString' + j).css('background-color', '#17ff4d66')

        } else {
            $('#RegexString' + j).css('background-color', 'rgba(255, 23, 23, 0.4)')
        }
    }
}
//FIM DO ANÁLISE MULTIPLA

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

function addTable() {
    let table = `
                <tr id="table${table_count}">
                    <td id="Token${table_count}" class="pt-3-half" contenteditable="true">S</td>
                    <td id="arrow${table_count}" class="pt-3-half disable_td no-select">-></td>
                    <td id="Grammar${table_count}" class="pt-3-half" contenteditable="true">λ</td>
                    <td>
                        <span class="table-remove"><button type="button"
                            class="btn btn-danger btn-rounded btn-sm my-0" onclick="decreaseCounter()">Remover</button></span>
                    </td>
                </tr>
                `;
    $('#main-grammar-container').append(table);
    table_count = table_count + 1;
}

function decreaseCounter() {
    if (table_count < 0)
        table_count = 0;

    table_count--;
}

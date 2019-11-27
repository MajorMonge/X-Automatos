let parsedEdges = [];
let reduce = [];
let alfabeto = [];

$('#convertAFND-AFD').click(function () {
    cy.edges().forEach(function (edge, index) {
        parsedEdges.push(edge.data());
        if (cy.getElementById(edge.data().source).data().initial == true)
            parsedEdges[index].initial = true;
        else
            parsedEdges[index].initial = false;
        parsedEdges[index].final = cy.getElementById(edge.data().target).data().final;
        parsedEdges[index].target = cy.getElementById(edge.data().target).data().label;
        parsedEdges[index].source = cy.getElementById(edge.data().source).data().label;
    });

    cy.nodes().forEach(function (node, index) {
        reduce.push({
            nodo: node.data().label,
            initial: node.data().initial,
            final: node.data().final,

        });
    });
    const max = 2^(reduce.length);
    parsedEdges.forEach(function (edge, index1) {
        let add = true;
        alfabeto.forEach(function (letra, index2) {
            if (letra == edge.label)
                add = false;
        });
        if (add == true)
            alfabeto.push(edge.label);
    });
    reduce.forEach(function (elem, index1) {
        alfabeto.forEach(function (letra, index2) {
            elem[`${letra}`] = [];
        });
    });

    reduce.forEach(function (node, index1) {
        parsedEdges.forEach(function (edge, index2) {
            if (node.nodo == edge.source) {
                alfabeto.forEach(function (char, index3) {
                    if (edge.label == char) {
                        node[`${char}`].push(edge.target);
                    }
                });
            }
        });
    });
    
    reduce.forEach(function (node, index1) {
        alfabeto.forEach(function (char, index2) {
            if (node[`${char}`].length > 1 && !checkExist(node[`${char}`].join(''))) {
                checkTarget(node, char);
            }
        });
    })


    console.log("Nós: ", reduce, "\nArestas: ", parsedEdges, "\nAlfabeto: ", alfabeto);
});

function checkTarget(node, char) {
    
    reduce.push({
        nodo: node[`${char}`],
        initial: false,
        final: node.final
    });
    alfabeto.forEach(function (char, index3) {
        reduce[reduce.length-1][`${char}`] = [];
    });
    parsedEdges.forEach(function (edge, index4) {
        reduce[reduce.length-1].nodo.forEach(function (estate, index5) {
            if (estate == edge.source) {
                alfabeto.forEach(function (char, index4) {
                    if (edge.label == char) {
                        reduce[reduce.length-1][`${char}`].push(edge.target);
                    }
                });
            }
        })
    })
    reduce[reduce.length-1].nodo = reduce[reduce.length-1].nodo.join('');
    if (reduce[reduce.length-1][`${char}`].length > 1 && !checkExist(reduce[reduce.length-1].nodo))
        return checkTarget(reduce[reduce.length-1], char); 
    else return;
        
}

function checkExist(node) {
    reduce.forEach(function (nodes, index) {
        if (nodes.nodo == node) return true;
        else return false;
    })
}
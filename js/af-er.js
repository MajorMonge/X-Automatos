$(document).ready(() => {
    cy.add([{
        data: { label: "q0", initial: true, final: false },
        renderedPosition: {
            x: "336",
            y: "293",
        },
    }]);


    cy.add([{
        data: { label: "q1", initial: false, final: false },
        renderedPosition: {
            x: "500",
            y: "291",
        },
    }]);

    cy.add([{
        data: { label: "q2", initial: false, final: true },
        renderedPosition: {
            x: "704",
            y: "290",
        },
    }]);

    cy.add([{
        data: { label: "q3", initial: false, final: true },
        renderedPosition: {
            x: "704",
            y: "390",
        },
    }]);

    cy.add([{
        group: 'edges', data: { source: cy.nodes('[label = "q0"]').data().id, target: cy.nodes('[label = "q0"]').data().id, label: "b" }
    }]);

    cy.add([{
        group: 'edges', data: { source: cy.nodes('[label = "q0"]').data().id, target: cy.nodes('[label = "q0"]').data().id, label: "a" }
    }]);

    cy.add([{
        group: 'edges', data: { source: cy.nodes('[label = "q0"]').data().id, target: cy.nodes('[label = "q1"]').data().id, label: "b" }
    }]);

    cy.add([{
        group: 'edges', data: { source: cy.nodes('[label = "q0"]').data().id, target: cy.nodes('[label = "q3"]').data().id, label: "b" }
    }]);

    cy.add([{
        group: 'edges', data: { source: cy.nodes('[label = "q1"]').data().id, target: cy.nodes('[label = "q2"]').data().id, label: "a" }
    }]);

    cy.add([{
        group: 'edges', data: { source: cy.nodes('[label = "q1"]').data().id, target: cy.nodes('[label = "q2"]').data().id, label: "b" }
    }]);


    styleNode(cy.nodes()[cy.nodes().length - 1], '#' + cy.nodes()[cy.nodes().length - 1].data().id)

    $("#buttonModalAFER").click();
})


$("#convertERtoAF").click(function () {

})

String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);

    return string + this;
};

function convertAFtoER(Initial, Edges, Nodes) {

    let ERString = "(";
    let simplifiedEdges = []
    console.log(Edges);
}


$("#convertAFtoER").click(function () {
    // Declarando o vetor para os objetos.
    let initialNode, parsedEdges = [], parsedNodes = [];
    cy.nodes().forEach(function (node, index) {
        parsedNodes.push(node.data());
        if (node.data().initial == true)
            initialNode = node;
    });

    cy.edges().forEach(function (edge, index) {
        parsedEdges.push(edge.data());
        parsedEdges[index].target = cy.getElementById(parsedEdges[index].target).data().label;
        parsedEdges[index].source = cy.getElementById(parsedEdges[index].source).data().label;
        console.log(cy.getElementById(parsedEdges[index].target).data())
    });

    convertAFtoER(initialNode, parsedEdges, parsedNodes);
})


/* function convertAFtoER(Initial, Edges, Nodes) {

    let ERString = "(";
    let simplifiedEdges = []

    // Simplifica o conjunto de arestas que tem mesma origem e destino
    Edges.forEach((edge, index) => {
        let simplifiedAdd = true;
        simplifiedEdges.forEach((sEdge, sIndex) => {
            if (edge.source == sEdge.source && edge.target == sEdge.target) {
                simplifiedAdd = false;
            }
        })
        if (simplifiedAdd) {
            simplifiedEdges.push({
                source: edge.source,
                target: edge.target,
                labels: []
            })
        }
    })

    // Adiciona os valores aceitos para cada conexão
    Edges.forEach((edge, index) => {
        simplifiedEdges.forEach((sEdge, sIndex) => {
            if (edge.source == sEdge.source && edge.target == sEdge.target) {
                simplifiedEdges[sIndex].labels.push(edge.label)
            }
        })
    })
    console.log(simplifiedEdges)


    simplifiedEdges.forEach((sEdge, sIndex) => {
        if (sEdge.labels.length > 1) {
            ERString = ERString.insert(ERString.length, "(");
            sEdge.labels.forEach((label, index) => {
                if (index == sEdge.labels.length - 1) {
                    ERString = ERString.insert(ERString.length, label);
                } else {
                    ERString = ERString.insert(ERString.length, label[index] + "|");
                }
            })
            ERString = ERString.insert(ERString.length, ")");
        } else {
            ERString = ERString.insert(ERString.length, sEdge.labels[0]);
        }
        if (sEdge.source == sEdge.target) {
            ERString = ERString.insert(ERString.length, "*")
        }
    })
    ERString = ERString.insert(ERString.length, ")");
    console.log(ERString);
} */
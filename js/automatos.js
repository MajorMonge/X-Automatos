/* CYTOSCAPE */
var cy = cytoscape({
  container: $('#mynetwork'),
  elements: [],

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'border-width': 4,
        'border-style': 'solid',
        'border-color': '#fcba03',
        'background-color': '#fcd303',
        'text-margin-y': +20,
        'label': 'data(label)'
      }
    },

    {
      selector: '.initialnode',
      style: {
        'border-width': 4,
        'border-style': 'solid',
        'border-color': '#fcba03',
        'background-color': '#ffffff',
        'text-margin-y': +20,
        'label': 'data(label)'
      }
    },
    {
      selector: '.finalnode',
      style: {
        'border-width': 4,
        'border-style': 'solid',
        'border-color': '#ca59ff',
        'background-color': '#fcd303',
        'text-margin-y': +20,
        'label': 'data(label)'
      }
    },
    {
      selector: '.bothnode',
      style: {
        'border-width': 4,
        'border-style': 'solid',
        'border-color': '#ca59ff',
        'background-color': '#ffffff',
        'text-margin-y': +20,
        'label': 'data(label)'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#2e2e2e',
        'curve-style': 'bezier',
        'target-arrow-color': '#2e2e2e',
        'target-arrow-shape': 'triangle',
        'text-margin-y': -10,
        'label': 'data(label)'
      }
    }
  ],

  layout: {
    name: 'grid',
    rows: 1
  }
});

/* VARIÁVEIS */
let modoEdicao;

/* INICIALIZAÇÃO */
$(document).ready(function () {
  $('#manipular').click();
  //console.log(cy.nodes());
});

/* MENUS */
$('#editor a').on('click', function (e) {
  $(this).parent().find('a.active').removeClass('active');
  $(this).addClass('active');
  modoEdicao = $(this).attr("id");
  ////console.log(modoEdicao);
  if (modoEdicao == 'aresta') {
    cy.nodes().ungrabify();
  } else {
    cy.nodes().grabify();
  }
});


/* EVENTOS */
/* Adicionar Nó */
cy.on('tap', function (event) {
  if (modoEdicao == "adicionar") {
    cy.add([{
      data: { label: `q${cy.nodes().length}`, initial: false, final: false, link: [] },
      renderedPosition: {
        x: event.renderedPosition.x,
        y: event.renderedPosition.y,
      },
    }]);
  } else {
    $(".custom-menu").slideUp(100);
  }
});

/* Remover e Editar Nó */
cy.on('tap', 'node', function (event) {
  var node = cy.$('#' + event.target.id());
  if (modoEdicao == "excluir") {
    cy.remove(node);
  } else if (modoEdicao == "editar") {
    let name = prompt("Digite o valor a ser atualizado:");
    if (name !== null) {
      if (name == "") {
        name = "λ"
      }
      else {
        name = name;
      }
      node.data().label = name;
    }
  } else {
    //console.log(event.renderedPosition.x, event.renderedPosition.y)
    event.preventDefault();
    $(".custom-menu").finish().toggle(100);
    $(".custom-menu").css({
      left: event.renderedPosition.x + "px",
      top: event.renderedPosition.y + "px"
    });
    $(".custom-menu").data("nodo", { id: event.target.id() });
    //console.log("Data: " + $(".custom-menu").data("nodo").id);
    if (node.data().initial) {
      $("#inicial").text("Inicial ✓");
    } else {
      $("#inicial").text("Inicial");
    }

    if (node.data().final) {
      $("#final").text("Final ✓");
    } else {
      $("#final").text("Final");
    }
  }
});

/* Adicionar Aresta */
let firstNode, secondNode;
cy.on('mousedown', 'node', function (event) {
  event.stopPropagation()
  firstNode = cy.$('#' + event.target.id());
}).on('mouseup', 'node', function (event) {
  event.stopPropagation()
  if (modoEdicao == "aresta") {
    secondNode = cy.$('#' + event.target.id());
    let name = prompt("Digite o valor da transição");
    if (name !== null) {
      if (name == "") {
        name = "λ"
      }
      else {
        name = name;
      }

      cy.add([{
        group: 'edges', data: { source: firstNode.data().id, target: secondNode.data().id, label: name }
      }]);
      let elem = cy.getElementById(firstNode.data().id);
      elem.data().link.push({ value: name, target: secondNode });
    }
  }
});


/* Remover e Editar Aresta */
cy.on('tap', 'edge', function (event) {
  var edge = cy.$('#' + event.target.id());
  if (modoEdicao == "excluir") {
    cy.remove(edge);
  } else if (modoEdicao == "editar") {
    let name = prompt("Digite o valor a ser atualizado:");
    if (name !== null) {
      if (name == "") {
        name = "λ"
      }
      else {
        name = name;
      }
      edge.data().label = name;
    }
  }
});

$("#inicial").on("click", function (event) {
  var node = cy.$('#' + $(".custom-menu").data("nodo").id);
  if (!node.data().initial) {

    let initialNodesWBoth = cy.filter('.bothnode');
    let initialNodes = cy.filter('.initialnode');
    if (initialNodesWBoth.data() != undefined) {
      initialNodesWBoth.data().initial = false;
      styleNode(initialNodesWBoth, '#' + initialNodesWBoth.data().id);
    }
    if (initialNodes.data() != undefined) {
      initialNodes.data().initial = false;
      styleNode(initialNodes, '#' + initialNodes.data().id);
    }


    node.data().initial = true;
    $("#inicial").text("Inicial ✓");


  } else {
    node.data().initial = false;
    $("#inicial").text("Inicial");
  }
  styleNode(node, '#' + $(".custom-menu").data("nodo").id)
})

$("#final").on("click", function (event) {
  var node = cy.$('#' + $(".custom-menu").data("nodo").id);
  if (!node.data().final) {
    node.data().final = true;
    $("#final").text("Final ✓");
  } else {
    node.data().final = false;
    $("#final").text("Final");
  }
  styleNode(node, '#' + $(".custom-menu").data("nodo").id)
})

function styleNode(ref, node) {
  if (ref.data().final && ref.data().initial) {
    cy.$(node).classes('bothnode');
  } else if (!ref.data().final && !ref.data().initial) {
    cy.$(node).classes('node');
  } else if (ref.data().final) {
    cy.$(node).classes('finalnode');
  } else if (ref.data().initial) {
    cy.$(node).classes('initialnode');
  }
}

/* LÓGICA */
$("#verificarSingle").click(function () {
  let entrada = $("#single-entrada").val();
  let inicial;
  if (entrada != "" && entrada != null) {
    ////console.log(entrada);
    cy.nodes().forEach(function (ele) { // Your function call inside
      ////console.log("loop", ele.data(), ele.data().initial);
      if (ele.data().initial)
        inicial = ele.data();
    });

    ////console.log(inicial);
    $("#resultadoSingle").text(resultAutomato(entrada, inicial, 0));
  }
})

function resultAutomato(entrada, node, indice) {
  let result = false;

  for (let x = 0; x < node.link.length; x++) {
    if (node.link[x].value == entrada[indice]) {
      if (node.link[x].target.data().final == true && indice == entrada.length - 1) {
        result = true;
        break;
      } else if (indice != entrada.length) {
        result = resultAutomato(entrada, node.link[x].target.data(), indice += 1);
        break;
      } else {
        result = false;
      }
    } else {
      result = false;
    }
  }
  return result;
}
$(document).ready(function () {
  $("#manipular").focus();
})
let menuModo;
function setModo(modo) {
  switch (modo) {
    case 0:
      menuModo = 0;
      options = {
        manipulation: {
          enabled: true
        }
      };
      network.disableEditMode();
      network.setOptions(options);
      break;
    case 1:
      menuModo = 1;
      options = {
        manipulation: {
          enabled: false,
          addNode: function (data, callback) {
            console.log(data);
            let name = prompt("Digite o nome do nodo");
            if (name == null)
              return;
            else if (name == "")
              data.label = "q" + nodes.length;
            else
              data.label = name;
            callback(data);
            setModo(1);
          },
        }
      };
      network.setOptions(options);
      network.addNodeMode();
      break;
    case 2:
      menuModo = 2;
      options = {
        manipulation: {
          enabled: false,
          addEdge: function (data, callback) {
            console.log(data);
            let name = prompt("Digite o valor da transição");
            if (name !== null) {
              if (name == "") {
                data.label = "λ"
              }
              else {
                data.label = name;
              }
              callback(data);
              setModo(2);
              network.addEdgeMode();
            }
          },
        }
      };
      network.setOptions(options);
      network.addEdgeMode();
      break;
    case 3:
      menuModo = 3;
      network.disableEditMode();
      options = {
        manipulation: {
          enabled: true,
        }
      };
      network.setOptions(options);
      network.on("click", function (param) {
        console.log(param)
        if (param.edges.length == 1 && menuModo == 3) {
          name = prompt("Digite o valor para atualizar a transição");
          if (name !== null) {
            edges.update({ id: param.edges[0], label: name });
          }
        }
      });
      break;
    case 4:
      menuModo = 4;
      network.disableEditMode();
      options = {
        manipulation: {
          enabled: true,
        }
      };
      network.setOptions(options);
      network.on("click", function (param) {
        if(menuModo == 4){
          network.deleteSelected();
        }
      });
      break;
  }
}


let estados = [
];

let transicoes = [
];

var nodes = new vis.DataSet(estados);

// create an array with edges
var edges = new vis.DataSet(transicoes);

// create a network
var container = document.getElementById('mynetwork');
var data = {
  nodes: nodes,
  edges: edges
};
var options = {
  nodes: {
    color: {
      border: '#c3c900',
      background: '#f7ff00',
      highlight: {
        border: '#2B7CE9',
        background: '#D2E5FF'
      },
      hover: {
        border: '#2B7CE9',
        background: '#D2E5FF'
      }
    },
    shape: 'circle',

    widthConstraint: 50,
  },
  edges: {
    smooth: {
      roundness: 0.5,
      forceDirection: "none",
      type: "discrete",
    },
    arrows: {
      to: { enabled: true, scaleFactor: 1, type: 'arrow' },
      middle: { enabled: false, scaleFactor: 1, type: 'arrow' },
      from: { enabled: false, scaleFactor: 1, type: 'arrow' }
    },
    arrowStrikethrough: true,
    chosen: true,
    color: {
      color: '#c3c900',
      highlight: '#2B7CE9',
      hover: '#2B7CE9',
      inherit: 'from',
      opacity: 1.0
    },
    hoverWidth: 1,
    scaling: {
      label: {
        drawThreshold: 5
      }
    },
    font: {
      color: '#343434',
      size: 14, // px
      face: 'arial',
      align: 'horizontal',
      vadjust: -10,
    },
    selfReferenceSize: 50,
    width: 1,
    length: 35,
  }, interaction: {
    selectConnectedEdges: false,
  },
  physics: false,
};

var network = new vis.Network(container, data, options);
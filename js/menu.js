// Variáveis globais
var modalAberto = false;
var modal;

function abrirModal(id) {		// Função para abrir o modal
    if (modalAberto == false) {
        modal = document.getElementById(id);	//variavel para mostrar o modal correspondente
        modal.style.display = 'block';
        modal.style.alignSelf;
        modalAberto = true;
    }
}

function fecharModal(id) {	// Função para fechar o modal
    modal = document.getElementById(id);
    modal.style.display = 'none';
    modalAberto = false;
}
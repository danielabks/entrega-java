/*
==============================================
 Entrega 1: Simulador de Carrinho de Compras
==============================================
*/

// --- 1. DECLARAÇÃO DE VARIÁVEIS, CONSTANTES E ARRAYS ---

// Array de objetos para representar os produtos disponíveis na loja.
// Usar 'const' é uma boa prática para dados que não mudarão durante a execução.
const produtosDisponiveis = [
    { id: 1, nome: "Notebook Gamer", preco: 4500.00 },
    { id: 2, nome: "Mouse sem fio", preco: 150.50 },
    { id: 3, nome: "Teclado Mecânico RGB", preco: 350.00 },
    { id: 4, nome: "Monitor 27' 4K", preco: 2200.00 },
    { id: 5, nome: "Cadeira Gamer", preco: 1200.75 }
];

// Array que irá armazenar os produtos selecionados pelo usuário.
// Usamos 'let' porque seu conteúdo será modificado.
let carrinho = [];

// Constante para o custo de envio.
const CUSTO_ENVIO = 50.00;


// --- 2. DEFINIÇÃO DAS FUNÇÕES ---

/**
 * Função para a ENTRADA DE DADOS.
 * Controla a interação inicial com o usuário, mostrando os produtos e permitindo adicioná-los ao carrinho.
 */
function solicitarProdutos() {
    // Monta uma string com a lista de produtos para exibir ao usuário.
    let listaDeProdutos = "Bem-vindo à nossa loja! Estes são os produtos disponíveis:\n\n";
    
    // Ciclo 'for...of' para iterar sobre o array de produtos.
    for (const produto of produtosDisponiveis) {
        listaDeProdutos += `ID: ${produto.id} - ${produto.nome} - R$ ${produto.preco.toFixed(2)}\n`;
    }

    alert(listaDeProdutos);

    let continuarComprando = true;

    // Ciclo 'while' para permitir que o usuário adicione vários produtos.
    while (continuarComprando) {
        // Solicita ao usuário o ID do produto que deseja comprar.
        const idProdutoSelecionado = prompt("Digite o ID do produto que deseja adicionar ao carrinho:");

        // Validação básica da entrada. Se o usuário clicar em "Cancelar", o prompt retorna null.
        if (idProdutoSelecionado === null) {
            continuarComprando = false;
            break;
        }

        // Converte a entrada para número e busca o produto no array.
        const produtoEncontrado = produtosDisponiveis.find(p => p.id === parseInt(idProdutoSelecionado));

        // Estrutura CONDICIONAL para verificar se o produto foi encontrado.
        if (produtoEncontrado) {
            carrinho.push(produtoEncontrado); // Adiciona o produto ao carrinho
            alert(`"${produtoEncontrado.nome}" foi adicionado ao seu carrinho!`);
            console.log("Produto adicionado:", produtoEncontrado);
        } else {
            alert("Erro: Produto não encontrado. Por favor, digite um ID válido.");
        }

        // Pergunta ao usuário se deseja adicionar mais itens.
        continuarComprando = confirm("Deseja adicionar mais algum produto ao carrinho?");
    }
}

/**
 * Função para o PROCESSAMENTO DE DADOS.
 * Calcula o subtotal e o total final da compra.
 * @returns {object} Um objeto contendo o subtotal e o total.
 */
function calcularTotal() {
    let subtotal = 0;
    
    // Ciclo 'for' para somar o preço de cada item no carrinho.
    for (let i = 0; i < carrinho.length; i++) {
        subtotal += carrinho[i].preco;
    }

    // Condicional para aplicar o custo de envio apenas se houver itens no carrinho.
    const totalFinal = carrinho.length > 0 ? subtotal + CUSTO_ENVIO : 0;
    
    console.log("Processamento de dados: Subtotal calculado:", subtotal, "Total final:", totalFinal);

    return {
        subtotal: subtotal,
        total: totalFinal
    };
}

/**
 * Função para a SAÍDA (MOSTRAR RESULTADOS).
 * Exibe um resumo da compra para o usuário no console e em um alert.
 * @param {object} totais - O objeto retornado pela função calcularTotal.
 */
function exibirResumo(totais) {
    // Se o carrinho estiver vazio, exibe uma mensagem e encerra.
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio. Obrigado pela visita!");
        console.log("O usuário finalizou a simulação sem adicionar produtos.");
        return;
    }

    let resumo = "--- RESUMO DA SUA COMPRA ---\n\nItens no carrinho:\n";

    // Itera sobre o carrinho para montar a lista de itens.
    carrinho.forEach((item, index) => {
        resumo += `${index + 1}. ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
    });

    resumo += "\n----------------------------------\n";
    resumo += `Subtotal: R$ ${totais.subtotal.toFixed(2)}\n`;
    resumo += `Custo de Envio: R$ ${CUSTO_ENVIO.toFixed(2)}\n`;
    resumo += `TOTAL A PAGAR: R$ ${totais.total.toFixed(2)}\n\n`;
    resumo += "Obrigado por comprar conosco!";
    
    // Mostra o resumo final em um alert e também no console.
    alert(resumo);
    console.log("--- Resumo Final da Compra ---");
    console.table(carrinho); // 'console.table' é ótimo para visualizar arrays de objetos.
    console.log(`Subtotal: R$ ${totais.subtotal.toFixed(2)}`);
    console.log(`Custo de Envio: R$ ${CUSTO_ENVIO.toFixed(2)}`);
    console.log(`TOTAL FINAL: R$ ${totais.total.toFixed(2)}`);
}

// --- 3. CHAMADA (INVOCAÇÃO) DAS FUNÇÕES PARA INICIAR O SIMULADOR ---

// A simulação começa aqui.
function iniciarSimulador() {
    solicitarProdutos();
    const totais = calcularTotal();
    exibirResumo(totais);
}

// Invoca a função principal para dar início ao programa.
iniciarSimulador();
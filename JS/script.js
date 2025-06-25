/* JS/script.js */

// --- 1. DADOS INICIAIS E CONSTANTES ---
const produtosDisponiveis = [
    { id: 1, nome: "Notebook Gamer Pro", preco: 4599.90, imagem: "https://via.placeholder.com/150/007bff/fff?text=Notebook" },
    { id: 2, nome: "Mouse Óptico Sem Fio", preco: 129.50, imagem: "https://via.placeholder.com/150/28a745/fff?text=Mouse" },
    { id: 3, nome: "Teclado Mecânico RGB", preco: 379.00, imagem: "https://via.placeholder.com/150/ffc107/000?text=Teclado" },
    { id: 4, nome: "Monitor LED 27' 4K", preco: 2199.00, imagem: "https://via.placeholder.com/150/dc3545/fff?text=Monitor" },
    { id: 5, nome: "Cadeira Gamer Ergonômica", preco: 1350.75, imagem: "https://via.placeholder.com/150/17a2b8/fff?text=Cadeira" },
    { id: 6, nome: "Headset Gamer 7.1", preco: 499.99, imagem: "https://via.placeholder.com/150/6f42c1/fff?text=Headset" }
];

let carrinho = []; // Nosso carrinho agora guardará objetos com { ...produto, quantidade }
const CUSTO_ENVIO = 50.00;
const CHAVE_CARRINHO_LS = 'carrinhoComprasApp'; // Chave para o LocalStorage

// --- 2. SELEÇÃO DE ELEMENTOS DO DOM ---
const listaProdutosContainer = document.getElementById('lista-produtos');
const carrinhoItensContainer = document.getElementById('carrinho-itens-container');
const carrinhoVazioMsg = document.getElementById('carrinho-vazio-msg');
const subtotalCarrinhoEl = document.getElementById('subtotal-carrinho');
const custoEnvioCarrinhoEl = document.getElementById('custo-envio-carrinho');
const totalCarrinhoEl = document.getElementById('total-carrinho');
const btnLimparCarrinho = document.getElementById('btn-limpar-carrinho');
const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');

// --- 3. FUNÇÕES DE RENDERIZAÇÃO ---

/**
 * Renderiza os produtos disponíveis na página.
 */
function renderizarProdutos() {
    if (!listaProdutosContainer) return; // Proteção caso o elemento não exista
    listaProdutosContainer.innerHTML = ''; // Limpa a lista antes de renderizar

    produtosDisponiveis.forEach(produto => {
        const cardProduto = `
            <div class="produto-card">
                <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem">
                <h3 class="produto-nome">${produto.nome}</h3>
                <p class="produto-preco">R$ ${produto.preco.toFixed(2)}</p>
                <div class="produto-compra">
                    <label for="qtd-produto-${produto.id}" class="sr-only">Quantidade:</label> 
                    <input type="number" id="qtd-produto-${produto.id}" class="produto-quantidade" value="1" min="1" aria-label="Quantidade para ${produto.nome}">
                    <button class="btn btn-adicionar" data-idprod="${produto.id}">Adicionar</button>
                </div>
            </div>
        `;
        // Adicionando sr-only (screen-reader only) class para o label, para acessibilidade,
        // mas visualmente pode ser escondido com CSS se não quiser que apareça.
        // Adicionei um `aria-label` no input para melhor acessibilidade.
        listaProdutosContainer.innerHTML += cardProduto;
    });

    // Adicionar event listeners aos botões "Adicionar" após renderizar
    document.querySelectorAll('.btn-adicionar').forEach(button => {
        button.addEventListener('click', handleAdicionarAoCarrinho);
    });
}

/**
 * Renderiza os itens do carrinho na página.
 */
function renderizarCarrinho() {
    if (!carrinhoItensContainer) return; // Proteção
    carrinhoItensContainer.innerHTML = ''; // Limpa antes de renderizar

    if (carrinho.length === 0) {
        carrinhoVazioMsg.style.display = 'block'; // Mostra mensagem de carrinho vazio
        carrinhoItensContainer.appendChild(carrinhoVazioMsg); // Reinsere se foi limpo
    } else {
        carrinhoVazioMsg.style.display = 'none'; // Esconde mensagem
        carrinho.forEach(item => {
            const itemCarrinhoHTML = `
                <div class="carrinho-item" data-iditemcarrinho="${item.id}">
                    <div class="item-info">
                        <p class="item-nome">${item.nome}</p>
                        <p class="item-preco-unitario">Unitário: R$ ${item.preco.toFixed(2)}</p>
                    </div>
                    <div class="item-quantidade-controle">
                        <button class="btn-diminuir-qtd" data-iditemcarrinho="${item.id}" aria-label="Diminuir quantidade de ${item.nome}">-</button>
                        <span class="item-quantidade">${item.quantidade}</span>
                        <button class="btn-aumentar-qtd" data-iditemcarrinho="${item.id}" aria-label="Aumentar quantidade de ${item.nome}">+</button>
                    </div>
                    <p class="item-subtotal">Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
                    <button class="btn-remover-item" data-iditemcarrinho="${item.id}" aria-label="Remover ${item.nome} do carrinho">Remover</button>
                </div>
            `;
            carrinhoItensContainer.innerHTML += itemCarrinhoHTML;
        });

        // Adicionar event listeners aos botões do carrinho (delegação seria melhor para muitos itens, mas isso funciona)
        document.querySelectorAll('.btn-diminuir-qtd').forEach(btn => btn.addEventListener('click', handleDiminuirQuantidade));
        document.querySelectorAll('.btn-aumentar-qtd').forEach(btn => btn.addEventListener('click', handleAumentarQuantidade));
        document.querySelectorAll('.btn-remover-item').forEach(btn => btn.addEventListener('click', handleRemoverItem));
    }
    atualizarTotais();
    salvarCarrinhoLocalStorage();
}


// --- 4. FUNÇÕES DE LÓGICA DO CARRINHO ---

function handleAdicionarAoCarrinho(event) {
    const produtoId = parseInt(event.target.dataset.idprod);
    const inputQuantidade = document.getElementById(`qtd-produto-${produtoId}`);
    const quantidade = parseInt(inputQuantidade.value);

    if (isNaN(quantidade) || quantidade <= 0) {
        alert("Por favor, insira uma quantidade válida.");
        inputQuantidade.value = "1"; // Reseta para 1
        return;
    }

    const produtoOriginal = produtosDisponiveis.find(p => p.id === produtoId);
    if (!produtoOriginal) return; // Produto não encontrado (improvável aqui)

    const itemExistente = carrinho.find(item => item.id === produtoId);

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({ ...produtoOriginal, quantidade: quantidade });
    }
    
    // Feedback para o usuário (poderia ser uma notificação mais elegante)
    alert(`"${produtoOriginal.nome}" (${quantidade}x) adicionado(s) ao carrinho!`);
    inputQuantidade.value = "1"; // Reseta quantidade no card do produto
    renderizarCarrinho();
}

function handleAumentarQuantidade(event) {
    const produtoId = parseInt(event.target.dataset.iditemcarrinho);
    const itemNoCarrinho = carrinho.find(item => item.id === produtoId);
    if (itemNoCarrinho) {
        itemNoCarrinho.quantidade++;
        renderizarCarrinho();
    }
}

function handleDiminuirQuantidade(event) {
    const produtoId = parseInt(event.target.dataset.iditemcarrinho);
    const itemNoCarrinho = carrinho.find(item => item.id === produtoId);
    if (itemNoCarrinho) {
        itemNoCarrinho.quantidade--;
        if (itemNoCarrinho.quantidade <= 0) {
            // Se quantidade for zero ou menos, remove o item
            removerItemDoCarrinho(produtoId);
        } else {
            renderizarCarrinho();
        }
    }
}

function handleRemoverItem(event) {
    const produtoId = parseInt(event.target.dataset.iditemcarrinho);
    removerItemDoCarrinho(produtoId);
}

function removerItemDoCarrinho(produtoId) {
    carrinho = carrinho.filter(item => item.id !== produtoId);
    // Feedback para o usuário
    const produtoRemovido = produtosDisponiveis.find(p => p.id === produtoId);
    if (produtoRemovido) {
        alert(`"${produtoRemovido.nome}" foi removido do carrinho.`);
    }
    renderizarCarrinho();
}

function limparCarrinho() {
    if (confirm("Tem certeza que deseja limpar todos os itens do carrinho?")) {
        carrinho = [];
        renderizarCarrinho();
        alert("Carrinho limpo!");
    }
}

// --- 5. FUNÇÕES DE CÁLCULO E ATUALIZAÇÃO DE TOTAIS ---

function atualizarTotais() {
    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const custoEnvio = carrinho.length > 0 ? CUSTO_ENVIO : 0;
    const total = subtotal + custoEnvio;

    if(subtotalCarrinhoEl) subtotalCarrinhoEl.textContent = `R$ ${subtotal.toFixed(2)}`;
    if(custoEnvioCarrinhoEl) custoEnvioCarrinhoEl.textContent = `R$ ${custoEnvio.toFixed(2)}`;
    if(totalCarrinhoEl) totalCarrinhoEl.textContent = `R$ ${total.toFixed(2)}`;
}

// --- 6. LOCALSTORAGE ---

function salvarCarrinhoLocalStorage() {
    localStorage.setItem(CHAVE_CARRINHO_LS, JSON.stringify(carrinho));
}

function carregarCarrinhoLocalStorage() {
    const carrinhoSalvo = localStorage.getItem(CHAVE_CARRINHO_LS);
    if (carrinhoSalvo) {
        carrinho = JSON.parse(carrinhoSalvo);
    }
}

// --- 7. INICIALIZAÇÃO E EVENT LISTENERS GLOBAIS ---

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio. Adicione produtos antes de finalizar a compra!");
        return;
    }

    const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const custoEnvio = CUSTO_ENVIO; // Assume que sempre tem custo se houver itens
    const total = subtotal + custoEnvio;

    let resumoCompra = "--- Obrigado por sua compra! ---\n\nItens:\n";
    carrinho.forEach(item => {
        resumoCompra += `- ${item.nome} (Qtd: ${item.quantidade}) - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });
    resumoCompra += "\n----------------------------------\n";
    resumoCompra += `Subtotal: R$ ${subtotal.toFixed(2)}\n`;
    resumoCompra += `Custo de Envio: R$ ${custoEnvio.toFixed(2)}\n`;
    resumoCompra += `TOTAL A PAGAR: R$ ${total.toFixed(2)}\n\n`;
    resumoCompra += "Sua compra foi finalizada com sucesso!";
    
    alert(resumoCompra);
    
    // Opcional: Limpar carrinho após finalizar
    // carrinho = [];
    // renderizarCarrinho(); 
    // salvarCarrinhoLocalStorage();
}


/**
 * Função principal para inicializar o aplicativo.
 */
function inicializarLoja() {
    // Adiciona uma classe sr-only ao CSS se ainda não existir
    // Isso é para esconder visualmente labels, mas mantê-los para leitores de tela.
    if (!document.styleSheets[0].cssRules.length || 
        ![...document.styleSheets[0].cssRules].find(rule => rule.selectorText === '.sr-only')) {
        const style = document.createElement('style');
        style.innerHTML = `
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    carregarCarrinhoLocalStorage();
    renderizarProdutos(); // Renderiza os cards de produto na vitrine
    renderizarCarrinho(); // Renderiza o estado atual do carrinho (pode estar vazio ou carregado do LS)

    if (btnLimparCarrinho) {
        btnLimparCarrinho.addEventListener('click', limparCarrinho);
    }
    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener('click', finalizarCompra);
    }
}

// Inicia a loja quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', inicializarLoja);
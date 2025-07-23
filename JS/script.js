/* JS/script.js */

// --- 1. DADOS INICIAIS E CONSTANTES ---
// ALTERADO DE VOLTA: A lista de produtos agora está aqui dentro do JS.
const produtosDisponiveis = [
    { 
        id: 1, 
        nome: "Notebook Gamer Pro", 
        preco: 4599.90, 
        imagem: "images/Notebook.webp" // Certifique-se que o caminho está correto
    },
    { 
        id: 2, 
        nome: "Mouse Óptico Sem Fio", 
        preco: 129.50, 
        imagem: "images/Mouse.webp"
    },
    { 
        id: 3, 
        nome: "Teclado Mecânico RGB", 
        preco: 379.00, 
        imagem: "images/Teclado.webp"
    },
    { 
        id: 4, 
        nome: "Monitor LED 27' 4K", 
        preco: 2199.00, 
        imagem: "images/Monitor.webp"
    },
    { 
        id: 5, 
        nome: "Cadeira Gamer Ergonômica", 
        preco: 1350.75, 
        imagem: "images/Cadeira.webp"
    },
    { 
        id: 6, 
        nome: "Headset Gamer 7.1", 
        preco: 499.99, 
        imagem: "images/Headset.webp" 
    }
];

let carrinho = []; 
const CUSTO_ENVIO = 50.00;
const CHAVE_CARRINHO_LS = 'carrinhoComprasApp';

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
// Nenhuma mudança nesta seção, tudo permanece igual.
function renderizarProdutos() {
    if (!listaProdutosContainer) return;
    listaProdutosContainer.innerHTML = ''; 

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
        listaProdutosContainer.innerHTML += cardProduto;
    });

    document.querySelectorAll('.btn-adicionar').forEach(button => {
        button.addEventListener('click', handleAdicionarAoCarrinho);
    });
}

function renderizarCarrinho() {
    if (!carrinhoItensContainer) return; 
    carrinhoItensContainer.innerHTML = ''; 

    if (carrinho.length === 0) {
        if(carrinhoVazioMsg) carrinhoVazioMsg.style.display = 'block'; 
        carrinhoItensContainer.appendChild(carrinhoVazioMsg);
    } else {
        if(carrinhoVazioMsg) carrinhoVazioMsg.style.display = 'none';
        carrinho.forEach(item => {
            const itemCarrinhoHTML = `
                <div class="carrinho-item" data-iditemcarrinho="${item.id}">
                    <p class="item-nome">${item.nome}</p>
                    <p class="item-preco-unitario">Unitário: R$ ${item.preco.toFixed(2)}</p>
                    <div class="item-quantidade-controle">
                        <button class="btn-diminuir-qtd" data-iditemcarrinho="${item.id}">-</button>
                        <span class="item-quantidade">${item.quantidade}</span>
                        <button class="btn-aumentar-qtd" data-iditemcarrinho="${item.id}">+</button>
                    </div>
                    <p class="item-subtotal">Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
                    <button class="btn-remover-item" data-iditemcarrinho="${item.id}">Remover</button>
                </div>
            `;
            carrinhoItensContainer.innerHTML += itemCarrinhoHTML;
        });

        document.querySelectorAll('.btn-diminuir-qtd').forEach(btn => btn.addEventListener('click', handleDiminuirQuantidade));
        document.querySelectorAll('.btn-aumentar-qtd').forEach(btn => btn.addEventListener('click', handleAumentarQuantidade));
        document.querySelectorAll('.btn-remover-item').forEach(btn => btn.addEventListener('click', handleRemoverItem));
    }
    atualizarTotais();
    salvarCarrinhoLocalStorage();
}

// --- 4. FUNÇÕES DE LÓGICA DO CARRINHO ---
// Nenhuma mudança nesta seção, tudo permanece igual.
function handleAdicionarAoCarrinho(event) {
    const produtoId = parseInt(event.target.dataset.idprod);
    const inputQuantidade = document.getElementById(`qtd-produto-${produtoId}`);
    const quantidade = parseInt(inputQuantidade.value);

    if (isNaN(quantidade) || quantidade <= 0) {
        alert("Por favor, insira uma quantidade válida.");
        inputQuantidade.value = "1";
        return;
    }

    const produtoOriginal = produtosDisponiveis.find(p => p.id === produtoId);
    if (!produtoOriginal) return;

    const itemExistente = carrinho.find(item => item.id === produtoId);

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        carrinho.push({ ...produtoOriginal, quantidade: quantidade });
    }
    
    alert(`"${produtoOriginal.nome}" (${quantidade}x) adicionado(s) ao carrinho!`);
    inputQuantidade.value = "1";
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
    const produtoRemovido = produtosDisponiveis.find(p => p.id === produtoId);
    carrinho = carrinho.filter(item => item.id !== produtoId);
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
    const custoEnvio = CUSTO_ENVIO;
    const total = subtotal + custoEnvio;
    let resumoCompra = "--- Obrigado por sua compra! ---\n\nItens:\n";
    carrinho.forEach(item => {
        resumoCompra += `- ${item.nome} (Qtd: ${item.quantidade}) - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });
    resumoCompra += `\n----------------------------------\nSubtotal: R$ ${subtotal.toFixed(2)}\nCusto de Envio: R$ ${custoEnvio.toFixed(2)}\nTOTAL A PAGAR: R$ ${total.toFixed(2)}\n\nSua compra foi finalizada com sucesso!`;
    alert(resumoCompra);
}

// ALTERADO DE VOLTA: A função de inicialização voltou a ser simples e síncrona.
function inicializarLoja() {
    carregarCarrinhoLocalStorage();
    renderizarProdutos(); 
    renderizarCarrinho(); 

    if (btnLimparCarrinho) {
        btnLimparCarrinho.addEventListener('click', limparCarrinho);
    }
    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener('click', finalizarCompra);
    }
}

// Inicia a loja quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', inicializarLoja);
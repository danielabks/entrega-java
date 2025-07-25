Funcionalidades Principais
Visualização Dinâmica de Produtos: Os produtos são carregados de um arquivo produtos.json externo e renderizados na página dinamicamente.
Carrinho Interativo:
Adicionar Itens: Adicione qualquer produto ao carrinho com a quantidade desejada.
Atualizar Quantidade: Altere a quantidade de um item diretamente no carrinho.
Remover Itens: Exclua itens individualmente.
Limpar Carrinho: Esvazie o carrinho com um único clique.
Cálculos em Tempo Real: Subtotal e total da compra são atualizados instantaneamente a cada alteração no carrinho.
Persistência de Dados: O conteúdo do carrinho é salvo no LocalStorage do navegador, mantendo os itens mesmo que o usuário feche ou atualize a página.
Design Responsivo: A interface se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis.
🛠️ Tecnologias Utilizadas
HTML5: Para a estrutura semântica da página.
CSS3: Para estilização, utilizando Flexbox para um layout moderno e responsivo.
JavaScript (ES6+): Para toda a lógica e interatividade, incluindo:
Manipulação do DOM para criar e atualizar elementos da página.
Uso do fetch API com async/await para carregar dados de forma assíncrona.
Gerenciamento de estado do carrinho através de arrays e objetos.
Interação com a Web Storage API (LocalStorage).

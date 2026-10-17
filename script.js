// ==========================================
// MINHA CONVENIÊNCIA - SISTEMA COMPLETO
// ==========================================

// ==========================================
// DADOS
// ==========================================

let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || [];

let carrinho = [];
let produtoEditando = null;
let formaPagamento = "dinheiro";

// ==========================================
// ELEMENTOS
// ==========================================

const campoPesquisa = document.getElementById("campoPesquisa");
const resultado = document.getElementById("resultado");
const limparPesquisa = document.getElementById("limparPesquisa");

const modalCadastro = document.getElementById("modalCadastro");
const modalLista = document.getElementById("modalLista");
const modalVenda = document.getElementById("modalVenda");

const abrirCadastro = document.getElementById("abrirCadastro");
const abrirLista = document.getElementById("abrirLista");

const fecharCadastro = document.getElementById("fecharCadastro");
const fecharLista = document.getElementById("fecharLista");
const fecharVenda = document.getElementById("fecharVenda");

const nomeProduto = document.getElementById("nomeProduto");
const precoProduto = document.getElementById("precoProduto");
const estoqueProduto = document.getElementById("estoqueProduto");

const salvarProduto = document.getElementById("salvarProduto");
const listaProdutos = document.getElementById("listaProdutos");

const produtoVenda = document.getElementById("produtoVenda");
const quantidadeVenda = document.getElementById("quantidadeVenda");

const menosQuantidade = document.getElementById("menosQuantidade");
const maisQuantidade = document.getElementById("maisQuantidade");

const adicionarCarrinho = document.getElementById("adicionarCarrinho");

const carrinhoElemento = document.getElementById("carrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const quantidadeItensCarrinho =
    document.getElementById("quantidadeItensCarrinho");

const valorRecebido =
    document.getElementById("valorRecebido");

const pagamentoTotal =
    document.getElementById("pagamentoTotal");

const trocoVenda =
    document.getElementById("trocoVenda");

const finalizarVenda =
    document.getElementById("finalizarVenda");

const limparCarrinho =
    document.getElementById("limparCarrinho");

const notificacao =
    document.getElementById("notificacao");

const botoesPagamento =
    document.querySelectorAll(".forma-pagamento");

const areaDinheiro =
    document.getElementById("areaDinheiro");

const areaTroco =
    document.getElementById("areaTroco");

// ==========================================
// FORMATAÇÃO DE DINHEIRO
// ==========================================

function dinheiro(valor) {

    return Number(valor || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

}

// ==========================================
// SALVAR DADOS
// ==========================================

function salvarDados() {

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

    localStorage.setItem(
        "vendas",
        JSON.stringify(vendas)
    );

}

// ==========================================
// NOTIFICAÇÃO
// ==========================================

function mostrarNotificacao(mensagem) {

    if (!notificacao) return;

    notificacao.textContent = mensagem;

    notificacao.classList.add("mostrar");

    setTimeout(() => {

        notificacao.classList.remove("mostrar");

    }, 2500);

}

// ==========================================
// RELÓGIO
// ==========================================

function atualizarRelogio() {

    const agora = new Date();

    const hora =
        String(agora.getHours()).padStart(2, "0");

    const minuto =
        String(agora.getMinutes()).padStart(2, "0");

    const segundo =
        String(agora.getSeconds()).padStart(2, "0");

    const relogio =
        document.getElementById("relogio");

    if (relogio) {

        relogio.textContent =
            `${hora}:${minuto}:${segundo}`;

    }

}

setInterval(atualizarRelogio, 1000);

atualizarRelogio();

// ==========================================
// ABAS
// ==========================================

document.querySelectorAll(".menu-btn").forEach(botao => {

    botao.addEventListener("click", () => {

        const abaNome =
            botao.dataset.aba;

        document.querySelectorAll(".menu-btn")
            .forEach(btn => {
                btn.classList.remove("ativo");
            });

        document.querySelectorAll(".aba")
            .forEach(aba => {
                aba.classList.remove("ativo");
            });

        botao.classList.add("ativo");

        const aba =
            document.getElementById(
                `aba-${abaNome}`
            );

        if (aba) {

            aba.classList.add("ativo");

        }

        if (abaNome === "relatorios") {

            atualizarRelatorios();

        }

        if (abaNome === "vendas") {

            atualizarProdutosVenda();

            atualizarCarrinho();

        }

    });

});

// ==========================================
// ABRIR CADASTRO
// ==========================================

abrirCadastro.addEventListener("click", () => {

    produtoEditando = null;

    document.getElementById(
        "tituloCadastro"
    ).textContent = "Adicionar produto";

    salvarProduto.textContent =
        "➕ Adicionar produto";

    nomeProduto.value = "";
    precoProduto.value = "";
    estoqueProduto.value = "";

    modalCadastro.classList.add("mostrar");

});

// ==========================================
// FECHAR CADASTRO
// ==========================================

fecharCadastro.addEventListener("click", () => {

    modalCadastro.classList.remove("mostrar");

    produtoEditando = null;

});
// ==========================================
// CADASTRAR / EDITAR PRODUTO
// ==========================================

salvarProduto.addEventListener("click", () => {

    const nome = nomeProduto.value.trim();

    const preco = Number(
        String(precoProduto.value)
            .replace(",", ".")
    );

    const estoque = Number(
        estoqueProduto.value
    );

    // ======================================
    // VALIDAR NOME
    // ======================================

    if (!nome) {

        alert("Digite o nome do produto.");

        nomeProduto.focus();

        return;
    }

    // ======================================
    // VALIDAR PREÇO
    // ======================================

    if (
        !Number.isFinite(preco) ||
        preco < 0
    ) {

        alert("Digite um preço válido.");

        precoProduto.focus();

        return;
    }

    // ======================================
    // VALIDAR ESTOQUE
    // ======================================

    if (
        !Number.isInteger(estoque) ||
        estoque < 0
    ) {

        alert(
            "Digite um estoque válido.\n\n" +
            "O estoque deve ser um número inteiro."
        );

        estoqueProduto.focus();

        return;
    }

    // ======================================
    // EDITAR PRODUTO
    // ======================================

    if (produtoEditando !== null) {

        const produto =
            produtos[produtoEditando];

        if (!produto) {

            alert("Produto não encontrado.");

            produtoEditando = null;

            return;
        }

        // Atualizar os dados
        produto.nome = nome;
        produto.preco = preco;
        produto.estoque = estoque;

        // Garantir que o estoque seja número
        produto.estoque = Number(
            produto.estoque
        );

        mostrarNotificacao(
            `📦 Estoque atualizado para ${produto.estoque} unidade(s)!`
        );

    }

    // ======================================
    // NOVO PRODUTO
    // ======================================

    else {

        produtos.push({

            id: Date.now(),

            nome: nome,

            preco: preco,

            estoque: estoque

        });

        mostrarNotificacao(
            "✅ Produto adicionado!"
        );
    }

    // ======================================
    // SALVAR NO LOCALSTORAGE
    // ======================================

    salvarDados();

    // ======================================
    // ATUALIZAR SISTEMA
    // ======================================

    atualizarTudo();

    // ======================================
    // FECHAR MODAL
    // ======================================

    modalCadastro.classList.remove(
        "mostrar"
    );

    nomeProduto.value = "";
    precoProduto.value = "";
    estoqueProduto.value = "";

    produtoEditando = null;

});


// ==========================================
// ABRIR LISTA
// ==========================================

abrirLista.addEventListener("click", () => {

    atualizarListaProdutos();

    modalLista.classList.add("mostrar");

});

// ==========================================
// FECHAR LISTA
// ==========================================

fecharLista.addEventListener("click", () => {

    modalLista.classList.remove("mostrar");

});

// ==========================================
// LISTA DE PRODUTOS
// ==========================================

function atualizarListaProdutos() {

    listaProdutos.innerHTML = "";

    if (produtos.length === 0) {

        listaProdutos.innerHTML = `

            <div class="resultado-vazio">

                <span>📦</span>

                <p>
                    Nenhum produto cadastrado.
                </p>

            </div>

        `;

        return;

    }

    produtos.forEach((produto, index) => {

        const item =
            document.createElement("div");

        item.className =
            "produto-lista";

        item.innerHTML = `

            <div>

                <strong>
                    ${escaparHTML(produto.nome)}
                </strong>

                <small>

                    ${dinheiro(produto.preco)}

                    • Estoque:
                    ${produto.estoque}

                </small>

            </div>

            <div class="acoes-produto">

                <button
                    type="button"
                    class="btn-editar"
                    onclick="editarProduto(${index})"
                    title="Editar produto"
                >
                    ✏️
                </button>

                <button
                    type="button"
                    class="btn-excluir"
                    onclick="excluirProduto(${index})"
                    title="Excluir produto"
                >
                    🗑️
                </button>

            </div>

        `;

        listaProdutos.appendChild(item);

    });

}

// ==========================================
// ESCAPAR HTML
// ==========================================

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        String(texto);

    return div.innerHTML;

}

// ==========================================
// EDITAR PRODUTO
// ==========================================

window.editarProduto = function(index) {

    const produto = produtos[index];

    if (!produto) {
        alert("Produto não encontrado.");
        return;
    }

    // Guardar qual produto está sendo editado
    produtoEditando = index;

    // Carregar os dados atuais no formulário
    nomeProduto.value = produto.nome || "";

    precoProduto.value = Number(produto.preco || 0).toFixed(2);

    estoqueProduto.value = Number(
        produto.estoque || 0
    );

    // Alterar título
    document.getElementById(
        "tituloCadastro"
    ).textContent = "Editar produto";

    // Alterar botão
    salvarProduto.textContent =
        "💾 Salvar alterações";

    // Fechar lista
    modalLista.classList.remove("mostrar");

    // Abrir cadastro/edição
    modalCadastro.classList.add("mostrar");

    // Colocar cursor no estoque
    setTimeout(() => {
        estoqueProduto.focus();
        estoqueProduto.select();
    }, 100);

};
// ==========================================
// EXCLUIR PRODUTO
// ==========================================

window.excluirProduto = function(index) {

    const produto =
        produtos[index];

    if (!produto) return;

    const confirmou =
        confirm(
            `Deseja realmente excluir "${produto.nome}"?`
        );

    if (!confirmou) return;

    // Não permitir excluir se estiver
    // dentro do carrinho
    const estaNoCarrinho =
        carrinho.some(
            item => item.id === produto.id
        );

    if (estaNoCarrinho) {

        alert(
            "Este produto está na venda atual.\n\n" +
            "Remova-o do carrinho antes de excluir."
        );

        return;

    }

    produtos.splice(index, 1);

    salvarDados();

    atualizarTudo();

    mostrarNotificacao(
        "🗑️ Produto excluído!"
    );

};

// ==========================================
// PESQUISA
// ==========================================

campoPesquisa.addEventListener(
    "input",
    pesquisarProduto
);

limparPesquisa.addEventListener(
    "click",
    () => {

        campoPesquisa.value = "";

        mostrarResultadoVazio();

    }
);

// ==========================================
// PESQUISAR PRODUTO
// ==========================================

function pesquisarProduto() {

    const texto =
        campoPesquisa.value
            .trim()
            .toLowerCase();

    if (!texto) {

        mostrarResultadoVazio();

        return;

    }

    const encontrados =
        produtos.filter(produto =>
            String(produto.nome)
                .toLowerCase()
                .includes(texto)
        );

    resultado.innerHTML = "";

    if (encontrados.length === 0) {

        resultado.innerHTML = `

            <div class="resultado-vazio">

                <span>❌</span>

                <p>
                    Produto não encontrado.
                </p>

            </div>

        `;

        return;

    }

    encontrados.forEach(produto => {

        const div =
            document.createElement("div");

        div.className =
            "resultado-produto";

        div.innerHTML = `

            <div>

                <strong>
                    ${escaparHTML(produto.nome)}
                </strong>

                <small>
                    Estoque:
                    ${produto.estoque}
                </small>

            </div>

            <strong>
                ${dinheiro(produto.preco)}
            </strong>

        `;

        resultado.appendChild(div);

    });

}

// ==========================================
// RESULTADO VAZIO
// ==========================================

function mostrarResultadoVazio() {

    resultado.innerHTML = `

        <div class="resultado-vazio">

            <span>🔎</span>

            <p>
                Digite um produto para começar
            </p>

        </div>

    `;

}

// ==========================================
// PRODUTOS PARA VENDA
// ==========================================

function atualizarProdutosVenda() {

    produtoVenda.innerHTML = "";

    const disponiveis =
        produtos.filter(
            produto =>
                Number(produto.estoque) > 0
        );

    if (disponiveis.length === 0) {

        produtoVenda.innerHTML = `

            <option value="">
                Nenhum produto em estoque
            </option>

        `;

        return;

    }

    disponiveis.forEach(produto => {

        const option =
            document.createElement("option");

        option.value =
            produto.id;

        option.textContent =
            `${produto.nome} - ` +
            `${dinheiro(produto.preco)} ` +
            `(Estoque: ${produto.estoque})`;

        produtoVenda.appendChild(
            option
        );

    });

}

// ==========================================
// QUANTIDADE - MENOS
// ==========================================

menosQuantidade.addEventListener(
    "click",
    () => {

        let quantidade =
            Number(
                quantidadeVenda.value
            ) || 1;

        if (quantidade > 1) {

            quantidade--;

        }

        quantidadeVenda.value =
            quantidade;

    }
);

// ==========================================
// QUANTIDADE - MAIS
// ==========================================

maisQuantidade.addEventListener(
    "click",
    () => {

        let quantidade =
            Number(
                quantidadeVenda.value
            ) || 1;

        const produto =
            produtos.find(
                p =>
                    String(p.id) ===
                    String(produtoVenda.value)
            );

        if (!produto) return;

        if (
            quantidade <
            Number(produto.estoque)
        ) {

            quantidade++;

        }

        quantidadeVenda.value =
            quantidade;

    }
);

// ==========================================
// TROCAR PRODUTO
// ==========================================

produtoVenda.addEventListener(
    "change",
    () => {

        quantidadeVenda.value = 1;

    }
);

// ==========================================
// ADICIONAR CARRINHO
// ==========================================

adicionarCarrinho.addEventListener(
    "click",
    () => {

        const id =
            produtoVenda.value;

        const quantidade =
            Number(
                quantidadeVenda.value
            );

        if (!id) {

            alert(
                "Cadastre um produto primeiro."
            );

            return;

        }

        if (
            !Number.isInteger(quantidade) ||
            quantidade < 1
        ) {

            alert(
                "Digite uma quantidade válida."
            );

            return;

        }

        const produto =
            produtos.find(
                p =>
                    String(p.id) ===
                    String(id)
            );

        if (!produto) {

            alert(
                "Produto não encontrado."
            );

            return;

        }

        const itemExistente =
            carrinho.find(
                item =>
                    item.id === produto.id
            );

        const quantidadeAtual =
            itemExistente
                ? itemExistente.quantidade
                : 0;

        if (
            quantidadeAtual +
            quantidade >
            produto.estoque
        ) {

            alert(

                `Estoque insuficiente.\n\n` +

                `Produto: ${produto.nome}\n` +

                `Estoque disponível: ` +
                `${produto.estoque}\n` +

                `Quantidade solicitada: ` +
                `${quantidadeAtual + quantidade}`

            );

            return;

        }

        if (itemExistente) {

            itemExistente.quantidade +=
                quantidade;

        } else {

            carrinho.push({

                id: produto.id,

                nome: produto.nome,

                preco: produto.preco,

                quantidade: quantidade

            });

        }

        quantidadeVenda.value = 1;

        atualizarCarrinho();

        mostrarNotificacao(
            "🛒 Produto adicionado à venda!"
        );

    }
);

// ==========================================
// ATUALIZAR CARRINHO
// ==========================================

function atualizarCarrinho() {

    carrinhoElemento.innerHTML = "";

    if (carrinho.length === 0) {

        carrinhoElemento.innerHTML = `

            <div class="resultado-vazio">

                <span>🛒</span>

                <p>
                    Nenhum produto na venda.
                </p>

            </div>

        `;

    } else {

        carrinho.forEach(
            (item, index) => {

                const subtotal =
                    item.preco *
                    item.quantidade;

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "item-carrinho";

                div.innerHTML = `

                    <div>

                        <strong>
                            ${escaparHTML(item.nome)}
                        </strong>

                        <small>

                            ${item.quantidade}
                            x
                            ${dinheiro(item.preco)}

                        </small>

                    </div>

                    <div>

                        <strong>
                            ${dinheiro(subtotal)}
                        </strong>

                        <button
                            type="button"
                            onclick="removerCarrinho(${index})"
                            title="Remover"
                        >
                            🗑️
                        </button>

                    </div>

                `;

                carrinhoElemento.appendChild(
                    div
                );

            }
        );

    }

    const total =
        calcularTotalCarrinho();

    const quantidadeItens =
        carrinho.reduce(
            (total, item) =>
                total + item.quantidade,
            0
        );

    totalCarrinho.textContent =
        dinheiro(total);

    pagamentoTotal.textContent =
        dinheiro(total);

    quantidadeItensCarrinho.textContent =
        quantidadeItens;

    calcularTroco();

}

// ==========================================
// REMOVER CARRINHO
// ==========================================

window.removerCarrinho = function(index) {

    carrinho.splice(index, 1);

    atualizarCarrinho();

    mostrarNotificacao(
        "Produto removido da venda."
    );

};

// ==========================================
// TOTAL CARRINHO
// ==========================================

function calcularTotalCarrinho() {

    return carrinho.reduce(
        (total, item) =>
            total +
            Number(item.preco) *
            Number(item.quantidade),
        0
    );

}

// ==========================================
// FORMAS DE PAGAMENTO
// ==========================================

botoesPagamento.forEach(botao => {

    botao.addEventListener(
        "click",
        () => {

            botoesPagamento.forEach(btn => {

                btn.classList.remove(
                    "ativo"
                );

            });

            botao.classList.add(
                "ativo"
            );

            formaPagamento =
                botao.dataset.pagamento;

            atualizarPagamento();

        }
    );

});

// ==========================================
// ATUALIZAR PAGAMENTO
// ==========================================

function atualizarPagamento() {

    if (
        formaPagamento ===
        "dinheiro"
    ) {

        areaDinheiro.style.display =
            "block";

        areaTroco.style.display =
            "flex";

        calcularTroco();

    } else {

        areaDinheiro.style.display =
            "none";

        areaTroco.style.display =
            "none";

        valorRecebido.value = "";

        trocoVenda.textContent =
            dinheiro(0);

    }

}

// ==========================================
// TROCO
// ==========================================

valorRecebido.addEventListener(
    "input",
    calcularTroco
);

function calcularTroco() {

    if (
        formaPagamento !==
        "dinheiro"
    ) {

        trocoVenda.textContent =
            dinheiro(0);

        return;

    }

    const total =
        calcularTotalCarrinho();

    const recebido =
        Number(
            valorRecebido.value
        ) || 0;

    let troco =
        recebido - total;

    if (troco < 0) {

        troco = 0;

    }

    trocoVenda.textContent =
        dinheiro(troco);

}

// ==========================================
// FINALIZAR VENDA
// ==========================================
// IMPORTANTE:
// Existe SOMENTE UM evento aqui.
// Isso evita registrar a venda duas vezes.
// ==========================================

finalizarVenda.addEventListener(
    "click",
    () => {

        if (carrinho.length === 0) {

            alert(
                "Adicione pelo menos um produto à venda."
            );

            return;

        }

        const total =
            calcularTotalCarrinho();

        let recebido = total;
        let troco = 0;

        // ======================================
        // DINHEIRO
        // ======================================

        if (
            formaPagamento ===
            "dinheiro"
        ) {

            recebido =
                Number(
                    valorRecebido.value
                );

            if (
                isNaN(recebido) ||
                recebido < total
            ) {

                alert(

                    `Valor recebido insuficiente.\n\n` +

                    `Total da venda: ` +
                    `${dinheiro(total)}`

                );

                valorRecebido.focus();

                return;

            }

            troco =
                recebido - total;

        }

        // ======================================
        // VERIFICAR ESTOQUE
        // ======================================

        for (
            const item of carrinho
        ) {

            const produto =
                produtos.find(
                    p =>
                        p.id ===
                        item.id
                );

            if (
                !produto ||
                Number(produto.estoque) <
                Number(item.quantidade)
            ) {

                alert(

                    `Estoque insuficiente para:\n\n` +
                    `${item.nome}`

                );

                atualizarProdutosVenda();

                return;

            }

        }

        // ======================================
        // BAIXAR ESTOQUE
        // ======================================

        carrinho.forEach(item => {

            const produto =
                produtos.find(
                    p =>
                        p.id ===
                        item.id
                );

            produto.estoque -=
                item.quantidade;

        });

        // ======================================
        // NOME PAGAMENTO
        // ======================================

        let nomePagamento = "";

        switch (formaPagamento) {

            case "dinheiro":

                nomePagamento =
                    "Dinheiro";

                break;

            case "pix":

                nomePagamento =
                    "PIX";

                break;

            case "cartao":

                nomePagamento =
                    "Cartão";

                break;

            case "fiado":

                nomePagamento =
                    "Pagar depois";

                break;

            default:

                nomePagamento =
                    "Dinheiro";

        }

        // ======================================
        // CRIAR VENDA
        // ======================================

        const venda = {

            id: Date.now(),

            data:
                new Date().toISOString(),

            itens:
                carrinho.map(item => ({

                    id: item.id,

                    nome: item.nome,

                    preco: item.preco,

                    quantidade:
                        item.quantidade,

                    subtotal:
                        item.preco *
                        item.quantidade

                })),

            total: total,

            formaPagamento:
                formaPagamento,

            nomePagamento:
                nomePagamento,

            valorRecebido:
                recebido,

            troco:
                troco

        };

        // ======================================
        // SALVAR VENDA
        // ======================================

        vendas.push(venda);

        salvarDados();

        // ======================================
        // LIMPAR
        // ======================================

        carrinho = [];

        valorRecebido.value = "";

        atualizarCarrinho();

        atualizarProdutosVenda();

        atualizarTudo();

        // ======================================
        // MENSAGEM
        // ======================================

        let mensagem = "";

        if (
            formaPagamento ===
            "dinheiro"
        ) {

            mensagem =

                `✅ VENDA FINALIZADA!\n\n` +

                `Pagamento: ` +
                `${nomePagamento}\n` +

                `Total: ` +
                `${dinheiro(total)}\n` +

                `Recebido: ` +
                `${dinheiro(recebido)}\n` +

                `Troco: ` +
                `${dinheiro(troco)}`;

        } else {

            mensagem =

                `✅ VENDA FINALIZADA!\n\n` +

                `Pagamento: ` +
                `${nomePagamento}\n` +

                `Total: ` +
                `${dinheiro(total)}`;

        }

        alert(mensagem);

    }
);

// ==========================================
// LIMPAR CARRINHO
// ==========================================

limparCarrinho.addEventListener(
    "click",
    () => {

        if (carrinho.length === 0) {

            return;

        }

        if (
            !confirm(
                "Deseja limpar a venda atual?"
            )
        ) {

            return;

        }

        carrinho = [];

        valorRecebido.value = "";

        atualizarCarrinho();

        mostrarNotificacao(
            "Venda limpa."
        );

    }
);

// ==========================================
// RESUMO DE VENDAS
// ==========================================

function atualizarResumoVendas() {

    const hoje =
        new Date();

    const vendasHoje =
        vendas.filter(venda => {

            const data =
                new Date(venda.data);

            return (

                data.getDate() ===
                    hoje.getDate() &&

                data.getMonth() ===
                    hoje.getMonth() &&

                data.getFullYear() ===
                    hoje.getFullYear()

            );

        });

    const faturamento =
        vendasHoje.reduce(
            (total, venda) =>
                total +
                Number(venda.total || 0),
            0
        );

    const itens =
        vendasHoje.reduce(
            (total, venda) => {

                return total +
                    (venda.itens || [])
                        .reduce(
                            (soma, item) =>
                                soma +
                                Number(
                                    item.quantidade || 0
                                ),
                            0
                        );

            },
            0
        );

    const vendasHojeElemento =
        document.getElementById(
            "vendasHoje"
        );

    const faturamentoHojeElemento =
        document.getElementById(
            "faturamentoHoje"
        );

    const itensHojeElemento =
        document.getElementById(
            "itensHoje"
        );

    if (vendasHojeElemento) {

        vendasHojeElemento.textContent =
            vendasHoje.length;

    }

    if (faturamentoHojeElemento) {

        faturamentoHojeElemento.textContent =
            dinheiro(faturamento);

    }

    if (itensHojeElemento) {

        itensHojeElemento.textContent =
            itens;

    }

}

// ==========================================
// RELATÓRIOS
// ==========================================

function atualizarRelatorios() {

    const totalVendido =
        vendas.reduce(
            (total, venda) =>
                total +
                Number(venda.total || 0),
            0
        );

    const relTotal =
        document.getElementById(
            "relTotalVendido"
        );

    const relQuantidade =
        document.getElementById(
            "relQuantidadeVendas"
        );

    const relProdutos =
        document.getElementById(
            "relProdutos"
        );

    if (relTotal) {

        relTotal.textContent =
            dinheiro(totalVendido);

    }

    if (relQuantidade) {

        relQuantidade.textContent =
            vendas.length;

    }

    if (relProdutos) {

        relProdutos.textContent =
            produtos.length;

    }

    const hoje =
        new Date();

    const vendasHoje =
        vendas.filter(venda => {

            const data =
                new Date(venda.data);

            return (

                data.getDate() ===
                    hoje.getDate() &&

                data.getMonth() ===
                    hoje.getMonth() &&

                data.getFullYear() ===
                    hoje.getFullYear()

            );

        });

    const relVendasHoje =
        document.getElementById(
            "relVendasHoje"
        );

    if (relVendasHoje) {

        relVendasHoje.textContent =
            vendasHoje.length;

    }

    atualizarMaisVendidos();

    atualizarEstoqueBaixo();

    atualizarHistorico();

}

// ==========================================
// PRODUTOS MAIS VENDIDOS
// ==========================================

function atualizarMaisVendidos() {

    const elemento =
        document.getElementById(
            "maisVendidos"
        );

    if (!elemento) return;

    const mapa = {};

    vendas.forEach(venda => {

        (venda.itens || [])
            .forEach(item => {

                if (!mapa[item.id]) {

                    mapa[item.id] = {

                        nome: item.nome,

                        quantidade: 0,

                        total: 0

                    };

                }

                mapa[item.id].quantidade +=
                    Number(
                        item.quantidade || 0
                    );

                mapa[item.id].total +=
                    Number(
                        item.subtotal || 0
                    );

            });

    });

    const lista =
        Object.values(mapa)
            .sort(
                (a, b) =>
                    b.quantidade -
                    a.quantidade
            );

    elemento.innerHTML = "";

    if (lista.length === 0) {

        elemento.innerHTML = `

            <div class="resultado-vazio">

                <span>🏆</span>

                <p>
                    Ainda não existem vendas.
                </p>

            </div>

        `;

        return;

    }

    lista.slice(0, 10)
        .forEach((item, index) => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "rel-item";

            div.innerHTML = `

                <div>

                    <strong>
                        ${index + 1}º
                        ${escaparHTML(item.nome)}
                    </strong>

                    <small>
                        ${item.quantidade}
                        unidade(s)
                    </small>

                </div>

                <strong>
                    ${dinheiro(item.total)}
                </strong>

            `;

            elemento.appendChild(div);

        });

}

// ==========================================
// ESTOQUE BAIXO
// ==========================================

function atualizarEstoqueBaixo() {

    const elemento =
        document.getElementById(
            "estoqueBaixo"
        );

    if (!elemento) return;

    const lista =
        produtos
            .filter(
                produto =>
                    Number(produto.estoque) <= 5
            )
            .sort(
                (a, b) =>
                    a.estoque -
                    b.estoque
            );

    elemento.innerHTML = "";

    if (lista.length === 0) {

        elemento.innerHTML = `

            <div class="resultado-vazio">

                <span>✅</span>

                <p>
                    Nenhum produto com estoque baixo.
                </p>

            </div>

        `;

        return;

    }

    lista.forEach(produto => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "rel-item";

        div.innerHTML = `

            <div>

                <strong>
                    ${escaparHTML(produto.nome)}
                </strong>

                <small>
                    ${dinheiro(produto.preco)}
                </small>

            </div>

            <strong>
                ${produto.estoque}
                unidade(s)
            </strong>

        `;

        elemento.appendChild(div);

    });

}

// ==========================================
// HISTÓRICO DE VENDAS
// ==========================================

function atualizarHistorico() {

    const tbody =
        document.getElementById(
            "historicoVendas"
        );

    if (!tbody) return;

    tbody.innerHTML = "";

    if (vendas.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;"
                >
                    Nenhuma venda registrada.
                </td>

            </tr>

        `;

        return;

    }

    const vendasOrdenadas =
        [...vendas].sort(
            (a, b) =>
                new Date(b.data) -
                new Date(a.data)
        );

    vendasOrdenadas.forEach(venda => {

        const data =
            new Date(venda.data);

        const dataFormatada =
            data.toLocaleString(
                "pt-BR"
            );

        const quantidadeItens =
            (venda.itens || [])
                .reduce(
                    (total, item) =>
                        total +
                        Number(
                            item.quantidade || 0
                        ),
                    0
                );

        const tr =
            document.createElement(
                "tr"
            );

        tr.innerHTML = `

            <td>
                ${dataFormatada}
            </td>

            <td>
                ${quantidadeItens}
            </td>

            <td>
                <strong>
                    ${dinheiro(venda.total)}
                </strong>
            </td>

            <td>

                <button
                    type="button"
                    onclick="verDetalhesVenda(${venda.id})"
                >
                    👁️ Ver
                </button>

            </td>

        `;

        tbody.appendChild(tr);

    });

}

// ==========================================
// DETALHES DA VENDA
// ==========================================

window.verDetalhesVenda = function(id) {

    const venda =
        vendas.find(
            v =>
                v.id === id
        );

    if (!venda) {

        alert(
            "Venda não encontrada."
        );

        return;

    }

    const data =
        new Date(venda.data);

    const detalheData =
        document.getElementById(
            "detalheVendaData"
        );

    const detalhes =
        document.getElementById(
            "detalhesVenda"
        );

    if (detalheData) {

        detalheData.textContent =
            data.toLocaleString(
                "pt-BR"
            );

    }

    if (detalhes) {

        detalhes.innerHTML = `

            <div class="detalhes-venda">

                <p>
                    <strong>
                        Forma de pagamento:
                    </strong>

                    ${
                        venda.nomePagamento ||
                        "Dinheiro"
                    }
                </p>

                <hr>

                ${
                    (venda.itens || [])
                        .map(item => `

                            <div class="item-detalhe">

                                <span>
                                    ${escaparHTML(item.nome)}
                                    <br>

                                    <small>
                                        ${item.quantidade}
                                        x
                                        ${dinheiro(item.preco)}
                                    </small>
                                </span>

                                <strong>
                                    ${dinheiro(item.subtotal)}
                                </strong>

                            </div>

                        `)
                        .join("")
                }

                <hr>

                <p>

                    <strong>
                        Total:
                    </strong>

                    ${dinheiro(venda.total)}

                </p>

                ${
                    venda.formaPagamento ===
                    "dinheiro"
                        ? `

                            <p>
                                <strong>
                                    Recebido:
                                </strong>

                                ${dinheiro(
                                    venda.valorRecebido
                                )}
                            </p>

                            <p>
                                <strong>
                                    Troco:
                                </strong>

                                ${dinheiro(
                                    venda.troco
                                )}
                            </p>

                        `
                        : ""
                }

            </div>

        `;

    }

    modalVenda.classList.add(
        "mostrar"
    );

};

// ==========================================
// FECHAR DETALHES VENDA
// ==========================================

if (fecharVenda) {

    fecharVenda.addEventListener(
        "click",
        () => {

            modalVenda.classList.remove(
                "mostrar"
            );

        }
    );

}

// ==========================================
// APAGAR HISTÓRICO
// ==========================================

const limparVendas =
    document.getElementById(
        "limparVendas"
    );

if (limparVendas) {

    limparVendas.addEventListener(
        "click",
        () => {

            if (vendas.length === 0) {

                alert(
                    "Não existem vendas para apagar."
                );

                return;

            }

            const confirmou =
                confirm(
                    "ATENÇÃO!\n\n" +
                    "Deseja apagar todo o histórico de vendas?\n\n" +
                    "Os produtos e o estoque NÃO serão apagados."
                );

            if (!confirmou) return;

            vendas = [];

            salvarDados();

            atualizarRelatorios();

            atualizarResumoVendas();

            mostrarNotificacao(
                "🗑️ Histórico apagado!"
            );

        }
    );

}

// ==========================================
// ATUALIZAR TUDO
// ==========================================

function atualizarTudo() {

    atualizarListaProdutos();

    atualizarProdutosVenda();

    atualizarResumoVendas();

    atualizarRelatorios();

    atualizarEstatisticasEstoque();

    pesquisarProduto();

}

// ==========================================
// ESTATÍSTICAS DO ESTOQUE
// ==========================================

function atualizarEstatisticasEstoque() {

    const totalProdutos =
        document.getElementById(
            "totalProdutos"
        );

    const quantidadeBadge =
        document.getElementById(
            "quantidadeBadge"
        );

    const valorTotal =
        document.getElementById(
            "valorTotal"
        );

    const totalQuantidade =
        produtos.length;

    let valorEstoque = 0;

    produtos.forEach(produto => {

        valorEstoque +=
            Number(produto.preco || 0) *
            Number(produto.estoque || 0);

    });

    if (totalProdutos) {

        totalProdutos.textContent =
            totalQuantidade;

    }

    if (quantidadeBadge) {

        quantidadeBadge.textContent =
            totalQuantidade;

    }

    if (valorTotal) {

        valorTotal.textContent =
            dinheiro(valorEstoque);

    }

}

// ==========================================
// FECHAR MODAIS CLICANDO FORA
// ==========================================

window.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            modalCadastro
        ) {

            modalCadastro.classList.remove(
                "mostrar"
            );

            produtoEditando = null;

        }

        if (
            event.target ===
            modalLista
        ) {

            modalLista.classList.remove(
                "mostrar"
            );

        }

        if (
            event.target ===
            modalVenda
        ) {

            modalVenda.classList.remove(
                "mostrar"
            );

        }

    }
);

// ==========================================
// INICIALIZAÇÃO
// ==========================================

atualizarTudo();

atualizarPagamento();

atualizarCarrinho();
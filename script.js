// ============================================================
// MINHA CONVENIÊNCIA
// SCRIPT COMPLETO - VERSÃO CORRIGIDA
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // DADOS
    // ========================================================

    let produtos = JSON.parse(
        localStorage.getItem("produtos") || "[]"
    );

    let vendas = JSON.parse(
        localStorage.getItem("vendas") || "[]"
    );
    

    let caixas = JSON.parse(
        localStorage.getItem("caixas") || "[]"
    );

    let caixaAtual = JSON.parse(
        localStorage.getItem("caixaAtual") || "null"
    );

    let carrinho = [];

    let produtoEditando = null;

    let formaPagamento = "dinheiro";


    // ========================================================
    // FUNÇÕES AUXILIARES
    // ========================================================

    function $(id) {
        return document.getElementById(id);
    }

    function dinheiro(valor) {
        return Number(valor || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }

    function salvarDados() {

        localStorage.setItem(
            "produtos",
            JSON.stringify(produtos)
        );

        localStorage.setItem(
            "vendas",
            JSON.stringify(vendas)
        );

        localStorage.setItem(
            "caixas",
            JSON.stringify(caixas)
        );

        localStorage.setItem(
            "caixaAtual",
            JSON.stringify(caixaAtual)
        );
    }

    function escaparHTML(texto) {

        const div = document.createElement("div");

        div.textContent = String(texto);

        return div.innerHTML;
    }

    function mostrarNotificacao(mensagem) {

        const notificacao = $("notificacao");

        if (!notificacao) return;

        notificacao.textContent = mensagem;

        notificacao.classList.add("mostrar");

        setTimeout(() => {
            notificacao.classList.remove("mostrar");
        }, 2500);
    }


    // ========================================================
    // RELÓGIO
    // ========================================================

    function atualizarRelogio() {

        const relogio = $("relogio");

        if (!relogio) return;

        const agora = new Date();

        relogio.textContent =
            agora.toLocaleTimeString("pt-BR");
    }

    atualizarRelogio();

    setInterval(
        atualizarRelogio,
        1000
    );


    // ========================================================
    // ABAS
    // ========================================================

    document.querySelectorAll(".menu-btn").forEach(botao => {

        botao.addEventListener("click", () => {

            const abaNome = botao.dataset.aba;

            // Remove ativo dos botões
            document
                .querySelectorAll(".menu-btn")
                .forEach(btn => {
                    btn.classList.remove("ativo");
                });

            // Remove ativo das abas
            document
                .querySelectorAll(".aba")
                .forEach(aba => {
                    aba.classList.remove("ativo");
                });

            // Ativa botão
            botao.classList.add("ativo");

            // Ativa aba
            const aba = $(`aba-${abaNome}`);

            if (aba) {
                aba.classList.add("ativo");
            }

            // Atualizações
            if (abaNome === "inicio") {
                atualizarTudo();
            }

            if (abaNome === "vendas") {
                atualizarProdutosVenda();
                atualizarCarrinho();
                atualizarResumoVendas();
                verificarCaixaParaVenda();
            }

            if (abaNome === "caixa") {
                atualizarCaixa();
            }

            if (abaNome === "relatorios") {
                atualizarRelatorios();
            }

        });

    });


    // ========================================================
    // IR PARA CAIXA
    // ========================================================

    function abrirAbaCaixa() {

        const botaoCaixa =
            document.querySelector(
                '.menu-btn[data-aba="caixa"]'
            );

        if (botaoCaixa) {
            botaoCaixa.click();
        }
    }

    if ($("irParaCaixa")) {

        $("irParaCaixa").addEventListener(
            "click",
            abrirAbaCaixa
        );
    }

    if ($("abrirCaixaVendas")) {

        $("abrirCaixaVendas").addEventListener(
            "click",
            abrirAbaCaixa
        );
    }


    // ========================================================
    // MODAIS
    // ========================================================

    function abrirModal(id) {

        const modal = $(id);

        if (modal) {
            modal.classList.add("mostrar");
        }
    }

    function fecharModal(id) {

        const modal = $(id);

        if (modal) {
            modal.classList.remove("mostrar");
        }
    }


    // ========================================================
    // CADASTRO DE PRODUTO
    // ========================================================

    if ($("abrirCadastro")) {

        $("abrirCadastro").addEventListener(
            "click",
            () => {

                produtoEditando = null;

                if ($("tituloCadastro")) {
                    $("tituloCadastro").textContent =
                        "Adicionar produto";
                }

                if ($("salvarProduto")) {
                    $("salvarProduto").textContent =
                        "➕ Adicionar produto";
                }

                if ($("nomeProduto")) {
                    $("nomeProduto").value = "";
                }

                if ($("precoProduto")) {
                    $("precoProduto").value = "";
                }

                if ($("estoqueProduto")) {
                    $("estoqueProduto").value = "";
                }

                abrirModal("modalCadastro");
            }
        );

    }


    if ($("fecharCadastro")) {

        $("fecharCadastro").addEventListener(
            "click",
            () => {
                fecharModal("modalCadastro");
                produtoEditando = null;
            }
        );

    }


    // ========================================================
    // SALVAR PRODUTO
    // ========================================================

    if ($("salvarProduto")) {

        $("salvarProduto").addEventListener(
            "click",
            () => {

                const nome =
                    $("nomeProduto").value.trim();

                const preco =
                    Number(
                        String(
                            $("precoProduto").value
                        ).replace(",", ".")
                    );

                const estoque =
                    Number(
                        $("estoqueProduto").value
                    );

                if (!nome) {

                    alert(
                        "Digite o nome do produto."
                    );

                    $("nomeProduto").focus();

                    return;
                }

                if (
                    !Number.isFinite(preco) ||
                    preco < 0
                ) {

                    alert(
                        "Digite um preço válido."
                    );

                    $("precoProduto").focus();

                    return;
                }

                if (
                    !Number.isInteger(estoque) ||
                    estoque < 0
                ) {

                    alert(
                        "Digite um estoque válido."
                    );

                    $("estoqueProduto").focus();

                    return;
                }


                // EDITAR
                if (produtoEditando !== null) {

                    const produto =
                        produtos[produtoEditando];

                    if (!produto) {

                        alert(
                            "Produto não encontrado."
                        );

                        produtoEditando = null;

                        return;
                    }

                    produto.nome = nome;
                    produto.preco = preco;
                    produto.estoque = estoque;

                    mostrarNotificacao(
                        "📦 Produto atualizado!"
                    );

                }

                // NOVO
                else {

                    produtos.push({

                        id:
                            Date.now() +
                            Math.floor(
                                Math.random() * 1000
                            ),

                        nome,
                        preco,
                        estoque

                    });

                    mostrarNotificacao(
                        "✅ Produto adicionado!"
                    );
                }

                salvarDados();

                fecharModal("modalCadastro");

                produtoEditando = null;

                atualizarTudo();

            }
        );

    }


    // ========================================================
    // LISTA DE PRODUTOS
    // ========================================================

    if ($("abrirLista")) {

        $("abrirLista").addEventListener(
            "click",
            () => {

                atualizarListaProdutos();

                abrirModal("modalLista");
            }
        );

    }


    if ($("fecharLista")) {

        $("fecharLista").addEventListener(
            "click",
            () => {
                fecharModal("modalLista");
            }
        );

    }


    function atualizarListaProdutos() {

        const lista = $("listaProdutos");

        if (!lista) return;

        lista.innerHTML = "";

        if (produtos.length === 0) {

            lista.innerHTML = `
                <div class="resultado-vazio">
                    <span>📦</span>
                    <p>Nenhum produto cadastrado.</p>
                </div>
            `;

            return;
        }

        produtos.forEach(
            (produto, index) => {

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
                            data-index="${index}"
                        >
                            ✏️
                        </button>

                        <button
                            type="button"
                            class="btn-excluir"
                            data-index="${index}"
                        >
                            🗑️
                        </button>

                    </div>
                `;

                lista.appendChild(item);
            }
        );


        lista
            .querySelectorAll(".btn-editar")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        editarProduto(
                            Number(
                                botao.dataset.index
                            )
                        );

                    }
                );

            });


        lista
            .querySelectorAll(".btn-excluir")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        excluirProduto(
                            Number(
                                botao.dataset.index
                            )
                        );

                    }
                );

            });

    }


    // ========================================================
    // EDITAR PRODUTO
    // ========================================================

    function editarProduto(index) {

        const produto =
            produtos[index];

        if (!produto) return;

        produtoEditando = index;

        $("nomeProduto").value =
            produto.nome;

        $("precoProduto").value =
            Number(produto.preco).toFixed(2);

        $("estoqueProduto").value =
            produto.estoque;

        $("tituloCadastro").textContent =
            "Editar produto";

        $("salvarProduto").textContent =
            "💾 Salvar alterações";

        fecharModal("modalLista");

        abrirModal("modalCadastro");
    }


    // ========================================================
    // EXCLUIR PRODUTO
    // ========================================================

    function excluirProduto(index) {

        const produto =
            produtos[index];

        if (!produto) return;

        const noCarrinho =
            carrinho.some(
                item =>
                    item.id === produto.id
            );

        if (noCarrinho) {

            alert(
                "Este produto está no carrinho.\n\n" +
                "Remova o produto da venda antes de excluí-lo."
            );

            return;
        }

        if (
            !confirm(
                `Deseja excluir "${produto.nome}"?`
            )
        ) {
            return;
        }

        produtos.splice(index, 1);

        salvarDados();

        atualizarTudo();

        atualizarListaProdutos();

        mostrarNotificacao(
            "🗑️ Produto excluído!"
        );
    }


    // ========================================================
    // PESQUISA
    // ========================================================

    if ($("campoPesquisa")) {

        $("campoPesquisa").addEventListener(
            "input",
            pesquisarProduto
        );
    }

    if ($("limparPesquisa")) {

        $("limparPesquisa").addEventListener(
            "click",
            () => {

                $("campoPesquisa").value = "";

                mostrarResultadoVazio();
            }
        );

    }


    function pesquisarProduto() {

        const campo = $("campoPesquisa");
        const resultado = $("resultado");

        if (!campo || !resultado) return;

        const texto =
            campo.value
                .trim()
                .toLowerCase();

        if (!texto) {

            mostrarResultadoVazio();

            return;
        }

        const encontrados =
            produtos.filter(
                produto =>
                    String(produto.nome)
                        .toLowerCase()
                        .includes(texto)
            );

        resultado.innerHTML = "";

        if (encontrados.length === 0) {

            resultado.innerHTML = `
                <div class="resultado-vazio">
                    <span>❌</span>
                    <p>Produto não encontrado.</p>
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


    function mostrarResultadoVazio() {

        const resultado = $("resultado");

        if (!resultado) return;

        resultado.innerHTML = `
            <div class="resultado-vazio">
                <span>🔎</span>
                <p>Digite um produto para começar</p>
            </div>
        `;
    }


    // ========================================================
// PRODUTOS PARA VENDA - ORDEM ALFABÉTICA
// ========================================================

function atualizarProdutosVenda() {

    const select = $("produtoVenda");

    if (!select) return;

    select.innerHTML = "";

    const disponiveis =
        produtos
            .filter(produto =>
                Number(produto.estoque) > 0
            )
            .sort((a, b) =>
                String(a.nome)
                    .localeCompare(
                        String(b.nome),
                        "pt-BR",
                        {
                            sensitivity: "base"
                        }
                    )
            );

    if (disponiveis.length === 0) {

        select.innerHTML = `
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
            `${produto.nome} - ${
                dinheiro(produto.preco)
            } (Estoque: ${
                produto.estoque
            })`;

        select.appendChild(option);
    });
}
    // ========================================================
    // QUANTIDADE
    // ========================================================

    if ($("menosQuantidade")) {

        $("menosQuantidade").addEventListener(
            "click",
            () => {

                let quantidade =
                    Number(
                        $("quantidadeVenda").value
                    ) || 1;

                quantidade =
                    Math.max(
                        1,
                        quantidade - 1
                    );

                $("quantidadeVenda").value =
                    quantidade;
            }
        );
    }


    if ($("maisQuantidade")) {

        $("maisQuantidade").addEventListener(
            "click",
            () => {

                let quantidade =
                    Number(
                        $("quantidadeVenda").value
                    ) || 1;

                const produto =
                    produtos.find(
                        p =>
                            String(p.id) ===
                            String(
                                $("produtoVenda").value
                            )
                    );

                if (!produto) return;

                if (
                    quantidade <
                    Number(produto.estoque)
                ) {
                    quantidade++;
                }

                $("quantidadeVenda").value =
                    quantidade;
            }
        );
    }


    if ($("produtoVenda")) {

        $("produtoVenda").addEventListener(
            "change",
            () => {
                $("quantidadeVenda").value = 1;
            }
        );
    }


    // ========================================================
    // CARRINHO
    // ========================================================

    if ($("adicionarCarrinho")) {

        $("adicionarCarrinho").addEventListener(
            "click",
            adicionarAoCarrinho
        );
    }


    function adicionarAoCarrinho() {

        // CAIXA FECHADO
        if (!caixaAtual) {

            alert(
                "🔒 O caixa está fechado.\n\n" +
                "Abra o caixa antes de realizar uma venda."
            );

            abrirAbaCaixa();

            return;
        }

        const id =
            $("produtoVenda").value;

        const quantidade =
            Number(
                $("quantidadeVenda").value
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

        if (!produto) return;

        const existente =
            carrinho.find(
                item =>
                    item.id === produto.id
            );

        const quantidadeAtual =
            existente
                ? existente.quantidade
                : 0;

        if (
            quantidadeAtual +
            quantidade >
            Number(produto.estoque)
        ) {

            alert(
                `Estoque insuficiente.\n\n` +
                `Produto: ${produto.nome}\n` +
                `Disponível: ${produto.estoque}`
            );

            return;
        }

        if (existente) {

            existente.quantidade +=
                quantidade;

        } else {

            carrinho.push({

                id: produto.id,

                nome: produto.nome,

                preco: Number(produto.preco),

                quantidade
            });
        }

        $("quantidadeVenda").value = 1;

        atualizarCarrinho();

        mostrarNotificacao(
            "🛒 Produto adicionado!"
        );
    }


    function calcularSubtotal() {

        return carrinho.reduce(
            (total, item) =>
                total +
                Number(item.preco) *
                Number(item.quantidade),
            0
        );
    }


    function calcularDesconto() {

        if (!$("descontoVenda")) {
            return 0;
        }

        const subtotal =
            calcularSubtotal();

        let desconto =
            Number(
                $("descontoVenda").value
            ) || 0;

        desconto =
            Math.max(0, desconto);

        desconto =
            Math.min(
                desconto,
                subtotal
            );

        return desconto;
    }


    function calcularTotal() {

        return Math.max(
            0,
            calcularSubtotal() -
            calcularDesconto()
        );
    }


    function atualizarCarrinho() {

        const elemento =
            $("carrinho");

        if (!elemento) return;

        elemento.innerHTML = "";

        if (carrinho.length === 0) {

            elemento.innerHTML = `
                <div class="resultado-vazio">
                    <span>🛒</span>
                    <p>Nenhum produto na venda.</p>
                </div>
            `;

        } else {

            carrinho.forEach(
                (item, index) => {

                    const subtotal =
                        item.preco *
                        item.quantidade;

                    const div =
                        document.createElement("div");

                    div.className =
                        "item-carrinho";

                    div.innerHTML = `

                        <div>

                            <strong>
                                ${escaparHTML(item.nome)}
                            </strong>

                            <small>
                                ${item.quantidade} x
                                ${dinheiro(item.preco)}
                            </small>

                        </div>

                        <div>

                            <strong>
                                ${dinheiro(subtotal)}
                            </strong>

                            <button
                                type="button"
                                class="remover-item"
                                data-index="${index}"
                            >
                                🗑️
                            </button>

                        </div>
                    `;

                    elemento.appendChild(div);
                }
            );


            elemento
                .querySelectorAll(".remover-item")
                .forEach(botao => {

                    botao.addEventListener(
                        "click",
                        () => {

                            carrinho.splice(
                                Number(
                                    botao.dataset.index
                                ),
                                1
                            );

                            atualizarCarrinho();
                        }
                    );
                });
        }


        const subtotal =
            calcularSubtotal();

        const desconto =
            calcularDesconto();

        const total =
            calcularTotal();

        const quantidade =
            carrinho.reduce(
                (soma, item) =>
                    soma +
                    Number(item.quantidade),
                0
            );


        if ($("subtotalCarrinho")) {
            $("subtotalCarrinho").textContent =
                dinheiro(subtotal);
        }

        if ($("totalCarrinho")) {
            $("totalCarrinho").textContent =
                dinheiro(total);
        }

        if ($("pagamentoTotal")) {
            $("pagamentoTotal").textContent =
                dinheiro(total);
        }

        if ($("quantidadeItensCarrinho")) {
            $("quantidadeItensCarrinho").textContent =
                quantidade;
        }

        calcularTroco();
    }


    // ========================================================
    // DESCONTO
    // ========================================================

    if ($("descontoVenda")) {

        $("descontoVenda").addEventListener(
            "input",
            atualizarCarrinho
        );
    }


    // ========================================================
    // PAGAMENTO
    // ========================================================

    document
        .querySelectorAll(".forma-pagamento")
        .forEach(botao => {

            botao.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".forma-pagamento"
                        )
                        .forEach(btn => {
                            btn.classList.remove(
                                "ativo"
                            );
                        });

                    botao.classList.add("ativo");

                    formaPagamento =
                        botao.dataset.pagamento;

                    atualizarPagamento();
                }
            );

        });


    function atualizarPagamento() {

        const dinheiroArea =
            $("areaDinheiro");

        const trocoArea =
            $("areaTroco");

        if (formaPagamento === "dinheiro") {

            if (dinheiroArea) {
                dinheiroArea.style.display =
                    "block";
            }

            if (trocoArea) {
                trocoArea.style.display =
                    "flex";
            }

            calcularTroco();

        } else {

            if (dinheiroArea) {
                dinheiroArea.style.display =
                    "none";
            }

            if (trocoArea) {
                trocoArea.style.display =
                    "none";
            }

            if ($("valorRecebido")) {
                $("valorRecebido").value = "";
            }
        }
    }


    if ($("valorRecebido")) {

        $("valorRecebido").addEventListener(
            "input",
            calcularTroco
        );
    }


    function calcularTroco() {

        if (!$("trocoVenda")) return;

        if (formaPagamento !== "dinheiro") {

            $("trocoVenda").textContent =
                dinheiro(0);

            return;
        }

        const total =
            calcularTotal();

        const recebido =
            Number(
                $("valorRecebido")?.value
            ) || 0;

        const troco =
            Math.max(
                0,
                recebido - total
            );

        $("trocoVenda").textContent =
            dinheiro(troco);
    }


    // ========================================================
    // FINALIZAR VENDA
    // ========================================================

    if ($("finalizarVenda")) {

        $("finalizarVenda").addEventListener(
            "click",
            finalizarVenda
        );
    }


    function finalizarVenda() {

        if (!caixaAtual) {

            alert(
                "🔒 Caixa fechado!\n\n" +
                "Abra o caixa antes de finalizar uma venda."
            );

            abrirAbaCaixa();

            return;
        }

        if (carrinho.length === 0) {

            alert(
                "Adicione pelo menos um produto."
            );

            return;
        }

        const subtotal =
            calcularSubtotal();

        const desconto =
            calcularDesconto();

        const total =
            calcularTotal();

        let recebido =
            total;

        let troco = 0;


        if (formaPagamento === "dinheiro") {

            recebido =
                Number(
                    $("valorRecebido").value
                ) || 0;

            if (recebido < total) {

                alert(
                    `Valor insuficiente.\n\n` +
                    `Total: ${dinheiro(total)}`
                );

                $("valorRecebido").focus();

                return;
            }

            troco =
                recebido - total;
        }


        // Verificar estoque
        for (const item of carrinho) {

            const produto =
                produtos.find(
                    p =>
                        p.id === item.id
                );

            if (
                !produto ||
                produto.estoque <
                item.quantidade
            ) {

                alert(
                    `Estoque insuficiente para ${item.nome}.`
                );

                atualizarProdutosVenda();

                return;
            }
        }


        // Baixar estoque
        carrinho.forEach(item => {

            const produto =
                produtos.find(
                    p =>
                        p.id === item.id
                );

            produto.estoque -=
                item.quantidade;
        });


        const nomesPagamento = {

            dinheiro: "Dinheiro",

            pix: "PIX",

            cartao: "Cartão",

            fiado: "Pagar depois"
        };


        const venda = {

            id:
                Date.now() +
                Math.floor(
                    Math.random() * 1000
                ),

            data:
                new Date().toISOString(),

            subtotal,

            desconto,

            total,

            formaPagamento,

            nomePagamento:
                nomesPagamento[
                    formaPagamento
                ] || "Dinheiro",

            valorRecebido:
                recebido,

            troco,

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
                }))
        };


        vendas.push(venda);

        salvarDados();


        carrinho = [];


        if ($("valorRecebido")) {
            $("valorRecebido").value = "";
        }

        if ($("descontoVenda")) {
            $("descontoVenda").value = "0";
        }


        atualizarTudo();


        let mensagem =
            `✅ VENDA FINALIZADA!\n\n` +
            `Pagamento: ${venda.nomePagamento}\n\n` +
            `Subtotal: ${dinheiro(subtotal)}\n` +
            `Desconto: ${dinheiro(desconto)}\n` +
            `Total: ${dinheiro(total)}`;


        if (
            formaPagamento === "dinheiro"
        ) {

            mensagem +=
                `\n\nRecebido: ${dinheiro(recebido)}` +
                `\nTroco: ${dinheiro(troco)}`;
        }


        alert(mensagem);
    }


    // ========================================================
    // LIMPAR CARRINHO
    // ========================================================

    if ($("limparCarrinho")) {

        $("limparCarrinho").addEventListener(
            "click",
            () => {

                if (carrinho.length === 0) return;

                if (
                    !confirm(
                        "Deseja limpar a venda atual?"
                    )
                ) {
                    return;
                }

                carrinho = [];

                if ($("valorRecebido")) {
                    $("valorRecebido").value = "";
                }

                if ($("descontoVenda")) {
                    $("descontoVenda").value = "0";
                }

                atualizarCarrinho();

                mostrarNotificacao(
                    "Venda limpa."
                );
            }
        );

    }


    // ========================================================
    // RESUMO DO DIA
    // ========================================================

    function vendasDeHoje() {

        const hoje =
            new Date();

        return vendas.filter(venda => {

            const data =
                new Date(venda.data);

            return (
                data.getDate() === hoje.getDate() &&
                data.getMonth() === hoje.getMonth() &&
                data.getFullYear() === hoje.getFullYear()
            );
        });
    }


    function atualizarResumoVendas() {

        const lista =
            vendasDeHoje();

        const faturamento =
            lista.reduce(
                (soma, venda) =>
                    soma +
                    Number(venda.total || 0),
                0
            );

        const itens =
            lista.reduce(
                (soma, venda) =>
                    soma +
                    (venda.itens || [])
                        .reduce(
                            (s, item) =>
                                s +
                                Number(
                                    item.quantidade || 0
                                ),
                            0
                        ),
                0
            );


        if ($("vendasHoje")) {
            $("vendasHoje").textContent =
                lista.length;
        }

        if ($("faturamentoHoje")) {
            $("faturamentoHoje").textContent =
                dinheiro(faturamento);
        }

        if ($("itensHoje")) {
            $("itensHoje").textContent =
                itens;
        }
    }
// ========================================================
// RELATÓRIO DE VENDAS POR PERÍODO
// ========================================================

function formatarDataInput(data) {

    const ano = data.getFullYear();

    const mes = String(
        data.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        data.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


// ========================================================
// GERAR RELATÓRIO POR PERÍODO
// ========================================================

function gerarRelatorioPeriodo() {

    const elemento =
        $("relatorioPeriodo");

    if (!elemento) return;


    const campoInicial =
        $("dataInicialRelatorio");

    const campoFinal =
        $("dataFinalRelatorio");


    if (!campoInicial || !campoFinal) {
        return;
    }


    const dataInicial =
        campoInicial.value;

    const dataFinal =
        campoFinal.value;


    if (!dataInicial || !dataFinal) {

        alert(
            "Selecione a data inicial e a data final."
        );

        return;
    }


    if (dataInicial > dataFinal) {

        alert(
            "A data inicial não pode ser maior que a data final."
        );

        return;
    }


    // ====================================================
    // DATAS
    // ====================================================

    const inicio =
        new Date(
            dataInicial + "T00:00:00"
        );

    const fim =
        new Date(
            dataFinal + "T23:59:59.999"
        );


    // ====================================================
    // FILTRAR VENDAS
    // ====================================================

    const vendasPeriodo =
        vendas.filter(venda => {

            if (!venda.data) {
                return false;
            }

            const dataVenda =
                new Date(venda.data);

            return (
                dataVenda >= inicio &&
                dataVenda <= fim
            );

        });


    // ====================================================
    // TOTAIS
    // ====================================================

    let faturamento = 0;

    let dinheiroTotal = 0;

    let pixTotal = 0;

    let cartaoTotal = 0;

    let fiadoTotal = 0;

    let descontosTotal = 0;

    let quantidadeProdutos = 0;


    vendasPeriodo.forEach(venda => {

        const total =
            Number(venda.total || 0);

        faturamento += total;


        descontosTotal +=
            Number(
                venda.desconto || 0
            );


        switch (
            venda.formaPagamento
        ) {

            case "dinheiro":

                dinheiroTotal += total;

                break;


            case "pix":

                pixTotal += total;

                break;


            case "cartao":

                cartaoTotal += total;

                break;


            case "fiado":

                fiadoTotal += total;

                break;
        }


        (venda.itens || [])
            .forEach(item => {

                quantidadeProdutos +=
                    Number(
                        item.quantidade || 0
                    );

            });

    });


    // ====================================================
    // MÉDIA POR VENDA
    // ====================================================

    const mediaVenda =
        vendasPeriodo.length > 0
            ? faturamento /
              vendasPeriodo.length
            : 0;


    // ====================================================
    // PRODUTOS MAIS VENDIDOS
    // ====================================================

    const produtosVendidos = {};


    vendasPeriodo.forEach(venda => {

        (venda.itens || [])
            .forEach(item => {

                const id =
                    item.id || item.nome;


                if (!produtosVendidos[id]) {

                    produtosVendidos[id] = {

                        nome: item.nome,

                        quantidade: 0,

                        valor: 0

                    };

                }


                produtosVendidos[id]
                    .quantidade +=
                    Number(
                        item.quantidade || 0
                    );


                produtosVendidos[id]
                    .valor +=
                    Number(
                        item.subtotal || 0
                    );

            });

    });


    const listaProdutos =
        Object.values(
            produtosVendidos
        )
        .sort(
            (a, b) =>
                b.quantidade -
                a.quantidade
        );


    // ====================================================
    // DATA FORMATADA
    // ====================================================

    const partesInicial =
        dataInicial.split("-");

    const partesFinal =
        dataFinal.split("-");


    const dataInicialExibicao =
        `${partesInicial[2]}/${partesInicial[1]}/${partesInicial[0]}`;


    const dataFinalExibicao =
        `${partesFinal[2]}/${partesFinal[1]}/${partesFinal[0]}`;


    // ====================================================
    // HTML DO RELATÓRIO
    // ====================================================

    let html = `

        <div class="relatorio-periodo-cabecalho">

            <h2>
                📊 Relatório de vendas
            </h2>

            <p>
                ${dataInicialExibicao}
                até
                ${dataFinalExibicao}
            </p>

        </div>


        <div class="relatorio-periodo-resumo">

            <div class="card-resumo-dia">

                <span>
                    💰 Faturamento
                </span>

                <strong>
                    ${dinheiro(faturamento)}
                </strong>

            </div>


            <div class="card-resumo-dia">

                <span>
                    🧾 Vendas
                </span>

                <strong>
                    ${vendasPeriodo.length}
                </strong>

            </div>


            <div class="card-resumo-dia">

                <span>
                    📦 Produtos vendidos
                </span>

                <strong>
                    ${quantidadeProdutos}
                </strong>

            </div>


            <div class="card-resumo-dia">

                <span>
                    📊 Média por venda
                </span>

                <strong>
                    ${dinheiro(mediaVenda)}
                </strong>

            </div>


            <div class="card-resumo-dia">

                <span>
                    🏷️ Descontos
                </span>

                <strong>
                    ${dinheiro(descontosTotal)}
                </strong>

            </div>

        </div>


        <div class="relatorio-pagamentos">

            <h3>
                💵 Formas de pagamento
            </h3>


            <div class="rel-pagamento">

                <span>💵 Dinheiro</span>

                <strong>
                    ${dinheiro(dinheiroTotal)}
                </strong>

            </div>


            <div class="rel-pagamento">

                <span>📱 PIX</span>

                <strong>
                    ${dinheiro(pixTotal)}
                </strong>

            </div>


            <div class="rel-pagamento">

                <span>💳 Cartão</span>

                <strong>
                    ${dinheiro(cartaoTotal)}
                </strong>

            </div>


            <div class="rel-pagamento">

                <span>📝 Fiado</span>

                <strong>
                    ${dinheiro(fiadoTotal)}
                </strong>

            </div>

        </div>

    `;


    // ====================================================
    // PRODUTOS
    // ====================================================

    html += `

        <div class="lista-produtos-dia">

            <div class="titulo-relatorio-dia">

                <strong>
                    🏆 Produtos vendidos
                </strong>

                <span>
                    ${listaProdutos.length}
                    produto(s)
                </span>

            </div>

    `;


    if (listaProdutos.length === 0) {

        html += `

            <div class="resultado-vazio">

                <span>📭</span>

                <p>
                    Nenhuma venda nesse período.
                </p>

            </div>

        `;

    } else {

        listaProdutos.forEach(
            (produto, index) => {

                html += `

                    <div class="produto-relatorio-dia">

                        <div class="produto-dia-numero">
                            ${index + 1}
                        </div>


                        <div class="produto-dia-info">

                            <strong>
                                ${escaparHTML(
                                    produto.nome
                                )}
                            </strong>

                            <small>
                                ${produto.quantidade}
                                unidade(s) vendida(s)
                            </small>

                        </div>


                        <div class="produto-dia-valor">

                            <strong>
                                ${dinheiro(
                                    produto.valor
                                )}
                            </strong>

                        </div>

                    </div>

                `;

            }
        );

    }


    html += `</div>`;


    // ====================================================
    // INSERIR NA TELA
    // ====================================================

    elemento.innerHTML =
        html;

}


// ========================================================
// DEFINIR PERÍODO INICIAL
// ========================================================

function definirPeriodoRelatorio() {

    const hoje =
        new Date();

    const campoInicial =
        $("dataInicialRelatorio");

    const campoFinal =
        $("dataFinalRelatorio");


    if (!campoInicial || !campoFinal) {
        return;
    }


    // Hoje
    campoFinal.value =
        formatarDataInput(hoje);


    // 7 dias atrás
    const inicio =
        new Date(hoje);

    inicio.setDate(
        inicio.getDate() - 6
    );


    campoInicial.value =
        formatarDataInput(inicio);


    gerarRelatorioPeriodo();
}


// ========================================================
// BOTÃO GERAR RELATÓRIO
// ========================================================

if ($("gerarRelatorioPeriodo")) {

    $("gerarRelatorioPeriodo")
        .addEventListener(
            "click",
            gerarRelatorioPeriodo
        );

}


// ========================================================
// INICIALIZAR DATAS
// ========================================================

if (
    $("dataInicialRelatorio") &&
    $("dataFinalRelatorio")
) {

    definirPeriodoRelatorio();

}

    // ========================================================
    // RELATÓRIOS
    // ========================================================

    function atualizarRelatorios() {

    const total =
        vendas.reduce(
            (soma, venda) =>
                soma +
                Number(venda.total || 0),
            0
        );

    if ($("relTotalVendido")) {
        $("relTotalVendido").textContent =
            dinheiro(total);
    }

    if ($("relQuantidadeVendas")) {
        $("relQuantidadeVendas").textContent =
            vendas.length;
    }

    if ($("relVendasHoje")) {
        $("relVendasHoje").textContent =
            vendasDeHoje().length;
    }

    if ($("relProdutos")) {
        $("relProdutos").textContent =
            produtos.length;
    }

    // ==========================================
    // ATUALIZA OS RELATÓRIOS
    // ==========================================

    atualizarMaisVendidos();

    atualizarEstoqueBaixo();

    // IMPORTANTE:
    // Agora o estoque alto também é atualizado
    atualizarEstoqueAlto();

    atualizarHistorico();
}

    function atualizarMaisVendidos() {

        const elemento =
            $("maisVendidos");

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
                    <p>Ainda não existem vendas.</p>
                </div>
            `;

            return;
        }


        lista
            .slice(0, 10)
            .forEach(
                (item, index) => {

                    const div =
                        document.createElement("div");

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
                }
            );
    }
    
   function atualizarEstoqueAlto() {

    const elemento = document.getElementById("estoqueAlto");

    if (!elemento) return;

    // Verifica se existem produtos
    if (!Array.isArray(produtos) || produtos.length === 0) {
        elemento.innerHTML = `
            <div class="resultado-vazio">
                <span>📦</span>
                <p>Nenhum produto cadastrado.</p>
            </div>
        `;
        return;
    }

    // Produtos com 30 unidades ou mais
    const produtosAltoEstoque = produtos
        .filter(produto => {

            const estoque = Number(
                produto.estoque ?? 
                produto.quantidade ?? 
                produto.qtd ?? 
                0
            );

            return estoque >= 06;
        })
        .sort((a, b) => {

            const estoqueA = Number(
                a.estoque ?? 
                a.quantidade ?? 
                a.qtd ?? 
                0
            );

            const estoqueB = Number(
                b.estoque ?? 
                b.quantidade ?? 
                b.qtd ?? 
                0
            );

            return estoqueB - estoqueA;
        });

    // Nenhum produto encontrado
    if (produtosAltoEstoque.length === 0) {

        elemento.innerHTML = `
            <div class="resultado-vazio">
                <span>📦</span>
                <p>Nenhum produto com estoque alto.</p>
                <small>
                    O estoque alto começa em 06 unidades.
                </small>
            </div>
        `;

        return;
    }

    // Mostra os produtos
    elemento.innerHTML = produtosAltoEstoque.map(produto => {

        const estoque = Number(
            produto.estoque ?? 
            produto.quantidade ?? 
            produto.qtd ?? 
            0
        );

        return `
            <div class="item-relatorio estoque-alto-item">

                <div class="item-relatorio-info">

                    <strong>
                        📦 ${produto.nome}
                    </strong>

                    <small>
                        Estoque disponível
                    </small>

                </div>

                <span class="estoque-alto-badge">
                    🟢 ${estoque} unidades
                </span>

            </div>
        `;

    }).join("");
}

    function atualizarEstoqueBaixo() {

        const elemento =
            $("estoqueBaixo");

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
                document.createElement("div");

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
                    ${produto.estoque} unidade(s)
                </strong>
            `;

            elemento.appendChild(div);
        });
    }
    


    // ========================================================
    // HISTÓRICO DE VENDAS
    // ========================================================

    function atualizarHistorico() {

        const tbody =
            $("historicoVendas");

        if (!tbody) return;

        tbody.innerHTML = "";


        if (vendas.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;">
                        Nenhuma venda registrada.
                    </td>
                </tr>
            `;

            return;
        }


        [...vendas]
            .sort(
                (a, b) =>
                    new Date(b.data) -
                    new Date(a.data)
            )
            .forEach(venda => {

                const data =
                    new Date(venda.data);

                const quantidade =
                    (venda.itens || [])
                        .reduce(
                            (soma, item) =>
                                soma +
                                Number(
                                    item.quantidade || 0
                                ),
                            0
                        );

                const tr =
                    document.createElement("tr");

                tr.innerHTML = `

                    <td>
                        ${data.toLocaleString("pt-BR")}
                    </td>

                    <td>
                        ${quantidade}
                    </td>

                    <td>
                        <strong>
                            ${dinheiro(venda.total)}
                        </strong>
                    </td>

                    <td>

                        <button
                            type="button"
                            class="btn-ver-venda"
                            data-id="${venda.id}"
                        >
                            👁️ Ver
                        </button>

                    </td>
                `;

                tbody.appendChild(tr);
            });


        tbody
            .querySelectorAll(".btn-ver-venda")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        verDetalhesVenda(
                            Number(
                                botao.dataset.id
                            )
                        );
                    }
                );

            });
    }


    // ========================================================
    // DETALHES DA VENDA
    // ========================================================

    function verDetalhesVenda(id) {

        const venda =
            vendas.find(
                v =>
                    Number(v.id) ===
                    Number(id)
            );

        if (!venda) {

            alert(
                "Venda não encontrada."
            );

            return;
        }


        const data =
            new Date(venda.data);


        if ($("detalheVendaData")) {

            $("detalheVendaData").textContent =
                data.toLocaleString("pt-BR");
        }


        if ($("detalhesVenda")) {

            $("detalhesVenda").innerHTML = `

                <div class="detalhes-venda">

                    <p>
                        <strong>
                            Pagamento:
                        </strong>
                        ${escaparHTML(
                            venda.nomePagamento ||
                            "Dinheiro"
                        )}
                    </p>

                    <hr>

                    ${
                        (venda.itens || [])
                            .map(item => `

                                <div class="item-detalhe">

                                    <span>

                                        ${escaparHTML(
                                            item.nome
                                        )}

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
                        <strong>Subtotal:</strong>
                        ${dinheiro(
                            venda.subtotal ??
                            venda.total
                        )}
                    </p>

                    <p>
                        <strong>Desconto:</strong>
                        ${dinheiro(
                            venda.desconto || 0
                        )}
                    </p>

                    <p>
                        <strong>Total:</strong>
                        ${dinheiro(venda.total)}
                    </p>

                    ${
                        venda.formaPagamento === "dinheiro"
                        ? `
                            <p>
                                <strong>Recebido:</strong>
                                ${dinheiro(
                                    venda.valorRecebido
                                )}
                            </p>

                            <p>
                                <strong>Troco:</strong>
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


        abrirModal("modalVenda");
    }


    if ($("fecharVenda")) {

        $("fecharVenda").addEventListener(
            "click",
            () => {
                fecharModal("modalVenda");
            }
        );
    }


    // ========================================================
    // APAGAR HISTÓRICO
    // ========================================================

    if ($("limparVendas")) {

        $("limparVendas").addEventListener(
            "click",
            () => {

                if (vendas.length === 0) {

                    alert(
                        "Não existem vendas para apagar."
                    );

                    return;
                }

                if (
                    !confirm(
                        "Deseja apagar todo o histórico de vendas?"
                    )
                ) {
                    return;
                }

                vendas = [];

                salvarDados();

                atualizarRelatorios();

                atualizarResumoVendas();

                atualizarCaixa();

                mostrarNotificacao(
                    "🗑️ Histórico apagado!"
                );
            }
        );
    }
// ========================================================
// RELATÓRIO DE VENDAS POR DATA
// ========================================================

function formatarDataInput(data) {

    const ano = data.getFullYear();

    const mes = String(
        data.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        data.getDate()
    ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


// ========================================================
// ATUALIZAR RELATÓRIO POR DATA
// ========================================================

function atualizarRelatorioPorData() {

    const elemento =
        $("relatorioPorDia");

    if (!elemento) return;

    const campoData =
        $("dataRelatorio");

    if (!campoData) return;

    let dataSelecionada =
        campoData.value;

    // Se não tiver data escolhida, usa hoje
    if (!dataSelecionada) {

        dataSelecionada =
            formatarDataInput(new Date());

        campoData.value =
            dataSelecionada;
    }


    // ====================================================
    // FILTRAR VENDAS DA DATA
    // ====================================================

    const vendasData =
        vendas.filter(venda => {

            if (!venda.data) {
                return false;
            }

            const dataVenda =
                new Date(venda.data);

            const dataVendaFormatada =
                formatarDataInput(dataVenda);

            return (
                dataVendaFormatada ===
                dataSelecionada
            );

        });


    // ====================================================
    // AGRUPAR PRODUTOS
    // ====================================================

    const produtosVendidos = {};

    let faturamento = 0;

    let quantidadeVendas =
        vendasData.length;

    let quantidadeProdutos = 0;


    vendasData.forEach(venda => {

        faturamento +=
            Number(venda.total || 0);


        (venda.itens || []).forEach(item => {

            const id =
                item.id || item.nome;


            if (!produtosVendidos[id]) {

                produtosVendidos[id] = {

                    nome: item.nome,

                    quantidade: 0,

                    valor: 0

                };

            }


            produtosVendidos[id].quantidade +=
                Number(
                    item.quantidade || 0
                );


            produtosVendidos[id].valor +=
                Number(
                    item.subtotal || 0
                );


            quantidadeProdutos +=
                Number(
                    item.quantidade || 0
                );

        });

    });


    const listaProdutos =
        Object.values(produtosVendidos)
            .sort(
                (a, b) =>
                    b.quantidade -
                    a.quantidade
            );


    // ====================================================
    // FORMATAR DATA PARA EXIBIÇÃO
    // ====================================================

    const partes =
        dataSelecionada.split("-");

    const dataExibicao =
        `${partes[2]}/${partes[1]}/${partes[0]}`;


    // ====================================================
    // CABEÇALHO
    // ====================================================

    let html = `

        <div class="relatorio-dia-cabecalho">

            <h3>
                📅 Vendas de ${dataExibicao}
            </h3>

            <div class="relatorio-dia-resumo">

                <div class="card-resumo-dia">

                    <span>
                        💰 Faturamento
                    </span>

                    <strong>
                        ${dinheiro(faturamento)}
                    </strong>

                </div>


                <div class="card-resumo-dia">

                    <span>
                        🧾 Vendas
                    </span>

                    <strong>
                        ${quantidadeVendas}
                    </strong>

                </div>


                <div class="card-resumo-dia">

                    <span>
                        📦 Produtos vendidos
                    </span>

                    <strong>
                        ${quantidadeProdutos}
                    </strong>

                </div>

            </div>

        </div>

    `;


    // ====================================================
    // NENHUMA VENDA
    // ====================================================

    if (listaProdutos.length === 0) {

        html += `

            <div class="resultado-vazio">

                <span>📭</span>

                <p>
                    Nenhuma venda registrada
                    em ${dataExibicao}.
                </p>

            </div>

        `;

        elemento.innerHTML =
            html;

        return;
    }


    // ====================================================
    // LISTA DE PRODUTOS
    // ====================================================

    html += `

        <div class="lista-produtos-dia">

            <div class="titulo-relatorio-dia">

                <strong>
                    📦 Produtos vendidos
                </strong>

                <span>
                    ${listaProdutos.length}
                    produto(s)
                </span>

            </div>

    `;


    listaProdutos.forEach(
        (produto, index) => {

            html += `

                <div class="produto-relatorio-dia">

                    <div class="produto-dia-numero">
                        ${index + 1}
                    </div>


                    <div class="produto-dia-info">

                        <strong>
                            ${escaparHTML(
                                produto.nome
                            )}
                        </strong>

                        <small>
                            ${produto.quantidade}
                            unidade(s) vendida(s)
                        </small>

                    </div>


                    <div class="produto-dia-valor">

                        <strong>
                            ${dinheiro(
                                produto.valor
                            )}
                        </strong>

                    </div>

                </div>

            `;

        }
    );


    html += `</div>`;


    elemento.innerHTML =
        html;
}


// ========================================================
// DEFINIR DATA DE HOJE
// ========================================================

function definirDataRelatorioHoje() {

    const campo =
        $("dataRelatorio");

    if (!campo) return;

    campo.value =
        formatarDataInput(
            new Date()
        );

    atualizarRelatorioPorData();
}


// ========================================================
// ALTERAÇÃO DA DATA
// ========================================================

if ($("dataRelatorio")) {

    $("dataRelatorio").addEventListener(
        "change",
        atualizarRelatorioPorData
    );

}


// ========================================================
// BOTÃO HOJE
// ========================================================

if ($("hojeRelatorio")) {

    $("hojeRelatorio").addEventListener(
        "click",
        definirDataRelatorioHoje
    );

}

    // ========================================================
    // CAIXA
    // ========================================================

    function verificarCaixaParaVenda() {

        const aviso =
            $("avisoCaixaFechado");

        if (!aviso) return;

        if (caixaAtual) {

            aviso.style.display = "none";

        } else {

            aviso.style.display = "flex";
        }
    }


    function atualizarCaixa() {

        const aberto =
            !!caixaAtual;


        // Status início
        if ($("statusCaixa")) {

            $("statusCaixa").textContent =
                aberto
                    ? "🟢 Caixa aberto"
                    : "🔴 Caixa fechado";
        }


        if ($("statusCaixaGrande")) {

            $("statusCaixaGrande").textContent =
                aberto
                    ? "Caixa aberto"
                    : "Caixa fechado";
        }


        if ($("iconeStatusCaixa")) {

            $("iconeStatusCaixa").textContent =
                aberto ? "🟢" : "🔴";
        }


        if ($("dataAberturaCaixa")) {

            $("dataAberturaCaixa").textContent =
                aberto
                    ? `Aberto em ${
                        new Date(
                            caixaAtual.dataAbertura
                        ).toLocaleString("pt-BR")
                    }`
                    : "Nenhum caixa aberto.";
        }


        if ($("botaoAbrirCaixa")) {

            $("botaoAbrirCaixa").style.display =
                aberto ? "none" : "block";
        }


        if ($("botaoFecharCaixa")) {

            $("botaoFecharCaixa").style.display =
                aberto ? "block" : "none";
        }


        if ($("resumoCaixaInicio")) {

            $("resumoCaixaInicio").textContent =
                aberto
                    ? `Abertura: ${
                        dinheiro(
                            caixaAtual.valorAbertura
                        )
                    }`
                    : "Abra o caixa para começar a vender.";
        }


        calcularResumoCaixa();

        atualizarHistoricoCaixas();

        verificarCaixaParaVenda();
    }


    function calcularResumoCaixa() {

        let dinheiroTotal = 0;

        let pixTotal = 0;

        let cartaoTotal = 0;

        let fiadoTotal = 0;

        let totalVendido = 0;


        if (caixaAtual) {

            const vendasCaixa =
                vendas.filter(
                    venda =>
                        Number(
                            venda.dataTimestamp ||
                            new Date(venda.data).getTime()
                        ) >=
                        Number(
                            caixaAtual.timestamp
                        )
                );


            vendasCaixa.forEach(venda => {

                const total =
                    Number(venda.total || 0);

                totalVendido += total;


                switch (
                    venda.formaPagamento
                ) {

                    case "dinheiro":
                        dinheiroTotal += total;
                        break;

                    case "pix":
                        pixTotal += total;
                        break;

                    case "cartao":
                        cartaoTotal += total;
                        break;

                    case "fiado":
                        fiadoTotal += total;
                        break;
                }
            });
        }


        if ($("caixaValorAbertura")) {

            $("caixaValorAbertura").textContent =
                dinheiro(
                    caixaAtual
                        ? caixaAtual.valorAbertura
                        : 0
                );
        }


        if ($("caixaDinheiro")) {
            $("caixaDinheiro").textContent =
                dinheiro(dinheiroTotal);
        }

        if ($("caixaPix")) {
            $("caixaPix").textContent =
                dinheiro(pixTotal);
        }

        if ($("caixaCartao")) {
            $("caixaCartao").textContent =
                dinheiro(cartaoTotal);
        }

        if ($("caixaFiado")) {
            $("caixaFiado").textContent =
                dinheiro(fiadoTotal);
        }

        if ($("caixaTotalVendido")) {
            $("caixaTotalVendido").textContent =
                dinheiro(totalVendido);
        }


        const esperado =
            caixaAtual
                ? Number(
                    caixaAtual.valorAbertura
                ) + dinheiroTotal
                : 0;


        if ($("dinheiroEsperado")) {

            $("dinheiroEsperado").textContent =
                dinheiro(esperado);
        }
    }


    // ========================================================
    // ABRIR CAIXA
    // ========================================================

    if ($("botaoAbrirCaixa")) {

        $("botaoAbrirCaixa").addEventListener(
            "click",
            () => {

                if (caixaAtual) {

                    alert(
                        "O caixa já está aberto."
                    );

                    return;
                }

                if ($("valorAbertura")) {
                    $("valorAbertura").value = "";
                }

                abrirModal(
                    "modalAberturaCaixa"
                );

                setTimeout(() => {

                    if ($("valorAbertura")) {
                        $("valorAbertura").focus();
                    }

                }, 100);
            }
        );
    }


    // ========================================================
    // CONFIRMAR ABERTURA
    // ========================================================

    if ($("confirmarAberturaCaixa")) {

        $("confirmarAberturaCaixa")
            .addEventListener(
                "click",
                () => {

                    if (caixaAtual) {

                        alert(
                            "O caixa já está aberto."
                        );

                        return;
                    }

                    const valor =
                        Number(
                            $("valorAbertura").value
                        ) || 0;


                    if (valor < 0) {

                        alert(
                            "Digite um valor válido."
                        );

                        return;
                    }


                    const agora =
                        new Date();


                    caixaAtual = {

                        id:
                            Date.now(),

                        dataAbertura:
                            agora.toISOString(),

                        timestamp:
                            agora.getTime(),

                        valorAbertura:
                            valor
                    };


                    salvarDados();

                    fecharModal(
                        "modalAberturaCaixa"
                    );

                    atualizarCaixa();

                    mostrarNotificacao(
                        "🟢 Caixa aberto com sucesso!"
                    );
                }
            );
    }


    if ($("fecharAberturaCaixa")) {

        $("fecharAberturaCaixa")
            .addEventListener(
                "click",
                () => {
                    fecharModal(
                        "modalAberturaCaixa"
                    );
                }
            );
    }


    // ========================================================
    // FECHAR CAIXA
    // ========================================================

    if ($("botaoFecharCaixa")) {

        $("botaoFecharCaixa")
            .addEventListener(
                "click",
                () => {

                    if (!caixaAtual) {

                        alert(
                            "O caixa já está fechado."
                        );

                        return;
                    }


                    const vendasCaixa =
                        vendas.filter(
                            venda =>
                                Number(
                                    venda.dataTimestamp ||
                                    new Date(
                                        venda.data
                                    ).getTime()
                                ) >=
                                Number(
                                    caixaAtual.timestamp
                                )
                        );


                    const dinheiroVendas =
                        vendasCaixa
                            .filter(
                                venda =>
                                    venda.formaPagamento ===
                                    "dinheiro"
                            )
                            .reduce(
                                (
                                    soma,
                                    venda
                                ) =>
                                    soma +
                                    Number(
                                        venda.total || 0
                                    ),
                                0
                            );


                    const totalVendido =
                        vendasCaixa
                            .reduce(
                                (
                                    soma,
                                    venda
                                ) =>
                                    soma +
                                    Number(
                                        venda.total || 0
                                    ),
                                0
                            );


                    const esperado =
                        Number(
                            caixaAtual.valorAbertura
                        ) +
                        dinheiroVendas;


                    if ($("fechamentoAbertura")) {

                        $("fechamentoAbertura")
                            .textContent =
                            dinheiro(
                                caixaAtual.valorAbertura
                            );
                    }


                    if ($("fechamentoDinheiro")) {

                        $("fechamentoDinheiro")
                            .textContent =
                            dinheiro(
                                dinheiroVendas
                            );
                    }


                    if ($("fechamentoTotal")) {

                        $("fechamentoTotal")
                            .textContent =
                            dinheiro(
                                totalVendido
                            );
                    }


                    if ($("fechamentoEsperado")) {

                        $("fechamentoEsperado")
                            .textContent =
                            dinheiro(
                                esperado
                            );
                    }


                    if ($("dinheiroContado")) {

                        $("dinheiroContado").value = "";

                        $("dinheiroContado")
                            .dataset.esperado =
                            esperado;
                    }


                    if ($("diferencaFechamento")) {

                        $("diferencaFechamento")
                            .textContent =
                            dinheiro(0);
                    }


                    abrirModal(
                        "modalFechamentoCaixa"
                    );
                }
            );
    }


    // ========================================================
    // CALCULAR DIFERENÇA
    // ========================================================

    if ($("dinheiroContado")) {

        $("dinheiroContado")
            .addEventListener(
                "input",
                () => {

                    const contado =
                        Number(
                            $("dinheiroContado").value
                        ) || 0;

                    const esperado =
                        Number(
                            $("dinheiroContado")
                                .dataset.esperado
                        ) || 0;

                    const diferenca =
                        contado - esperado;


                    if ($("diferencaFechamento")) {

                        $("diferencaFechamento")
                            .textContent =
                            dinheiro(diferenca);
                    }
                }
            );
    }


    // ========================================================
    // CONFIRMAR FECHAMENTO
    // ========================================================

    if ($("confirmarFechamentoCaixa")) {

        $("confirmarFechamentoCaixa")
            .addEventListener(
                "click",
                () => {

                    if (!caixaAtual) {

                        alert(
                            "Nenhum caixa aberto."
                        );

                        return;
                    }


                    const contado =
                        Number(
                            $("dinheiroContado").value
                        );


                    if (
                        !Number.isFinite(contado) ||
                        contado < 0
                    ) {

                        alert(
                            "Informe o dinheiro contado."
                        );

                        $("dinheiroContado")
                            .focus();

                        return;
                    }


                    const vendasCaixa =
                        vendas.filter(
                            venda =>
                                Number(
                                    venda.dataTimestamp ||
                                    new Date(
                                        venda.data
                                    ).getTime()
                                ) >=
                                Number(
                                    caixaAtual.timestamp
                                )
                        );


                    const dinheiroVendas =
                        vendasCaixa
                            .filter(
                                venda =>
                                    venda.formaPagamento ===
                                    "dinheiro"
                            )
                            .reduce(
                                (
                                    soma,
                                    venda
                                ) =>
                                    soma +
                                    Number(
                                        venda.total || 0
                                    ),
                                0
                            );


                    const totalVendido =
                        vendasCaixa
                            .reduce(
                                (
                                    soma,
                                    venda
                                ) =>
                                    soma +
                                    Number(
                                        venda.total || 0
                                    ),
                                0
                            );


                    const esperado =
                        Number(
                            caixaAtual.valorAbertura
                        ) +
                        dinheiroVendas;


                    const diferenca =
                        contado - esperado;


                    const fechamento = {

                        id:
                            Date.now(),

                        dataAbertura:
                            caixaAtual.dataAbertura,

                        dataFechamento:
                            new Date().toISOString(),

                        valorAbertura:
                            caixaAtual.valorAbertura,

                        totalVendido,

                        dinheiroVendas,

                        dinheiroEsperado:
                            esperado,

                        dinheiroContado:
                            contado,

                        diferenca,

                        observacao:
                            $("observacaoFechamento")
                                ?.value || ""
                    };


                    caixas.push(
                        fechamento
                    );


                    caixaAtual = null;


                    salvarDados();


                    fecharModal(
                        "modalFechamentoCaixa"
                    );


                    atualizarCaixa();


                    if ($("observacaoFechamento")) {
                        $("observacaoFechamento")
                            .value = "";
                    }


                    alert(
                        "🔴 CAIXA FECHADO!\n\n" +
                        `Dinheiro esperado: ${
                            dinheiro(esperado)
                        }\n` +
                        `Dinheiro contado: ${
                            dinheiro(contado)
                        }\n` +
                        `Diferença: ${
                            dinheiro(diferenca)
                        }`
                    );
                }
            );
    }


    if ($("fecharModalFechamento")) {

        $("fecharModalFechamento")
            .addEventListener(
                "click",
                () => {
                    fecharModal(
                        "modalFechamentoCaixa"
                    );
                }
            );
    }


    // ========================================================
    // HISTÓRICO DE CAIXAS
    // ========================================================

    function atualizarHistoricoCaixas() {

        const tbody =
            $("historicoCaixas");

        if (!tbody) return;

        tbody.innerHTML = "";


        if (caixas.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        Nenhum fechamento registrado.
                    </td>
                </tr>
            `;

            return;
        }


        [...caixas]
            .sort(
                (a, b) =>
                    new Date(b.dataFechamento) -
                    new Date(a.dataFechamento)
            )
            .forEach(caixa => {

                const abertura =
                    new Date(
                        caixa.dataAbertura
                    );

                const fechamento =
                    new Date(
                        caixa.dataFechamento
                    );

                const tr =
                    document.createElement("tr");

                tr.innerHTML = `

                    <td>
                        ${abertura.toLocaleString("pt-BR")}
                    </td>

                    <td>
                        ${fechamento.toLocaleString("pt-BR")}
                    </td>

                    <td>
                        ${dinheiro(
                            caixa.valorAbertura
                        )}
                    </td>

                    <td>
                        ${dinheiro(
                            caixa.totalVendido
                        )}
                    </td>

                    <td>
                        ${dinheiro(
                            caixa.dinheiroContado
                        )}
                    </td>

                    <td>
                        ${dinheiro(
                            caixa.diferenca
                        )}
                    </td>
                `;

                tbody.appendChild(tr);
            });
    }


    // ========================================================
    // FECHAR MODAIS CLICANDO FORA
    // ========================================================

    window.addEventListener(
        "click",
        event => {

            document
                .querySelectorAll(".modal")
                .forEach(modal => {

                    if (
                        event.target === modal
                    ) {
                        modal.classList.remove(
                            "mostrar"
                        );
                    }

                });
        }
    );


    // ========================================================
    // ESTATÍSTICAS
    // ========================================================

    function atualizarEstatisticasEstoque() {

        const quantidade =
            produtos.length;

        const valor =
            produtos.reduce(
                (total, produto) =>
                    total +
                    Number(produto.preco || 0) *
                    Number(produto.estoque || 0),
                0
            );


        if ($("totalProdutos")) {

            $("totalProdutos").textContent =
                quantidade;
        }

        if ($("quantidadeBadge")) {

            $("quantidadeBadge").textContent =
                quantidade;
        }

        if ($("valorTotal")) {

            $("valorTotal").textContent =
                dinheiro(valor);
        }
    }


    // ========================================================
    // ATUALIZAR TUDO
    // ========================================================

    function atualizarTudo() {

        atualizarListaProdutos();

        atualizarProdutosVenda();

        atualizarResumoVendas();

        atualizarRelatorios();

        atualizarEstatisticasEstoque();

        atualizarCaixa();

        atualizarCarrinho();

        pesquisarProduto();
    }
// ========================================================
// SUGESTÃO INTELIGENTE DE PEDIDO
// ========================================================

function calcularSugestaoPedido() {

    const lista = $("listaSugestaoPedido");

    if (!lista) {
        console.error("Elemento listaSugestaoPedido não encontrado.");
        return;
    }

    lista.innerHTML = "";

    // ----------------------------------------------------
    // VERIFICAR PRODUTOS
    // ----------------------------------------------------

    if (!produtos || produtos.length === 0) {

        if ($("pedidoProdutosAnalisados")) {
            $("pedidoProdutosAnalisados").textContent = "0";
        }

        if ($("pedidoQuantidadeItens")) {
            $("pedidoQuantidadeItens").textContent = "0";
        }

        if ($("pedidoQuantidadeTotal")) {
            $("pedidoQuantidadeTotal").textContent = "0";
        }

        lista.innerHTML = `
            <div class="resultado-vazio">
                <span>📦</span>
                <p>Nenhum produto cadastrado.</p>
                <small>
                    Cadastre produtos para calcular a sugestão.
                </small>
            </div>
        `;

        return;
    }

    // ----------------------------------------------------
    // DIAS DE ESTOQUE DESEJADO
    // ----------------------------------------------------

    const campoDias = $("diasEstoque");

    let diasEstoque = Number(
        campoDias?.value || 7
    );

    if (!Number.isFinite(diasEstoque) || diasEstoque < 1) {
        diasEstoque = 7;
    }

    // ----------------------------------------------------
    // DATA DE REFERÊNCIA
    // ----------------------------------------------------

    const agora = new Date();

    const dataInicial = new Date(agora);

    dataInicial.setDate(
        dataInicial.getDate() - 07
    );

    // ----------------------------------------------------
    // ANALISAR PRODUTOS
    // ----------------------------------------------------

    const sugestoes = [];

    produtos.forEach(produto => {

        const estoqueAtual = Number(
            produto.estoque ??
            produto.quantidade ??
            produto.qtd ??
            0
        );

        let quantidadeVendida = 0;

        // ------------------------------------------------
        // PROCURAR VENDAS DO PRODUTO
        // ------------------------------------------------

        vendas.forEach(venda => {

            if (!venda.data) return;

            const dataVenda = new Date(
                venda.data
            );

            if (dataVenda < dataInicial) {
                return;
            }

            (venda.itens || []).forEach(item => {

                if (
                    String(item.id) ===
                    String(produto.id)
                ) {

                    quantidadeVendida +=
                        Number(
                            item.quantidade || 0
                        );
                }

            });

        });

        // ------------------------------------------------
        // MÉDIA DIÁRIA
        // ------------------------------------------------

        const mediaDiaria =
            quantidadeVendida / 7;

        // ------------------------------------------------
        // ESTOQUE NECESSÁRIO
        // ------------------------------------------------

        const estoqueNecessario =
            Math.ceil(
                mediaDiaria * diasEstoque
            );

        // ------------------------------------------------
// QUANTIDADE A COMPRAR
// ------------------------------------------------

// Se o produto nunca vendeu,
// não sugerir compra automaticamente.
if (quantidadeVendida === 0) {

    quantidadeComprar = 0;

} else {

    quantidadeComprar =
        estoqueNecessario - estoqueAtual;

    quantidadeComprar =
        Math.max(
            0,
            Math.ceil(quantidadeComprar)
        );
}

        // ------------------------------------------------
        // ADICIONAR À SUGESTÃO
        // ------------------------------------------------

        if (quantidadeComprar > 0) {

            sugestoes.push({

                produto,

                estoqueAtual,

                quantidadeVendida,

                mediaDiaria,

                estoqueNecessario,

                quantidadeComprar

            });

        }

    });

    // ----------------------------------------------------
    // ORDENAR
    // ----------------------------------------------------

    sugestoes.sort(
        (a, b) =>
            b.quantidadeComprar -
            a.quantidadeComprar
    );

    // ----------------------------------------------------
    // ATUALIZAR INDICADORES
    // ----------------------------------------------------

    if ($("pedidoProdutosAnalisados")) {

        $("pedidoProdutosAnalisados")
            .textContent =
            produtos.length;

    }

    if ($("pedidoQuantidadeItens")) {

        $("pedidoQuantidadeItens")
            .textContent =
            sugestoes.length;

    }

    const quantidadeTotal =
        sugestoes.reduce(
            (total, item) =>
                total +
                item.quantidadeComprar,
            0
        );

    if ($("pedidoQuantidadeTotal")) {

        $("pedidoQuantidadeTotal")
            .textContent =
            quantidadeTotal;

    }

    // ----------------------------------------------------
    // NENHUM PRODUTO PARA PEDIR
    // ----------------------------------------------------

    if (sugestoes.length === 0) {

        lista.innerHTML = `
            <div class="resultado-vazio">

                <span>✅</span>

                <p>
                    Seu estoque está em boas condições!
                </p>

                <small>
                    Nenhum produto precisa de reposição
                    para os próximos ${diasEstoque} dias.
                </small>

            </div>
        `;

        mostrarNotificacao(
            "✅ Nenhum produto precisa de reposição."
        );

        return;
    }

    // ----------------------------------------------------
    // MOSTRAR PRODUTOS
    // ----------------------------------------------------

    sugestoes.forEach(item => {

        const produto =
            item.produto;

        const div =
            document.createElement("div");

        div.className =
            "item-sugestao-pedido";

        div.innerHTML = `

            <div class="sugestao-produto">

                <strong>
                    📦 ${escaparHTML(produto.nome)}
                </strong>

                <small>
                    Estoque atual:
                    <b>
                        ${item.estoqueAtual}
                    </b>
                </small>

                <small>
                    Vendidos:
                    <b>
                        ${item.quantidadeVendida}
                    </b>
                </small>

                <small>
                    Média diária:
                    <b>
                        ${item.mediaDiaria.toFixed(2)}
                    </b>
                </small>

            </div>

            <div class="sugestao-compra">

                <span>
                    Comprar
                </span>

                <strong>
                    ${item.quantidadeComprar}
                    unidade(s)
                </strong>

            </div>

        `;

        lista.appendChild(div);

    });

    mostrarNotificacao(
        "📋 Sugestão de pedido calculada!"
    );

}


// ========================================================
// BOTÃO CALCULAR SUGESTÃO DE PEDIDO
// ========================================================

const botaoCalcularSugestao = $("calcularSugestaoPedido");

if (botaoCalcularSugestao) {

    botaoCalcularSugestao.addEventListener("click", () => {

        console.log("Calculando sugestão de pedido...");

        calcularSugestaoPedido();

    });

}


// ========================================================
// ABRIR MODAL DE SUGESTÃO
// ========================================================

if ($("abrirSugestaoPedido")) {

    $("abrirSugestaoPedido").addEventListener(
        "click",
        () => {

            abrirModal("modalSugestaoPedido");

            calcularSugestaoPedido();
        }
    );
}


// ========================================================
// FECHAR MODAL DE SUGESTÃO
// ========================================================

if ($("fecharSugestaoPedido")) {

    $("fecharSugestaoPedido").addEventListener(
        "click",
        () => {

            fecharModal("modalSugestaoPedido");

        }
    );
}

    // ========================================================
    // INICIALIZAÇÃO
    // ========================================================

    atualizarTudo();

    atualizarPagamento();

    atualizarCarrinho();

    atualizarCaixa();

});

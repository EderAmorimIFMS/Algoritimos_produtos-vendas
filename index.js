const container = document.getElementById("container");
let produtos, vendas;

function carregarProdutos() {
    let produtosArmazenados = localStorage.getItem("produtos");
    produtosArmazenados ? produtos = JSON.parse(produtosArmazenados) : produtos = [];
}

function carregarVendas() {
    let vendasArmazenadas = localStorage.getItem("vendas");
    vendasArmazenadas ? vendas = JSON.parse(vendasArmazenadas) : vendas = [];
}
carregarProdutos();
carregarVendas();

function promptProduto(param) {
    return prompt(`Digite ${param} do produto:`);
};

let idProduto = 1;
function addProduto(id, nome, categoria, preco, estoque) {
  if (id && nome && categoria && !isNaN(preco) && (!isNaN(estoque) && estoque > 0)) {
      let produto = {
          id: id,
          nome: nome,
          categoria: categoria,
          preco: preco,
          estoque: estoque
      };
      produtos.push(produto);
      localStorage.setItem('produtos', JSON.stringify(produtos));
      alert('Produto cadastrado com sucesso!');
  } else {
      alert('Entradas incorretas, preencha todos os campos corretamente!');
      return;
  }
}


//funcão onclick
function cadastrarProduto() { 
    let id = idProduto++;
    let nome = promptProduto('o nome',);
    let categoria = promptProduto('a categoria');
    let preco = parseFloat(promptProduto('o preço'));
    let estoque = parseInt(promptProduto('a quantidade em estoque'));

    addProduto(id, nome, categoria, preco, estoque);
};

let idVenda = 1;
function addVenda(id, produto, quantidade, data, total){
  let venda = {
    id: id, 
    produto: produto, 
    quantidade: quantidade, 
    data: data,
    total: total
  };
  vendas.push(venda);
  localStorage.setItem('vendas', JSON.stringify(vendas));
  alert('Venda registrada com sucesso!');
}

 // Função para converter data no formato dd-mm-yyyy para objeto Date----OBS: PEGUEI EMPRESTADO O CODIGO RS
function toDateObj(data) {
  let [dia, mes, ano] = data.split('-').map(Number);
  return new Date(ano, mes - 1, dia); // mes - 1 porque os meses em JavaScript são indexados de 0 a 11
}

//funcão onclick
function registrarVenda() {
  let produtoId = parseInt(promptProduto('o id'));
  let produto = buscarProdutoPorId(produtoId);

  if (!produto) {
      alert(`Erro: produto não encontrado!`);
      return;
  }

  let quantidade = parseInt(promptProduto('a quantidade vendida'));

  if (isNaN(quantidade) || quantidade <= 0 || quantidade > produto.estoque) {
      alert(`Quantidade inválida ou insuficiente em estoque (${produto.estoque} menor que ${quantidade})`);
      return;
  }
  let data = toDateObj(prompt("Digite a data da venda, EXATAMENTE assim (dia-mes-ano):"));
  let id = idVenda++;
  let total = quantidade * produto.preco;
  produto.estoque -= quantidade;

  addVenda(id, produto.nome, quantidade, data, total);
}

//funcão onclick
function atualizarEstoque(){
  let produtoId = parseInt(promptProduto('o id'));
  let produto = buscarProdutoPorId(produtoId);
  
  if(!produto){
    alert(`Erro: produto não encontrado!`);
    return
  };

  let quantidade = parseInt(promptProduto('a quantidade nova do estoque'));

  if(isNaN(quantidade) || quantidade < 0){
    alert(`Quantidade inválida, preencha corretamente!`);
    return
  };
  
  produto.estoque = quantidade;
  alert(`Estoque do ${produto.nome} atualizado com sucesso!`);
};

//funcão onclick
function gerarRelatorioVendas() {
  let dataInicio = toDateObj(prompt("Digite a data de início EXATAMENTE assim (dia-mes-ano):"));
  let dataFim = toDateObj(prompt("Digite a data de fim EXATAMENTE assim (dia-mes-ano):"));

  if (isNaN(dataInicio) || isNaN(dataFim) || dataInicio >= dataFim) {
      alert(`Erro: datas inválidas!`);
      return;
  }

  container.innerHTML = '';

  let filtoVendas = vendas.filter(venda => venda.data >= dataInicio && venda.data <= dataFim);
  let totalVendas = filtoVendas.reduce((total, venda) => total + venda.total, 0);
  let h1 = `<h1 id="titulo-especial">Vendas: R$${totalVendas.toFixed(2)}</h1>`;
  container.insertAdjacentHTML('beforeend', h1);

  filtoVendas.forEach(item => {
      let cardHTML = `
          <div class="card">
              <p class="titulo">${item.produto}</p>
              <p class="texto">id: ${item.id}</p>
              <p class="texto">quantidade: ${item.quantidade}</p>
              <p class="texto">R$ ${item.total.toFixed(2)}</p>
              <p class="texto">data: ${item.data}</p>
          </div>
      `;
      container.insertAdjacentHTML('beforeend', cardHTML);
  });
}

//funcão onclick
function gerarRelatorioEstoque(){
    container.innerHTML = ''; 

    let h1 = `<h1 id="titulo-especial">Produtos: ${produtos.length}</h1>`
    container.insertAdjacentHTML('beforeend', h1);
  
    produtos.map(item => {
        let cardHTML = `
            <div class="card">
                <p class="titulo">${item.nome}</p>
                <p class="texto">id: ${item.id}</p>
                <p class="texto">categoria: ${item.categoria}</p>
                <p class="texto">R$ ${item.preco.toFixed(2)}</p>
                <p class="texto">em estoque: ${item.estoque}</p>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
};

function buscarProdutoPorId(id){
  return produtos.find(produto => produto.id === id);
};

document.getElementById("btn-adicionarProduto").addEventListener("click", cadastrarProduto);
document.getElementById("btn-registrarVenda").addEventListener("click", registrarVenda);
document.getElementById("btn-atualizarEstoque").addEventListener("click", atualizarEstoque);
document.getElementById("btn-relatorioProdutos").addEventListener("click", gerarRelatorioEstoque);
document.getElementById("btn-relatorioVendas").addEventListener("click", gerarRelatorioVendas);
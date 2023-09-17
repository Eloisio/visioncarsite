let list = [];
var vendaObj=null;
let listpd = new Set();
let listprodsel = new Set();
let selectedService = null;
var cliente_TpV = null;
window.onload = function () {
    getProjects();
    getprodutos();
    getvenda();
}

function getProjects() {
    const cliente_EmpresaId = sessionStorage.getItem("cliente_EmpresaId");

    fetch("https://produtoapi.azurewebsites.net/api/Servico/empresa/EmpresaAtiva/" + cliente_EmpresaId)
        .then(response => response.json())
        .then(response => {
            list = response;
            buildTable();
        })
}

function buildTable() {
    document.querySelector("#table-body").innerHTML = '';
    cliente_TpV = sessionStorage.getItem("cliente_tpveiculo");
    list.forEach(el => {
        var valor = 0;
        if (cliente_TpV == "PEQUENO") {
            valor = el.preco;
        } else {
            if (cliente_TpV == "MEDIO") {
                valor = el.precoMD;
            } else {
                if (cliente_TpV == "GRANDE") {
                    valor = el.precoGD;
                } else {
                    if (cliente_TpV == "VAN") {
                        valor = el.precoVAN;
                    } else {
                        if (cliente_TpV == "CAM") {
                            valor = el.precoCAM;
                        }
                    }
                }
            }
        }
        let template = `
        <div class="row card" data-id="${el.id}" onclick="selectService(${el.id})">
        <div class="title-description style="flex-grow: 10;">
            <h6 class="Descricao" style="font-size: 16px;">${el.descricao}</h6> 
        </div>
        <div class="title-preco2 style="flex-grow: 1;">
            <h6 class="preco2" style="font-size: 14px;"> ${valor}</h6> 
        </div>
        
    </div>
        `;
        document.querySelector("#table-body").insertAdjacentHTML("beforeend", template);
    });
}

function getprodutos() {
    const cliente_EmpresaId = sessionStorage.getItem("cliente_EmpresaId");

    fetch("https://produtoapi.azurewebsites.net/api/Produto")
        .then(response => response.json())
        .then(response => {
            listpd = response;
            buildProd();
        })
}

function buildProd() {
    const tableProd = document.querySelector("#table-Prod");
    tableProd.innerHTML = '';
    tableProd.innerHTML = '';
    let template = '';
    if (listprodsel.size > 0) {
        const headerTemplate = `
        <thead>
          <tr>
            <th class="produtos">Produtos Comprados</th>
          </tr>
        </thead>
      `;
        tableProd.insertAdjacentHTML("beforeend", headerTemplate);
    }
    listprodsel.forEach(el => {

        const precoFormatado = parseFloat(el.preco).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        template = `
        <div class="row_card" ">
        <div class="produto-item">
            <div class="Descricaopd">${el.descricao}</div>
            <div class="precopd">${precoFormatado}</div>
        </div>
        </div>
        `;
        tableProd.insertAdjacentHTML("beforeend", template);
    });
}

function getvenda(){
vendaObj=sessionStorage.getItem("ObjVenda");

//selecionar os serviços
//incluir produtos
//calcular 

}

function selectService(serviceId) {
    const selectedCard = document.querySelector(`[data-id="${serviceId}"]`);
    const priceElement = selectedCard.querySelector(".preco2");
    const preco = priceElement.textContent.replace("R$", "");
    const price = parseFloat(preco.replace("R$", ""));
    const desc = selectedCard.querySelector(".Descricao");
    const _desc = desc.textContent;

    if (selectedCard.classList.contains("selected")) {
        selectedCard.classList.remove("selected"); // Se estiver selecionado, remova a classe
        decrementservico(price, _desc);
    } else {
        selectedCard.classList.add("selected"); // Se não estiver selecionado, adicione a classe
        incrementservico(price, _desc);
    }
}

function adicionarAoCarrinho() {
    var modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = '';
    var form = document.createElement('form');
    var groupName = 'produtoSelecionado';
    listpd.forEach(dt => {
        var div = document.createElement('div');
        div.classList.add('form-check');
        var input = document.createElement('input');
        input.type = 'checkbox'; // Altere para 'radio'
        input.classList.add('form-check-input');
        input.value = dt.descricao;
        input.name = groupName; // Use o mesmo nome para todos os botões de rádio
        input.id = dt.descricao; // Defina um id único para cada botão de rádio

        var precoNumerico = parseFloat(dt.preco.replace(',', '.'));
        var precoFormatado = isNaN(precoNumerico) ? 'Preço não disponível' : `R$${precoNumerico.toFixed(2)}`;

        var label = document.createElement('label');
        label.classList.add('form-check-label');
        label.textContent = `${precoFormatado} - ${dt.descricao}`;
        label.setAttribute('for', dt.descricao); // Associe o label ao id do checkbox

        div.appendChild(input);
        div.appendChild(label);
        form.appendChild(div);
    });
    modalBody.appendChild(form);
    $('#myModal').modal('show');
}

let valorServicos = 0;
let valorCaixinha = 0;
let descricao = "";

function updateValores() {
    const valorTotal = valorServicos + valorCaixinha;
    document.getElementById("valor-servicos").textContent = `R$${valorServicos.toFixed(2)}`;
    document.getElementById("valor-caixinha").textContent = `R$${valorCaixinha.toFixed(2)}`;
    document.getElementById("valor-total").textContent = `R$${valorTotal.toFixed(2)}`;
    // document.getElementById("descserv_").textContent = `${descricao}`;
}

function incrementservico(valor, desc) {
    valorServicos += valor;
    if (descricao != "") descricao += "/";
    descricao += desc;
    updateValores();
}

function incrementproduto(valor, desc) {
    valorServicos += valor;
    if (descricao != "") descricao += "/";
    descricao += desc;
    updateValores();
}

function decrementservico(valor, desc) {
    valorServicos -= valor;

    descricao = descricao.replace("/" + desc, "");
    updateValores();
}

function incrementCaixinha(valor) {
    valorCaixinha += valor;
    updateValores();
}

function decrementCaixinha(valor) {
    if (valorCaixinha >= valor) {
        valorCaixinha -= valor;
        updateValores();
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const cliente_veiculo = sessionStorage.getItem("cliente_veiculo");
    const venda_id = sessionStorage.getItem("idVenda");
    const cliente_EmpresaId = sessionStorage.getItem("cliente_EmpresaId");
    const cliente_Placa = sessionStorage.getItem("cliente_placa");
    document.getElementById('produtos').style.display = 'nome';
    document.getElementById("confirmarSelecao").addEventListener("click", function () {
        var selectedprodutos = document.querySelectorAll('input[name="produtoSelecionado"]:checked');

        if (selectedprodutos.length > 0) {
            selectedprodutos.forEach(selectedproduto => {
                produtoSelecionadoNome = selectedproduto.value;

                listpd.forEach(dt => {
                    if (dt.descricao === produtoSelecionadoNome && dt.ativo) {
                        listprodsel.add(dt);
                        const priceElement = dt.preco;
                        const price = parseFloat(priceElement.replace("R$", ""));
                        incrementproduto(price, dt.descricao);
                    }
                });

            });

            $('#myModal').modal('hide');
            buildProd();

        } else {
            alert("Nenhum veículo selecionado.");
        }
    });
    document.getElementById("concluir-button").addEventListener("click", () => {
        // Obter o valor do elemento e converter para decimal
        const valorTotalText = document.getElementById("valor-total").textContent;
        const valorTotalDecimal = parseFloat(valorTotalText.replace("R$", "").replace(",", "."));
        const valorTotalcaixinha = document.getElementById("valor-caixinha").textContent;
        const valorTotalcaixinhaDecimal = parseFloat(valorTotalcaixinha.replace("R$", "").replace(",", "."));
        const dataAtual = new Date().toISOString();

        const radioDinheiro = document.querySelector('input[value="dinheiro"]');
        const radioCartao = document.querySelector('input[value="cartao"]');
        const radioPix = document.querySelector('input[value="pix"]');
        
        const x = venda_id;

        if (descricao != "" && (radioCartao.checked) || radioDinheiro.checked || radioPix.checked) {
            let payload = {
                "id": 0,
                "idEmpresa": cliente_EmpresaId,
                "idCliente": 0, //pegar id cliente
                "valor": valorTotalDecimal,
                "caixinha": valorTotalcaixinhaDecimal,
                "inicio": dataAtual,
                "fim": "2001-01-01",
                "data": dataAtual,
                "pago": false,
                "avisarCliente": false,
                "excluido": false,
                "observacao": "",
                "descricao": descricao,
                "placa": cliente_Placa,
                "tipoPgto": radioCartao.checked ? 2 : radioDinheiro.checked ? 1 : 3,
                "avaliacao": "",
                "avaliacaoDescricao": "",
                "celular": "",
                "veiculo": cliente_veiculo
            }
            fetch("https://produtoapi.azurewebsites.net/api/venda", {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => response.json())
                .then(data => {
                    sessionStorage.setItem("idVenda", data.id);
                    sessionStorage.getItem("Venda_carro", cliente_veiculo);
                    sessionStorage.getItem("Venda_tipoVeiculo", cliente_TpV);
                    const redirectTo = `avaliacao.html`;
                    window.location.href = redirectTo;
                })
        } else {
            var msg = "Selecione um serviço!!!";
            if ((descricao != "") && (!radioCartao.checked && !radioDinheiro.checked && !radioPix.checked)) {
                msg = "Selecione uma forma de Pagamento!!!";
            }
            Swal.fire({
                title: 'Ops!',
                text: msg,
                icon: 'alert',
                confirmButtonText: 'Ok!'
            })
        }
    });
});
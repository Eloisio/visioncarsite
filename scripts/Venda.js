// Pega os parametros da URL
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

// Type: 'create' | 'edit'
const screenType = params.id ? 'edit' : 'create';

function createOrEdit() {
    // Inicia a massa de dados (payload)
    
    let payload = {
        descricao: document.querySelector("#Venda").value,
        preco: document.querySelector("#Tipo").value,
    }
    // Enviar para API
    
    console.log("Payload:", payload);
    // Enviar para API
    fetch("https://produtoapi.azurewebsites.net/api/venda", {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(response => {
            Swal.fire({
                title: 'Bom Trabalho!',
                text: "Produto Cadastrado com sucesso!",
                icon: 'success',
                confirmButtonText: 'Ok!'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.setItem("Descricao", response.Nome);
                    localStorage.setItem("Preco", response.email);
                    localStorage.setItem("Ativo", response.id);
                    location.reload();
                }
            })
        })
}

window.onload = function () {
    setScreenTypeTexts();
    fillInputs();
}


function setScreenTypeTexts() {
    // MODO CRIAR
    if (screenType == 'create') {
        document.querySelector('#main-title').innerText = "Vamos cadastrar seu veiculo!";
        document.querySelector('#tipo-title').innerText = "Selecione o tamanho de seu veiculo!";
        document.querySelector('#action-button').innerText = "Proxima Etapa";
    }
}
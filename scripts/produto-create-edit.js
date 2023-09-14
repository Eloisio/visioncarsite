// Pega os parametros da URL
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

// Type: 'create' | 'edit'
const screenType = params.id ? 'edit' : 'create';

function createOrEdit() {
    // Inicia a massa de dados (payload)
    let payload = {
        descricao: document.querySelector("#Descricao").value,
        preco: document.querySelector("#preco").value,
    }

    // Enviar para API
    console.log("Payload:", payload);
    // Enviar para API
    fetch("https://produtoapi.azurewebsites.net/api/produto", {
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

function fillInputs() {
    if (screenType === 'edit') {
        fetch(`https://622cd1e6087e0e041e147214.mockapi.io/api/projects/${params.id}`)
            .then(response => response.json())
            .then(project => {
                document.querySelector("#title").value = project.title;
                document.querySelector("#totalCost").value = project.totalCost;
                document.querySelector("#description").value = project.description;
            })
    }
}

function setScreenTypeTexts() {
    // MODO CRIAR
    if (screenType == 'create') {
        document.querySelector('#main-title').innerText = "Vamos cadastrar um novo produto!";
        document.querySelector('#action-button').innerText = "Cadastrar";
    }

    // MODO EDITAR
    if (screenType == 'edit') {
        document.querySelector('#main-title').innerText = "Editar projeto";
        document.querySelector('#action-button').innerText = "Salvar";
    }
}
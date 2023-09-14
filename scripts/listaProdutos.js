let list = [];

window.onload = function () {
    getProjects();
}

function getProjects() {
    fetch("https://produtoapi.azurewebsites.net/api/Produto/Empresa/1")
        .then(response => response.json())
        .then(response => {
            list = response;
            buildTable();
        })
}

function goToEdit(id) {
    window.location.href = `produto-create-edit.html?id=${id}`;
}

function deleteProject(id) {
    fetch(`https://622cd1e6087e0e041e147214.mockapi.io/api/projects/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(response => {
            list = list.filter(project => project.id != id);

            buildTable();
        })
}

function buildTable() {
    document.querySelector("#table-body").innerHTML = '';
    const idClient = localStorage.getItem('idEmpresa');

    //list = list.filter(el => el.idEmpresa === idEmpresa);

    list.forEach(el => {
        
        let template = `
            <div class="row">
                <div class="title-description">
                    <h6 class="Descricao">${el.descricao}</h6> 
                </div>
                <div class="preco">R$ ${el.preco}</div>
                <div class="ativo"> 
                ${el.ativo ? '<i class="icon-active material-icons">check_circle</i>' : '<i class="icon-inactive material-icons">cancel</i>'}
                </div>
                <div class="actions">
                    <span class="edit material-icons" onclick="goToEdit(${el.id})">edit</span>
                    <span class="delete material-icons" onclick="deleteProject(${el.id})">delete_outline</span>
                </div>
            </div>
        `
        document.querySelector("#table-body").insertAdjacentHTML("beforeend", template)
    });
}
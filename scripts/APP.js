const init = () => {
    const validateEmail = (event) => {
        const input = event.currentTarget;
        const emailTest = input.value.includes("@");
        if (!emailTest) {
            submitButton.setAttribute("disabled", "disabled");
            input.nextElementSibling.classList.add('error');
        } else {
            submitButton.removeAttribute("disabled");
            input.nextElementSibling.classList.remove('error');
        }
    }

    const validatePassowrd = (event) => {
        const input = event.currentTarget;

        if (input.value.length < 4) {
            submitButton.setAttribute("disabled", "disabled");
            input.nextElementSibling.classList.add('error');
        } else {
            submitButton.removeAttribute("disabled");
            input.nextElementSibling.classList.remove('error');
        }
    }

    const inputEmail = document.querySelector('input[type="email"]');
    const inputPassword = document.querySelector('input[type="password"]');
    const submitButton = document.querySelector('.login__submit');

    inputEmail.addEventListener('input', validateEmail);
    inputPassword.addEventListener('input', validatePassowrd);

    const errorHandler = () => {
        submitButton.classList.remove('loading');
        submitButton.classList.remove('success');
        submitButton.classList.add('error');
        submitButton.textContent = "Error :(";
    }

    const successHandler = () => {
        submitButton.classList.remove('loading');
        submitButton.classList.remove('error');
        submitButton.classList.add('success');
        submitButton.textContent = "Sent! :)";
    }
    function baixarArquivo() {
        const urlDoArquivo = "http://www.camposevolution.com/VisionCar.apk";
        fetch(urlDoArquivo)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao baixar o arquivo');
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'VisionCar.apk'; // Defina o nome do arquivo para o download
                link.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }
    if (submitButton) {

        submitButton.addEventListener('click', (event) => {
            event.preventDefault();

            submitButton.textContent = "Loading...";
                        fetch("https://produtoapi.azurewebsites.net/api/Users/login/"+ inputEmail.value )
            .then(response => response.json())
            .then(response => {
                if (inputPassword.value === response.senha) {
                    baixarArquivo();
                } else {
                    const msgElement = document.getElementById("msg");
                    msgElement.textContent = "Usuario não Cadastrado";
                }
            })

        })
    }
}

window.onload = init;
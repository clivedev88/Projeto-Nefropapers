document.addEventListener('DOMContentLoaded', () =>{

    /* Variaveis da tela de Login */
    const container = document.querySelector('.container')
    const loginForm = document.querySelector('#form')
    const loginEmail = document.querySelector('#inputEmail')
    const loginPass = document.querySelector('#inputPass')
    const loginPassIcon = document.querySelector('.showPass')
    const loginCheck = document.querySelector('#inputCheck')
    const lembrarSenha = document.querySelector('#forgotPass')
    const loginButton = document.querySelector('#loginButton')
    const loginGoogle = document.querySelector('#hrefGoogle')
    const loginMeta = document.querySelector('#hrefMeta')
    const loginFirst = document.querySelector('#firstHref')

    /* Variaveis da rela de Cadastro */ 

    const section3 = document.querySelector('.registration')
    const formRegist = document.querySelector('#form-Regist')
    const userName = document.querySelector('#name')
    const passName = document.querySelector('#senha')
    const passIcon = document.querySelector('.mostarSenha')
    const passConfirIcon = document.querySelector('.confirSenha')
    const passNameConfirmation = document.querySelector("#confirmaçaoSenha")
    const registEmail = document.querySelector('#Email')
    const registButton = document.querySelector('#cadastro')
    const logar = document.querySelector('#hrefLogar')
    const divMessage = document.querySelector('#Error')

    /* variaveis para recuperar senha */

    const section2 = document.querySelector('.section-recover')
    const recoverInput = document.querySelector('#recoverPassword')
    const recoverButton = document.querySelector('#recoverEmail')
    const recoverHref = document.querySelector('#hrefRemenber')
    const body = document.querySelector('body')


    /* variaveis da section de create-question / historico */
    // const sectionCreatQuestion = document.querySelector('.create-question')
    const editBtn = document.querySelector('.createBack')
    const editHistBtn = document.getElementById('historico')
    const histBack = document.querySelector('.histrBack')
    const starsRating = document.querySelectorAll('.stars')
    const heartRating = document.querySelectorAll('.iconHeart')
   


document.addEventListener('DOMContentLoaded', () => {
    const registButton = document.getElementById('registButton');
    
    if (registButton) {
        registButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (checkInputs()) {
                const nome = userName.value.trim();
                const email = registEmail.value.trim();
                const senha = passName.value.trim();
                cadastrarUsuario(nome, email, senha);
            }
        });
    } else {
        console.error('O botão de registro não foi encontrado no DOM.');
    }});


    passIcon.addEventListener('click', () =>{
        togglePassword(passName, passIcon)
    })
    passConfirIcon.addEventListener('click', () => {
        togglePassword(passNameConfirmation, passConfirIcon)
    })
    loginPassIcon.addEventListener('click', () =>{
        togglePassword(loginPass, loginPassIcon)
    })


    // const sectionCreatQuestion = document.querySelector('.create-question');

    // if (sectionCreatQuestion) {

    //     editBtn.addEventListener('click', () => {
    //         container.style.display = 'flex';
    //         sectionCreatQuestion.style.display = 'none';
    //     });

    //     histBack.addEventListener('click', () => {
    //         sectionCreatQuestion.style.display = 'flex';
    //         editHistBtn.style.display = 'none';
    //     });

    //     newQuestion.addEventListener('click', function (e) {
    //         e.preventDefault();
    //         homeUser.style.display = 'none';
    //         sectionCreatQuestion.style.display = 'flex';
    //     });
    // } else {
    //     console.error("A seção 'create-question' não foi encontrada no DOM.");
    // }

    let modulosSelecionados = [];


    const sectionCreatQuestion = document.querySelector('.create-question');

    if (sectionCreatQuestion) {
        const editBtn = document.querySelector('.createBack');
        const histBack = document.querySelector('.histrBack');
        const newQuestion = document.querySelector('.newQuestion');
        const saveBtn = document.querySelector('.saveBtn button');
    

        // saveBtn.addEventListener('click', (e) => {
        //     e.preventDefault();
        //     criarQuestao();
        // });

        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            criarQuestao(modulosSelecionados);
        });

    
        // NAVEGAÇÃO
        
        editBtn.addEventListener('click', () => {
            container.style.display = 'flex';
            sectionCreatQuestion.style.display = 'none';
        });
    
        histBack.addEventListener('click', () => {
            sectionCreatQuestion.style.display = 'flex';
            editHistBtn.style.display = 'none';
        });

    
        newQuestion.addEventListener('click', function (e) {
            e.preventDefault();
            homeUser.style.display = 'none';
            sectionCreatQuestion.style.display = 'flex';
        });
    } else {
        console.error("A seção 'create-question' não foi encontrada no DOM.");
    }
    


    logar.addEventListener('click', (e) =>{
        e.preventDefault();    
        section3.style.display = 'none'
        container.style.display = 'flex'
    
    })
    
    loginFirst.addEventListener('click', (e) => {
        e.preventDefault()
        container.style.display = 'none'
        section3.style.display = 'flex'
    })  
    

    lembrarSenha.addEventListener('click', (e) => {
        e.preventDefault();

        container.style.display = 'none'
        section2.style.display = 'flex'
        
    })

    recoverHref.addEventListener('click', (e) =>{
        e.preventDefault();

        section2.style.display = 'none'
        container.style.display = 'flex'
    })


    // Processa o login
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        const email = document.querySelector('#inputEmail').value.trim();
        const senha = document.querySelector('#inputPass').value.trim();

        if (email === '' || senha === '') {
            alert('Por favor, preencha seu e-mail e senha.');
            return;
        }

        console.log("Tentando login com email:", email); 
        loginUsuario(email, senha);
    });


    /* transiçao da tela inicial */
    
    window.onload = function () {
        setTimeout(function () {
            const mainContainer = document.getElementById('main_container');
            const inputScreen = document.getElementById('inputScreen');

            console.log("Iniciando a transição da tela de entrada...");

            mainContainer.style.display = 'flex'; 
            mainContainer.style.opacity = 0; 

            inputScreen.style.transition = 'opacity 0.5s ease-out';
            inputScreen.style.opacity = 0; 

            setTimeout(() => {
                inputScreen.style.display = 'none'; 
                console.log("Tela de entrada ocultada.");
                
                mainContainer.style.transition = 'opacity 0.5s ease-out';
                mainContainer.style.opacity = 1; 
                console.log("Tela principal exibida.");
            }, 500); 
        }, 500); 
    };


    function login() {
        // debugger
        const loginEmailValue = loginEmail.value.trim();
        const loginPassValue = loginPass.value.trim();

        if (loginEmailValue === "" || loginPassValue === "") {
            alert('Campos obrigatórios');
        } else {
            // container.style.display = 'none'
            // userHome.style.display = 'flex'

        }
    }


    function checkInputs() {
        const userNameValue = userName.value.trim();
        const passNameValue = passName.value.trim();
        const passNameConfirmationValue = passNameConfirmation.value.trim();
        const registEmailValue = registEmail.value.trim();
        
        let error = false;
        divMessage.innerHTML = ''; 

        // CAMPOS OBRIGATÓRIOS
        if (userNameValue === "" || passNameValue === "" || passNameConfirmationValue === "" || registEmailValue === "") {
            const message = document.createElement('p');
            message.textContent = 'Campos obrigatórios';
            divMessage.appendChild(message);
            formRegist.classList.add('error');
            error = true;
        } else{
            formRegist.classList.remove('error')
        }

        // VALIDAR NOME

        if(userNameValue === ""){
            const message = document.createElement('p')
            message.textContent = 'Insira seu nome completo.'
            divMessage.appendChild(message)
            formRegist.classList.add('error')
            error = true;
            return

        }else if(userNameValue.length < 10){
            const message = document.createElement('p')
            message.textContent = 'O nome tem que ter no mínimo 10 caracteres.'
            divMessage.appendChild(message)
            formRegist.classList.add('error')
            error = true;
            return
        }else{
            formRegist.classList.remove('error')
            error = false
        }


        // VALIDAR SENHA

        if(passNameValue === "" ){
            const message = document.createElement('p')
            message.textContent = 'Insira sua senha.'
            divMessage.appendChild(message)
            formRegist.classList.add('error')
            error = true;
            return

        }else if(passNameValue.length < 8){
            const message = document.createElement('p')
            message.textContent = 'A senha tem que ter no mínimo 8 caracteres.'
            divMessage.appendChild(message)
            formRegist.classList.add('error')
            error = true;
            return
        }else{
            formRegist.classList.remove('error')
            error = false
        }


        // VERIFICAÇÃO IGUALDADE DE SENHAS
        if (passNameConfirmationValue !== passNameValue) {
            const message = document.createElement('p');
            message.textContent = 'As senhas não conferem.';
            divMessage.appendChild(message);
            formRegist.classList.add('error');
            error = true;
        }

        // VALIDAR EMAIL
        if (!validEmail(registEmailValue)) {
            const message = document.createElement('p');
            message.textContent = 'Email inválido, tente novamente.';
            divMessage.appendChild(message);
            formRegist.classList.add('error');
            error = true;
        }

        return !error;
    }

    function validEmail(email){

            const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
            return regexEmail.test(email);
    }

    function togglePassword(input, icon) {

        if (input.type === "password") {
            input.type = "text"
            icon.querySelector('i').classList.add('fa-eye-slash')
        } else {
            input.type = "password"
            icon.querySelector('i').classList.remove('fa-eye-slash')
        }
    }

})


    const config = document.querySelector('.iconConfig'); 
    const popUser = document.querySelector('.popUpUser'); 
    const home = document.querySelector('.userHome')
    // const overlay = document.querySelector('.overlay');

    const overlayForms = document.querySelector('.overlay');
    
    config.addEventListener('click', popUpOpen);
    
    
    function popUpOpen() {
        const Visible = popUser.style.display === 'flex';
        popUser.style.display = Visible ? 'none' : 'flex'; 
        overlayForms.style.display = Visible ? 'none' : 'block';
    
    }
    
    
    const newQuestion = document.querySelector(".newQuestion")
    const newtest = document.querySelector(".newtest")
    const homeUser = document.querySelector('.userHome')
    
    document.addEventListener('click', function(event) {
    
        if (!popUser.contains(event.target) && !config.contains(event.target)) {
            popUser.style.display = 'none';
            overlayForms.style.display = 'none'; 
    
        }
    });
    document.querySelector('.creationIcon').addEventListener('click', function() {
        const modal = document.querySelector('.modalCreate');
        modal.classList.toggle('show');
    });
    
    document.addEventListener('click', function(event) {
        const modal = document.querySelector('.modalCreate');
        const icon = document.querySelector('.creationIcon');
        
        if (!modal.contains(event.target) && !icon.contains(event.target)) {
            modal.classList.remove('show');
        }
    });
    
   
    const verTodosBtn = document.querySelector('.verTodosBtn');
    if (verTodosBtn) {
        verTodosBtn.addEventListener('click', mostrarTodosTestes);
    }

// EXIBIR A LISTA DE MÓDULOS


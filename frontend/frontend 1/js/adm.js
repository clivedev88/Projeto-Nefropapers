const questions = {
    questoes: "",
    respostas: ["", "", "", "", ""],
    correta: null,
    explicaçao: ""
}

const textArea = document.getElementById('textQuest')
const questionInput = document.querySelectorAll('.input-question input')
const questionSaveBtn = document.querySelector('.saveBtn button')
const explicationText = document.querySelector('.explication-text')
const switchCheck = document.querySelectorAll('.switch input')
const divError = document.getElementById('msgError')


const btnGabarito = document.querySelector('.gab-btn1')
const btnImagen = document.querySelector('.gab-btn2')
const modal = document.querySelector('.modal')
// const overlay = document.querySelector('.overlay')
const uploadImg = document.querySelector('.uploadImg')
const editQuestion = document.querySelector(".edit-questao")
const filterQuestion = document.querySelector('.filter-question')
const divQuestions = document.querySelector('.questions')
const subSection = document.querySelector(".subSection")
const questionContainer = document.querySelector(".questionContainer")

const overlayAdm = document.querySelector('.overlay');


function Questao() {
    questions.questoes = textArea.value
    questionInput.forEach((input, index) => {
        questions.respostas[index] = input.value
    });
    questions.explicaçao = explicationText.value

}

function respostaCorreta() {
    switchCheck.forEach((switch_, index)  => {
        switch_.addEventListener('change', ()=>{
            if(switch_.checked){
                questions.correta= index

                switchCheck.forEach((restSwitch, restIndex) => {
                    if(restIndex !== index) restSwitch.checked = false
                })
            }else{
                questions.correta = null
            }
        })
    })
}

function validQuestion() {
    if(questions.questoes.trim() === ''){
        messageError('Por favor, insira o enuciado da questão.')
        return false
    }
    if(questions.respostas.some( correta => correta.trim() === "")){
        messageError('Preencha todas as opções de respostas.')
        return false
    }
    if(questions.correta === null){
        messageError('Selecione a reposta correta.')
        return false
    }
    return true
}

function messageError(message){
    divError.textContent = message;
    divError.style.display = 'block'
    setTimeout(() => {
        divError.style.display = 'none'
    }, 3000)
}

questionSaveBtn.addEventListener('click', () =>{
    Questao()
    if(validQuestion()){
        console.log('pergunta salva:', questions)

        messageError('pergunta salva com sucesso')
    }
})

respostaCorreta();

btnGabarito.addEventListener('click', function(event){
    event.preventDefault()

    editQuestion.style.display = 'none'
    divQuestions.style.display = 'none'
    filterQuestion.style.display = 'none'
    questionContainer.style.display = 'none'
    subSection.style.display = 'flex'


})
btnImagen.addEventListener('click', togglePopup)
overlayAdm.addEventListener('click', togglePopup)
uploadImg.addEventListener('click', togglePopup)

function togglePopup() {
    const isVisible = modal.style.display === 'flex';
    modal.style.display = isVisible ? 'none' : 'flex';
    overlay.style.display = isVisible ? 'none' : 'block';
}

modal.addEventListener('click', function(event){
    if(event.target === modal || event.target.classList.contains('overlay')) {
        togglePopup()
    }
})


function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function toggleModal() {
    // const modal = document.querySelector('.modalCreate');
    // modal.classList.toggle('show');
}

document.querySelector('.icon-tests').addEventListener('click', function() {
    document.querySelector('.userHome').style.display = 'none';
    document.querySelector('.all-tests').style.display = 'flex';
});

// REDIRECIONAR PARA NOVO TESTE
document.querySelector('.newTest').addEventListener('click', function() {
    window.location.href = 'frontend/frontend%202/fazer_teste.html';
});
// REDIRECIONAR PARA NOVA QUESTÃO
document.querySelector('.newQuestion').addEventListener('click', function() {

    document.querySelector('.userHome').style.display = 'none';
    document.querySelector('.all-tests').style.display = 'none';

    document.querySelector('.create-question').style.display = 'flex';
});

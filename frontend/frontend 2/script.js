function toggleExpand(element) {
    const questionItem = element.parentElement; // Acessa a questão principal
    const expandedContent = questionItem.nextElementSibling; // Seleciona o conteúdo para expandir

    questionItem.classList.toggle('expanded'); // Adiciona a classe 'expanded' para girar a seta

    if (expandedContent.style.maxHeight) {
        expandedContent.style.maxHeight = null;
        expandedContent.style.opacity = 0;
    } else {
        expandedContent.style.maxHeight = expandedContent.scrollHeight + 'px';
        expandedContent.style.opacity = 1;
    }
}

// Função editar texto
document.getElementById('edit-icon').addEventListener('click', function() {
    const nomeTeste = document.getElementById('nome-teste');
    const isEditable = nomeTeste.contentEditable === "true";

    nomeTeste.contentEditable = !isEditable;
    nomeTeste.focus();
    this.textContent = isEditable ? 'edit' : '✔️'; // Troca ícone entre editar e confirmar
});

// Função Pop-up
const testsButton = document.querySelector('.tests-button');
const popupQuestion = document.getElementById('popup');

const backButton = document.querySelector('.back-button');
backButton.addEventListener('click', () => {
    // Ocultar as páginas e mostrar a seção userHome
    // document.getElementById('inputScreen').style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.userHome').style.display = 'flex';  // Mostra a seção userHome
});


testsButton.addEventListener('click', () => {
    popupQuestion.style.display = 'flex'; 
});

popupQuestion.addEventListener('click', (e) => {
    if (e.target === popupQuestion) {
        popupQuestion.style.display = 'none'; 
    }
});

// Função de busca
document.getElementById('search-input').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase();
    const questions = document.querySelectorAll('.question-item');

    questions.forEach(function(question) {
        const questionText = question.querySelector('h3').textContent.toLowerCase();
        if (questionText.includes(searchValue)) {
            question.style.display = 'block'; // Mostra a questão
        } else {
            question.style.display = 'none';  // Esconde a questão
        }
    });
});


// Seleciona os elementos
const editIcon = document.getElementById('edit-icon-img');
const imageUpload = document.getElementById('imageUpload');
const testImage = document.getElementById('testImage');

// Quando o ícone de edição for clicado, abre o seletor de arquivos
editIcon.addEventListener('click', function() {
    imageUpload.click(); // Aciona o input do tipo file
});

// Quando o usuário selecionar um arquivo
imageUpload.addEventListener('change', function(event) {
    const file = event.target.files[0]; // Pega o arquivo selecionado

    // Verifica se o arquivo é uma imagem
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        // Quando o arquivo for carregado, substitui a imagem atual
        reader.onload = function(e) {
            testImage.src = e.target.result; // Define a nova imagem
        }

        reader.readAsDataURL(file); // Lê o arquivo da imagem e o transforma em base64
    } else {
        alert('Por favor, selecione um arquivo de imagem válido.');
    }
});


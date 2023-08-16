var dadosObjetivos = JSON.parse(localStorage.getItem("dadosObjetivos")) || [];
let gastosLista = JSON.parse(localStorage.getItem('gastosLista')) || [];
let fontesRenda = JSON.parse(localStorage.getItem("fontesRenda")) || [];

//Função para gerar Unique User ID - UUID
function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  }  

//FORM GASTOS
document.getElementById("gastosSubmit").addEventListener('click', (event) => {
  event.preventDefault();

  const gastoNome = document.querySelector('#gastoNome').value;
  const gastoValor = document.querySelector('#gastoValor').value;
  const gastoTipo = document.querySelector('#gastoTipo').value;

  if (gastoNome && gastoValor && gastoTipo) {
    const gasto = {
      id: generateUUID(),
      nome: gastoNome,
      valor: gastoValor,
      tipo: gastoTipo,
    };

    gastosLista.push(gasto);
    localStorage.setItem('gastosLista', JSON.stringify(gastosLista));

    document.querySelector('#gastoNome').value = '';
    document.querySelector('#gastoValor').value = '';
    document.querySelector('#gastoTipo').value = '';

    // Exibir mensagem de sucesso ou fazer outra ação desejada aqui
    alert('Gasto adicionado com sucesso!');
  } else {
    // Exibir mensagem de erro ou fazer outra ação desejada aqui
    alert('Por favor, preencha todos os campos do formulário.');
  }
});


if (Object.keys(usuarioCorrente).length === 0) {
  loggedIn = false;
}
if (loggedIn) {
  document.getElementById("loginHeader").style.display = "none";
  $('#gastosLink').removeClass('disabilitado')
  $('#loginLink').addClass('disabilitado')
} else {
  document.getElementById("gastosHeader").style.display = "none";
  //document.getElementById("fotoUser").style.display = "none";
  $('#gastosLink').addClass('disabilitado')
  $('#loginLink').removeClass('disabilitado')
};

//SLIDER
let periodoInput = 5; // Valor padrão para o período
const valorSliderElement = document.getElementById("valorSlider");

$(function() {
  // Inicializa o slider
  $("#slider").slider({
    range: "min",
    min: 1,
    max: 100,
    value: periodoInput,
    slide: function(event, ui) {
      periodoInput = ui.value; // Atualiza o valor do período
      valorSliderElement.textContent = periodoInput; // Atualiza o elemento com o valor atual do slider
    }
  });
  
  valorSliderElement.textContent = periodoInput;
});

function atualizaFormularioRenda(){
  document.getElementById('salario').value = fontesRenda[0].salario;
  document.getElementById('bonificacoes').value = fontesRenda[0].bonificacoes;
  document.getElementById('extra').value = fontesRenda[0].horaExtra;
  document.getElementById('freelancing').value = fontesRenda[0].freelancing;
}

document.getElementById("submitRenda").addEventListener("click",function(){
  let salario = document.getElementById('salario').value;
  let bonificacoes = document.getElementById('bonificacoes').value;
  let horaExtra = document.getElementById('extra').value;
  let freelancing = document.getElementById('freelancing').value;
  if(salario == '') salario = 0;
  if(bonificacoes == '') bonificacoes = 0;
  if(horaExtra == '') horaExtra = 0;
  if(freelancing == '') freelancing = 0;
  const renda = {
    salario: salario,
    bonificacoes: bonificacoes,
    horaExtra: horaExtra,
    freelancing: freelancing
  };

  if (fontesRenda.length > 0) {
    // Se já existir um conjunto de dados, substitui pelo novo
    fontesRenda[0] = renda;
  } else {
    // Se não existir nenhum dado, adiciona o novo conjunto
    fontesRenda.push(renda);
  }

  localStorage.setItem("fontesRenda", JSON.stringify(fontesRenda));

  alert("Dados adicionados com sucesso!");
  atualizaFormularioRenda();
})

document.getElementById("orcamentoSubmit").addEventListener("click",function(){
  let modo = document.getElementById('escolhaModo').value
  if(modo == 1){
    if (document.getElementById('valorOrcamento').value == ''){
      alert("Digite um valor para seu orçamento antes!");
    }else if (document.getElementById('metaF').value == '') {
      alert("Digite um valor para a meta financeira antes!");
    }else{
      var objetivos = {
        valorOrcamento: document.getElementById("valorOrcamento").value,
        metaFinanceira: document.getElementById("metaF").value,
        tempo: periodoInput,
        modo: 1,
        valorFixoTipo: 0
      }
      alert("Dados cadastrados com sucesso!");

      if (dadosObjetivos.length > 0) {
        dadosObjetivos[0] = objetivos;
      } else {
        dadosObjetivos.push(objetivos);
      }
    
      localStorage.setItem("dadosObjetivos", JSON.stringify(dadosObjetivos));
    }
  }
  if(modo == 2){
    if (document.getElementById('valorFixo').value == ''){
      alert("Digite o quanto quer poupar antes!");
    }else if (document.getElementById('metaF').value == '') {
      alert("Digite um valor para a meta financeira antes!");
    }else{
      var objetivos = {
        valorOrcamento: document.getElementById("valorFixo").value,
        metaFinanceira: document.getElementById("metaF").value,
        tempo: periodoInput,
        modo: 2,
        valorFixoTipo: document.getElementById('valorFixoEscolha').value
      }
      alert("Dados cadastrados com sucesso!");

      if (dadosObjetivos.length > 0) {
        dadosObjetivos[0] = objetivos;
      } else {
        dadosObjetivos.push(objetivos);
      }
    
      localStorage.setItem("dadosObjetivos", JSON.stringify(dadosObjetivos));
    }
  }
})


function atualizaFormularioOrcamento(){
  document.getElementById("valorOrcamento").value = dadosObjetivos[0].valorOrcamento;
  document.getElementById("metaF").value = dadosObjetivos[0].metaFinanceira;
  periodoInput = dadosObjetivos[0].tempo;
}

document.getElementById('escolherOrcamento').style.display = "block";
document.getElementById('escolherValorFixo').style.display = "none";
document.getElementById('escolhaModo').value = 1;

window.addEventListener('load', () => {  
  if (dadosObjetivos.length > 0 && loggedIn){
    atualizaFormularioOrcamento();
  }
  if (fontesRenda.length > 0 && loggedIn){
    atualizaFormularioRenda();
  }
    //Função para o orçamento mensal
    if (dadosObjetivos.length > 0 && loggedIn){
      if(dadosObjetivos[0].modo == 2){
        document.getElementById('escolherOrcamento').style.display = "none";
        document.getElementById('escolherValorFixo').style.display = "block";
        document.getElementById('escolhaModo').value = 2;
        document.getElementById('valorFixo').value = dadosObjetivos[0].valorOrcamento
        document.getElementById("metaF").value = dadosObjetivos[0].metaFinanceira;
        document.getElementById("valorFixoEscolha").value = dadosObjetivos[0].valorFixoTipo
      }else{
        document.getElementById("valorOrcamento").value = dadosObjetivos[0].valorOrcamento;
        document.getElementById("metaF").value = dadosObjetivos[0].metaFinanceira;
        document.getElementById('escolhaModo').value = 1;
      }
    };
    
      //CODIGO PARA INPUTS DE VALORES NUMERICOS SÓ ACEITAREM NUMEROS
      const numericInputs = document.querySelectorAll("[inputmode='numeric']");
  
      numericInputs.forEach((input) => {
        validateInput(input);
      });
      
      function validateInput(el) {
        el.addEventListener("beforeinput", function (e) {
          let beforeValue = el.value;
          e.target.addEventListener(
            "input",
            function () {
              if (el.validity.patternMismatch || containsMultipleDots(el.value)) {
                el.value = beforeValue;
              }
            },
            { once: true }
          );
        });
      }
      
      function containsMultipleDots(value) {
        const dotCount = value.split(".").length - 1;
        return dotCount > 1;
      }
      
    //-------------------------------------------------------------------
    document.getElementById('escolhaModo').addEventListener("change", function(){
      var escolhaModo = document.getElementById('escolhaModo').value;
    
      if (escolhaModo == 1) {
        document.getElementById('escolherOrcamento').style.display = "block";
        document.getElementById('escolherValorFixo').style.display = "none";
      } else {
        document.getElementById('escolherOrcamento').style.display = "none";
        document.getElementById('escolherValorFixo').style.display = "flex";
        
      }
    });
})
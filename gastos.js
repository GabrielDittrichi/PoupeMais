if (!(JSON.parse(localStorage.getItem('gastosLista'))) || !(JSON.parse(localStorage.getItem('fontesRenda'))) || !(JSON.parse(localStorage.getItem('dadosObjetivos')))) {
    document.getElementById('aviso').style.display = "block";
} else {
    document.getElementById('aviso').style.display = "none";
}

function carregaGastos() {
    const gastos = JSON.parse(localStorage.getItem('gastosLista')) || [
        {
            "id": "0c8426bc-cd56-42a7-9315-47409f404f95",
            "nome": "Seu primeiro gasto!",
            "valor": "123",
            "tipo": "Teste"
        },
        {
            "id": "fb54f556-073c-4424-bd8d-4d81d1fa3cf5",
            "nome": "Seu segundo gasto!",
            "valor": "35",
            "tipo": "Teste 2"
        },
        {
            "id": "f446914d-587f-4bb7-b42c-ea0368e0cdaf",
            "nome": "Seu terceiro gasto!",
            "valor": "200",
            "tipo": "Teste 3"
        },
        {
            "id": "f446914d-587f-4bb7-b42c-ea0368e0cdaf",
            "nome": "Seu quarto gasto!",
            "valor": "50",
            "tipo": "Teste"
        }
    ];
    return gastos;
}

function carregaRenda() {
    const renda = JSON.parse(localStorage.getItem('fontesRenda')) || [
        {
            "salario": "1234",
            "bonificacoes": "0",
            "horaExtra": "0",
            "freelancing": "0"
        }
    ]
    return renda;
}

function carregaObjetivos() {
    const dadosObjetivos = JSON.parse(localStorage.getItem('dadosObjetivos')) || [
        {
            "valorOrcamento": "1234",
            "metaFinanceira": "123456",
            "tempo": 5,
            "modo": 1,
            "valorFixoTipo": 0
        }
    ];
    return dadosObjetivos;
}

const fontesDeRenda = carregaRenda();
const objetivosDoUsuario = carregaObjetivos();

const rendaTotal = parseFloat(fontesDeRenda[0].salario) + parseFloat(fontesDeRenda[0].bonificacoes) + parseFloat(fontesDeRenda[0].horaExtra) + parseFloat(fontesDeRenda[0].freelancing);
document.getElementById('apresentacaoRenda').innerHTML = `$${rendaTotal}`;

var limiteDeGastos;
if (objetivosDoUsuario[0].modo == 2) {
    switch (objetivosDoUsuario[0].valorFixoTipo) {
        case '%':{
            limiteDeGastos = rendaTotal - (rendaTotal * (parseFloat(objetivosDoUsuario[0].valorOrcamento) / 100));
            break;
        }
        case '$': {
            limiteDeGastos = rendaTotal - objetivosDoUsuario[0].valorOrcamento;
            break;
        }
        default:{
            limiteDeGastos = parseFloat(objetivosDoUsuario[0].valorOrcamento);
            break;
        }
    }
}
else limiteDeGastos = parseFloat(objetivosDoUsuario[0].valorOrcamento);
document.getElementById('apresentacaoLimiteDeGastos').innerHTML = `$${limiteDeGastos}`;

const metaFinanceira = parseFloat(objetivosDoUsuario[0].metaFinanceira);
document.getElementById('apresentacaoMeta').innerHTML = `$${metaFinanceira}`;

function calculaTotalGasto() {
    let gastos = carregaGastos();
    let totalGasto = 0;
    for (let i = 0; i < gastos.length; i++) totalGasto += parseFloat(gastos[i].valor);
    document.getElementById('apresentacaoTotalGastos').innerHTML = `$${totalGasto}`;
    return totalGasto;
}

function calculaRestanteLimiteGastos() {
    let totalGasto = calculaTotalGasto();
    let restanteLimiteGastos = limiteDeGastos - totalGasto;
    document.getElementById('apresentacaoRestanteLimiteDeGastos').innerHTML = `$${restanteLimiteGastos}`;
    return restanteLimiteGastos;
}

function calculaSaldoPoupanca() {
    let saldoDePoupanca = 0;
    let restanteLimiteGastos = calculaRestanteLimiteGastos();
    if (objetivosDoUsuario[0].modo == 2) {
        switch (objetivosDoUsuario[0].valorFixoTipo) {
            case '%': saldoDePoupanca = rendaTotal - (rendaTotal * (parseFloat(objetivosDoUsuario[0].valorOrcamento) / 100));
            case '$': saldoDePoupanca = rendaTotal - objetivosDoUsuario[0].valorOrcamento;
        }
    }
    else {
        saldoDePoupanca = restanteLimiteGastos;
    }
    document.getElementById('poupadoApresentacao').innerHTML = `$${saldoDePoupanca}`;
    return saldoDePoupanca;
}

function faltaQuantoParaMeta() {
    let saldoDePoupanca = calculaSaldoPoupanca();
    let faltaQuanto = metaFinanceira - saldoDePoupanca;
    document.getElementById('apresentacaoFaltaQuanto').innerHTML = `$${faltaQuanto}`;
}

function filtroDeGastos() {
    const gastos = carregaGastos();
    const filtroPreco = document.getElementById("filtroPreco").value;
    const filtroCategoria = document.getElementById("filtroCategoria").value;

    switch (filtroPreco) {
        case "1": {
            for (let i = gastos.length - 1; i >= 0; i--) {
                if (gastos[i].valor >= 100) {
                    gastos.splice(i, 1);
                }
            }
            break;
        }
        case "2": {
            for (let i = gastos.length - 1; i >= 0; i--) {
                if (!(gastos[i].valor > 100 && gastos[i].valor <= 500)) {
                    gastos.splice(i, 1);
                }
            }
            break;
        }
        case "3": {
            for (let i = gastos.length - 1; i >= 0; i--) {
                if (gastos[i].valor < 500) {
                    gastos.splice(i, 1);
                }
            }
            break;
        }
    }
    if (filtroCategoria != 0) {
        for (let i = 0; i < gastos.length; i++) {
            if (gastos[i].tipo != filtroCategoria) {
                gastos.splice(i, 1);
            }
        }
    }
    apresentacaoGastosIndividuais(gastos);
}


function apresentacaoGastosIndividuais(gastos) {
    const tabelaDeGastos = document.querySelector('#gastos-list');
    tabelaDeGastos.innerHTML = ''
    //let gastos = carregaGastos();
    for (let i = 0; i < gastos.length; i++) {
        const row = document.createElement('tr');
        const indexCell = document.createElement('td');
        const nomeCell = document.createElement('td')
        const valorCell = document.createElement('td');
        const tipoCell = document.createElement('td');
        const deleteCell = document.createElement('td');
        const editCell = document.createElement('td');

        const deleteBtn = document.createElement('button');
        deleteBtn.addEventListener('click', function () {
            row.remove();
            gastos.splice(i, 1);
            localStorage.setItem('gastosLista', JSON.stringify(gastos));
            faltaQuantoParaMeta();
            updateChart();
        });

        const editBtn = document.createElement('button');
        editBtn.addEventListener('click', function () {
            const novoNome = prompt("Digite o novo nome do gasto:", gastos[i].nome);
            const novoValor = prompt("Digite o novo valor do gasto:", gastos[i].valor);
            const novoTipo = prompt("Digite o novo tipo do gasto:", gastos[i].tipo);
            gastos[i].nome = novoNome;
            gastos[i].valor = novoValor;
            gastos[i].tipo = novoTipo;
            const gastoEditado = tabelaDeGastos.children[i]
            gastoEditado.children[1].textContent = novoNome;
            gastoEditado.children[2].textContent = novoValor;
            gastoEditado.children[3].textContent = novoTipo;
            localStorage.setItem('gastosLista', JSON.stringify(gastos));
            faltaQuantoParaMeta();
            updateChart();
        });

        indexCell.textContent = i + 1;
        nomeCell.textContent = gastos[i].nome;
        valorCell.textContent = gastos[i].valor;
        tipoCell.textContent = gastos[i].tipo;
        deleteBtn.textContent = 'Excluir';
        editBtn.textContent = 'Editar';

        deleteCell.appendChild(deleteBtn);
        editCell.appendChild(editBtn);

        row.appendChild(indexCell);
        row.appendChild(nomeCell);
        row.appendChild(valorCell);
        row.appendChild(tipoCell);
        row.appendChild(deleteCell);
        row.appendChild(editCell);

        tabelaDeGastos.appendChild(row);
    }
}

function buscaCategorias() {
    const categoriasDeGasto = {};
    let gastos = carregaGastos();
    for (let i = 0; i < gastos.length; i++) {
        const categoria = gastos[i].tipo;
        if (categoriasDeGasto.hasOwnProperty(categoria)) {
            // a categoria existe no dicionario
            categoriasDeGasto[categoria] += parseFloat(gastos[i].valor)
        } else {
            // A categoria não existe no dicionario
            categoriasDeGasto[categoria] = parseFloat(gastos[i].valor)
        }
    }
    let nomeCategorias = Object.keys(categoriasDeGasto)
    for (let j = 0; j < nomeCategorias.length; j++) {
        document.getElementById('filtroCategoria').innerHTML += `<option value="${nomeCategorias[j]}">${nomeCategorias[j]}</option>`
    }
    return categoriasDeGasto;
}

let graficoCategorias;
function initGraficoCategorias() {
    const canvasGrafico = document.getElementById('graficoCategorias');
    const ctx = canvasGrafico.getContext("2d");

    let categorias = buscaCategorias();
    const labels = Object.keys(categorias);
    const data = Object.values(categorias);
    graficoCategorias = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56",
                    "#8A2BE2",
                    "#3CB371",
                    "#FF69B4",
                ],
            }],
        },
    });
};

function updateChart() {
    let categorias = buscaCategorias()
    const labels = Object.keys(categorias);
    const data = Object.values(categorias);

    graficoCategorias.data.labels = labels;
    graficoCategorias.data.datasets[0].data = data;
    graficoCategorias.update();
}

let periodoInput = objetivosDoUsuario[0].tempo; // Valor padrão para o período
$("#valorSlider").text(periodoInput);

$(function () {
    $("#slider").slider({
        range: "min",
        min: 1,
        max: 100,
        value: periodoInput,
        slide: function (event, ui) {
            periodoInput = ui.value;
            $("#valorSlider").text(ui.value);
        }
    });
});

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let graficoAplicacao;
let linhasDados = [];

document.getElementById('limparGrafico').addEventListener('click', function () {
    // Clear the canvas
    const canvasGrafico = document.getElementById('graficoAplicacao');
    const ctx = canvasGrafico.getContext("2d");
    ctx.clearRect(0, 0, canvasGrafico.width, canvasGrafico.height);

    // Clear the data
    linhasDados = [];

    if (graficoAplicacao) {
        graficoAplicacao.destroy();
        graficoAplicacao = undefined;
    }
});

function gerarGraficoAplicacao() {
    const canvasGrafico = document.getElementById('graficoAplicacao');
    const ctx = canvasGrafico.getContext("2d");

    if (document.getElementById('valorInput').value == 'Valor') {
        alert("Selecione um valor antes de simular seu gráfico!");
    } else if (document.getElementById('aplicacaoInput').value == 'Aplicação') {
        alert("Selecione uma aplicação para simular!")
    } else {
        let aplicacaoInput, aplicacaoTipo;
        if (document.getElementById("aplicacaoInput").value == 1) {
            aplicacaoInput = 0.1157;
            aplicacaoTipo = "Tesouro Direto - Prefixado 2029";
        } else {
            aplicacaoInput = 0.1367;
            aplicacaoTipo = "Tesouro Selic";
        }

        let dataAtual = new Date();
        const anos = []; // Eixo X
        const valores = []; // Eixo Y
        for (let j = 0; j < 1; j++) {
            let valorInput;

            if (document.getElementById('valorInput').value == 1) valorInput = metaFinanceira;
            else valorInput = calculaSaldoPoupanca();

            for (let i = 0; i < periodoInput; i++) {
                anos.push(dataAtual.getFullYear() + i);
                valorInput *= 1 + aplicacaoInput;
                valores.push(valorInput);
            }
        }
        const novaLinhaDados = {
            label: aplicacaoTipo,
            data: valores,
            fill: false,
            borderColor: getRandomColor(),
            tension: 0.1
        };

        linhasDados.push(novaLinhaDados);
        if (graficoAplicacao) {
            linhasDados.forEach((linha, index) => {
                graficoAplicacao.data.datasets[index].data = linha.data;
            });
            graficoAplicacao.update();
        } else {
            graficoAplicacao = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: anos,
                    datasets: linhasDados
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
}

document.getElementById('gerarGrafico').addEventListener('click', function () {
    gerarGraficoAplicacao();
});

document.getElementById('filtroPreco').addEventListener('change', function () {
    filtroDeGastos();
})

document.getElementById('filtroCategoria').addEventListener('change', function () {
    filtroDeGastos();
})

document.addEventListener("DOMContentLoaded", function () {
    filtroDeGastos();
    faltaQuantoParaMeta();
    initGraficoCategorias();
});
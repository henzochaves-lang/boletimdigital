// Dados brutos fictícios do 8º Ano
const disciplinas = [
    {
        disciplina: "Língua Portuguesa",
        tri1: 82,
        tri2: "7,8",
        tri3: 85,
        faltas: [2, 1, 1]
    },
    {
        disciplina: "Matemática",
        tri1: 52,
        tri2: "5,8",
        tri3: null,
        faltas: [3, 2, 1]
    },
    {
        disciplina: "Ciências",
        tri1: "8,1",
        tri2: 76,
        tri3: 8.0,
        faltas: [1, 2, 0]
    },
    {
        disciplina: "História",
        tri1: 7.0,
        tri2: 84,
        tri3: null,
        faltas: [1, 1, 1]
    },
    {
        disciplina: "Geografia",
        tri1: 68,
        tri2: 7.3,
        tri3: "7,9",
        faltas: [0, 1, 1]
    },
    {
        disciplina: "Língua Inglesa",
        tri1: 86,
        tri2: "8,1",
        tri3: 8.7,
        faltas: [1, 0, 0]
    },
    {
        disciplina: "Arte",
        tri1: 9.0,
        tri2: 92,
        tri3: null,
        faltas: [1, 1, 0]
    },
    {
        disciplina: "Educação Física",
        tri1: 95,
        tri2: 9.0,
        tri3: "9,4",
        faltas: [0, 1, 0]
    },
    {
        disciplina: "Educação Digital",
        tri1: 88,
        tri2: 9.1,
        tri3: 93,
        faltas: [1, 0, 1]
    },
    {
        disciplina: "Educação Financeira",
        tri1: 74,
        tri2: "7,8",
        tri3: null,
        faltas: [1, 1, 1]
    },
    {
        disciplina: "Estudo Orientado",
        tri1: 8.0,
        tri2: 83,
        tri3: "8,5",
        faltas: [0, 1, 0]
    },
    {
        disciplina: "Redação e Leitura",
        tri1: 62,
        tri2: "6,8",
        tri3: null,
        faltas: [2, 1, 1]
    },
    {
        disciplina: "Pensamento Lógico",
        tri1: 48,
        tri2: 5.6,
        tri3: "6,0",
        faltas: [2, 2, 1]
    },
    {
        disciplina: "Literatura Arte e Movimento",
        tri1: "7,7",
        tri2: 80,
        tri3: null,
        faltas: [1, 0, 1]
    },
    {
        disciplina: "Práticas Experimentais",
        tri1: 58,
        tri2: "6,2",
        tri3: 6.4,
        faltas: [1, 1, 1]
    }
];

// Converte diferentes formatos para uma nota entre 0 e 10.
function normalizarNota(valor) {
    // Valores vazios significam que a nota ainda não foi lançada.
    if (valor === null || valor === undefined || valor === "") {
        return null;
    }

    // Aceita números escritos com vírgula ou ponto.
    const numero = Number(String(valor).replace(",", "."));

    // Se não for um número válido, não usamos a nota.
    if (Number.isNaN(numero)) {
        return null;
    }

    // Notas de 0 a 10 permanecem iguais.
    if (numero >= 0 && numero <= 10) {
        return numero;
    }

    // Valores maiores que 10 até 100 são convertidos para a escala 0–10.
    if (numero > 10 && numero <= 100) {
        return numero / 10;
    }

    // Qualquer outro valor é inválido.
    return null;
}

// Calcula a média usando somente as notas disponíveis.
function calcularMedia(notas) {
    const notasValidas = notas.filter(nota => nota !== null);

    if (notasValidas.length === 0) {
        return null;
    }

    const soma = notasValidas.reduce(
        (total, nota) => total + nota,
        0
    );

    return soma / notasValidas.length;
}

// Soma as faltas dos três trimestres.
function calcularFaltas(faltas) {
    return faltas.reduce(
        (total, falta) => total + falta,
        0
    );
}

// Define a situação da disciplina.
function definirSituacao(media) {
    if (media === null) {
        return "Nota ainda não disponível";
    }

    if (media >= 6) {
        return "Bom desempenho";
    }

    return "Atenção";
}

// Mostra uma nota na tabela.
function formatarNota(nota) {
    if (nota === null) {
        return "Ainda não lançada";
    }

    return nota.toFixed(1).replace(".", ",");
}

// Cria uma classe CSS de acordo com a situação.
function classeSituacao(situacao) {
    if (situacao === "Bom desempenho") {
        return "bom";
    }

    if (situacao === "Atenção") {
        return "atencao";
    }

    return "indisponivel";
}

// Preenche a tabela usando os dados do array.
function preencherTabela() {
    const tabela = document.getElementById("tabela-notas");

    disciplinas.forEach(disciplina => {
        // Normaliza cada nota antes de usar.
        const nota1 = normalizarNota(disciplina.tri1);
        const nota2 = normalizarNota(disciplina.tri2);
        const nota3 = normalizarNota(disciplina.tri3);

        const notas = [nota1, nota2, nota3];

        const media = calcularMedia(notas);
        const faltas = calcularFaltas(disciplina.faltas);
        const situacao = definirSituacao(media);

        // Cria uma nova linha da tabela.
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${disciplina.disciplina}</td>
            <td>${formatarNota(nota1)}</td>
            <td>${formatarNota(nota2)}</td>
            <td>${formatarNota(nota3)}</td>
            <td>${formatarNota(media)}</td>
            <td>${faltas}</td>
            <td>
                <span class="situacao ${classeSituacao(situacao)}">
                    ${situacao}
                </span>
            </td>
        `;

        tabela.appendChild(linha);
    });
}

// Calcula e mostra os cards de resumo.
function preencherResumo() {
    const todasAsMedias = [];
    let totalFaltas = 0;
    let bomDesempenho = 0;
    let precisamAtencao = 0;

    disciplinas.forEach(disciplina => {
        const notas = [
            normalizarNota(disciplina.tri1),
            normalizarNota(disciplina.tri2),
            normalizarNota(disciplina.tri3)
        ];

        const media = calcularMedia(notas);

        if (media !== null) {
            todasAsMedias.push(media);
        }

        totalFaltas += calcularFaltas(disciplina.faltas);

        const situacao = definirSituacao(media);

        if (situacao === "Bom desempenho") {
            bomDesempenho++;
        }

        if (situacao === "Atenção") {
            precisamAtencao++;
        }
    });

    const mediaGeral = calcularMedia(todasAsMedias);

    document.getElementById("media-geral").textContent =
        formatarNota(mediaGeral);

    document.getElementById("total-faltas").textContent =
        totalFaltas;

    document.getElementById("bom-desempenho").textContent =
        bomDesempenho;

    document.getElementById("precisam-atencao").textContent =
        precisamAtencao;

    // Frequência fictícia apenas para demonstração.
    // No futuro, esse percentual será tratado de outra forma.
    const frequenciaDemonstrativa = 92;

    document.getElementById("frequencia").textContent =
        `${frequenciaDemonstrativa}%`;

    document.getElementById("frequencia-texto").textContent =
        "Frequência adequada";
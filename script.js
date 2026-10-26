// Dados fictícios brutos do 8º Ano
const dadosBoletim = [
  { disciplina: "Língua Portuguesa", tri1: 82, tri2: "7,8", tri3: 85, faltas: [2, 1, 1] },
  { disciplina: "Matemática", tri1: 52, tri2: "5,8", tri3: null, faltas: [3, 2, 1] },
  { disciplina: "Ciências", tri1: "8,1", tri2: 76, tri3: 8.0, faltas: [1, 2, 0] },
  { disciplina: "História", tri1: 7.0, tri2: 84, tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Geografia", tri1: 68, tri2: 7.3, tri3: "7,9", faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 86, tri2: "8,1", tri3: 8.7, faltas: [1, 0, 0] },
  { disciplina: "Arte", tri1: 9.0, tri2: 92, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 95, tri2: 9.0, tri3: "9,4", faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 88, tri2: 9.1, tri3: 93, faltas: [1, 0, 1] },
  { disciplina: "Educação Financeira", tri1: 74, tri2: "7,8", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Estudo Orientado", tri1: 8.0, tri2: 83, tri3: "8,5", faltas: [0, 1, 0] },
  { disciplina: "Redação e Leitura", tri1: 62, tri2: "6,8", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 48, tri2: 5.6, tri3: "6,0", faltas: [2, 2, 1] },
  { disciplina: "Literatura Arte e Movimento", tri1: "7,7", tri2: 80, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Práticas Experimentais", tri1: 58, tri2: "6,2", tri3: 6.4, faltas: [1, 1, 1] }
];

// Função para converter e validar qualquer formato de nota para a escala 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null; // Nota ainda não lançada
  }

  // Se for texto com vírgula (ex: "7,8"), substitui por ponto para o JavaScript entender
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  const num = parseFloat(valor);

  if (isNaN(num)) {
    return null; // Valor inválido
  }

  if (num >= 0 && num <= 10) {
    return num;
  }

  if (num > 10 && num <= 100) {
    return num / 10;
  }

  return null; // Fora do intervalo permitido
}

// Função principal que processa os dados e desenha a tela
function carregarBoletim() {
  const corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.innerHTML = "";

  let somaMediasGerais = 0;
  let quantidadeDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  // Percorre cada matéria da lista
  dadosBoletim.forEach((item) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Soma as faltas dos três trimestres
    const totalFaltasMateria = item.faltas.reduce((acc, curr) => acc + curr, 0);
    totalFaltasGeral += totalFaltasMateria;

    // Filtra apenas as notas válidas para calcular a média
    const notasValidas = [n1, n2, n3].filter((n) => n !== null);

    let mediaTexto = "—";
    let situacaoTexto = "Nota ainda não disponível";
    let classeStatus = "status-indisponivel";

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      const mediaCalculada = soma / notasValidas.length;
      
      mediaTexto = mediaCalculada.toFixed(1).replace(".", ",");
      somaMediasGerais += mediaCalculada;
      quantidadeDisciplinasComMedia++;

      if (mediaCalculada >= 6.0) {
        situacaoTexto = "Bom desempenho";
        classeStatus = "status-bom";
        qtdBomDesempenho++;
      } else {
        situacaoTexto = "Atenção";
        classeStatus = "status-atencao";
        qtdAtencao++;
      }
    }

    // Formatação visual para exibir cada trimestre
    const fmt1 = n1 !== null ? n1.toFixed(1).replace(".", ",") : "—";
    const fmt2 = n2 !== null ? n2.toFixed(1).replace(".", ",") : "—";
    const fmt3 = n3 !== null ? n3.toFixed(1).replace(".", ",") : "—";

    // Cria a linha da tabela no HTML
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${fmt1}</td>
      <td>${fmt2}</td>
      <td>${fmt3}</td>
      <td><strong>${mediaTexto}</strong></td>
      <td>${totalFaltasMateria}</td>
      <td class="${classeStatus}">${situacaoTexto}</td>
    `;
    corpoTabela.appendChild(tr);
  });

  // Atualiza os cards superiores com os resultados agregados
  const mediaGeralFinal = quantidadeDisciplinasComMedia > 0 
    ? (somaMediasGerais / quantidadeDisciplinasComMedia).toFixed(1).replace(".", ",") 
    : "—";

  document.getElementById("media-geral").textContent = mediaGeralFinal;
  document.getElementById("total-faltas").textContent = totalFaltasGeral;
  document.getElementById("qtd-bom-desempenho").textContent = qtdBomDesempenho;
  document.getElementById("qtd-atencao").textContent = qtdAtencao;

  // NOTA: A frequência abaixo é apenas demonstrativa/fictícia (92%) nesta versão.
  document.getElementById("frequencia-geral").textContent = "92%";
}

// Executa a função assim que a página é carregada
document.addEventListener("DOMContentLoaded", carregarBoletim);
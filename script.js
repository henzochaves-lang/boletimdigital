// Configuração fixa do aluno
const CONFIG_ALUNO = {
  turma: "8B",
  numeroChamada: 16,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// Variável para armazenar o PIN em memória durante a sessão
let pinSessao = "";
let modoEdicao = false;

// Dados fictícios brutos do 8º Ano
let dadosBoletim = [
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

// Função para converter e validar qualquer formato de nota para a escala 0 a 10 (Dados Legados)
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  const num = parseFloat(valor);

  if (isNaN(num)) {
    return null;
  }

  if (num >= 0 && num <= 10) {
    return num;
  }

  if (num > 10 && num <= 100) {
    return num / 10;
  }

  return null;
}

// Validação de notas digitadas no editor (aceita apenas 0 a 10, ponto/vírgula ou vazio)
function validarNotaEditada(valorStr) {
  const v = valorStr.trim();
  if (v === "") return { valido: true, valor: null };
  
  const vNorm = v.replace(",", ".");
  const num = Number(vNorm);
  
  if (isNaN(num) || num < 0 || num > 10) {
    return { valido: false, valor: null };
  }
  
  return { valido: true, valor: num };
}

// Validação de faltas digitadas no editor (aceita apenas inteiros >= 0)
function validarFaltaEditada(valorStr) {
  const v = valorStr.trim();
  if (v === "") return { valido: false, valor: null };
  
  const num = Number(v);
  if (!Number.isInteger(num) || num < 0) {
    return { valido: false, valor: null };
  }
  
  return { valido: true, valor: num };
}

// Função para renderizar a tabela e os cards de resumo
function renderizarBoletim() {
  const corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.innerHTML = "";

  let somaMediasGerais = 0;
  let quantidadeDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  dadosBoletim.forEach((item, index) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const faltasArray = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const totalFaltasMateria = faltasArray.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    totalFaltasGeral += totalFaltasMateria;

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

    const tr = document.createElement("tr");

    if (modoEdicao) {
      const val1 = n1 !== null ? n1.toString().replace(".", ",") : "";
      const val2 = n2 !== null ? n2.toString().replace(".", ",") : "";
      const val3 = n3 !== null ? n3.toString().replace(".", ",") : "";
      const f1 = faltasArray[0] !== undefined ? faltasArray[0] : 0;
      const f2 = faltasArray[1] !== undefined ? faltasArray[1] : 0;
      const f3 = faltasArray[2] !== undefined ? faltasArray[2] : 0;

      const tdDisc = document.createElement("td");
      const strongDisc = document.createElement("strong");
      strongDisc.textContent = item.disciplina;
      tdDisc.appendChild(strongDisc);

      const td1 = document.createElement("td");
      td1.innerHTML = `<input type="text" class="input-edicao input-nota" data-index="${index}" data-tri="1" value="${val1}">`;

      const td2 = document.createElement("td");
      td2.innerHTML = `<input type="text" class="input-edicao input-nota" data-index="${index}" data-tri="2" value="${val2}">`;

      const td3 = document.createElement("td");
      td3.innerHTML = `<input type="text" class="input-edicao input-nota" data-index="${index}" data-tri="3" value="${val3}">`;

      const tdMedia = document.createElement("td");
      const strongMedia = document.createElement("strong");
      strongMedia.textContent = mediaTexto;
      tdMedia.appendChild(strongMedia);

      const tdFaltas = document.createElement("td");
      tdFaltas.innerHTML = `
        <div class="grupo-faltas-edicao">
          <input type="text" class="input-edicao input-falta" data-index="${index}" data-tri="1" value="${f1}" title="Faltas 1º Tri">
          <input type="text" class="input-edicao input-falta" data-index="${index}" data-tri="2" value="${f2}" title="Faltas 2º Tri">
          <input type="text" class="input-edicao input-falta" data-index="${index}" data-tri="3" value="${f3}" title="Faltas 3º Tri">
        </div>
      `;

      const tdStatus = document.createElement("td");
      tdStatus.className = classeStatus;
      tdStatus.textContent = situacaoTexto;

      tr.appendChild(tdDisc);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(tdMedia);
      tr.appendChild(tdFaltas);
      tr.appendChild(tdStatus);
    } else {
      const fmt1 = n1 !== null ? n1.toFixed(1).replace(".", ",") : "—";
      const fmt2 = n2 !== null ? n2.toFixed(1).replace(".", ",") : "—";
      const fmt3 = n3 !== null ? n3.toFixed(1).replace(".", ",") : "—";

      const tdDisc = document.createElement("td");
      const strongDisc = document.createElement("strong");
      strongDisc.textContent = item.disciplina;
      tdDisc.appendChild(strongDisc);

      const td1 = document.createElement("td");
      td1.textContent = fmt1;

      const td2 = document.createElement("td");
      td2.textContent = fmt2;

      const td3 = document.createElement("td");
      td3.textContent = fmt3;

      const tdMedia = document.createElement("td");
      const strongMedia = document.createElement("strong");
      strongMedia.textContent = mediaTexto;
      tdMedia.appendChild(strongMedia);

      const tdFaltas = document.createElement("td");
      tdFaltas.textContent = totalFaltasMateria;

      const tdStatus = document.createElement("td");
      tdStatus.className = classeStatus;
      tdStatus.textContent = situacaoTexto;

      tr.appendChild(tdDisc);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(tdMedia);
      tr.appendChild(tdFaltas);
      tr.appendChild(tdStatus);
    }

    corpoTabela.appendChild(tr);
  });

  const mediaGeralFinal = quantidadeDisciplinasComMedia > 0 
    ? (somaMediasGerais / quantidadeDisciplinasComMedia).toFixed(1).replace(".", ",") 
    : "—";

  document.getElementById("media-geral").textContent = mediaGeralFinal;
  document.getElementById("total-faltas").textContent = totalFaltasGeral;
  document.getElementById("qtd-bom-desempenho").textContent = qtdBomDesempenho;
  document.getElementById("qtd-atencao").textContent = qtdAtencao;
  document.getElementById("frequencia-geral").textContent = "92%";
}

// Manipulação do Login
document.getElementById("form-login").addEventListener("submit", async (e) => {
  e.preventDefault();
  const campoPin = document.getElementById("campo-pin");
  const msgLogin = document.getElementById("msg-login");
  const pinDigitado = campoPin.value.trim();

  if (!pinDigitado) return;

  msgLogin.textContent = "Conectando...";
  msgLogin.style.color = "var(--cor-texto-mutado)";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      msgLogin.style.color = "var(--cor-destaque)";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      msgLogin.style.color = "var(--cor-alerta)";
      return;
    }

    if (!resposta.ok) {
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      msgLogin.style.color = "var(--cor-destaque)";
      return;
    }

    const resultado = await resposta.json();

    // PIN mantido somente em memória
    pinSessao = pinDigitado;
    campoPin.value = ""; // Limpa o campo por segurança

    if (resultado.dados && Array.isArray(resultado.dados.disciplinas) && resultado.dados.disciplinas.length > 0) {
      dadosBoletim = resultado.dados.disciplinas;
    }

    document.getElementById("secao-login").style.display = "none";
    document.getElementById("conteudo-boletim").style.display = "block";
    renderizarBoletim();

  } catch (erro) {
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    msgLogin.style.color = "var(--cor-destaque)";
  }
});

// Botão para alternar modo de edição
document.getElementById("btn-alternar-edicao").addEventListener("click", () => {
  modoEdicao = !modoEdicao;
  const btnAlternar = document.getElementById("btn-alternar-edicao");
  const btnSalvar = document.getElementById("btn-salvar");
  const msgSalvamento = document.getElementById("msg-salvamento");

  msgSalvamento.textContent = "";

  if (modoEdicao) {
    btnAlternar.textContent = "Cancelar edição";
    btnSalvar.style.display = "inline-block";
  } else {
    btnAlternar.textContent = "Alterar dados";
    btnSalvar.style.display = "none";
  }

  renderizarBoletim();
});

// Botão para salvar alterações na API
document.getElementById("btn-salvar").addEventListener("click", async () => {
  const msgSalvamento = document.getElementById("msg-salvamento");
  msgSalvamento.textContent = "";

  let temErro = false;
  const inputsNota = document.querySelectorAll(".input-nota");
  const inputsFalta = document.querySelectorAll(".input-falta");

  // Limpa marcas de erros anteriores
  document.querySelectorAll(".input-edicao").forEach(inp => inp.classList.remove("campo-invalido"));

  // Clona os dados atuais para atualizar com as entradas válidas
  const novosDados = JSON.parse(JSON.stringify(dadosBoletim));

  // Valida todas as notas digitadas
  inputsNota.forEach((input) => {
    const idx = parseInt(input.getAttribute("data-index"), 10);
    const tri = input.getAttribute("data-tri");
    const valRes = validarNotaEditada(input.value);

    if (!valRes.valido) {
      input.classList.add("campo-invalido");
      temErro = true;
    } else {
      if (tri === "1") novosDados[idx].tri1 = valRes.valor;
      if (tri === "2") novosDados[idx].tri2 = valRes.valor;
      if (tri === "3") novosDados[idx].tri3 = valRes.valor;
    }
  });

  // Valida todas as faltas digitadas
  inputsFalta.forEach((input) => {
    const idx = parseInt(input.getAttribute("data-index"), 10);
    const tri = parseInt(input.getAttribute("data-tri"), 10) - 1;
    const valRes = validarFaltaEditada(input.value);

    if (!valRes.valido) {
      input.classList.add("campo-invalido");
      temErro = true;
    } else {
      if (!Array.isArray(novosDados[idx].faltas)) {
        novosDados[idx].faltas = [0, 0, 0];
      }
      novosDados[idx].faltas[tri] = valRes.valor;
    }
  });

  if (temErro) {
    msgSalvamento.textContent = "Verifique os campos destacadas em vermelho antes de salvar.";
    msgSalvamento.style.color = "var(--cor-destaque)";
    return;
  }

  msgSalvamento.textContent = "Salvando...";
  msgSalvamento.style.color = "var(--cor-texto-mutado)";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novosDados
        }
      })
    });

    if (!resposta.ok) {
      msgSalvamento.textContent = "Erro ao salvar dados. Tente novamente.";
      msgSalvamento.style.color = "var(--cor-destaque)";
      return;
    }

    dadosBoletim = novosDados;
    modoEdicao = false;
    document.getElementById("btn-alternar-edicao").textContent = "Alterar dados";
    document.getElementById("btn-salvar").style.display = "none";
    
    msgSalvamento.textContent = "Dados salvos com sucesso.";
    msgSalvamento.style.color = "var(--cor-sucesso)";

    renderizarBoletim();

  } catch (erro) {
    msgSalvamento.textContent = "Erro ao conectar com o servidor para salvar.";
    msgSalvamento.style.color = "var(--cor-destaque)";
  }
});

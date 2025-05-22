const frases = [
    { texto: "Vacinas causam autismo", status: "fake" },
    { texto: "A Terra é plana", status: "fake" },
    { texto: "O aquecimento global é causado por humanos", status: "verdadeiro" },
    { texto: "Máscaras reduzem a disseminação de vírus", status: "verdadeiro" },
    { texto: "5G transmite COVID-19", status: "fake" },
    { texto: "A vacina contra COVID-19 foi testada", status: "verdadeiro" },
    { texto: "Bill Gates quer implantar chips", status: "fake" },
    { texto: "O cinto de segurança salva vidas", status: "verdadeiro" },
    { texto: "Cloroquina cura COVID-19", status: "fake" },
    { texto: "Água potável é essencial para a vida", status: "verdadeiro" }
  ];
   
  document.getElementById("btnVerificar").addEventListener("click", () => {
    const input = document.getElementById("inputFrase").value.toLowerCase();
    const resultadoEl = document.getElementById("resultado");
    const fraseEncontrada = frases.find(f => input.includes(f.texto.toLowerCase()));
   
    let resultadoTexto = "";
    let classe = "";
   
    if (fraseEncontrada) {
      if (fraseEncontrada.status === "fake") {
        resultadoTexto = "❌ Fake News - Essa informação é falsa.";
        classe = "resultado-fake";
      } else {
        resultadoTexto = "✅ Fato Verificado - Essa informação é verdadeira.";
        classe = "resultado-verdadeiro";
      }
    } else {
      resultadoTexto = "Não encontrado na base local.";
      classe = "";
    }
   
    resultadoEl.textContent = resultadoTexto;
    resultadoEl.className = classe;
   
    salvarHistorico(input, resultadoTexto);
    buscarNoticias(input);
  });
   
  function salvarHistorico(frase, resultado) {
    const historico = JSON.parse(localStorage.getItem("historico")) || [];
    historico.push({
      frase,
      resultado,
      data: new Date().toLocaleString()
    });
    localStorage.setItem("historico", JSON.stringify(historico));
  }
   
  document.getElementById("btnHistorico").addEventListener("click", () => {
    const historicoEl = document.getElementById("historicoContainer");
    const historico = JSON.parse(localStorage.getItem("historico")) || [];
   
    if (historico.length === 0) {
      historicoEl.innerHTML = "<p>Sem histórico.</p>";
    } else {
      const tabela = `
        <table>
          <tr><th>Frase</th><th>Resultado</th><th>Data/Hora</th></tr>
          ${historico.map(entry => `
            <tr>
              <td>${entry.frase}</td>
              <td>${entry.resultado}</td>
              ${entry.data}</td>
            </tr>`).join("")}
        </table>`;
      historicoEl.innerHTML = tabela;
    }
   
    historicoEl.classList.toggle("hidden");
  });
   
  function buscarNoticias(termo) {
    const apiKey = "97bf5003fbfe4bcc07c22bbf0141c5d8";
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(termo)}&lang=pt&token=${apiKey}`;
   
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const noticiasEl = document.getElementById("noticias");
        noticiasEl.innerHTML = "";
   
        if (data.articles && data.articles.length > 0) {
          data.articles.slice(0, 5).forEach(noticia => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${noticia.url}" target="_blank">${noticia.title}</a>`;
            noticiasEl.appendChild(li);
          });
        } else {
          noticiasEl.innerHTML = "<li>Nenhuma notícia encontrada.</li>";
        }
      })
      .catch(() => {
        document.getElementById("noticias").innerHTML = "<li>Erro ao buscar notícias.</li>";
      });
  }
   
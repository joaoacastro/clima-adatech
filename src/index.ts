const form = document.querySelector<HTMLFormElement>("#search-form > form");
const input = document.querySelector<HTMLInputElement>("#input-localizacao");
const sectionTempoInfo = document.querySelector<HTMLElement>("#tempo-info");

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector<HTMLInputElement>("#input-localizacao");

  if (input) {
    input.focus(); // Coloca o cursor no input assim que a página carregar
  }
});

form?.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  if (!input || !sectionTempoInfo) return;

  const localizacao = input.value.trim();

  if (localizacao.length < 3) {
    alert(
      `A cidade "${input.value}" não existe. O local precisa ter no mínimo 3 letras!`
    );
    input.value = "";
    return;
  }

  try {
    const resposta = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${localizacao}&appid=35050c22c2c3ac8d260aa5742de645a6&lang=pt_br&units=metric`
    );

    if (!resposta.ok) {
      throw new Error("Cidade não encontrada");
    }

    const dados = await resposta.json();

    if (dados.cod !== "200") {
      throw new Error("Cidade não encontrada");
    }

    // const previsoes = dados.list.slice(0, 8 * 7); // 7 dias de previsão (8 previsões por dia)
    const previsoes = dados.list.filter(
      (item: any, index: number) => index % 7 === 0
    );

    const infos = {
      temperatura: Math.round(dados.list[0].main.temp),
      sensacaoTermica: Math.round(dados.list[0].main.feels_like),
      umidade: Math.round(dados.list[0].main.humidity),
      local: dados.city.name,
      icone: `https://openweathermap.org/img/wn/${dados.list[0].weather[0].icon}@2x.png`,
    };

    sectionTempoInfo.innerHTML = "";

    const cidadeDiv = document.createElement("div");
    cidadeDiv.classList.add("cidade");
    const cidadeTitulo = document.createElement("h2");
    cidadeTitulo.textContent = infos.local;
    cidadeDiv.appendChild(cidadeTitulo);
    sectionTempoInfo.appendChild(cidadeDiv);

    const tempoDadosDiv = document.createElement("div");
    tempoDadosDiv.classList.add("tempo-dados");

    const temperaturaDiv = document.createElement("div");
    temperaturaDiv.classList.add("tempo-dados-temperatura");
    const temperaturaTitulo = document.createElement("h2");
    temperaturaTitulo.textContent = "Temperatura";
    const temperaturaValor = document.createElement("span");
    temperaturaValor.textContent = `${infos.temperatura}ºC`;
    temperaturaDiv.appendChild(temperaturaTitulo);
    temperaturaDiv.appendChild(temperaturaValor);
    tempoDadosDiv.appendChild(temperaturaDiv);

    const sensacaoDiv = document.createElement("div");
    sensacaoDiv.classList.add("tempo-dados-sensacao");
    const sensacaoTitulo = document.createElement("h2");
    sensacaoTitulo.textContent = "Sensação Térmica";
    const sensacaoValor = document.createElement("span");
    sensacaoValor.textContent = `${infos.sensacaoTermica}ºC`;
    sensacaoDiv.appendChild(sensacaoTitulo);
    sensacaoDiv.appendChild(sensacaoValor);
    tempoDadosDiv.appendChild(sensacaoDiv);

    const umidadeDiv = document.createElement("div");
    umidadeDiv.classList.add("tempo-dados-umidade");
    const umidadeTitulo = document.createElement("h2");
    umidadeTitulo.textContent = "Umidade";
    const umidadeValor = document.createElement("span");
    umidadeValor.textContent = `${infos.umidade}%`;
    umidadeDiv.appendChild(umidadeTitulo);
    umidadeDiv.appendChild(umidadeValor);
    tempoDadosDiv.appendChild(umidadeDiv);

    const iconeImg = document.createElement("img");
    iconeImg.src = infos.icone;
    tempoDadosDiv.appendChild(iconeImg);

    sectionTempoInfo.appendChild(tempoDadosDiv);

    // Adicionando o título "Previsão"
    const previsaoTitulo = document.createElement("h2");
    previsaoTitulo.textContent = "Previsão";
    sectionTempoInfo.appendChild(previsaoTitulo);
    previsaoTitulo.classList.add("previsaoTitulo");

    const previsaoDiv = document.createElement("div");
    previsaoDiv.classList.add("previsao");

    const diasDaSemana = [
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
      "Domingo",
    ];

    // previsoes.forEach((previsao: any) => {
    //   const data = new Date(previsao.dt * 1000);
    //   const diaDaSemanaIndex = data.getDay();
    //   const diaDaSemana = diasDaSemana[diaDaSemanaIndex];
    //   const descricaoClima =
    //     previsao.weather[0]?.description || "Descrição não disponível";

    //   const previsaoDiaDiv = document.createElement("div");
    //   previsaoDiaDiv.classList.add("previsaoDia");

    //   const diaTitulo = document.createElement("h2");
    //   diaTitulo.textContent = diaDaSemana;
    //   previsaoDiaDiv.appendChild(diaTitulo);

    //   const temperaturaSpan = document.createElement("span");
    //   temperaturaSpan.textContent = `${Math.round(previsao.main.temp)}ºC`;
    //   previsaoDiaDiv.appendChild(temperaturaSpan);

    //   const descricaoSpan = document.createElement("span");
    //   descricaoSpan.textContent = descricaoClima;
    //   previsaoDiaDiv.appendChild(descricaoSpan);

    //   previsaoDiv.appendChild(previsaoDiaDiv);
    // });

    // const previsoesUnicas: { [key: string]: boolean } = {};

    // previsoes.forEach((previsao: any) => {
    //   const data = new Date(previsao.dt * 1000);
    //   const diaDaSemanaIndex = data.getDay();
    //   const diaDaSemana = diasDaSemana[diaDaSemanaIndex];

    //   // Verifique se o dia já foi adicionado
    //   if (previsoesUnicas[diaDaSemana]) {
    //     return; // Pule se o dia já estiver no objeto
    //   }

    //   previsoesUnicas[diaDaSemana] = true;

    //   const descricaoClima =
    //     previsao.weather[0]?.description || "Descrição não disponível";

    //   const previsaoDiaDiv = document.createElement("div");
    //   previsaoDiaDiv.classList.add("previsaoDia");

    //   const diaTitulo = document.createElement("h2");
    //   diaTitulo.textContent = diaDaSemana;
    //   previsaoDiaDiv.appendChild(diaTitulo);

    //   const temperaturaSpan = document.createElement("span");
    //   temperaturaSpan.textContent = `${Math.round(previsao.main.temp)}ºC`;
    //   previsaoDiaDiv.appendChild(temperaturaSpan);

    //   const descricaoSpan = document.createElement("span");
    //   descricaoSpan.textContent = descricaoClima;
    //   previsaoDiaDiv.appendChild(descricaoSpan);

    //   previsaoDiv.appendChild(previsaoDiaDiv);
    // });

    const previsoesUnicas: { [key: string]: boolean } = {};
    let diasAdicionados = 0;

    previsoes.forEach((previsao: any) => {
      if (diasAdicionados >= 4) return; // Limita a 4 dias únicos

      const data = new Date(previsao.dt * 1000);
      const diaDaSemanaIndex = data.getDay();
      const diaDaSemana = diasDaSemana[diaDaSemanaIndex];

      if (previsoesUnicas[diaDaSemana]) {
        return; // Pule se o dia já estiver no objeto
      }

      previsoesUnicas[diaDaSemana] = true;
      diasAdicionados++;

      const descricaoClima =
        previsao.weather[0]?.description || "Descrição não disponível";

      const previsaoDiaDiv = document.createElement("div");
      previsaoDiaDiv.classList.add("previsaoDia");

      const diaTitulo = document.createElement("h2");
      diaTitulo.textContent = diaDaSemana;
      previsaoDiaDiv.appendChild(diaTitulo);

      const temperaturaSpan = document.createElement("span");
      temperaturaSpan.textContent = `${Math.round(previsao.main.temp)}ºC`;
      previsaoDiaDiv.appendChild(temperaturaSpan);

      const descricaoSpan = document.createElement("span");
      descricaoSpan.textContent = descricaoClima;
      previsaoDiaDiv.appendChild(descricaoSpan);

      previsaoDiv.appendChild(previsaoDiaDiv);
    });

    sectionTempoInfo.appendChild(previsaoDiv);
    input.value = "";
  } catch (err) {
    alert(
      `A cidade ${input.value} não existe ou não foi encontrada. Por favor, digite um nome válido para cidade.`
    );
    input.value = "";
    return;
  }
});

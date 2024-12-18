const form: HTMLFormElement | null = document.querySelector(
  "#search-form > form"
);
const input: HTMLInputElement | null =
  document.querySelector("#input-localizacao");

const sectionTempoInfo = document.querySelector("#tempo-info");

form?.addEventListener("submit", async (event) => {
  event?.preventDefault();

  if (!input || !sectionTempoInfo) return;

  const localizacao = input.value.trim(); //Remove espaços em branco no início e no final do valor digitado pelo usuário.

  if (localizacao.length < 3) {
    alert(
      `A cidade "${input.value}" não existe. O local precisa ter no mínimo 3 letras!`
    );
    input.value = "";
    return;
  }

  try {
    const resposta = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${localizacao}&appid=35050c22c2c3ac8d260aa5742de645a6&lang=pt_br&units=metric`
    );

    const dados = await resposta.json();

    const infos = {
      temperatura: Math.round(dados.main.temp),
      sensacaoTermica: Math.round(dados.main.feels_like),
      umidade: Math.round(dados.main.humidity),
      local: dados.name,
      icone: `https://openweathermap.org/img/wn/${dados.weather[0].icon}@2x.png`,
    };

    sectionTempoInfo.innerHTML = `
            <h2>${infos.local}</h2>
          <div class="tempo-dados">
            <div class="tempo-dados-temperatura">
                <h2>Temperatura</h2>
                <span>${infos.temperatura}ºC</span>
            </div>
            
            <div class="tempo-dados-sensacao">
                <h2>Sensação Térmica</h2>
                <span>${infos.sensacaoTermica}ºC</span>
            </div>
            
            <div class="tempo-dados-umidade">
                <h2>Umidade</h2>
                <span>${infos.umidade}%</span>
            </div>
            <img src="${infos.icone}" />
          </div>
  
      `;
  } catch (err) {
    alert(
      `A cidade ${input.value} não existe, por favor digite um nome válido para cidade.`
    );
    input.value = "";
    return;
  }
});

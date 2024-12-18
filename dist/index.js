"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const form = document.querySelector("#search-form > form");
const input = document.querySelector("#input-localizacao");
const sectionTempoInfo = document.querySelector("#tempo-info");
form === null || form === void 0 ? void 0 : form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event === null || event === void 0 ? void 0 : event.preventDefault();
    if (!input || !sectionTempoInfo)
        return;
    const localizacao = input.value.trim(); //Remove espaços em branco no início e no final do valor digitado pelo usuário.
    if (localizacao.length < 3) {
        alert(`A cidade "${input.value}" não existe. O local precisa ter no mínimo 3 letras!`);
        input.value = "";
        return;
    }
    try {
        const resposta = yield fetch(`https://api.openweathermap.org/data/2.5/weather?q=${localizacao}&appid=35050c22c2c3ac8d260aa5742de645a6&lang=pt_br&units=metric`);
        const dados = yield resposta.json();
        const infos = {
            temperatura: Math.round(dados.main.temp),
            sensacaoTermica: Math.round(dados.main.feels_like),
            umidade: Math.round(dados.main.humidity),
            local: dados.name,
            icone: `https://openweathermap.org/img/wn/${dados.weather[0].icon}@2x.png`,
        };
        sectionTempoInfo.innerHTML = `
            <h2 class="cidade">${infos.local}</h2>
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
        input.value = "";
    }
    catch (err) {
        alert(`A cidade ${input.value} não existe, por favor digite um nome válido para cidade.`);
        input.value = "";
        return;
    }
}));

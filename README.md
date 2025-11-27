🎮 README.md para o seu projeto — Arcade Game / Kingshot Terminal

<div align="center">
  
# 🏰 Kingshot Terminal  
### A Tower Defense Experience • Node.js API + React Front

Um mini–jogo estilo **tower defense** totalmente construído em **JavaScript**, usando:

🚀 **Backend**: Node.js + Express  
🎨 **Frontend**: React + CSS customizado  
🧠 **Game Engine própria**: lógica de turnos, fases, torres, tropas e inimigos

<img width="1541" height="1452" alt="screencapture-localhost-3000-2025-11-27-09_10_29" src="https://github.com/user-attachments/assets/952c72bd-0bc2-4965-ad48-705c5d4e3316" />


</div>

---

## 📌 Sobre o jogo

**Kingshot Terminal** é um jogo inspirado em Kingshot / Clash Mini / Tower Defense, mas com uma proposta diferente:

🛡 Você administra um **castelo**,  
🏹 evolui torres,  
⚔️ treina tropas,  
👹 enfrenta ondas de inimigos,  
📈 avança fases  
… tudo em **turnos**, consumindo uma API real.

É como jogar um jogo mobile, mas com lógica totalmente transparente e API aberta.

---

## 🧱 Estrutura do Projeto

```
arcade-game/
│
├── api/                 # Backend Node (Express + Game Engine)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── data/
│   └── server.js
│
└── app/                 # Frontend React estilizado como jogo mobile
    ├── public/
    └── src/
        ├── api/
        ├── components/
        ├── hooks/
        ├── pages/
        ├── App.jsx
        ├── App.css
        └── index.js
```

---

## ⚙️ Como Rodar o Projeto

### 1) Rodando o backend (API)

```bash
cd api
npm install
npm start
```

A API sobe em:

```
http://localhost:8000/game
```

### 2) Rodando o frontend (React)

Em outro terminal:

```bash
cd app
npm install
npm start
```

O jogo abre automaticamente em:

```
http://localhost:3000
```

---

## 🎯 Funcionalidades Principais

### 🏰 Castelo
- Vida, defesa e cura com energia + comida
- Muralha com níveis
- Defesa extra de escudos na fase de combate
- Ganha dano por turno se inimigos sobreviverem

### 🏹 Torres
- Construção de novas torres
- Upgrades de nível
- Escala de dano por fase

### ⚔️ Tropas
- Tipos: soldiers e archers
- Ataque coletivo por turno
- Treinamento por recurso
- Evolução de tropas (aumenta ATK / HP)

### 🪖 Construtores
- Construtores coletam madeira, ouro e comida por ação dedicada
- Possível contratar mais construtores (custo em recursos)

### 🏛 Quartel & Arsenal
- Fabricação e melhoria de: catapultas, canhões antigos, cavalos, cavalaria, escudos e lanças
- Armas de cerco e cavalaria adicionam dano extra; escudos somam defesa do castelo

### 👹 Inimigos
- HP, max HP (com barra), ícone, ataque, distância e recompensa em ouro
- Orks e chefes concedem energia e cura ao morrer
- Novos inimigos vão sendo desbloqueados por fase

### 🔁 Sistema de turnos
Mecânica a cada turno:
1. Torres atacam  
2. Tropas + arsenal atacam  
3. Inimigos revidam (considerando escudos)  
4. Castelo recebe dano residual  
5. Recompensas por inimigos mortos
6. Avança turno / fase

### 🪵 Recursos
- Ouro, madeira, comida e energia coletáveis por ações (coleta padrão e coleta de construtores)
- Custos dinâmicos por fase/mapa

### 🔄 Reset / Mapa
- Reset do jogo a qualquer momento
- Game Over quando HP chega a 0
- Vitória do mapa ao vencer todas as fases, com opção de próximo mapa

### 🖼 Preview
Você pode substituir quando quiser por prints reais do seu jogo.

---

## 📡 Rotas da API

- `POST /game/start` — Inicia um novo jogo.
- `GET /game/status` — Retorna o estado atual.
- `POST /game/turn` — Resolve o turno e retorna o novo estado.
- `POST /game/tower/:id/upgrade` — Upa uma torre.
- `POST /game/tower/add` — Constrói uma nova torre.
- `POST /game/troops/train` — Treina tropas (soldiers ou archers).
- `POST /game/troops/upgrade` — Evolui tropas (melhora ATK / HP).
- `POST /game/castle/wall/upgrade` — Reforça a muralha do castelo.
- `POST /game/castle/heal` — Cura o castelo usando energia + comida.
- `POST /game/collect` — Coleta ouro, madeira, comida e energia.
- `POST /game/builders/collect` — Coleta recursos com construtores.
- `POST /game/builders/hire` — Contrata novos construtores.
- `POST /game/armory/build` — Fabrica itens do arsenal (catapultas, canhões, etc.).
- `POST /game/armory/upgrade` — Melhora itens do arsenal.
- `POST /game/reset` — Reinicia toda a partida.
- `POST /game/map/next` — Avança para o próximo mapa após vitória.

---

## 🧠 Mapa da Game Engine
- Sistema de dano
- Cálculo dinâmico de fases
- Escalonamento de HP e ATK de inimigos (com ícone, recompensa e distância)
- Lógica de batalha com torres, tropas, arsenal e defesa extra de escudos
- Economia (ouro, madeira, comida, energia) e coleta via construtores
- Log de eventos com histórico

---

## 🚀 Roadmap
Coisas já mapeadas para evolução:

- Heroínas com habilidades especiais
- Novos tipos de inimigos (chefe, rápido, tanque...)
- Sistema de eventos aleatórios
- Modo sobrevivência infinito
- Sistema de save/load com localStorage
- Efeitos sonoros e animações
- Modo mapa (tower defense grid)
- Pontuação global e ranking

---

## 🤝 Contribuindo
- Pull Requests são bem-vindos!
- Sugestões, ideias e melhorias também.

---

## 📄 Licença
MIT — use como quiser.

<div align="center">

Feito com ❤️ por Izaac Baptista  
Se divirta defendendo seu reino! 🏰⚔️🔥

</div>

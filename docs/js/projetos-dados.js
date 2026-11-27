// @ts-check
/**
 * @typedef {{kind:'image'|'gif'|'video'|'youtube', src:string, caption:string, alt:string}} ProjectMedia
 * @typedef {{
 *   id:string, name:string, type:string, category:'academic'|'personal', description:string,
 *   tags:string[], cover:string, title:string, url:string, demo?:{url:string,label:string},
 *   theme:{accent:string,light:string,surface:string}, media:ProjectMedia[], overview:string,
 *   problem:string, features:string[], contributions:string[], context:string,
 *   evidence:{url:string,label:string}
 * }} PortfolioProject
 */

/** @type {PortfolioProject[]} */
const portfolioProjects = [
  {
    id: 'eco', name: 'EcoByteMetrics', type: 'ACADÊMICO / FULL STACK', category: 'academic',
    description: 'Plataforma de monitoramento energético e ambiental de software.',
    tags: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    cover: 'assets/projetos/capas/ECO.png', title: 'assets/projetos/titulos/titulo-eco.png',
    url: 'https://github.com/pentascripts-organization/EcoByteMetrics',
    demo: {url: 'https://youtu.be/-J-_2v4ASvk', label: 'Ver demonstração'},
    theme: {accent: '#86e7a6', light: '#47d9d4', surface: '#101d18'},
    media: [
      {kind: 'image', src: 'assets/projetos/galeria/eco-inicio.png', caption: 'Aplicação · Página inicial', alt: 'Página inicial do EcoByteMetrics com a apresentação do impacto ambiental e o acesso ao monitoramento.'},
      {kind: 'image', src: 'assets/projetos/galeria/eco-painel.png', caption: 'Dashboard · Dados de teste', alt: 'Painel de monitoramento do EcoByteMetrics exibindo os serviços do ambiente de teste.'},
      {kind: 'image', src: 'assets/projetos/galeria/eco-filtros.png', caption: 'Dashboard · Filtros do histórico', alt: 'Painel com a seleção de filtros aberta sobre os dados de teste.'},
      {kind: 'image', src: 'assets/projetos/galeria/eco-acesso.png', caption: 'Aplicação · Acesso à conta', alt: 'Tela de login do EcoByteMetrics.'},
      {kind: 'youtube', src: '-J-_2v4ASvk', caption: 'Demonstração · Terceira sprint', alt: 'Apresentação das entregas finais da equipe PentaScripts.'}
    ],
    overview: 'O EcoByteMetrics transforma leituras de CPU, memória e rede em estimativas de consumo elétrico e emissões de carbono por microsserviço.',
    problem: 'Métricas de infraestrutura isoladas dificultam enxergar o custo ambiental de uma aplicação. O painel reúne os serviços e permite comparar seu impacto no mesmo intervalo de tempo.',
    features: ['Monitoramento de serviços e de falhas na coleta de métricas.', 'Ranking de impacto e comparação entre aplicações.', 'Visualização geográfica das emissões estimadas.'],
    contributions: ['Trabalhei nas interfaces de comparação e monitoramento, incluindo a apresentação em telas de celular.', 'Contribuí para a área de administração e para a correção da reentrada e dos perfis de acesso.'],
    context: 'Projeto acadêmico da PentaScripts. Integrei a equipe de desenvolvimento, com foco no front-end. A arquitetura full stack e os cálculos ambientais são entregas do grupo.',
    evidence: {url:'https://github.com/pentascripts-organization/EcoByteMetrics/blob/main/docs/plano-de-entregas.md', label:'Consultar registro das entregas'}
  },
  {
    id: 'dungeon', name: 'Scrum Dungeon', type: 'ACADÊMICO / RPG EDUCATIVO', category: 'academic',
    description: 'Aprendizado de Scrum em uma aventura com fases e desafios interativos.',
    tags: ['JavaScript', 'Node.js', 'Express', 'EJS', 'PostgreSQL'],
    cover: 'assets/projetos/capas/SCRUM.png', title: 'assets/projetos/titulos/titulo-dungeon.png',
    url: 'https://github.com/octopusCode26/scrum-dungeon',
    demo: {url: 'https://www.youtube.com/watch?v=iSikcW3CIZE', label: 'Ver demonstração'},
    theme: {accent: '#e9bd79', light: '#bd843d', surface: '#221c16'},
    media: [
      {kind:'image', src:'assets/projetos/galeria/scrum-mapa.png', caption:'Protótipo original · Sala dos desafios', alt:'Protótipo do mapa com cinco portas de capítulos e a seleção entre história e desafio.'},
      {kind:'image', src:'assets/projetos/galeria/scrum-quiz.png', caption:'Protótipo · Questionário', alt:'Tela do questionário do Scrum Dungeon.'},
      {kind:'image', src:'assets/projetos/galeria/scrum-resultado-reprovado.png', caption:'Protótipo · Resultado do desafio', alt:'Tela de resultado após uma tentativa sem aprovação.'},
      {kind:'image', src:'assets/projetos/capas/SCRUM.png', caption:'Arte · Capa do projeto', alt:'Ilustração de capa do Scrum Dungeon.'},
      {kind:'youtube', src:'iSikcW3CIZE', caption:'Demonstração · A aventura em jogo', alt:'Apresentação em vídeo do Scrum Dungeon.'}
    ],
    overview: 'Um RPG de navegador em que cada fase apresenta uma prática de Scrum. A jornada começa nos fundamentos e termina com um desafio sobre o ciclo completo.',
    problem: 'Memorizar papéis e cerimônias é diferente de saber quando usá-los. A equipe transformou esses conceitos em decisões e desafios que o jogador resolve para avançar.',
    features: ['Cinco níveis com progressão por desempenho.', 'Questionários com sorteio de questões e registro de tentativas.', 'Histórico de resultados e certificado digital de conclusão.'],
    contributions: ['Elaborei o diagrama de casos de uso e colaborei nos diagramas de classes e de sequência.', 'Participei do questionário, da exibição de resultados e da tela de emissão de certificado.', 'Escrevi a história e desenvolvi a pagina do nível 2, dedicado a papéis e Personagens.'],
    context: 'Projeto integrador do primeiro semestre de Desenvolvimento de Software Multiplataforma na FATEC Jacareí. Atuei como desenvolvedor na Octopus Code ao longo de três sprints.',
    evidence: {url:'https://github.com/octopusCode26/scrum-dungeon/tree/main/docs/sprints', label:'Consultar as três sprints'}
  },
  {
    id:'recall', name:'RECALL', type:'PESSOAL / DESKTOP', category:'personal',
    description:'Aplicação em desenvolvimento para notas, lembretes e foco.',
    tags:['TypeScript', 'Svelte', 'Tauri', 'SQLite'],
    cover:'assets/projetos/capas/RECALL.png', title:'assets/projetos/titulos/titulo-recall.png',
    url:'https://github.com/VtecturboBr/RECALL',
    theme:{accent:'#ff849a', light:'#ef224a', surface:'#221419'},
    media:[
      {kind:'image', src:'assets/projetos/galeria/recall-previa.png', caption:'Interface · Biblioteca de notas', alt:'Captura da prévia oficial do RECALL com a biblioteca vazia e os comandos para criar ou capturar uma nota.'},
      {kind:'image', src:'assets/projetos/galeria/recall-captura.png', caption:'Interface · Captura rápida', alt:'Janela de captura rápida aberta na prévia do RECALL.'}
    ],
    overview:'O RECALL reúne notas, lembretes e ferramentas de foco em um aplicativo para Windows. Os dados da versão desktop ficam em um banco SQLite local.',
    problem:'Uma ideia rápida pode se perder ao trocar de janela. O fluxo de captura por atalho permite registrar a nota e retomar a tarefa, com o aplicativo ativo na bandeja.',
    features:['Notas com salvamento automático, pesquisa e fixação.', 'Cartões flutuantes e lembretes enquanto o processo está ativo.', 'Prévia independente em HTML com armazenamento no navegador.'],
    contributions:['Desenvolvo o RECALL como projeto pessoal, integrando a interface em Svelte à camada desktop em Tauri.', 'Disponibilizei uma prévia para experimentar a organização de notas diretamente no navegador.'],
    context:'A versão 0.4 está em desenvolvimento. A prévia permite explorar a interface. A compilação e a distribuição do executável Windows ainda precisam de validação.',
    evidence:{url:'https://github.com/VtecturboBr/RECALL#valida%C3%A7%C3%A3o', label:'Consultar o estado da versão'}
  }
];

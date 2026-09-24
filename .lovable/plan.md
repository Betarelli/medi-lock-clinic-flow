# Fontes documentais interativas

## Objetivo
Tornar todas as fontes com documento na Visão Clínica claramente clicáveis e abrir uma visualização rápida coerente com cada evidência.

## Alterações
- Substituir os textos de fonte de hipertensão, diabetes, glicemia e exames de rotina por botões de link azuis, com destaque ao passar o cursor, foco visível e ícone `ExternalLink`.
- Manter a fonte informada via WhatsApp como texto, pois não existe ficheiro original para visualizar.
- Criar um único estado local para o documento selecionado e reutilizar um modal para todas as fontes.
- Simular uma folha laboratorial branca, exibindo nome do ficheiro, página, paciente, data e o trecho correspondente destacado em amarelo.
- Exibir no topo direito o botão “Fechar visualizador (ESC)”; o modal também continuará fechando pela tecla Escape.

## Conteúdo por fonte
- Receita de Losartana: destacar o trecho que sustenta hipertensão arterial.
- Laudo de Glicemia: destacar a glicemia de jejum de 138 mg/dL.
- Laudo Bioquímico, página 1: destacar a glicemia de 138 mg/dL.
- Laudo Bioquímico, páginas 1 e 2: destacar HbA1c de 7,4% e mostrar os demais resultados de rotina.

## Validação
- Confirmar abertura, conteúdo específico e fechamento por botão e Escape.
- Conferir a Visão Clínica em desktop e mobile, sem sobreposição ou rolagem horizontal.

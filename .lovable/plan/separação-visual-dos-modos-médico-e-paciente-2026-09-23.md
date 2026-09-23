# Separação visual dos modos Médico e Paciente

## Objetivo
Diferenciar claramente os dois perfis sem alterar fluxos, conteúdo ou recursos de acessibilidade existentes.

## Alterações
- Aplicar uma identidade azul-petróleo (`#0B4F6C`) à Visão do Médico, incluindo cabeçalho, botões principais, links de fontes, ícones e estados de foco.
- Aplicar uma identidade verde-saúde (`#008542`) à Visão do Paciente, incluindo identificação, perfil clínico, token, upload, documentos e privacidade ativa.
- Fazer o seletor de visualização refletir a cor do perfil ativo.
- Manter vermelho semântico para alergias, erros e encerramento da consulta em ambas as visões.
- Preservar o modo de alto contraste, garantindo preto, branco, verde acessível e vermelho para riscos.

## Detalhes técnicos
- Criar conjuntos de tokens semânticos por perfil no tema global.
- Aplicar a classe do perfil ativo no contêiner principal para que os componentes existentes herdem a identidade correta.
- Ajustar o alerta de alergia para vermelho, sem reutilizar o amarelo clínico.
- Validar visualmente as duas visões e conferir contraste, foco por teclado e ausência de regressões em celular e desktop.

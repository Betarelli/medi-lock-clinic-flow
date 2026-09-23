# Plano — Modo Paciente MediLock

## Objetivo
Adicionar uma experiência mobile-first “MediLock — Minha Saúde” e um seletor persistente no topo para alternar instantaneamente entre a visão do médico existente e a nova visão do paciente.

## Experiência do paciente
- Cabeçalho compacto com avatar, saudação a João Silva e informação da consulta com Dr. Carlos Eduardo às 14:30.
- Seletor destacado “Visualização: Paciente | Médico”, acessível e adaptado a telas pequenas.
- Card verde de liberação em sala com token `849-201`, ação para copiar, confirmação visual e QR Code interativo.
- Aviso claro sobre expiração do código e autorização presencial.
- Central “Meus Documentos e Histórico” com contador de três arquivos, envio simulado por PDF ou câmera e lista dos exames fornecidos.
- Visualização simulada de cada documento em modal, com nome, data, tipo e conteúdo resumido.
- Card de privacidade ativa com escudo verde e histórico do último acesso autorizado.

## Comportamento
- Alternar entre Paciente e Médico sem perder o estado atual do fluxo médico.
- Copiar o token usando a área de transferência e mostrar confirmação na própria tela.
- Permitir escolher arquivo ou capturar foto no celular; atualizar o aviso após a seleção.
- Abrir e fechar QR Code e documentos com controles acessíveis.

## Direção visual
- Manter a identidade clínica azul-petróleo existente, usando verde vivo apenas para liberação e privacidade.
- Priorizar leitura linear, áreas de toque confortáveis e boa hierarquia no celular.
- Expandir para desktop sem transformar a experiência do paciente em um painel excessivamente largo.

## Verificação
- Conferir alternância de visão, cópia do token, QR Code, upload e abertura dos três documentos.
- Validar visualmente em celular e desktop, sem sobreposição ou texto cortado.

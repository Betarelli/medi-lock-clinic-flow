# Plano — Histórico Clínico MediLock

## Objetivo
Adicionar o perfil clínico do paciente e condições crônicas rastreáveis ao prontuário médico, sem alterar os fluxos existentes de token, documentos, alertas e encerramento da consulta.

## Visão do paciente
- Inserir “Meu Perfil Clínico” logo após o cabeçalho.
- Exibir badges para Hipertensão Arterial, Diabetes Tipo 2 e Alergia a Penicilina.
- Adicionar a ação “[+] Informar nova condição ou alergia” com interação simulada e confirmação visual.
- Preservar integralmente o token/QR Code, os documentos e a área de privacidade.

## Visão do médico
- Inserir “Condições Crônicas Pré-Identificadas” no topo do prontuário desbloqueado.
- Criar três registros com condição, origem rastreável e ações individuais de confirmação ou descarte.
- Destacar a alergia a penicilina com alerta clínico amarelo/vermelho.
- Manter o ponto de atenção da glicemia e o guardrail de prescrição sem evidência.
- Fazer cada decisão mudar de estado e permitir desfazer, registrando visualmente a supervisão médica.

## Padrão visual e validação
- Ajustar o verde hospitalar para `#008542` por meio dos tokens semânticos do sistema visual.
- Manter cards compactos, bordas suaves, ícones clínicos e boa leitura em desktop e celular.
- Verificar desbloqueio com `849201`, decisões médicas, ação do perfil do paciente e ausência de cortes ou sobreposição nos dois tamanhos de tela.

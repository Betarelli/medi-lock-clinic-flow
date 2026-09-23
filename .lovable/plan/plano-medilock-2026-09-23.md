# Plano — MediLock

## Objetivo
Criar uma aplicação clínica responsiva com dois estados: prontuário bloqueado e consulta desbloqueada, priorizando desktop para o médico e mobile para o paciente.

## Experiência principal
- Barra superior com identificação do médico e status visual da consulta.
- Tela inicial bloqueada com mensagem LGPD, token formatado em 6 dígitos, validação do código `849201` e alternativa de QR Code.
- Fluxo de simulação para liberar o prontuário sem depender de câmera real.
- Após o desbloqueio, painel clínico com resumo do paciente, alerta rastreável, fonte clicável e ações médicas.
- Guardrail em destaque para deixar explícita a sugestão descartada por falta de evidência.
- Ações finais para adicionar laudo e encerrar a consulta, revogando o acesso e retornando ao estado bloqueado.
- Estados visuais de sucesso, ignorado, consulta ativa e acesso revogado.

## Direção visual
- Clínica moderna, limpa e profissional em azul-petróleo, branco e neutros frios.
- Hierarquia clara, contraste acessível, bordas discretas e tipografia sóbria.
- Layout amplo e informativo no desktop; controles maiores e leitura linear no mobile.
- Animações leves nas transições, respeitando preferência por movimento reduzido.

## Detalhes técnicos
- Implementar na página inicial com React e Tailwind, usando tokens semânticos no sistema visual.
- Usar ícones consistentes e componentes acessíveis para botões, campos, alertas e modal da fonte.
- Validar e normalizar o token no navegador, limitar a seis dígitos e apresentar erro claro para códigos inválidos.
- Incluir metadados próprios da MediLock para título, descrição e compartilhamento.
- Verificar visualmente os fluxos e a adaptação em desktop e mobile.

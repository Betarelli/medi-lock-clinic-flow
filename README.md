# MediLock Clinical Hub

Crie uma aplicação web responsiva para desktop (visão do médico) e mobile (visão do paciente) chamada "MediLock - Copiloto Clínico com Acesso em Sala".

A aplicação deve conter:

1. Barra Superior:

   - Identificação do médico: "Dr. Carlos Eduardo - CRM/SP 123456".

   - Status da Consulta: "Paciente na Recepção" (badge amarelo) ou "Em Consulta" (badge verde).

2. Estado 1 (Bloqueado - Tela Inicial):

   - Card central com ícone de cadeado.

   - Mensagem: "Prontuário Bloqueado por LGPD. Aguardando paciente em sala."

   - Campo para digitar Token de 6 dígitos (ex: 849-201) e botão "Desbloquear com Token".

   - Botão alternativo: "Escanear QR Code do Paciente".

3. Estado 2 (Desbloqueado - Ao inserir o token correto "849201" ou clicar em simular):

   - Painel dividido em 3 seções:

     A) Resumo do Paciente: João Silva, 48 anos. Histórico de envio de 2 laudos pré-consulta.

     B) Ponto de Atenção Rastreável: 

        - Alerta: "Glicemia de jejum elevada (138 mg/dL) com tendência de alta."

        - Citação clicável: "[Fonte: Laudo_Bioquimica_Out2025.pdf - Página 1]".

        - Botões de ação médica: "Aceitar / Registrar no Prontuário" e "Ignorar".

     C) Sugestão Bloqueada por Falta de Evidência (Guardrail):

        - Card em tom cinza/alerta: "Sugestão Descartada: Prescrição de Estatina."

        - Motivo explícito: "Bloqueado: Nenhuma evidência de perfil lipídico recente no histórico enviado."

     D) Botão de Ação Final:

        - "Adicionar Laudo da Consulta" e botão vermelho "Encerrar Consulta & Revogar Acesso".

Design limpo, profissional (estilo clínica moderna com tons azul petróleo e branco), botões interativos que mudam de estado ao clicar.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5d75181d-9005-4ca2-897f-439e979b41ef).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

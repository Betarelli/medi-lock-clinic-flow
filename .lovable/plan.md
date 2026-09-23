# Tela de Acesso do Paciente

## Objetivo
Adicionar uma entrada mobile-first para o paciente e conectar esse fluxo à experiência existente do MediLock.

## O que será alterado
- Criar a tela “Acesso do Paciente - MediLock” com identidade verde, mensagem institucional, celular com máscara brasileira, CPF e consentimento LGPD.
- Validar o preenchimento básico dos dois campos e, ao entrar, abrir diretamente a Visão do Paciente existente.
- Adicionar “Sair / Trocar de Conta” no topo da área autenticada para retornar à tela de acesso.
- Preservar o seletor Paciente/Médico, o token, documentos, acessibilidade e todas as interações já existentes.

## Detalhes técnicos
- O acesso será uma simulação local para demonstração, sem cadastro real ou persistência de dados.
- Os campos terão rótulos claros, teclado apropriado no celular, máscaras de entrada, mensagens acessíveis e foco visível.
- A tela será conferida em celular e desktop, incluindo entrada, saída e ausência de rolagem horizontal.

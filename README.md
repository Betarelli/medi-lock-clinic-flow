# 🔒 MediLock — Copiloto Clínico com Acesso em Sala por Token

> **"O histórico médico nas mãos do paciente; insights rastreáveis na tela do doutor."**  
> Projeto desenvolvido durante o **Hack Inova OS 2.0 (HealthTech)** — Universidade Anhembi Morumbi (Campus Av. Paulista).

🔗 **Protótipo Funcional Online:** [https://medi-lock-clinic-flow.lovable.app/](https://medi-lock-clinic-flow.lovable.app/)

---

## 🏆 O Hackathon e o Desafio

O **Hack Inova OS 2.0** desafiou os estudantes a aplicarem Inteligência Artificial prática para transformar a área da saúde. 

Nossa equipe trabalhou no **Desafio 04 — Copiloto Clínico Seguro**, com foco em resolver a sobrecarga de informações médicas e garantir a privacidade e segurança dos dados dos pacientes:
* **Rastreabilidade Documental:** Toda informação clínica consolidada deve apontar exatamente para o documento e página de origem.
* **Trava Anti-Alucinação:** O sistema descarta e bloqueia automaticamente qualquer sugestão que não possua respaldo em exames e laudos recentes.
* **Supervisão Humana Obrigatória:** A IA atua apenas como copiloto de suporte; a validação final cabe 100% ao médico, que decide aceitar ou ignorar cada ponto.

---

## 💡 O que é o MediLock?

O **MediLock** é uma plataforma de inteligência pré-consulta que organiza laudos e receitas fragmentados sem expor os dados do paciente fora do momento de atendimento:

1. **Envio Prévio e Cofre Trancado:** O paciente envia PDFs de laudos ou fotos de receitas antigas via WhatsApp ou web[cite: 1, 4]. Os arquivos são processados e armazenados em um cofre digital criptografado, permanecendo inacessíveis para terceiros antes do atendimento.
2. **Aperto de Mão Digital em Sala:** O médico só consegue abrir o histórico quando o paciente está fisicamente no consultório e fornece um **Token numérico efêmero (ex.: `849-201`)** ou apresenta um QR Code.
3. **Consulta Ágil e Fechamento Seguro:** O profissional acessa uma linha do tempo com alertas rastreáveis[cite: 1, 4]. Ao finalizar o atendimento, o token expira imediatamente, o cofre é trancado e um registro de auditoria é gravado.

---

## 📊 Validação Real ($N = 27$)

Durante a maratona, aplicamos uma pesquisa com 27 respondentes para validar o problema e a solução:
* **70,4%** dos pacientes perdem tempo substancial em consultas procurando exames ou repetindo histórico.
* **66,7%** já enfrentaram apuros por esquecer laudos e receitas em papel.
* **88,9%** afirmaram intenção de uso do envio antecipado com liberação presencial por código.
* **51,9%** condicionaram a adesão à garantia explícita de que ninguém verá seus dados fora da consulta, validando o conceito de acesso estritamente presencial via Token.

---

## ⚙️ Tecnologias e Implementação

* **Frontend e Interatividade:** Desenvolvido no [Lovable](https://lovable.app/) com foco em usabilidade, diferenciação cromática entre Modo Médico e Modo Paciente, e acessibilidade nativa (alto contraste, navegação por teclado e síntese de voz para leitura do token e alertas).
* **Arquitetura de Dados Zero-Trust:** Modelagem de segurança com banco relacional e regras de **Row Level Security (RLS)**, garantindo que registros clínicos só sejam consultados durante sessões ativas e com token válido.
* **Automação e Ingestão:** Fluxo planejado para captura de anexos via Webhook no WhatsApp, OCR e extração estruturada de evidências clínicas.

---

## 👥 Equipe

Estudantes de **Ciência da Computação (Turno Noturno) — Universidade Anhembi Morumbi**:
* **Gustavo Betarelli Leite** — RA: 12526130738
* **Enrico Rodrigues da Silva** — RA: 12526175153
* **Leonardo Jorge Nobre de Lima** — RA: 12526143614

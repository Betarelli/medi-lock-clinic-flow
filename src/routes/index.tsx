import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  FilePlus2,
  HeartPulse,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediLock — Copiloto Clínico com Acesso em Sala" },
      {
        name: "description",
        content: "Acesso clínico seguro, rastreável e consentido pelo paciente durante a consulta.",
      },
      { property: "og:title", content: "MediLock — Copiloto Clínico com Acesso em Sala" },
      {
        property: "og:description",
        content: "Prontuário seguro e inteligência clínica rastreável para consultas presenciais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MediLockApp,
});

type AttentionState = "pending" | "accepted" | "ignored";

function Brand() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm">
        <HeartPulse className="size-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-lg font-extrabold text-foreground">MediLock</p>
        <p className="hidden text-xs text-muted-foreground sm:block">Copiloto Clínico com Acesso em Sala</p>
      </div>
    </div>
  );
}

function Header({ unlocked }: { unlocked: boolean }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto grid min-h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:flex sm:justify-between sm:px-6 lg:px-8">
        <Brand />
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <div className="hidden min-w-0 items-center gap-2 border-r border-border pr-6 md:flex">
            <Stethoscope className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <p className="truncate text-sm font-semibold">Dr. Carlos Eduardo <span className="font-normal text-muted-foreground">· CRM/SP 123456</span></p>
          </div>
          <div className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${unlocked ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>
            <span className={`size-2 rounded-full ${unlocked ? "bg-success" : "bg-warning"}`} />
            <span className="hidden sm:inline">{unlocked ? "Em Consulta" : "Paciente na Recepção"}</span>
            <span className="sm:hidden">{unlocked ? "Em consulta" : "Recepção"}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-2 md:hidden">
        <p className="truncate text-xs font-semibold text-muted-foreground">Dr. Carlos Eduardo · CRM/SP 123456</p>
      </div>
    </header>
  );
}

function MediLockApp() {
  const [unlocked, setUnlocked] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [attention, setAttention] = useState<AttentionState>("pending");
  const [notice, setNotice] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const updateToken = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 6);
    setToken(digits.length > 3 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : digits);
    if (error) setError("");
  };

  const unlock = (event?: FormEvent) => {
    event?.preventDefault();
    if (token.replace(/\D/g, "") !== "849201") {
      setError("Token inválido. Confira os 6 dígitos com o paciente.");
      return;
    }
    setUnlocked(true);
    setQrOpen(false);
    setNotice("Acesso autorizado pelo paciente.");
  };

  const simulateQr = () => {
    setToken("849-201");
    setUnlocked(true);
    setQrOpen(false);
    setNotice("QR Code validado. Acesso autorizado pelo paciente.");
  };

  const revoke = () => {
    setUnlocked(false);
    setToken("");
    setAttention("pending");
    setNotice("Consulta encerrada. O acesso ao prontuário foi revogado.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header unlocked={unlocked} />
      {notice && (
        <div className="border-b border-success/20 bg-success-soft px-4 py-2 text-center text-sm font-medium text-success" role="status">
          {notice}
          <button className="ml-3 align-middle" aria-label="Fechar aviso" onClick={() => setNotice("")}><X className="size-4" /></button>
        </div>
      )}

      <main>{unlocked ? (
        <UnlockedDashboard
          attention={attention}
          setAttention={setAttention}
          setSourceOpen={setSourceOpen}
          onUpload={() => fileInput.current?.click()}
          onRevoke={revoke}
        />
      ) : (
        <LockedView token={token} error={error} updateToken={updateToken} unlock={unlock} openQr={() => setQrOpen(true)} />
      )}</main>

      <input
        ref={fileInput}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) setNotice(`${file.name} adicionado à consulta.`);
          event.target.value = "";
        }}
      />

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="max-w-sm rounded-lg">
          <DialogHeader>
            <DialogTitle>Escanear QR Code</DialogTitle>
            <DialogDescription>Posicione o código exibido no celular do paciente dentro da área abaixo.</DialogDescription>
          </DialogHeader>
          <div className="mx-auto grid aspect-square w-56 place-items-center rounded-lg border-2 border-dashed border-primary/40 bg-secondary">
            <QrCode className="size-24 text-primary" aria-hidden="true" />
          </div>
          <Button size="lg" onClick={simulateQr}>Simular leitura autorizada</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={sourceOpen} onOpenChange={setSourceOpen}>
        <DialogContent className="max-w-xl rounded-lg">
          <DialogHeader>
            <DialogTitle>Laudo_Bioquimica_Out2025.pdf</DialogTitle>
            <DialogDescription>Página 1 · Resultado laboratorial enviado pelo paciente</DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-border bg-muted p-5 text-sm leading-7">
            <p className="font-bold">Glicemia de jejum</p>
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3">
              <span className="text-muted-foreground">Resultado</span><strong>138 mg/dL</strong>
              <span className="text-muted-foreground">Referência</span><span>70–99 mg/dL</span>
              <span className="text-muted-foreground">Resultado anterior</span><span>126 mg/dL</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LockedView({ token, error, updateToken, unlock, openQr }: {
  token: string;
  error: string;
  updateToken: (value: string) => void;
  unlock: (event?: FormEvent) => void;
  openQr: () => void;
}) {
  return (
    <section className="medilock-enter mx-auto flex min-h-[calc(100vh-8.25rem)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-10">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-secondary text-primary">
          <LockKeyhole className="size-7" aria-hidden="true" />
        </div>
        <div className="mt-6 text-center">
          <p className="text-xs font-bold uppercase text-primary">Acesso protegido</p>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight sm:text-3xl">Prontuário Bloqueado por LGPD</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Aguardando paciente em sala. O acesso só será liberado com consentimento presencial.</p>
        </div>

        <form onSubmit={unlock} className="mt-8">
          <label htmlFor="token" className="mb-2 block text-sm font-bold">Token de acesso do paciente</label>
          <Input
            id="token"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={7}
            value={token}
            onChange={(event) => updateToken(event.target.value)}
            placeholder="000-000"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "token-error" : "token-help"}
            className="h-14 text-center text-xl font-extrabold tracking-[0.22em] focus-visible:ring-2 md:text-xl"
          />
          {error ? <p id="token-error" className="mt-2 text-sm font-medium text-destructive">{error}</p> : <p id="token-help" className="mt-2 text-xs text-muted-foreground">Digite os 6 dígitos exibidos no celular do paciente.</p>}
          <Button type="submit" size="lg" className="mt-5 h-12 w-full" disabled={token.replace(/\D/g, "").length !== 6}>
            <LockKeyhole /> Desbloquear com Token
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />ou<span className="h-px flex-1 bg-border" /></div>
        <Button type="button" variant="outline" size="lg" className="h-12 w-full" onClick={openQr}>
          <QrCode /> Escanear QR Code do Paciente
        </Button>
        <div className="mt-7 flex items-start gap-2 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>Acesso temporário e auditável. Será revogado automaticamente ao encerrar a consulta.</p>
        </div>
      </div>
    </section>
  );
}

function UnlockedDashboard({ attention, setAttention, setSourceOpen, onUpload, onRevoke }: {
  attention: AttentionState;
  setAttention: (state: AttentionState) => void;
  setSourceOpen: (open: boolean) => void;
  onUpload: () => void;
  onRevoke: () => void;
}) {
  return (
    <section className="medilock-enter mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">Consulta em andamento</p>
          <h1 className="mt-1 truncate text-2xl font-extrabold sm:text-3xl">Visão Clínica</h1>
        </div>
        <div className="hidden items-center gap-2 text-xs font-medium text-muted-foreground sm:flex"><Clock3 className="size-4" /> Acesso temporário ativo</div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.4fr]">
        <article className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2 text-primary"><UserRound className="size-5" /><h2 className="text-sm font-bold uppercase">Resumo do paciente</h2></div>
          <div className="mt-6 flex items-center gap-4">
            <div className="grid size-14 shrink-0 place-items-center rounded-full bg-secondary text-lg font-extrabold text-primary">JS</div>
            <div className="min-w-0"><h3 className="truncate text-xl font-extrabold">João Silva</h3><p className="text-sm text-muted-foreground">48 anos</p></div>
          </div>
          <div className="mt-6 rounded-md bg-muted p-4">
            <div className="flex items-start gap-3"><FileCheck2 className="mt-0.5 size-5 shrink-0 text-primary" /><div><p className="font-bold">2 laudos pré-consulta</p><p className="mt-1 text-sm leading-5 text-muted-foreground">Documentos enviados e processados antes do atendimento.</p></div></div>
          </div>
        </article>

        <article className="rounded-lg border border-warning/35 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2 text-warning"><AlertTriangle className="size-5" /><h2 className="text-sm font-bold uppercase">Ponto de atenção rastreável</h2></div>
          <p className="mt-5 text-lg font-bold leading-7">Glicemia de jejum elevada <span className="text-warning">(138 mg/dL)</span> com tendência de alta.</p>
          <button onClick={() => setSourceOpen(true)} className="mt-4 flex items-start gap-2 text-left text-sm font-semibold text-primary underline underline-offset-4 hover:text-clinical">
            <ExternalLink className="mt-0.5 size-4 shrink-0" /><span>[Fonte: Laudo_Bioquimica_Out2025.pdf - Página 1]</span>
          </button>
          {attention === "pending" ? (
            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
              <Button className="min-h-11 flex-1 whitespace-normal" onClick={() => setAttention("accepted")}><Check /> Aceitar / Registrar no Prontuário</Button>
              <Button variant="outline" className="min-h-11 sm:w-28" onClick={() => setAttention("ignored")}>Ignorar</Button>
            </div>
          ) : (
            <div className={`mt-6 flex items-center justify-between gap-3 rounded-md p-4 ${attention === "accepted" ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`} role="status">
              <div className="flex items-center gap-2 text-sm font-bold">{attention === "accepted" ? <CheckCircle2 className="size-5" /> : <X className="size-5" />}{attention === "accepted" ? "Registrado no prontuário" : "Ponto de atenção ignorado"}</div>
              <Button variant="ghost" size="sm" onClick={() => setAttention("pending")}>Desfazer</Button>
            </div>
          )}
        </article>
      </div>

      <article className="mt-5 rounded-lg border border-border bg-muted p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-md bg-background text-muted-foreground"><ShieldCheck className="size-5" /></div>
          <div className="min-w-0"><p className="text-xs font-bold uppercase text-muted-foreground">Guardrail clínico</p><h2 className="mt-1 text-lg font-extrabold">Sugestão Descartada: Prescrição de Estatina.</h2><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Bloqueado:</strong> Nenhuma evidência de perfil lipídico recente no histórico enviado.</p></div>
        </div>
      </article>

      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Button variant="outline" size="lg" className="h-12" onClick={onUpload}><FilePlus2 /> Adicionar Laudo da Consulta</Button>
        <Button variant="destructive" size="lg" className="h-12" onClick={onRevoke}>Encerrar Consulta &amp; Revogar Acesso <ArrowRight /></Button>
      </div>
    </section>
  );
}
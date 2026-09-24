import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Clock3,
  Eye,
  ExternalLink,
  FileCheck2,
  FileImage,
  FilePlus2,
  FileText,
  FlaskConical,
  Gauge,
  HeartPulse,
  History,
  LockKeyhole,
  LogOut,
  Plus,
  QrCode,
  ShieldCheck,
  Square,
  Stethoscope,
  TestTube2,
  Upload,
  UserRound,
  UsersRound,
  Volume2,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

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
type AppView = "doctor" | "patient";
type ConditionId = "hypertension" | "diabetes" | "penicillin";
type ConditionDecision = "pending" | "confirmed" | "discarded";
type ConditionDecisions = Record<ConditionId, ConditionDecision>;
type ClinicalSourceId = "losartan" | "glucose" | "biochemistry-glucose" | "biochemistry-routine";

type ClinicalSource = {
  title: string;
  description: string;
  section: string;
  highlight: string;
  reference: string;
  supportingResults?: string[];
};

const clinicalSources: Record<ClinicalSourceId, ClinicalSource> = {
  losartan: {
    title: "Receita_Losartana_Jan2026.pdf • Página 1",
    description: "Receita médica original enviada pelo paciente",
    section: "Prescrição de uso contínuo",
    highlight: "Losartana Potássica 50 mg — tomar 1 comprimido pela manhã e 1 à noite.",
    reference: "Indicação clínica registrada: Hipertensão Arterial Sistêmica",
  },
  glucose: {
    title: "Laudo_Glicemia_Out2025.pdf • Página 1",
    description: "Laudo laboratorial original enviado pelo paciente",
    section: "Bioquímica Clínica",
    highlight: "Glicemia de Jejum: 138 mg/dL",
    reference: "Referência: 70 a 99 mg/dL",
  },
  "biochemistry-glucose": {
    title: "Laudo_Bioquimica_Out2025.pdf • Página 1",
    description: "Laudo laboratorial original enviado pelo paciente",
    section: "Bioquímica Clínica",
    highlight: "Glicemia de Jejum: 138 mg/dL",
    reference: "Referência: 70 a 99 mg/dL",
    supportingResults: ["Método: Enzimático colorimétrico", "Resultado anterior: 126 mg/dL"],
  },
  "biochemistry-routine": {
    title: "Laudo_Bioquimica_Out2025.pdf • Páginas 1 e 2",
    description: "Laudo laboratorial original enviado pelo paciente",
    section: "Exames de Rotina",
    highlight: "Hemoglobina Glicada (HbA1c): 7,4%",
    reference: "Referência: até 5,7%",
    supportingResults: [
      "Colesterol Total: 182 mg/dL",
      "Triglicerídeos: 178 mg/dL",
      "Creatinina Sérica: 0,95 mg/dL",
      "Potássio (K+): 4,4 mEq/L",
    ],
  },
};

type PatientDocument = {
  name: string;
  date: string;
  type: "PDF" | "Foto";
  detail: string;
};

const patientDocuments: PatientDocument[] = [
  {
    name: "Laudo Bioquímica - Glicemia e Perfil Lipídico",
    date: "Out/2025",
    type: "PDF",
    detail: "Resultados de glicemia de jejum e perfil lipídico completo.",
  },
  {
    name: "Receita Médica - Metformina 500mg",
    date: "Jan/2026",
    type: "Foto",
    detail: "Receita médica fotografada e armazenada no seu cofre pessoal.",
  },
  {
    name: "Ressonância Magnética Coluna Lombar",
    date: "Ago/2024",
    type: "PDF",
    detail: "Laudo e imagens de ressonância magnética da coluna lombar.",
  },
];

function useSpeechController() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const activeUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    activeUtterance.current = null;
    setSpeakingId(null);
  }, []);

  const toggleSpeech = useCallback((id: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (speakingId === id) {
      stopSpeech();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance.current = utterance;
    utterance.lang = "pt-BR";
    utterance.rate = 0.9;
    const resetWhenCurrent = () => {
      if (activeUtterance.current === utterance) {
        activeUtterance.current = null;
        setSpeakingId(null);
      }
    };
    utterance.onend = resetWhenCurrent;
    utterance.onerror = resetWhenCurrent;
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  }, [speakingId, stopSpeech]);

  useEffect(() => stopSpeech, [stopSpeech]);

  return { speakingId, toggleSpeech, stopSpeech };
}

function AccessibilityBar({
  fontScale,
  setFontScale,
  highContrast,
  setHighContrast,
  onOpenCredits,
}: {
  fontScale: number;
  setFontScale: (scale: number) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  onOpenCredits: () => void;
}) {
  return (
    <aside className="border-b border-border bg-foreground px-4 py-2 text-background" aria-label="Barra de acessibilidade">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-2">
        <span className="mr-1 hidden text-xs font-bold sm:inline">Acessibilidade</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11 min-w-11 border-background/50 bg-foreground text-background hover:bg-background hover:text-foreground"
          onClick={() => setFontScale(Math.max(0, fontScale - 1))}
          disabled={fontScale === 0}
          aria-label="Diminuir tamanho da fonte"
        >
          A−
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11 min-w-11 border-background/50 bg-foreground text-background hover:bg-background hover:text-foreground"
          onClick={() => setFontScale(Math.min(2, fontScale + 1))}
          disabled={fontScale === 2}
          aria-label="Aumentar tamanho da fonte"
        >
          A+
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11 border-background/50 bg-foreground px-3 text-background hover:bg-background hover:text-foreground"
          onClick={() => setHighContrast(!highContrast)}
          aria-label={`${highContrast ? "Desativar" : "Ativar"} modo de alto contraste`}
          aria-pressed={highContrast}
        >
          <span className="size-4 rounded-full border border-current bg-token" aria-hidden="true" />
          Alto Contraste
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-11 border-background/50 bg-foreground px-3 text-background hover:bg-background hover:text-foreground"
          onClick={onOpenCredits}
          aria-label="Abrir informações da equipe e créditos"
        >
          <UsersRound className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Equipe &amp; Créditos</span>
          <span className="sm:hidden">Créditos</span>
        </Button>
      </div>
    </aside>
  );
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className={`grid size-10 shrink-0 place-items-center rounded-md shadow-sm ${inverse ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"}`}>
        <HeartPulse className="size-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className={`truncate text-lg font-extrabold ${inverse ? "text-primary-foreground" : "text-foreground"}`}>MediLock</p>
        <p className={`hidden text-xs sm:block ${inverse ? "text-primary-foreground/75" : "text-muted-foreground"}`}>Copiloto Clínico com Acesso em Sala</p>
      </div>
    </div>
  );
}

function Header({ unlocked }: { unlocked: boolean }) {
  return (
    <header className="border-b border-primary bg-primary text-primary-foreground">
      <div className="mx-auto grid min-h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:flex sm:justify-between sm:px-6 lg:px-8">
        <Brand inverse />
        <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <div className="hidden min-w-0 items-center gap-2 border-r border-primary-foreground/30 pr-6 md:flex">
            <Stethoscope className="size-4 shrink-0" aria-hidden="true" />
            <p className="truncate text-sm font-semibold">Dr. Carlos Eduardo <span className="font-normal text-primary-foreground/75">· CRM/SP 123456</span></p>
          </div>
          <div className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${unlocked ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>
            <span className={`size-2 rounded-full ${unlocked ? "bg-success" : "bg-warning"}`} />
            <span className="hidden sm:inline">{unlocked ? "Em Consulta" : "Paciente na Recepção"}</span>
            <span className="sm:hidden">{unlocked ? "Em consulta" : "Recepção"}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 px-4 py-2 md:hidden">
        <p className="truncate text-xs font-semibold text-primary-foreground/80">Dr. Carlos Eduardo · CRM/SP 123456</p>
      </div>
    </header>
  );
}

function ViewSwitcher({ view, onChange, onSignOut }: { view: AppView; onChange: (view: AppView) => void; onSignOut: () => void }) {
  return (
    <div className="border-b border-border bg-card px-4 py-3">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
        <span className="text-xs font-bold text-muted-foreground">Visualização:</span>
        <div className="order-3 grid w-full grid-cols-2 rounded-lg bg-muted p-1 sm:order-none sm:w-auto sm:min-w-80" role="group" aria-label="Escolher visualização">
          <Button
            type="button"
            variant={view === "patient" ? "default" : "ghost"}
            className="h-10 shadow-none"
            aria-pressed={view === "patient"}
            aria-label="Mudar para visualização do paciente"
            onClick={() => onChange("patient")}
          >
            <UserRound /> Paciente
          </Button>
          <Button
            type="button"
            variant={view === "doctor" ? "default" : "ghost"}
            className="h-10 shadow-none"
            aria-pressed={view === "doctor"}
            aria-label="Mudar para visualização do médico"
            onClick={() => onChange("doctor")}
          >
            <Stethoscope /> Médico
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto min-h-11 text-muted-foreground"
          onClick={onSignOut}
          aria-label="Sair e trocar de conta"
        >
          <LogOut /> Sair / Trocar de Conta
        </Button>
      </div>
    </div>
  );
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function PatientLoginScreen({ onAccess }: { onAccess: () => void }) {
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  const accessDemo = () => {
    if (!phone) setPhone("(11) 99999-9999");
    if (!cpf) setCpf("123.456.789-00");
    onAccess();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    accessDemo();
  };

  return (
    <main className="medilock-enter mx-auto flex min-h-[calc(100vh-3.75rem)] w-full max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-md" aria-labelledby="patient-access-title">
        <div className="text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-success/15" aria-hidden="true">
            <ShieldCheck className="size-8" />
          </div>
          <p className="mt-5 text-sm font-extrabold text-primary">Acesso do Paciente · MediLock</p>
          <h1 id="patient-access-title" className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
            MediLock Saúde - Seu Histórico nas Suas Mãos
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            Acesse seus exames, receitas e autorize suas consultas em tempo real.
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 rounded-lg border border-border bg-card p-5 shadow-xl shadow-success/5 sm:p-7" noValidate>
          <div>
            <label htmlFor="patient-phone" className="mb-2 block text-sm font-bold">Número de Celular / WhatsApp</label>
            <Input
              id="patient-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={phone}
              onChange={(event) => setPhone(formatPhone(event.target.value))}
              placeholder="(11) 99999-9999"
              maxLength={15}
              className="h-12"
            />
          </div>
          <div className="mt-5">
            <label htmlFor="patient-cpf" className="mb-2 block text-sm font-bold">CPF do Titular</label>
            <Input
              id="patient-cpf"
              inputMode="numeric"
              autoComplete="off"
              value={cpf}
              onChange={(event) => setCpf(formatCpf(event.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
              className="h-12"
            />
          </div>
          <Button type="submit" size="lg" className="mt-6 h-12 w-full" aria-label="Entrar no meu cofre de saúde">
            <LockKeyhole /> Entrar no Meu Cofre de Saúde
          </Button>
          <Button type="button" variant="ghost" className="mt-2 min-h-11 w-full text-primary" onClick={accessDemo} aria-label="Acessar diretamente o modo de demonstração">
            Acessar Direto (Modo Demo)
          </Button>
          <div className="mt-5 flex items-start gap-2 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <p>Ao continuar, você autoriza o armazenamento criptografado dos seus registros médicos conforme a LGPD.</p>
          </div>
        </form>
      </section>
    </main>
  );
}

function MediLockApp() {
  const [fontScale, setFontScale] = useState(0);
  const [highContrast, setHighContrast] = useState(false);
  const [patientAuthenticated, setPatientAuthenticated] = useState(false);
  const [view, setView] = useState<AppView>("doctor");
  const [unlocked, setUnlocked] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [qrOpen, setQrOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<ClinicalSourceId | null>(null);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [attention, setAttention] = useState<AttentionState>("pending");
  const [conditionDecisions, setConditionDecisions] = useState<ConditionDecisions>({
    hypertension: "pending",
    diabetes: "pending",
    penicillin: "pending",
  });
  const [notice, setNotice] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const patientFileInput = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const { speakingId, toggleSpeech, stopSpeech } = useSpeechController();

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = fontScale === 1 ? "18px" : fontScale === 2 ? "20px" : "16px";
    return () => {
      root.style.fontSize = "";
    };
  }, [fontScale]);

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
    setConditionDecisions({ hypertension: "pending", diabetes: "pending", penicillin: "pending" });
    setNotice("Consulta encerrada. O acesso ao prontuário foi revogado.");
  };

  return (
    <div className={`min-h-screen bg-background text-foreground ${patientAuthenticated && view === "doctor" ? "profile-doctor" : "profile-patient"} ${fontScale === 1 ? "a11y-font-large" : fontScale === 2 ? "a11y-font-larger" : ""} ${highContrast ? "high-contrast" : ""}`}>
      <AccessibilityBar
        fontScale={fontScale}
        setFontScale={setFontScale}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        onOpenCredits={() => setCreditsOpen(true)}
      />
      {!patientAuthenticated ? (
        <PatientLoginScreen onAccess={() => { setPatientAuthenticated(true); setView("patient"); setNotice(""); }} />
      ) : (
        <>
      {view === "doctor" && <Header unlocked={unlocked} />}
      <ViewSwitcher view={view} onChange={setView} onSignOut={() => {
        setPatientAuthenticated(false);
        setView("patient");
        setNotice("");
        stopSpeech();
      }} />
      {notice && (
        <div className="border-b border-success/20 bg-success-soft px-4 py-2 text-center text-sm font-medium text-success" role="status">
          {notice}
           <Button type="button" variant="ghost" size="icon" className="ml-2 min-h-11 min-w-11 align-middle" aria-label="Fechar aviso" onClick={() => setNotice("")}><X className="size-4" /></Button>
        </div>
      )}

      <main>{view === "patient" ? (
        <PatientView
          onUpload={() => patientFileInput.current?.click()}
          onCamera={() => cameraInput.current?.click()}
          speakingId={speakingId}
          toggleSpeech={toggleSpeech}
        />
      ) : unlocked ? (
          <UnlockedDashboard
            attention={attention}
            setAttention={setAttention}
            conditionDecisions={conditionDecisions}
            setConditionDecision={(condition, decision) => {
              setConditionDecisions((current) => ({ ...current, [condition]: decision }));
            }}
            onOpenSource={setSelectedSource}
            onUpload={() => fileInput.current?.click()}
            onRevoke={revoke}
            speakingId={speakingId}
            toggleSpeech={toggleSpeech}
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
      <input
        ref={patientFileInput}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) setNotice(`${file.name} foi salvo em Meus Documentos.`);
          event.target.value = "";
        }}
      />
      <input
        ref={cameraInput}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.[0]) setNotice("Foto salva em Meus Documentos.");
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
          <Button size="lg" onClick={simulateQr} aria-label="Simular leitura autorizada do QR Code">Simular leitura autorizada</Button>
        </DialogContent>
      </Dialog>

      <ClinicalDocumentViewer sourceId={selectedSource} onClose={() => setSelectedSource(null)} />
        </>
      )}

      <Dialog open={creditsOpen} onOpenChange={setCreditsOpen}>
        <DialogContent className="max-w-lg rounded-lg">
          <DialogHeader>
            <div className="mb-2 grid size-11 place-items-center rounded-md bg-secondary text-primary" aria-hidden="true">
              <UsersRound className="size-5" />
            </div>
            <DialogTitle>MediLock • Hack Inova OS 2.0</DialogTitle>
            <DialogDescription>
              Ciência da Computação (Noturno) - Universidade Anhembi Morumbi
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-border bg-muted p-4">
            <p className="text-xs font-bold uppercase text-muted-foreground">Integrantes</p>
            <ul className="mt-3 space-y-3 text-sm">
              <li><strong>Gustavo Betarelli Leite</strong> <span className="text-muted-foreground">(RA: 12526130738)</span></li>
              <li><strong>Enrico Rodrigues da Silva</strong> <span className="text-muted-foreground">(RA: 12526175153)</span></li>
              <li><strong>Leonardo Jorge Nobre de Lima</strong> <span className="text-muted-foreground">(RA: 12526143614)</span></li>
            </ul>
          </div>
          <div className="rounded-md border border-primary/25 bg-secondary px-4 py-3 text-sm font-bold text-secondary-foreground">
            Desafio 04: Copiloto Clínico | Zero-Trust &amp; LGPD
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={() => setCreditsOpen(false)} aria-label="Fechar equipe e créditos">
            Fechar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PatientView({ onUpload, onCamera, speakingId, toggleSpeech }: {
  onUpload: () => void;
  onCamera: () => void;
  speakingId: string | null;
  toggleSpeech: (id: string, text: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [qrExpanded, setQrExpanded] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<PatientDocument | null>(null);
  const [conditionFormOpen, setConditionFormOpen] = useState(false);

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText("849201");
    } catch {
      // The visual confirmation still helps on browsers that block clipboard access.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="medilock-enter mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-9">
      <header className="flex items-center gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-full bg-secondary text-lg font-extrabold text-primary">JS</div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">MediLock · Minha Saúde</p>
          <h1 className="truncate text-2xl font-extrabold">Olá, João Silva</h1>
          <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" /> Consulta hoje às 14:30 com Dr. Carlos Eduardo
          </p>
        </div>
      </header>

      <section className="mt-6 rounded-lg border border-border bg-card p-5 shadow-sm" aria-labelledby="clinical-profile-title">
        <div className="flex items-center gap-2 text-primary">
          <Activity className="size-5" aria-hidden="true" />
          <h2 id="clinical-profile-title" className="font-extrabold">Meu Perfil Clínico</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Condições e alergias cadastradas">
          <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground">Hipertensão Arterial</span>
          <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground">Diabetes Tipo 2</span>
          <span className="rounded-full border border-destructive/35 bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive">Alergia a Penicilina</span>
        </div>
        <Button type="button" variant="ghost" className="mt-4 h-auto min-h-11 justify-start px-0 py-1 text-primary hover:bg-transparent hover:text-clinical" onClick={() => setConditionFormOpen((open) => !open)} aria-expanded={conditionFormOpen} aria-label="Informar nova condição ou alergia">
          <Plus className="size-4" /> Informar nova condição ou alergia
        </Button>
        {conditionFormOpen && (
          <div className="mt-3 rounded-md bg-success-soft p-3 text-sm font-medium text-success" role="status">
            Solicitação aberta. A nova informação será revisada antes de entrar no seu perfil clínico.
          </div>
        )}
      </section>

      <article className="mt-7 overflow-hidden rounded-lg bg-token text-token-foreground shadow-lg shadow-success/15">
        <div className="p-6 text-center sm:p-8">
          <div className="mx-auto grid size-11 place-items-center rounded-full bg-token-foreground/15"><LockKeyhole className="size-5" /></div>
          <p className="mt-4 text-sm font-bold">Seu Token de Acesso em Sala</p>
          <p className="mt-2 text-4xl font-extrabold sm:text-5xl" aria-label="Token 849 201">849-201</p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
           <Button type="button" variant="secondary" size="lg" className="h-12 min-w-44" onClick={copyToken} aria-label="Copiar token 849-201">
            {copied ? <ClipboardCheck /> : <Copy />} {copied ? "Token Copiado" : "Copiar Token"}
          </Button>
            <Button type="button" variant="secondary" size="lg" className="h-12 min-w-44" onClick={() => toggleSpeech("patient-token-summary", "Resumo do acesso. Seu token de acesso em sala é 849 201. Ele expira ao término da consulta.")} aria-label={`${speakingId === "patient-token-summary" ? "Parar" : "Ouvir"} resumo do token`} aria-pressed={speakingId === "patient-token-summary"}>
              {speakingId === "patient-token-summary" ? <Square /> : <Volume2 />} {speakingId === "patient-token-summary" ? "Parar leitura" : "Ouvir resumo"}
           </Button>
          </div>
           <Button type="button" variant="ghost" className="mt-3 min-h-11 text-token-foreground hover:bg-token-foreground/10 hover:text-token-foreground" onClick={() => toggleSpeech("patient-token-digits", "8, 4, 9, 2, 0, 1")} aria-label={`${speakingId === "patient-token-digits" ? "Parar leitura do" : "Ouvir"} token 849-201, dígito por dígito`} aria-pressed={speakingId === "patient-token-digits"}>
              {speakingId === "patient-token-digits" ? <Square /> : <Volume2 />} {speakingId === "patient-token-digits" ? "Parar Token" : "Ouvir Token"}
          </Button>
        </div>
        <div className="border-t border-token-foreground/20 bg-token-deep px-5 py-4">
          <Button type="button" variant="ghost" className="h-auto min-h-11 w-full justify-between py-2 text-token-foreground hover:bg-token-foreground/10 hover:text-token-foreground" onClick={() => setQrExpanded((open) => !open)} aria-expanded={qrExpanded} aria-controls="patient-token-qr" aria-label={`${qrExpanded ? "Ocultar" : "Mostrar"} QR Code do token`}>
            <span className="flex items-center gap-2"><QrCode /> Ou mostre este QR Code para o médico na sala</span>
            <span className="text-lg" aria-hidden="true">{qrExpanded ? "−" : "+"}</span>
          </Button>
          {qrExpanded && (
            <div id="patient-token-qr" className="mx-auto mt-4 grid aspect-square w-44 place-items-center rounded-lg bg-card text-foreground shadow-sm">
              <QrCode className="size-32" aria-label="QR Code do token 849-201" />
            </div>
          )}
        </div>
      </article>

      <div className="mt-4 flex items-start gap-3 rounded-lg border border-success/25 bg-success-soft p-4 text-xs leading-5 text-foreground">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
        <p>Este código expira ao término da consulta. O médico só acessa seus dados com a sua autorização presencial.</p>
      </div>

      <section className="mt-9" aria-labelledby="documents-title">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-primary">Cofre pessoal</p>
            <h2 id="documents-title" className="mt-1 text-xl font-extrabold">Meus Documentos e Histórico</h2>
          </div>
          <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">3 arquivos</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button type="button" size="lg" className="col-span-2 min-h-12 whitespace-normal px-4 sm:col-span-1" onClick={onUpload} aria-label="Enviar novo exame ou receita"><Upload /> + Enviar Novo Exame ou Receita</Button>
          <Button type="button" variant="outline" size="lg" className="col-span-2 h-12 sm:col-span-1" onClick={onCamera} aria-label="Tirar foto de exame ou receita"><Camera /> Tirar foto</Button>
        </div>

        <div className="mt-5 space-y-3">
          {patientDocuments.map((document) => (
            <article key={document.name} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:items-center">
              <div className="grid size-11 shrink-0 place-items-center rounded-md bg-secondary text-primary">
                {document.type === "PDF" ? <FileText className="size-5" /> : <FileImage className="size-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold leading-5">{document.name} <span className="font-medium text-muted-foreground">({document.type})</span></h3>
                <p className="mt-1 text-xs text-muted-foreground">{document.date}</p>
              </div>
              <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => setSelectedDocument(document)} aria-label={`Visualizar ${document.name}`} title="Visualizar">
                <Eye />
              </Button>
            </article>
          ))}
        </div>
      </section>

      <article className="mt-8 rounded-lg border border-success/25 bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-success-soft text-success"><ShieldCheck className="size-5" /></div>
          <div>
            <h2 className="font-extrabold text-success">Privacidade Ativa</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Nenhum médico ou clínica tem acesso aos seus exames neste momento. O acesso só será liberado após a validação do token acima.</p>
          </div>
        </div>
        <div className="mt-5 flex items-start gap-2 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
          <History className="mt-0.5 size-4 shrink-0" />
          <p><strong className="text-foreground">Último acesso autorizado:</strong> 15/09/2025 - Hospital São Paulo</p>
        </div>
      </article>

      <Dialog open={Boolean(selectedDocument)} onOpenChange={(open) => { if (!open) setSelectedDocument(null); }}>
        <DialogContent className="max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.name}</DialogTitle>
            <DialogDescription>{selectedDocument?.type} · {selectedDocument?.date}</DialogDescription>
          </DialogHeader>
          <div className="grid min-h-44 place-items-center rounded-md border border-border bg-muted p-6 text-center">
            {selectedDocument?.type === "PDF" ? <FileText className="size-12 text-primary" /> : <FileImage className="size-12 text-primary" />}
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{selectedDocument?.detail}</p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
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
          <Button type="submit" size="lg" className="mt-5 h-12 w-full" disabled={token.replace(/\D/g, "").length !== 6} aria-label="Desbloquear prontuário com token">
            <LockKeyhole /> Desbloquear com Token
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />ou<span className="h-px flex-1 bg-border" /></div>
        <Button type="button" variant="outline" size="lg" className="h-12 w-full" onClick={openQr} aria-label="Escanear QR Code do paciente">
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

function UnlockedDashboard({ attention, setAttention, conditionDecisions, setConditionDecision, onOpenSource, onUpload, onRevoke, speakingId, toggleSpeech }: {
  attention: AttentionState;
  setAttention: (state: AttentionState) => void;
  conditionDecisions: ConditionDecisions;
  setConditionDecision: (condition: ConditionId, decision: ConditionDecision) => void;
  onOpenSource: (source: ClinicalSourceId) => void;
  onUpload: () => void;
  onRevoke: () => void;
  speakingId: string | null;
  toggleSpeech: (id: string, text: string) => void;
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

      <section className="mb-5" aria-labelledby="chronic-conditions-title">
        <div className="mb-4 flex items-center gap-2 text-primary">
          <Activity className="size-5" aria-hidden="true" />
          <h2 id="chronic-conditions-title" className="text-sm font-extrabold uppercase">Condições Crônicas Pré-Identificadas</h2>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <ChronicConditionCard
            id="hypertension"
            title="Hipertensão Arterial Sistêmica"
            source="[Fonte: Receita_Losartana_Jan2026.pdf - Pág. 1]"
            sourceId="losartan"
            onOpenSource={onOpenSource}
            decision={conditionDecisions.hypertension}
            onDecision={setConditionDecision}
            speakingId={speakingId}
            toggleSpeech={toggleSpeech}
          />
          <ChronicConditionCard
            id="diabetes"
            title="Diabetes Tipo 2"
            source="[Fonte: Laudo_Glicemia_Out2025.pdf - Pág. 1]"
            sourceId="glucose"
            onOpenSource={onOpenSource}
            decision={conditionDecisions.diabetes}
            onDecision={setConditionDecision}
            speakingId={speakingId}
            toggleSpeech={toggleSpeech}
          />
          <ChronicConditionCard
            id="penicillin"
            title="Alergia a Penicilina"
            source="[Fonte: Informado pelo paciente no cadastro via WhatsApp]"
            decision={conditionDecisions.penicillin}
            onDecision={setConditionDecision}
            isAlert
            speakingId={speakingId}
            toggleSpeech={toggleSpeech}
          />
        </div>
      </section>

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

        <div className="min-w-0 space-y-5">
          <article className={`rounded-lg border p-5 shadow-sm transition-all sm:p-6 ${attention === "accepted" ? "border-success/45 bg-success-soft/40" : attention === "ignored" ? "border-border bg-muted opacity-60" : "border-warning/35 bg-card"}`}>
            <div className="flex items-center gap-2 text-warning"><AlertTriangle className="size-5" /><h2 className="text-sm font-bold uppercase">Ponto de atenção rastreável</h2></div>
            <p className="mt-5 text-lg font-bold leading-7">Glicemia de jejum elevada <span className="text-warning">(138 mg/dL)</span> com tendência de alta.</p>
            <Button type="button" variant="link" onClick={() => onOpenSource("biochemistry-glucose")} className="mt-4 h-auto min-h-11 max-w-full items-start whitespace-normal px-0 text-left text-sm font-semibold underline-offset-4 hover:underline" aria-label="Abrir documento original Laudo Bioquímica de outubro de 2025, página 1">
              <ExternalLink className="mt-0.5 size-4 shrink-0" /><span>[Fonte: Laudo_Bioquimica_Out2025.pdf - Página 1]</span>
            </Button>
            <Button type="button" variant="outline" className="mt-4 min-h-11" onClick={() => toggleSpeech("attention-glucose", "Ponto de atenção rastreável. Glicemia de jejum elevada, 138 miligramas por decilitro, com tendência de alta. Fonte: Laudo Bioquímica, outubro de 2025, página 1.")} aria-label={`${speakingId === "attention-glucose" ? "Parar" : "Ouvir"} resumo do ponto de atenção sobre glicemia`} aria-pressed={speakingId === "attention-glucose"}>
              {speakingId === "attention-glucose" ? <Square /> : <Volume2 />} {speakingId === "attention-glucose" ? "Parar leitura" : "Ouvir resumo"}
            </Button>
            {attention === "pending" ? (
              <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
                <Button className="min-h-11 flex-1 whitespace-normal" onClick={() => setAttention("accepted")} aria-label="Aceitar ponto de atenção e registrar no prontuário"><Check /> Aceitar</Button>
                <Button variant="outline" className="min-h-11 sm:w-28" onClick={() => setAttention("ignored")} aria-label="Ignorar ponto de atenção">Ignorar</Button>
              </div>
            ) : (
              <div className={`mt-6 flex items-center justify-between gap-3 rounded-md p-4 ${attention === "accepted" ? "border border-success/30 bg-success-soft text-success" : "border border-border bg-card text-muted-foreground"}`} role="status">
                <div className="flex items-center gap-2 text-sm font-bold">{attention === "accepted" ? <CheckCircle2 className="size-5" /> : <X className="size-5" />}{attention === "accepted" ? "Validado pelo Dr. Carlos Eduardo" : "Descartado pelo profissional"}</div>
                 <Button variant="ghost" size="sm" className="min-h-11" onClick={() => setAttention("pending")} aria-label="Desfazer decisão sobre o ponto de atenção">Desfazer</Button>
              </div>
            )}
          </article>

          <section className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6" aria-labelledby="routine-exams-title">
            <div className="flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-md bg-secondary text-primary"><BarChart3 className="size-5" aria-hidden="true" /></div>
              <div className="min-w-0">
                <h2 id="routine-exams-title" className="text-sm font-extrabold uppercase leading-5">Exames de Rotina (Último Laudo Extraído)</h2>
                <Button type="button" variant="link" onClick={() => onOpenSource("biochemistry-routine")} className="mt-1 h-auto min-h-11 max-w-full items-start whitespace-normal px-0 text-left text-xs font-semibold leading-5 underline-offset-4 hover:underline" aria-label="Abrir documento original Laudo Bioquímica de outubro de 2025, páginas 1 e 2">
                  <ExternalLink className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>[Fonte: Laudo_Bioquimica_Out2025.pdf - Pág. 1 e 2]</span>
                </Button>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <RoutineExam icon={FlaskConical} name="Hemoglobina Glicada (HbA1c)" value="7,4%" reference="Ref: até 5,7%" status="Elevada / Ponto de Atenção" attention />
              <RoutineExam icon={HeartPulse} name="Colesterol Total" value="182 mg/dL" reference="Ref: < 190 mg/dL" status="Normal" />
              <RoutineExam icon={Gauge} name="Triglicerídeos" value="178 mg/dL" reference="Ref: < 150 mg/dL" status="Levemente Elevado" attention />
              <RoutineExam icon={TestTube2} name="Creatinina Sérica" value="0,95 mg/dL" reference="Ref: 0,70 a 1,20 mg/dL" status="Função Renal Normal" />
              <RoutineExam icon={Activity} name="Potássio (K+)" value="4,4 mEq/L" reference="Ref: 3,5 a 5,1 mEq/L" status="Normal" />
            </div>
          </section>
        </div>
      </div>

      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Button variant="outline" size="lg" className="h-12" onClick={onUpload} aria-label="Adicionar laudo da consulta"><FilePlus2 /> Adicionar Laudo da Consulta</Button>
        <Button variant="destructive" size="lg" className="h-12" onClick={onRevoke} aria-label="Encerrar consulta e revogar acesso">Encerrar Consulta &amp; Revogar Acesso <ArrowRight /></Button>
      </div>
    </section>
  );
}

function RoutineExam({ icon: Icon, name, value, reference, status, attention = false }: {
  icon: typeof Activity;
  name: string;
  value: string;
  reference: string;
  status: string;
  attention?: boolean;
}) {
  return (
    <article className="min-w-0 rounded-md border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        <div className={`grid size-9 shrink-0 place-items-center rounded-md ${attention ? "bg-warning-soft text-warning" : "bg-success-soft text-success"}`}>
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold leading-5">{name}</h3>
          <p className="mt-1 text-base font-extrabold">{value}</p>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{reference}</p>
        </div>
      </div>
      <span className={`mt-3 inline-flex max-w-full rounded-full px-2.5 py-1 text-xs font-bold leading-5 ${attention ? "bg-warning-soft text-warning" : "bg-success-soft text-success"}`}>
        {status}
      </span>
    </article>
  );
}

function ChronicConditionCard({ id, title, source, sourceId, onOpenSource, decision, onDecision, speakingId, toggleSpeech, isAlert = false }: {
  id: ConditionId;
  title: string;
  source: string;
  sourceId?: ClinicalSourceId;
  onOpenSource?: (source: ClinicalSourceId) => void;
  decision: ConditionDecision;
  onDecision: (condition: ConditionId, decision: ConditionDecision) => void;
  speakingId: string | null;
  toggleSpeech: (id: string, text: string) => void;
  isAlert?: boolean;
}) {
  return (
    <article className={`rounded-lg border bg-card p-5 shadow-sm ${isAlert ? "border-destructive/55" : "border-border"}`}>
      <div className="flex items-start gap-3">
        <div className={`grid size-9 shrink-0 place-items-center rounded-md ${isAlert ? "bg-destructive/10 text-destructive" : "bg-secondary text-primary"}`}>
          {isAlert ? <AlertTriangle className="size-5" /> : <HeartPulse className="size-5" />}
        </div>
        <div className="min-w-0">
          <h3 className={`font-extrabold leading-6 ${isAlert ? "text-destructive" : ""}`}>{title}</h3>
          {sourceId && onOpenSource ? (
            <Button type="button" variant="link" onClick={() => onOpenSource(sourceId)} className="mt-2 h-auto min-h-11 max-w-full items-start whitespace-normal px-0 text-left text-xs font-semibold leading-5 underline-offset-4 hover:underline" aria-label={`Abrir documento original de ${title}`}>
              <ExternalLink className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>{source}</span>
            </Button>
          ) : (
            <p className={`mt-2 text-xs font-semibold leading-5 ${isAlert ? "rounded-md bg-destructive/10 px-2 py-1.5 text-destructive" : "text-primary"}`}>{source}</p>
          )}
          <Button type="button" variant="ghost" size="sm" className="mt-2 min-h-11 px-2" onClick={() => toggleSpeech(`condition-${id}`, `${title}. ${source.replaceAll("[", "").replaceAll("]", "")}`)} aria-label={`${speakingId === `condition-${id}` ? "Parar" : "Ouvir"} resumo de ${title}`} aria-pressed={speakingId === `condition-${id}`}>
            {speakingId === `condition-${id}` ? <Square /> : <Volume2 />} {speakingId === `condition-${id}` ? "Parar leitura" : "Ouvir resumo"}
          </Button>
        </div>
      </div>
      {decision === "pending" ? (
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border pt-4">
          <Button type="button" size="sm" className="min-h-11" onClick={() => onDecision(id, "confirmed")} aria-label={`Confirmar ${title}`}><Check /> Confirmar</Button>
          <Button type="button" size="sm" variant="outline" className="min-h-11" onClick={() => onDecision(id, "discarded")} aria-label={`Descartar ${title}`}>Descartar</Button>
        </div>
      ) : (
        <div className={`mt-5 flex items-center justify-between gap-2 rounded-md p-3 ${decision === "confirmed" ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`} role="status">
          <span className="flex items-center gap-2 text-xs font-bold">
            {decision === "confirmed" ? <CheckCircle2 className="size-4" /> : <X className="size-4" />}
            {decision === "confirmed" ? "Condição confirmada" : "Condição descartada"}
          </span>
          <Button type="button" variant="ghost" size="sm" className="min-h-11 px-2" onClick={() => onDecision(id, "pending")} aria-label={`Desfazer decisão sobre ${title}`}>Desfazer</Button>
        </div>
      )}
    </article>
  );
}

function ClinicalDocumentViewer({ sourceId, onClose }: { sourceId: ClinicalSourceId | null; onClose: () => void }) {
  const source = sourceId ? clinicalSources[sourceId] : null;

  return (
    <Dialog open={Boolean(source)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-lg p-4 sm:p-6">
        {source && (
          <>
            <div className="flex flex-col-reverse gap-3 border-b border-border pb-4 pr-7 sm:flex-row sm:items-start sm:justify-between">
              <DialogHeader className="min-w-0 text-left">
                <DialogTitle className="break-words pr-1 leading-6">{source.title}</DialogTitle>
                <DialogDescription>{source.description}</DialogDescription>
              </DialogHeader>
              <Button type="button" variant="outline" size="sm" className="min-h-11 shrink-0 self-end sm:self-start" onClick={onClose} aria-label="Fechar visualizador de documento">
                <X className="size-4" aria-hidden="true" /> Fechar visualizador (ESC)
              </Button>
            </div>

            <div className="rounded-md bg-muted p-3 sm:p-5" aria-label={`Visualização de ${source.title}`}>
              <article className="mx-auto min-h-96 max-w-xl border border-border bg-card p-5 text-foreground shadow-lg sm:p-8">
                <header className="flex items-start justify-between gap-4 border-b-2 border-primary pb-5">
                  <div>
                    <p className="text-xs font-extrabold uppercase text-primary">Laboratório MediAnálise</p>
                    <h3 className="mt-1 text-xl font-extrabold">{source.section}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">Paciente: João Silva · Coleta: 18/10/2025</p>
                  </div>
                  <FileText className="size-8 shrink-0 text-primary" aria-hidden="true" />
                </header>

                <div className="mt-8">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Trecho vinculado ao prontuário</p>
                  <div className="mt-3 border-l-4 border-warning bg-warning-soft px-4 py-4" role="note" aria-label="Trecho destacado do documento">
                    <p className="font-extrabold leading-7">{source.highlight}</p>
                    <p className="mt-1 text-sm font-semibold">{source.reference}</p>
                  </div>
                </div>

                {source.supportingResults && (
                  <div className="mt-7 border-t border-border pt-5">
                    <p className="text-xs font-bold uppercase text-muted-foreground">Demais resultados no documento</p>
                    <ul className="mt-3 divide-y divide-border text-sm">
                      {source.supportingResults.map((result) => <li key={result} className="py-2.5">{result}</li>)}
                    </ul>
                  </div>
                )}

                <footer className="mt-10 border-t border-border pt-4 text-xs text-muted-foreground">
                  Documento original preservado no cofre MediLock · Visualização somente leitura
                </footer>
              </article>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
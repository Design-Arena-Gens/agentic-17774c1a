"use client";

import { FormEvent, useMemo, useState } from "react";
import { generateVideoResponse } from "../lib/generator";
import type { Platform, VideoResponse } from "../lib/types";

type FormState = {
  theme: string;
  platform: Platform;
  duration: number;
  style: string;
  audience: string;
  corePain: string;
  desiredAction: string;
  additionalNotes: string;
};

const defaultForm: FormState = {
  theme: "",
  platform: "tiktok",
  duration: 45,
  style: "emocional",
  audience: "",
  corePain: "",
  desiredAction: "",
  additionalNotes: ""
};

const platformOptions: { value: Platform; label: string }[] = [
  { value: "tiktok", label: "TikTok" },
  { value: "youtube_short", label: "YouTube Shorts" },
  { value: "youtube_long", label: "YouTube Longo" },
  { value: "kwai", label: "Kwai" }
];

const platformLabel: Record<Platform, string> = {
  tiktok: "TikTok",
  youtube_short: "YouTube Shorts",
  youtube_long: "YouTube Longo",
  kwai: "Kwai"
};

const styleOptions = [
  { value: "emocional", label: "Emocional" },
  { value: "educativo", label: "Educativo" },
  { value: "provocativo", label: "Provocativo" },
  { value: "fé", label: "Fé" },
  { value: "negócios", label: "Negócios" }
];

export default function Home() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<VideoResponse | null>(null);

  const isDisabled = useMemo(() => {
    return (
      !form.theme.trim() ||
      !form.audience.trim() ||
      !form.corePain.trim() ||
      !form.desiredAction.trim() ||
      form.duration <= 0
    );
  }, [form]);

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isDisabled) return;
    setIsGenerating(true);
    try {
      const response = generateVideoResponse({
        theme: form.theme.trim(),
        platform: form.platform,
        duration: form.duration,
        style: form.style.trim(),
        audience: form.audience.trim(),
        corePain: form.corePain.trim(),
        desiredAction: form.desiredAction.trim(),
        additionalNotes: form.additionalNotes.trim() || undefined
      });
      setResult(response);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="page">
      <div className="container">
        <section className="panel">
          <h1>AGENTE DE VÍDEOS</h1>
          <p>
            Informe tema, plataforma, duração e estilo. O agente respeita a
            estrutura de alta retenção automaticamente.
          </p>

          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="theme">Tema central</label>
              <input
                id="theme"
                value={form.theme}
                placeholder="Ex.: Lidar com ansiedade em lançamentos digitais"
                onChange={(event) => handleChange("theme", event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="platform">Plataforma</label>
              <select
                id="platform"
                value={form.platform}
                onChange={(event) =>
                  handleChange("platform", event.target.value as Platform)
                }
              >
                {platformOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="duration">Duração desejada (segundos)</label>
              <input
                id="duration"
                type="number"
                min={10}
                max={240}
                value={form.duration}
                onChange={(event) =>
                  handleChange("duration", Number(event.target.value))
                }
              />
            </div>

            <div className="field">
              <label htmlFor="style">Estilo principal</label>
              <select
                id="style"
                value={form.style}
                onChange={(event) => handleChange("style", event.target.value)}
              >
                {styleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="audience">Público-alvo direto</label>
              <input
                id="audience"
                value={form.audience}
                placeholder="Ex.: Criadores que passam noites revisando roteiros"
                onChange={(event) => handleChange("audience", event.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="corePain">Dor ou bloqueio principal</label>
              <input
                id="corePain"
                value={form.corePain}
                placeholder="Ex.: Travar ao ligar a câmera por medo de crítica"
                onChange={(event) =>
                  handleChange("corePain", event.target.value)
                }
              />
            </div>

            <div className="field">
              <label htmlFor="desiredAction">Ação desejada no final</label>
              <input
                id="desiredAction"
                value={form.desiredAction}
                placeholder="Ex.: Comentar a maior trava e compartilhar"
                onChange={(event) =>
                  handleChange("desiredAction", event.target.value)
                }
              />
            </div>

            <div className="field">
              <label htmlFor="additionalNotes">Observações extras (opcional)</label>
              <textarea
                id="additionalNotes"
                value={form.additionalNotes}
                placeholder="Tom específico, referências ou contexto de campanha"
                onChange={(event) =>
                  handleChange("additionalNotes", event.target.value)
                }
              />
            </div>

            <button className="submit" type="submit" disabled={isDisabled || isGenerating}>
              {isGenerating ? "Gerando..." : "Gerar roteiro completo"}
            </button>
          </form>
        </section>

        <section className="panel outputs-scroll">
          {result ? (
            <div className="output">
              <div className="block analysis">
                <strong>Análise inicial</strong>
                <span>{result.analysis.audience}</span>
                <span>{result.analysis.tension}</span>
                <span>{result.analysis.emotionalAxis}</span>
                <span>{result.analysis.action}</span>
              </div>

              <div className="block">
                <h3>Estratégia para {platformLabel[result.platform]}</h3>
                <div className="content-list">
                  <span>{result.platformStrategy}</span>
                </div>
              </div>

              <div className="block">
                <h3>Roteiro estruturado</h3>
                <div className="content-list">
                  <span>
                    <strong>Gancho:</strong> {result.script.hook}
                  </span>
                  <span>
                    <strong>Contexto:</strong> {result.script.context}
                  </span>
                  <span>
                    <strong>Desenvolvimento:</strong>
                    {result.script.development.map((line, index) => (
                      <span key={index}>• {line}</span>
                    ))}
                  </span>
                  <span>
                    <strong>Clímax:</strong> {result.script.climax}
                  </span>
                  <span>
                    <strong>CTA:</strong> {result.script.callToAction}
                  </span>
                </div>
              </div>

              <div className="block">
                <h3>Versões</h3>
                <div className="content-list">
                  <span>
                    <strong>{result.versions.short.label} ({result.versions.short.durationHint}):</strong>
                  </span>
                  {result.versions.short.script.map((line, index) => (
                    <span key={`short-${index}`}>• {line}</span>
                  ))}
                  {result.versions.long && (
                    <>
                      <span>
                        <strong>{result.versions.long.label} ({result.versions.long.durationHint}):</strong>
                      </span>
                      {result.versions.long.script.map((line, index) => (
                        <span key={`long-${index}`}>• {line}</span>
                      ))}
                    </>
                  )}
                </div>
              </div>

              <div className="block">
                <h3>Texto na tela</h3>
                <div className="content-list">
                  {result.textOverlays.map((overlay, index) => (
                    <span key={`overlay-${index}`}>{overlay}</span>
                  ))}
                </div>
              </div>

              <div className="block">
                <h3>Títulos sugeridos</h3>
                <div className="titles-list">
                  {result.titles.map((title, index) => (
                    <span key={`title-${index}`}>{title}</span>
                  ))}
                </div>
              </div>

              <div className="block">
                <h3>Descrição otimizada</h3>
                <div className="content-list">
                  {result.description.split("\n").map((line, index) => (
                    <span key={`desc-${index}`}>{line}</span>
                  ))}
                </div>
              </div>

              <div className="block">
                <h3>Hashtags estratégicas</h3>
                <div className="tags">
                  {result.hashtags.map((tag, index) => (
                    <span key={`tag-${index}`} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="block">
                <h3>Trilha & Enquadramento</h3>
                <div className="content-list">
                  <span>
                    <strong>Trilha sonora:</strong> {result.soundtrack}
                  </span>
                  <span>
                    <strong>Enquadramento:</strong> {result.framing}
                  </span>
                </div>
              </div>

              <div className="block">
                <h3>Melhoria contínua</h3>
                <div className="content-list">
                  <span>
                    <strong>Risco de retenção:</strong> {result.improvement.retentionRisk}
                  </span>
                  <span>
                    <strong>Refino de gancho:</strong> {result.improvement.hookBoost}
                  </span>
                  <span>
                    <strong>Mais comentários:</strong> {result.improvement.conversationSpark}
                  </span>
                  <span>
                    <strong>Versão alternativa:</strong> {result.improvement.alternative.hook} —{" "}
                    {result.improvement.alternative.angle} ({result.improvement.alternative.reason})
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="inline">
              <strong>Aguardando briefing completo.</strong>
              <span>
                Informe tema, plataforma, duração e estilo para liberar o plano de vídeo com retenção acima de 70%.
              </span>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

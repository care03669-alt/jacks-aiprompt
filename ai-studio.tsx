"use client";

import { useState } from "react";
import { Bot, Sparkles, WandSparkles, ScanSearch, Copy, Check, Loader2, ShieldCheck, AlertCircle } from "lucide-react";

type Provider = "openai" | "anthropic" | "gemini";
type Task = "generate" | "enhance" | "analyze";

const providerOptions: { id: Provider; name: string; model: string; key: string }[] = [
  { id: "openai", name: "OpenAI", model: "gpt-4o-mini", key: "OPENAI_API_KEY" },
  { id: "gemini", name: "Google Gemini", model: "gemini-2.0-flash", key: "GOOGLE_AI_API_KEY" },
  { id: "anthropic", name: "Anthropic Claude", model: "claude-3-5-haiku-latest", key: "ANTHROPIC_API_KEY" }
];

export default function AIStudio() {
  const [provider, setProvider] = useState<Provider>("openai");
  const [model, setModel] = useState("gpt-4o-mini");
  const [task, setTask] = useState<Task>("generate");
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const selected = providerOptions.find(p => p.id === provider)!;
  function changeProvider(value: Provider) {
    setProvider(value);
    setModel(providerOptions.find(p => p.id === value)!.model);
    setError("");
  }

  async function runAI() {
    if (!prompt.trim()) { setError("Masukkan ide atau prompt terlebih dahulu."); return; }
    setLoading(true); setError(""); setOutput("");
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, model, task, prompt, context })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI request gagal.");
      setOutput(data.output || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tidak dapat menghubungi AI service.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!output) return;
    try { await navigator.clipboard.writeText(output); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }
    catch { setError("Clipboard tidak tersedia pada browser ini."); }
  }

  const inputClass = "w-full rounded-xl border border-[#202a3d] bg-[#0b1020] px-3.5 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-violet-500";
  const labelClass = "mb-2 block text-[10px] font-bold uppercase tracking-[.15em] text-slate-400";

  return (
    <div>
      <div className="mb-7">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-cyan-300"><Bot size={14}/> MULTI-PROVIDER AI ENGINE</div>
        <h1 className="text-2xl font-black sm:text-3xl">AI <span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">Studio</span></h1>
        <p className="mt-2 text-sm text-slate-500">Generate, enhance, dan analyze prompt menggunakan provider AI pilihanmu.</p>
      </div>

      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4">
        <ShieldCheck className="mt-0.5 shrink-0 text-emerald-300" size={18}/>
        <div><div className="text-xs font-bold text-emerald-200">API key aman di server</div><p className="mt-1 text-[11px] leading-5 text-slate-400">Browser hanya memanggil endpoint internal. Secret provider dibaca dari environment variable server dan tidak dikirim ke client.</p></div>
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,.85fr)]">
        <section className="rounded-2xl border border-[#202a3d] bg-[#101522]/90 p-5 sm:p-6">
          <div className="mb-5 text-sm font-bold">AI configuration</div>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>AI Provider</label>
              <div className="grid grid-cols-3 gap-2">
                {providerOptions.map(p => <button key={p.id} onClick={() => changeProvider(p.id)} className={`rounded-xl border px-2 py-3 text-[11px] font-semibold ${provider === p.id ? "border-violet-400/50 bg-violet-500/15 text-violet-200" : "border-[#202a3d] bg-[#0b1020] text-slate-500"}`}>{p.name}</button>)}
              </div>
            </div>
            <div><label className={labelClass}>Model ID</label><input value={model} onChange={e => setModel(e.target.value)} className={inputClass} placeholder={selected.model}/><p className="mt-1.5 text-[10px] text-slate-600">Model ID dapat diubah sesuai model yang tersedia pada akun provider.</p></div>
            <div>
              <label className={labelClass}>AI task</label>
              <div className="grid grid-cols-3 gap-2">
                {([{id:"generate",name:"Generate",icon:Sparkles},{id:"enhance",name:"Enhance",icon:WandSparkles},{id:"analyze",name:"Analyze",icon:ScanSearch}] as const).map(t => { const Icon = t.icon; return <button key={t.id} onClick={() => setTask(t.id)} className={`flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-[10px] font-semibold ${task === t.id ? "border-violet-400/50 bg-violet-500/15 text-violet-200" : "border-[#202a3d] bg-[#0b1020] text-slate-500"}`}><Icon size={17}/>{t.name}</button>; })}
              </div>
            </div>
            <div><label className={labelClass}>Project idea / input prompt</label><textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={7} maxLength={18000} placeholder="Jelaskan ide proyek atau tempel prompt yang ingin dianalisis..." className={`${inputClass} resize-y`}/><div className="mt-1 text-right text-[10px] text-slate-600">{prompt.length.toLocaleString("id-ID")} / 18.000</div></div>
            <div><label className={labelClass}>Additional context (optional)</label><textarea value={context} onChange={e => setContext(e.target.value)} rows={3} maxLength={6000} placeholder="Platform, target pengguna, tech stack, batasan, dan preferensi..." className={`${inputClass} resize-y`}/></div>
            {error && <div className="flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-xs leading-5 text-rose-200"><AlertCircle size={15} className="mt-0.5 shrink-0"/>{error}</div>}
            <button disabled={loading} onClick={runAI} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/25 disabled:cursor-not-allowed disabled:opacity-60">{loading ? <><Loader2 size={17} className="animate-spin"/> Processing...</> : <><Sparkles size={17}/> Run {task === "generate" ? "AI Generator" : task === "enhance" ? "Prompt Enhancer" : "Prompt Analyzer"}</>}</button>
            <p className="text-center text-[10px] text-slate-600">Penggunaan API dapat dikenakan biaya oleh provider AI.</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#202a3d] bg-[#101522]/90">
          <div className="flex items-center justify-between border-b border-[#202a3d] px-5 py-4"><div><div className="text-sm font-bold">AI response</div><div className="mt-1 text-[10px] text-slate-500">Output dari {selected.name}</div></div><span className="rounded-md border border-cyan-400/15 bg-cyan-400/5 px-2 py-1 text-[9px] font-semibold text-cyan-200">LIVE API</span></div>
          {output ? <><pre className="max-h-[720px] overflow-auto whitespace-pre-wrap break-words p-5 text-[11px] leading-6 text-slate-300">{output}</pre><div className="border-t border-[#202a3d] p-4"><button onClick={copy} className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-500/15 px-3 py-3 text-xs font-bold text-violet-200">{copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? "Copied" : "Copy response"}</button></div></> : <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/5 text-cyan-200"><Bot size={28}/></div><div className="text-sm font-semibold text-slate-300">Your AI response appears here</div><p className="mt-2 max-w-[230px] text-xs leading-5 text-slate-600">Pilih provider, masukkan ide atau prompt, lalu jalankan AI task.</p></div>}
        </section>
      </div>
    </div>
  );
}

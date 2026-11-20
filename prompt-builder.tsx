"use client";

import { useEffect, useMemo, useState } from "react";
import AIStudio from "@/components/ai-studio";
import {
  Activity, AppWindow, ArrowDownToLine, ArrowRight, Bot, Check, ChevronDown,
  CircleHelp, Clock3, Code2, Copy, Cpu, Crown, FileText, Gamepad2, Github,
  Globe2, LayoutDashboard, Library, Menu, MessageSquareText, Moon, Plus,
  Search, Settings2, ShieldCheck, Sparkles, WandSparkles, X, Zap
} from "lucide-react";

type Category = "Game" | "APK / Mobile App" | "Website";
type SavedPrompt = { id: number; title: string; category: Category; prompt: string; createdAt: string };

const starterTemplates = [
  { title: "Open-world RPG", category: "Game" as Category, description: "Dunia luas, quest, karakter, combat, dan progression." },
  { title: "AI Productivity App", category: "APK / Mobile App" as Category, description: "Aplikasi Android dengan AI assistant dan akun pengguna." },
  { title: "SaaS Dashboard", category: "Website" as Category, description: "Dashboard SaaS dengan billing, analytics, dan admin." },
  { title: "2D Platformer", category: "Game" as Category, description: "Game platformer 2D dengan level dan mekanik menarik." },
  { title: "E-commerce Mobile", category: "APK / Mobile App" as Category, description: "Katalog produk, keranjang, pembayaran, dan notifikasi." },
  { title: "Portfolio Website", category: "Website" as Category, description: "Website portfolio profesional, cepat, dan responsif." }
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Prompt Studio", icon: WandSparkles },
  { label: "AI Studio", icon: Bot },
  { label: "Game Builder", icon: Gamepad2 },
  { label: "APK Builder", icon: AppWindow },
  { label: "Website Builder", icon: Globe2 },
  { label: "Template Library", icon: Library },
  { label: "Prompt History", icon: Clock3 }
];

function buildPrompt(input: {
  category: Category; title: string; idea: string; platform: string; style: string;
  features: string; tech: string; audience: string; language: string; detail: string;
}) {
  const { category, title, idea, platform, style, features, tech, audience, language, detail } = input;
  const typeBrief = category === "Game"
    ? "Rancang game lengkap mencakup core gameplay loop, mekanik, kontrol, level/world design, karakter, musuh/NPC, progression, UI game, audio, balancing, save system, performa, dan strategi testing."
    : category === "APK / Mobile App"
    ? "Rancang aplikasi mobile lengkap mencakup user journey, screen flow, UI components, autentikasi, state management, API integration, database, permission, offline/online behavior, keamanan, accessibility, dan testing."
    : "Rancang website lengkap mencakup sitemap, user journey, responsive layout, design system, komponen UI, frontend, backend, database, API, SEO, accessibility, keamanan, analytics, dan testing.";

  return `# MASTER PROMPT — ${title || "Project Baru"}\n\n## 1. ROLE & EXPERTISE\nBertindaklah sebagai tim ahli multidisiplin: senior product strategist, solution architect, UI/UX designer, senior ${category === "Game" ? "game developer" : "full-stack developer"}, QA engineer, security specialist, dan technical writer. Berikan keputusan teknis yang realistis dan jelaskan asumsi penting.\n\n## 2. PROJECT OVERVIEW\n- Nama proyek: ${title || "Tentukan nama proyek"}\n- Kategori: ${category}\n- Ide utama: ${idea || "Kembangkan konsep berdasarkan kebutuhan pengguna."}\n- Target platform: ${platform}\n- Target pengguna: ${audience || "Pengguna umum"}\n- Bahasa produk: ${language}\n- Gaya visual: ${style}\n- Tingkat detail: ${detail}\n\n## 3. PRODUCT OBJECTIVE\nUbah ide menjadi produk yang dapat dibangun dan diuji. Prioritaskan pengalaman pengguna, kejelasan ruang lingkup, kualitas implementasi, keamanan, maintainability, dan performa. Hindari fitur dekoratif yang tidak mendukung tujuan produk.\n\n## 4. CORE DESIGN & FUNCTIONAL REQUIREMENTS\n${typeBrief}\nFitur wajib dari pengguna:\n${features || "- Identifikasi fitur inti berdasarkan ide proyek dan kelompokkan menjadi MVP serta pengembangan lanjutan."}\n\n## 5. TECHNICAL DIRECTION\nTeknologi atau batasan pilihan:\n${tech || "Pilih stack modern yang stabil, sesuai platform, mudah dipelihara, dan jelaskan alasan pemilihannya."}\nSertakan arsitektur sistem, struktur folder, alur data, skema database bila diperlukan, kontrak API, validasi input, error handling, logging, dan strategi deployment.\n\n## 6. UI/UX SPECIFICATION\nBuat sitemap atau screen map, user flow, design tokens, tipografi, warna, spacing, komponen reusable, empty/loading/error/success states, responsive behavior, accessibility, dan micro-interactions. Jelaskan setiap layar secara konkret.\n\n## 7. IMPLEMENTATION PLAN\nBagi pekerjaan menjadi fase berurutan: foundation, MVP, integrasi, hardening, testing, dan release. Untuk setiap fase berikan tujuan, file yang dibuat/diubah, langkah implementasi, acceptance criteria, serta risiko.\n\n## 8. QUALITY, SECURITY & TESTING\nTerapkan secure-by-default. Jangan menaruh secret di client atau repository. Sertakan unit, integration, dan end-to-end test yang relevan; validasi edge cases; optimasi performa; backup/migration bila memakai database; serta checklist sebelum rilis.\n\n## 9. REQUIRED OUTPUT FORMAT\n1. Ringkasan produk dan asumsi.\n2. Requirement fungsional dan non-fungsional.\n3. Arsitektur dan diagram alur dalam Mermaid bila membantu.\n4. Rancangan UI/UX per layar.\n5. Struktur direktori dan spesifikasi data/API.\n6. Implementasi bertahap dengan kode lengkap untuk setiap file yang diminta.\n7. Cara menjalankan lokal, menguji, dan deploy.\n8. Checklist acceptance dan daftar pekerjaan berikutnya.\n\n## 10. WORKING RULES\n- Jangan mengarang integrasi atau mengklaim fitur sudah berjalan jika belum diuji.\n- Jangan meninggalkan placeholder untuk fungsi inti tanpa menjelaskannya.\n- Jika informasi penting belum tersedia, tanyakan satu per satu; jika tidak kritis, nyatakan asumsi dan lanjutkan.\n- Pastikan semua instruksi konsisten, spesifik, dapat diverifikasi, dan siap dieksekusi.\n\nMulai dengan menganalisis ide proyek, lalu hasilkan spesifikasi dan rencana implementasi paling tepat.`;
}

export default function PromptBuilder() {
  const [active, setActive] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [category, setCategory] = useState<Category>("Game");
  const [title, setTitle] = useState("");
  const [idea, setIdea] = useState("");
  const [platform, setPlatform] = useState("Web + Android");
  const [style, setStyle] = useState("Modern, premium, dark");
  const [features, setFeatures] = useState("");
  const [tech, setTech] = useState("");
  const [audience, setAudience] = useState("");
  const [language, setLanguage] = useState("Bahasa Indonesia");
  const [detail, setDetail] = useState("Sangat detail (production-ready)");
  const [generated, setGenerated] = useState("");
  const [saved, setSaved] = useState<SavedPrompt[]>([]);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem("jaccksallas-prompts") || "[]")); } catch {}
  }, []);

  const prompt = useMemo(() => generated, [generated]);
  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };

  function generate() {
    if (!idea.trim()) { showToast("Tambahkan ide proyek terlebih dahulu."); return; }
    const result = buildPrompt({ category, title, idea, platform, style, features, tech, audience, language, detail });
    setGenerated(result);
    setActive("Prompt Studio");
    showToast("Master prompt berhasil dibuat.");
  }

  async function copyPrompt() {
    if (!prompt) return;
    try { await navigator.clipboard.writeText(prompt); setCopied(true); showToast("Prompt berhasil disalin."); window.setTimeout(() => setCopied(false), 1800); }
    catch { showToast("Clipboard tidak tersedia. Pilih dan salin teks secara manual."); }
  }

  function savePrompt() {
    if (!prompt) return;
    const item: SavedPrompt = { id: Date.now(), title: title || "Untitled Prompt", category, prompt, createdAt: new Date().toLocaleString("id-ID") };
    const next = [item, ...saved].slice(0, 100);
    setSaved(next);
    localStorage.setItem("jaccksallas-prompts", JSON.stringify(next));
    showToast("Prompt disimpan ke riwayat perangkat ini.");
  }

  function downloadPrompt() {
    if (!prompt) return;
    const blob = new Blob([prompt], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${(title || "master-prompt").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`; a.click();
    URL.revokeObjectURL(url);
  }

  function useTemplate(t: typeof starterTemplates[number]) {
    setCategory(t.category); setTitle(t.title); setIdea(t.description); setActive("Prompt Studio");
    showToast("Template dimuat ke Prompt Studio.");
  }

  const filteredTemplates = starterTemplates.filter(t => `${t.title} ${t.category} ${t.description}`.toLowerCase().includes(search.toLowerCase()));

  const inputClass = "w-full rounded-xl border border-line bg-[#0b1020] px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15";
  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-[.13em] text-slate-400";

  return (
    <div className="min-h-screen bg-ink">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-70" />
      <div className="pointer-events-none fixed -left-40 top-20 h-96 w-96 rounded-full bg-violet-700/10 blur-[120px]" />
      <div className="pointer-events-none fixed -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />

      <div className="relative flex min-h-screen">
        {mobileOpen && <button aria-label="Tutup menu" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-black/70 lg:hidden" />}
        <aside className={`fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col border-r border-line bg-[#0b101c] transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex h-[82px] items-center justify-between border-b border-line px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-glow"><Bot size={23} /></div>
              <div><div className="text-sm font-black tracking-[.13em]">JACCKSALLAS</div><div className="mt-0.5 text-[9px] font-bold tracking-[.22em] text-cyan-300">AI PROMPT BUILDER</div></div>
            </div>
            <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-white/5 lg:hidden"><X size={18}/></button>
          </div>

          <div className="px-4 pt-6">
            <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-slate-600">Workspace</div>
            <nav className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon; const selected = active === item.label;
                return <button key={item.label} onClick={() => { setActive(item.label); setMobileOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] font-medium transition ${selected ? "border border-violet-400/20 bg-violet-500/10 text-violet-200 shadow-[inset_2px_0_0_#a78bfa]" : "text-slate-400 hover:bg-white/[.04] hover:text-slate-100"}`}><Icon size={17}/>{item.label}{item.label === "Prompt History" && saved.length > 0 && <span className="ml-auto rounded-md bg-white/5 px-2 py-0.5 text-[10px]">{saved.length}</span>}</button>;
              })}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 p-4">
              <div className="mb-2 flex items-center gap-2 text-violet-200"><Crown size={15}/><span className="text-xs font-bold">Builder workspace</span></div>
              <p className="text-[11px] leading-relaxed text-slate-400">Ubah ide sederhana menjadi instruksi AI yang terstruktur dan siap dikembangkan.</p>
              <div className="mt-3 flex items-center gap-2 text-[10px] text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/> Local prompt engine active</div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-line pt-4 text-[11px] text-slate-600"><ShieldCheck size={14}/> Jaccksallas AI · V1.0</div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-[70px] items-center justify-between border-b border-line bg-[#080b14]/85 px-4 backdrop-blur-xl sm:px-7">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="rounded-lg border border-line p-2 text-slate-300 lg:hidden"><Menu size={18}/></button>
              <div><div className="text-sm font-semibold text-slate-100">{active}</div><div className="hidden text-[10px] text-slate-500 sm:block">Workspace / {active}</div></div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-line bg-white/[.03] px-3 py-2 text-[10px] text-slate-400 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400"/> System operational</div>
              <button onClick={() => setActive("Settings")} className="rounded-xl border border-line bg-white/[.03] p-2.5 text-slate-400 hover:text-white"><Settings2 size={17}/></button>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-xs font-bold text-violet-200">J</div>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] p-4 sm:p-7 lg:p-9">
            {active === "Overview" && <>
              <section className="relative overflow-hidden rounded-3xl border border-violet-400/15 bg-gradient-to-br from-[#17152c] via-[#11172a] to-[#0d1c28] p-6 shadow-glow sm:p-9">
                <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-violet-300/10" />
                <div className="absolute -right-2 -top-12 h-48 w-48 rounded-full border border-cyan-300/10" />
                <div className="relative max-w-2xl">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-violet-200"><Sparkles size={13}/> Your AI creation workspace</div>
                  <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">Turn ideas into <span className="gradient-text">powerful prompts.</span></h1>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">Bangun master prompt profesional untuk game, aplikasi Android, dan website. Mulai dari ide sederhana hingga spesifikasi production-ready.</p>
                  <button onClick={() => setActive("Prompt Studio")} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-violet-900/30 transition hover:brightness-110">Create a master prompt <ArrowRight size={15}/></button>
                </div>
              </section>

              <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Prompt categories", value: "03", icon: MessageSquareText, color: "text-violet-300" },
                  { label: "Saved prompts", value: String(saved.length).padStart(2,"0"), icon: FileText, color: "text-cyan-300" },
                  { label: "Starter templates", value: "06", icon: Library, color: "text-emerald-300" },
                  { label: "AI providers", value: "Ready", icon: Cpu, color: "text-amber-300" }
                ].map(stat => { const Icon = stat.icon; return <div key={stat.label} className="glass rounded-2xl p-4"><div className="flex items-center justify-between"><span className="text-xs text-slate-500">{stat.label}</span><Icon size={17} className={stat.color}/></div><div className="mt-3 text-2xl font-bold">{stat.value}</div><div className="mt-1 text-[10px] text-slate-600">Workspace overview</div></div>; })}
              </section>

              <section className="mt-9">
                <div className="mb-4 flex items-end justify-between"><div><h2 className="text-lg font-bold">Choose your builder</h2><p className="mt-1 text-xs text-slate-500">Pilih kategori untuk mulai merancang prompt.</p></div><button onClick={() => setActive("Template Library")} className="text-xs font-semibold text-violet-300">All templates <ArrowRight className="ml-1 inline" size={13}/></button></div>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    { name: "Game Builder", category: "Game" as Category, desc: "Game 2D/3D, RPG, FPS, simulator, multiplayer.", icon: Gamepad2, color: "from-violet-500/20 to-fuchsia-500/5" },
                    { name: "APK Builder", category: "APK / Mobile App" as Category, desc: "Android, iOS, mobile UI, API, database, auth.", icon: AppWindow, color: "from-cyan-500/20 to-blue-500/5" },
                    { name: "Website Builder", category: "Website" as Category, desc: "Landing page, SaaS, e-commerce, full-stack.", icon: Globe2, color: "from-emerald-500/20 to-teal-500/5" }
                  ].map(card => { const Icon = card.icon; return <button key={card.name} onClick={() => { setCategory(card.category); setActive("Prompt Studio"); }} className={`rounded-2xl border border-line bg-gradient-to-br ${card.color} p-5 text-left transition hover:-translate-y-1 hover:border-violet-400/30`}><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/20"><Icon size={21}/></div><div className="font-bold">{card.name}</div><p className="mt-2 text-xs leading-6 text-slate-400">{card.desc}</p><div className="mt-4 text-[11px] font-semibold text-violet-200">Open builder <ArrowRight className="ml-1 inline" size={13}/></div></button>; })}
                </div>
              </section>

              <section className="mt-9">
                <div className="mb-4"><h2 className="text-lg font-bold">Quick start templates</h2><p className="mt-1 text-xs text-slate-500">Mulai lebih cepat dengan contoh ide proyek.</p></div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {starterTemplates.slice(0,3).map(t => <button key={t.title} onClick={() => useTemplate(t)} className="glass rounded-2xl p-4 text-left transition hover:border-violet-400/30"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">{t.category}</span><ArrowRight size={14} className="text-slate-600"/></div><div className="mt-3 text-sm font-semibold">{t.title}</div><p className="mt-1 text-xs leading-5 text-slate-500">{t.description}</p></button>)}
                </div>
              </section>
            </>}

            {active === "AI Studio" && <AIStudio />}

            {active === "Prompt Studio" && <>
              <div className="mb-7"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-violet-300"><WandSparkles size={14}/> PROMPT ENGINE</div><h1 className="text-2xl font-black sm:text-3xl">Prompt <span className="gradient-text">Studio</span></h1><p className="mt-2 text-sm text-slate-500">Isi detail proyek. Local engine akan menyusun master prompt terstruktur untuk AI pilihanmu.</p></div>
              <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(340px,.85fr)]">
                <section className="glass rounded-2xl p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between"><h2 className="font-bold">Project configuration</h2><span className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold text-violet-200">STEP 01 / 01</span></div>
                  <div className="space-y-5">
                    <div><label className={labelClass}>Project category</label><div className="grid grid-cols-3 gap-2">{(["Game","APK / Mobile App","Website"] as Category[]).map(c => <button key={c} onClick={() => setCategory(c)} className={`rounded-xl border px-2 py-3 text-[11px] font-semibold transition ${category === c ? "border-violet-400/50 bg-violet-500/15 text-violet-200" : "border-line bg-[#0b1020] text-slate-500 hover:text-white"}`}>{c}</button>)}</div></div>
                    <div><label className={labelClass}>Project name</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Galaxy Survival Online" className={inputClass}/></div>
                    <div><label className={labelClass}>Project idea <span className="text-rose-300">*</span></label><textarea value={idea} onChange={e => setIdea(e.target.value)} rows={4} placeholder="Jelaskan ide, tujuan, cara kerja, dan masalah yang ingin diselesaikan..." className={`${inputClass} resize-y`}/><p className="mt-1.5 text-[10px] text-slate-600">Semakin jelas idenya, semakin relevan hasil master prompt.</p></div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div><label className={labelClass}>Target platform</label><select value={platform} onChange={e => setPlatform(e.target.value)} className={inputClass}><option>Web + Android</option><option>Android</option><option>iOS</option><option>Web</option><option>Windows / PC</option><option>Cross-platform</option></select></div>
                      <div><label className={labelClass}>Visual direction</label><select value={style} onChange={e => setStyle(e.target.value)} className={inputClass}><option>Modern, premium, dark</option><option>Minimalist, clean</option><option>Futuristic, neon</option><option>Playful, colorful</option><option>Professional, corporate</option><option>Custom (jelaskan di fitur)</option></select></div>
                    </div>
                    <div><label className={labelClass}>Core features</label><textarea value={features} onChange={e => setFeatures(e.target.value)} rows={3} placeholder={"Contoh:\n- Login dan register\n- Dashboard pengguna\n- Notifikasi real-time"} className={`${inputClass} resize-y`}/></div>
                    <div><label className={labelClass}>Preferred technology / constraints</label><input value={tech} onChange={e => setTech(e.target.value)} placeholder="Contoh: Next.js, Supabase, Unity, Kotlin..." className={inputClass}/></div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div><label className={labelClass}>Target audience</label><input value={audience} onChange={e => setAudience(e.target.value)} placeholder="Umum / developer" className={inputClass}/></div>
                      <div><label className={labelClass}>Output language</label><select value={language} onChange={e => setLanguage(e.target.value)} className={inputClass}><option>Bahasa Indonesia</option><option>English</option><option>Bilingual</option></select></div>
                      <div><label className={labelClass}>Detail level</label><select value={detail} onChange={e => setDetail(e.target.value)} className={inputClass}><option>Sangat detail (production-ready)</option><option>Detail</option><option>Ringkas (MVP)</option></select></div>
                    </div>
                    <button onClick={generate} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3.5 text-sm font-bold shadow-lg shadow-violet-900/25 transition hover:brightness-110"><Sparkles size={17}/> Generate Master Prompt</button>
                  </div>
                </section>
                <section className="glass overflow-hidden rounded-2xl">
                  <div className="flex items-center justify-between border-b border-line px-5 py-4"><div><h2 className="text-sm font-bold">Prompt preview</h2><p className="mt-1 text-[10px] text-slate-500">Generated output</p></div><span className="rounded-md border border-emerald-400/15 bg-emerald-400/5 px-2 py-1 text-[9px] font-semibold text-emerald-300">LOCAL ENGINE</span></div>
                  {prompt ? <><pre className="scrollbar-thin max-h-[650px] overflow-auto whitespace-pre-wrap break-words p-5 text-[11px] leading-6 text-slate-300">{prompt}</pre><div className="grid grid-cols-3 gap-2 border-t border-line p-4"><button onClick={copyPrompt} className="flex items-center justify-center gap-1.5 rounded-lg bg-violet-500/15 px-2 py-2.5 text-[10px] font-bold text-violet-200">{copied ? <Check size={13}/> : <Copy size={13}/>} Copy</button><button onClick={savePrompt} className="flex items-center justify-center gap-1.5 rounded-lg border border-line px-2 py-2.5 text-[10px] font-bold text-slate-300"><Plus size={13}/> Save</button><button onClick={downloadPrompt} className="flex items-center justify-center gap-1.5 rounded-lg border border-line px-2 py-2.5 text-[10px] font-bold text-slate-300"><ArrowDownToLine size={13}/> Export</button></div></> : <div className="flex min-h-[390px] flex-col items-center justify-center p-8 text-center"><div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/15 bg-violet-500/10 text-violet-300"><WandSparkles size={27}/></div><div className="text-sm font-semibold text-slate-300">Your prompt appears here</div><p className="mt-2 max-w-[220px] text-xs leading-5 text-slate-600">Lengkapi ide proyek lalu tekan Generate Master Prompt.</p></div>}
                </section>
              </div>
            </>}

            {active === "Template Library" && <>
              <div className="mb-7"><div className="mb-2 text-xs font-semibold text-cyan-300">STARTER COLLECTION</div><h1 className="text-3xl font-black">Template <span className="gradient-text">Library</span></h1><p className="mt-2 text-sm text-slate-500">Pilih template untuk mengisi Prompt Studio secara otomatis.</p></div>
              <div className="relative mb-5 max-w-lg"><Search className="absolute left-3 top-3.5 text-slate-600" size={16}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari template..." className={`${inputClass} pl-10`}/></div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{filteredTemplates.map(t => <button key={t.title} onClick={() => useTemplate(t)} className="glass rounded-2xl p-5 text-left transition hover:border-violet-400/30"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">{t.category}</span><ArrowRight size={15} className="text-slate-500"/></div><h3 className="mt-4 font-bold">{t.title}</h3><p className="mt-2 text-xs leading-6 text-slate-500">{t.description}</p><div className="mt-5 text-[10px] font-semibold text-violet-300">Use this template</div></button>)}</div>
              {filteredTemplates.length === 0 && <p className="py-10 text-center text-sm text-slate-500">Template tidak ditemukan.</p>}
            </>}

            {active === "Prompt History" && <>
              <div className="mb-7"><div className="mb-2 text-xs font-semibold text-violet-300">YOUR WORKSPACE</div><h1 className="text-3xl font-black">Prompt <span className="gradient-text">History</span></h1><p className="mt-2 text-sm text-slate-500">Prompt yang disimpan di browser perangkat ini.</p></div>
              {saved.length ? <div className="space-y-3">{saved.map(item => <div key={item.id} className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-semibold">{item.title}</div><div className="mt-1 text-[10px] text-slate-500">{item.category} · {item.createdAt}</div></div><div className="flex gap-2"><button onClick={() => { setGenerated(item.prompt); setTitle(item.title); setCategory(item.category); setActive("Prompt Studio"); }} className="rounded-lg bg-violet-500/15 px-3 py-2 text-[11px] font-semibold text-violet-200">Open</button><button onClick={() => { const next = saved.filter(x => x.id !== item.id); setSaved(next); localStorage.setItem("jaccksallas-prompts", JSON.stringify(next)); }} className="rounded-lg border border-line px-3 py-2 text-[11px] text-slate-400 hover:text-rose-300">Delete</button></div></div>)}</div> : <div className="glass rounded-2xl p-12 text-center"><Clock3 className="mx-auto mb-3 text-slate-600" size={28}/><p className="text-sm font-semibold">Belum ada prompt tersimpan</p><p className="mt-1 text-xs text-slate-500">Generate prompt lalu tekan Save untuk menyimpannya.</p></div>}
            </>}

            {["Game Builder","APK Builder","Website Builder"].includes(active) && <div className="glass rounded-2xl p-8 sm:p-12"><div className="mb-4 inline-flex rounded-xl bg-violet-500/10 p-3 text-violet-300"><WandSparkles size={23}/></div><h1 className="text-2xl font-black">{active}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Builder ini menggunakan Prompt Studio dengan kategori yang sudah dipilih. Mulai isi detail proyek untuk menghasilkan master prompt khusus.</p><button onClick={() => { setCategory(active === "Game Builder" ? "Game" : active === "APK Builder" ? "APK / Mobile App" : "Website"); setActive("Prompt Studio"); }} className="mt-6 rounded-xl bg-violet-600 px-4 py-3 text-xs font-bold">Open {active} <ArrowRight className="ml-2 inline" size={14}/></button></div>}

            {active === "Settings" && <div className="max-w-2xl"><div className="mb-7"><h1 className="text-3xl font-black">Settings</h1><p className="mt-2 text-sm text-slate-500">Pengaturan awal workspace Jaccksallas AI.</p></div><div className="glass space-y-5 rounded-2xl p-5"><div><div className="text-sm font-semibold">AI provider integration</div><p className="mt-1 text-xs leading-5 text-slate-500">Multi-provider API tersedia di AI Studio. Simpan API key di environment variables Vercel, bukan di browser.</p><div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-400/15 bg-amber-400/5 p-3 text-xs text-amber-200"><CircleHelp size={15}/> Status provider mengikuti konfigurasi environment variables Vercel.</div></div><div className="border-t border-line pt-5"><div className="text-sm font-semibold">Data & privacy</div><p className="mt-1 text-xs leading-5 text-slate-500">Riwayat versi ini tersimpan di localStorage browser. Data tidak tersinkron antarperangkat dan dapat hilang jika data browser dihapus.</p></div><div className="border-t border-line pt-5"><div className="text-sm font-semibold">Application</div><p className="mt-1 text-xs text-slate-500">Jaccksallas AI Master Prompt Builder · V1.0 · Foundation + UI/UX</p></div></div></div>}
          </div>
          <footer className="border-t border-line px-5 py-5 text-center text-[10px] text-slate-600">© 2026 Jaccksallas AI Master Prompt Builder · Built for creators</footer>
        </main>
      </div>
      {toast && <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-xl border border-violet-400/20 bg-[#17152a] px-4 py-3 text-xs font-medium text-violet-100 shadow-2xl">{toast}</div>}
    </div>
  );
}

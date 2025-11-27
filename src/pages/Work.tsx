import { Card } from "@/components/ui/card";
import { FileText, GitBranch, Mic, MessageSquare, Users, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import * as React from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const Work = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [jiraDomain, setJiraDomain] = React.useState("");
  const [jiraEmail, setJiraEmail] = React.useState("");
  const [jiraToken, setJiraToken] = React.useState("");
  const [jiraProjectKey, setJiraProjectKey] = React.useState("");
  const [epicName, setEpicName] = React.useState("");
  const [spec, setSpec] = React.useState("");
  const [generatedTasks, setGeneratedTasks] = React.useState<string[]>([]);
  const [structuredTasks, setStructuredTasks] = React.useState<{ title: string; subtasks: string[] }[]>([]);
  const [atomicTasks, setAtomicTasks] = React.useState<{ title: string; role: string; priority: "low" | "medium" | "high" }[]>([]);
  const [team, setTeam] = React.useState<{ name: string; role: string }[]>([]);
  const [memberName, setMemberName] = React.useState("");
  const [memberRole, setMemberRole] = React.useState("");
  const [assignments, setAssignments] = React.useState<Record<string, string>>({});
  const [transcript, setTranscript] = React.useState("");
  const [listening, setListening] = React.useState(false);
  const [createSubtasks, setCreateSubtasks] = React.useState(true);
  const [jiraLoading, setJiraLoading] = React.useState(false);
  React.useEffect(() => {
    const planRaw = localStorage.getItem("aiPlan");
    const planText = localStorage.getItem("aiPlanText");
    if (planRaw && !spec) {
      try {
        const plan = JSON.parse(planRaw) as { epic?: string; tasks?: { title: string; subtasks: string[] }[] };
        const epic = plan.epic || "Эпик";
        const tasks = Array.isArray(plan.tasks) ? plan.tasks : [];
        setEpicName(epic);
        setStructuredTasks(tasks);
        setGeneratedTasks(tasks.map(t => t.title));
        setAtomicTasks([]);
        setSpec(planText || tasks.map(t => `${t.title}\n${t.subtasks.map(s => `  - ${s}`).join("\n")}`).join("\n\n"));
      } catch {}
      localStorage.removeItem("aiPlan");
      localStorage.removeItem("aiPlanText");
      return;
    }
    const s = localStorage.getItem("aiSpec");
    const e = localStorage.getItem("aiEpic");
    if (s && !spec) {
      setSpec(s);
      if (e) setEpicName(e);
      const atomic = buildAtomicTasksFromText(s);
      setAtomicTasks(atomic);
      setStructuredTasks([]);
      setGeneratedTasks(atomic.map(a => a.title));
      localStorage.removeItem("aiSpec");
      localStorage.removeItem("aiEpic");
    }
  }, []);

  const isSupabaseConfigured = React.useMemo(() => {
    return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  }, []);

  const generateFromText = React.useCallback((text: string) => {
    const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const lines = rawLines.flatMap(l => l.split(/\.|;|\u2022|-/).map(s => s.trim())).filter(Boolean);
    const structured = lines.map(line => {
      const parts = line.split(/\sи\s|,|;|\(|\)|\sа также\s|\sдля\s|\sв\s|\sна\s/).map(p => p.trim()).filter(Boolean);
      const uniqueSubs: string[] = [];
      for (const p of parts) {
        if (!uniqueSubs.some(u => u.toLowerCase() === p.toLowerCase())) uniqueSubs.push(p);
      }
      const subs = uniqueSubs.slice(0, 6);
      return { title: line, subtasks: subs.length ? subs : ["Анализ", "Реализация", "Тестирование"] };
    });
    const titles = structured.map(s => s.title);
    setStructuredTasks(structured);
    setGeneratedTasks(titles);
    toast({ title: "Сгенерировано", description: `${titles.length} задач по ТЗ и структура подзадач` });
  }, [toast]);

  const buildAtomicTasksFromText = (text: string) => {
    const t = text.toLowerCase();
    const out: { title: string; role: string; priority: "low" | "medium" | "high" }[] = [];
    const add = (title: string, role: string, priority: "low" | "medium" | "high") => out.push({ title, role, priority });
    const has = (r: RegExp) => r.test(t);
    if (has(/вход|логин|аутентиф|нов(ое|ый)?\s*устр|device/)) {
      add("Собрать device fingerprint на логине", "backend", "high");
      add("Создать таблицу known_devices", "backend", "high");
      add("Реализовать правило 'новое устройство' и событие", "backend", "high");
    }
    if (has(/push|мобильн|app|android|ios/)) {
      add("Подключить push провайдера (FCM/APNS)", "mobile", "high");
      add("Реализовать выдачу и хранение push‑токенов", "mobile", "medium");
      add("Собрать шаблоны уведомлений", "frontend", "medium");
    }
    if (has(/почт|email|smtp/)) {
      add("Настроить SMTP/почтовый сервис", "devops", "medium");
      add("Создать шаблоны писем", "design", "medium");
      add("Логировать исходящие письма", "backend", "medium");
    }
    if (has(/лог|аудит|audit|trace/)) {
      add("Спроектировать схему событий аудита", "backend", "medium");
      add("Реализовать запись журнала событий", "backend", "medium");
    }
    if (has(/монитор|sla|алерт|оповещ/)) {
      add("Добавить метрики входов и доставок", "devops", "medium");
      add("Настроить пороговые алерты", "devops", "medium");
    }
    if (!out.length) {
      add("Уточнить требования и сформировать план работ", "pm", "medium");
      add("Реализовать ключевую функциональность", "backend", "medium");
      add("Покрыть интеграционными тестами", "qa", "medium");
    }
    return out;
  };

  const generateTasks = () => {
    const atomic = buildAtomicTasksFromText(spec);
    setAtomicTasks(atomic);
    setStructuredTasks([]);
    setGeneratedTasks(atomic.map(a => a.title));
    toast({ title: "Анализ ТЗ", description: `Задач: ${atomic.length}` });
  };

  const saveLocalTasks = async () => {
    if (!generatedTasks.length) return;
    if (isSupabaseConfigured) {
      const url = import.meta.env.VITE_SUPABASE_URL as string;
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
      const client = createClient(url, key, { auth: { storage: localStorage, persistSession: true, autoRefreshToken: true } });
      const projectId = crypto.randomUUID();
      const teamId = crypto.randomUUID();
      await client.from("teams").insert({ id: teamId, name: "Команда", owner_id: "local" });
      await client.from("projects").insert({ id: projectId, name: epicName || "Эпик", status: "active", team_id: teamId });
      const rows = generatedTasks.map(t => ({ id: crypto.randomUUID(), title: t, project_id: projectId, status: "new", priority: "medium" }));
      await client.from("tasks").insert(rows);
    }
    toast({ title: "Сохранено", description: "Задачи сохранены локально" });
  };

  const saveToHome = () => {
    const list = structuredTasks.length
      ? structuredTasks.map(s => ({ title: s.title, status: "Новое", priority: "Средний", assigneeName: assignments[s.title] || "" }))
      : generatedTasks.map(t => ({ title: t, status: "Новое", priority: "Средний", assigneeName: assignments[t] || "" }));
    localStorage.setItem("homeTasks", JSON.stringify(list));
    localStorage.setItem("homeProjectName", epicName || "Forte AI-Master");
    toast({ title: "Сохранено на главной", description: `${list.length} задач добавлено на главную страницу` });
  };

  const createInJira = async () => {
    if (!generatedTasks.length) {
      toast({ title: "Нет задач", description: "Сначала сгенерируйте задачи из ТЗ" });
      return;
    }
    if (!jiraDomain || !jiraEmail || !jiraToken || !jiraProjectKey) {
      toast({ title: "Требуются данные Jira", description: "Заполните домен, email, токен и ключ проекта" });
      return;
    }
    try {
      setJiraLoading(true);
      const auth = btoa(`${jiraEmail}:${jiraToken}`);
      let epicKey = "";
      if (epicName) {
        const epicRes = await fetch(`https://${jiraDomain}/rest/api/3/issue`, {
          method: "POST",
          headers: { "Authorization": `Basic ${auth}`, "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ fields: { project: { key: jiraProjectKey }, summary: epicName, issuetype: { name: "Epic" } } })
        });
        const epicJson = await epicRes.json();
        epicKey = epicJson?.key || "";
      }
      if (!atomicTasks.length && createSubtasks && structuredTasks.length) {
        for (const s of structuredTasks) {
          const parentRes = await fetch(`https://${jiraDomain}/rest/api/3/issue`, {
            method: "POST",
            headers: { "Authorization": `Basic ${auth}`, "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ fields: { project: { key: jiraProjectKey }, summary: s.title, issuetype: { name: "Task" }, customfield_10014: epicKey || undefined } })
          });
          const parentJson = await parentRes.json();
          const parentKey = parentJson?.key;
          for (const sub of s.subtasks) {
            await fetch(`https://${jiraDomain}/rest/api/3/issue`, {
              method: "POST",
              headers: { "Authorization": `Basic ${auth}`, "Accept": "application/json", "Content-Type": "application/json" },
              body: JSON.stringify({ fields: { project: { key: jiraProjectKey }, summary: sub, issuetype: { name: "Sub-task" }, parent: { key: parentKey }, customfield_10014: epicKey || undefined } })
            });
          }
        }
      } else {
        const list = atomicTasks.length ? atomicTasks.map(a => a.title) : generatedTasks;
        for (const t of list) {
          await fetch(`https://${jiraDomain}/rest/api/3/issue`, {
            method: "POST",
            headers: { "Authorization": `Basic ${auth}`, "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ fields: { project: { key: jiraProjectKey }, summary: t, issuetype: { name: "Task" }, customfield_10014: epicKey || undefined } })
          });
        }
      }
      toast({ title: "Создано в Jira", description: `${generatedTasks.length} задач` });
    } catch (e) {
      toast({ title: "Ошибка Jira", description: "Проверьте доступ и данные" });
    } finally {
      setJiraLoading(false);
    }
  };

  const addMember = () => {
    if (!memberName || !memberRole) return;
    setTeam(prev => [...prev, { name: memberName, role: memberRole || "" }]);
    setMemberName("");
    setMemberRole("");
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMember();
  };


  const decomposeTask = (t: string) => {
    const parts = t.split(/[,.;]/).map(p => p.trim()).filter(p => p);
    const subs = parts.length ? parts : [t];
    toast({ title: "Декомпозиция", description: `${subs.length} пунктов` });
  };

  const assignTask = (task: string, member: string) => {
    setAssignments(prev => ({ ...prev, [task]: member }));
  };

  type RecognitionEvent = { resultIndex: number; results: ArrayLike<{ 0: { transcript: string } }> };
  type SpeechRecoCtor = new () => { lang: string; continuous: boolean; onresult: (e: RecognitionEvent) => void; onend: () => void; start: () => void };
  const startListening = () => {
    const w = window as Window & { SpeechRecognition?: SpeechRecoCtor; webkitSpeechRecognition?: SpeechRecoCtor };
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Нет поддержки", description: "Распознавание речи недоступно" });
      return;
    }
    const recog = new SpeechRecognition();
    recog.lang = "ru-RU";
    recog.continuous = true;
    recog.onresult = (e: RecognitionEvent) => {
      let text = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setTranscript(prev => (prev ? prev + "\n" : "") + text);
    };
    recog.onend = () => setListening(false);
    recog.start();
    setListening(true);
  };

  const stopListening = () => {
    const w = window as Window & { SpeechRecognition?: SpeechRecoCtor; webkitSpeechRecognition?: SpeechRecoCtor };
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setListening(false);
    }
  };

  const syncDecisionsToTasks = () => {
    const lines = transcript.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const decisions = lines.filter(l => /решени|итог|договор/i.test(l));
    if (!decisions.length) {
      toast({ title: "Нет решений", description: "Не найдено ключевых решений" });
      return;
    }
    toast({ title: "Зафиксировано", description: `${decisions.length} решений` });
  };

  const analyzeTranscriptToTasks = () => {
    const text = transcript.toLowerCase();
    const tasks: { title: string; subtasks: string[] }[] = [];
    const push = (title: string, subs: string[]) => tasks.push({ title, subtasks: subs });
    const has = (r: RegExp) => r.test(text);
    if (has(/вход|логин|аутентиф|нов(ое|ый)?\s*устр|device/)) {
      push("Детектирование входов с новых устройств", [
        "Критерии 'нового' устройства",
        "Сбор device fingerprint",
        "Сравнение и триггер события",
        "Хранилище известных устройств",
      ]);
    }
    if (has(/уведомлен|push|мобильн|app|android|ios/)) {
      push("Уведомления в мобильное приложение", [
        "Провайдер push",
        "Связка аккаунт-устройство",
        "Шаблоны уведомлений",
        "Мониторинг доставки",
      ]);
    }
    if (has(/почт|email|корпорат|smtp/)) {
      push("Уведомления на корпоративную почту", [
        "Почтовый сервис",
        "Шаблоны писем",
        "Ретраи",
        "Логи исходящих",
      ]);
    }
    if (has(/лог|аудит|audit|trace/)) {
      push("Логирование и аудит", [
        "Схема событий",
        "Ретеншн",
        "Корреляция",
        "Отчётность",
      ]);
    }
    if (has(/монитор|sla|алерт|оповещ/)) {
      push("Мониторинг и алерты", [
        "Метрики",
        "Пороги",
        "Каналы оповещений",
        "Проверки",
      ]);
    }
    if (!tasks.length) {
      push("Анализ требований", ["Сбор", "Области", "План работ"]);
      push("Реализация", ["Дизайн", "Разработка", "Интеграция"]);
      push("Тестирование", ["Юнит", "Интеграция", "E2E"]);
    }
    setStructuredTasks(tasks);
    setGeneratedTasks(tasks.map(t => t.title));
    toast({ title: "Анализ транскрипта", description: `Задач: ${tasks.length}` });
  };

  const progress = React.useMemo(() => {
    const total = generatedTasks.length || 1;
    const done = Object.values(assignments).length;
    return Math.round((done / total) * 100);
  }, [generatedTasks, assignments]);

  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-16 grid gap-8 max-w-6xl">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate(-1)} className="transform transition-transform hover:-translate-y-0.5">
            <ArrowLeft className="w-4 h-4 mr-2" /> Назад
          </Button>
        </div>
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary shadow-glow mx-auto">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">Рабочая страница</h1>
          <p className="text-lg text-muted-foreground">Функции Forte AI‑Master для работы</p>
          <div className="pt-3">
            <Button asChild className="bg-primary hover:bg-primary-glow shadow-glow transform transition-transform hover:-translate-y-0.5">
              <Link to="/ai">Автоматизация через ИИ</Link>
            </Button>
          </div>
        </div>

        <Card className="p-6 bg-card border-primary/20 shadow-glow rounded-xl transform transition-all hover:-translate-y-1 hover:shadow-[0_0_50px_hsl(338_80%_50%/0.35)]">
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary-glow" />
              <div className="text-xl font-semibold">Создание эпика и задач из ТЗ</div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="epic">Эпик</Label>
                <Input id="epic" value={epicName} onChange={e => setEpicName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Jira Project Key</Label>
                <Input id="project" value={jiraProjectKey} onChange={e => setJiraProjectKey(e.target.value)} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Jira Domain</Label>
                <Input id="domain" placeholder="your-domain.atlassian.net" value={jiraDomain} onChange={e => setJiraDomain(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={jiraEmail} onChange={e => setJiraEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token">API Token</Label>
                <Input id="token" type="password" value={jiraToken} onChange={e => setJiraToken(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="spec">Техническое задание</Label>
              <Textarea id="spec" rows={6} value={spec} onChange={e => setSpec(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <Button onClick={generateTasks} className="transform transition-transform hover:-translate-y-0.5">Анализировать ТЗ</Button>
              <Button onClick={saveLocalTasks} variant="secondary" className="transform transition-transform hover:-translate-y-0.5">Сохранить локально</Button>
              <Button onClick={createInJira} variant="outline" disabled={jiraLoading} className="transform transition-transform hover:-translate-y-0.5">{jiraLoading ? "Создание..." : "Создать в Jira"}</Button>
              <Button onClick={saveToHome} variant="outline" className="transform transition-transform hover:-translate-y-0.5">Сохранить на главной</Button>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={createSubtasks} onChange={e => setCreateSubtasks(e.target.checked)} />
                Создавать подзадачи
              </label>
            </div>
            <div className="grid gap-3">
              <div className="text-sm text-muted-foreground">Задач: {atomicTasks.length || generatedTasks.length}</div>
              <div className="rounded-lg border border-primary/40 bg-gradient-to-br from-secondary/30 to-background p-3 shadow-card">
                <div className="flex flex-wrap gap-2">
                  {(atomicTasks.length ? atomicTasks.map(a => a.title) : generatedTasks).map(t => (
                    <Badge key={t} variant="outline" className="text-xs max-w-[280px] truncate border-primary/40 text-primary/80 bg-primary/5 hover:bg-primary/10" title={t}>{t}</Badge>
                  ))}
                </div>
              </div>
              {structuredTasks.length ? (
                <div className="grid gap-2 pt-2">
                  {structuredTasks.map((s, i) => (
                    <div key={i} className="rounded-lg border border-primary/40 p-3 bg-card/60 shadow-card">
                      <div className="text-base font-semibold max-w-[600px] truncate" title={s.title}>{s.title}</div>
                      {createSubtasks && s.subtasks.length ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {s.subtasks.map((sub, j) => (
                            <Badge key={j} variant="outline" className="text-xs max-w-[260px] truncate border-secondary text-secondary-foreground bg-secondary/20 hover:bg-secondary/30" title={sub}>{sub}</Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-primary/20 shadow-glow rounded-xl transform transition-all hover:-translate-y-1 hover:shadow-[0_0_50px_hsl(338_80%_50%/0.35)]">
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <GitBranch className="w-6 h-6 text-primary-glow" />
              <div className="text-xl font-semibold">Поручения</div>
            </div>
            <div className="space-y-2">
              <Label>Список поручений</Label>
              <div className="flex flex-wrap gap-2">
                {atomicTasks.map(a => (
                  <Badge key={a.title} variant="outline" className="text-xs max-w-[320px] truncate" title={a.title}>{a.title} • {a.role} • {a.priority}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Назначение поручений</Label>
              <div className="flex flex-wrap gap-2">
                {atomicTasks.map(a => (
                  <div key={a.title} className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs max-w-[260px] truncate" title={a.title}>{a.title}</Badge>
                    <select className="h-9 rounded-md border bg-background px-2 text-sm" value={assignments[a.title] || ""} onChange={e => assignTask(a.title, e.target.value)}>
                      <option value="">Не назначено</option>
                      {team.map(m => (
                        <option key={m.name} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-primary/20 shadow-glow rounded-xl transform transition-all hover:-translate-y-1 hover:shadow-[0_0_50px_hsl(338_80%_50%/0.35)]">
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <GitBranch className="w-6 h-6 text-primary-glow" />
              <div className="text-xl font-semibold">Декомпозиция и распределение</div>
            </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Задачи</Label>
                  <div className="rounded-lg border border-primary/40 bg-gradient-to-br from-secondary/30 to-background p-3 shadow-card">
                    <div className="flex flex-wrap gap-2">
                      {generatedTasks.map(t => (
                        <Button
                          key={t}
                          variant="outline"
                          onClick={() => decomposeTask(t)}
                          className="text-xs max-w-[280px] truncate border-primary/40 text-primary/80 bg-primary/5 hover:bg-primary/10"
                          title={t}
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Команда</Label>
                  <form onSubmit={handleAddMemberSubmit} className="flex gap-2">
                    <Input placeholder="Имя" value={memberName} onChange={e => setMemberName(e.target.value)} />
                  <Input placeholder="Роль" value={memberRole} onChange={e => setMemberRole(e.target.value)} />
                  <Button type="submit" disabled={!memberName || !memberRole} className="transform transition-transform hover:-translate-y-0.5">Добавить</Button>
                </form>
                <div className="flex flex-wrap gap-2 mt-2">
                  {team.map(m => (
                    <Badge key={m.name} variant="secondary" className="text-xs">{m.name} • {m.role}</Badge>
                  ))}
                </div>
              </div>
            </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Назначение</Label>
                  <div className="rounded-lg border border-primary/40 bg-card/60 p-3 shadow-card">
                    <div className="flex flex-wrap gap-2">
                      {generatedTasks.map(t => (
                        <div key={t} className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs max-w-[260px] truncate border-primary/40 text-primary/80 bg-primary/5" title={t}>{t}</Badge>
                          <select
                            className="h-9 rounded-md border bg-background px-2 text-sm border-primary/40 focus:outline-none focus:ring-2 focus:ring-ring"
                            value={assignments[t] || ""}
                            onChange={e => assignTask(t, e.target.value)}
                          >
                            <option value="">Не назначено</option>
                            {team.map(m => (
                              <option key={m.name} value={m.name}>{m.name}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Прогресс</Label>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <div className="text-sm text-muted-foreground">{progress}%</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-primary/20 shadow-glow rounded-xl transform transition-all hover:-translate-y-1 hover:shadow-[0_0_50px_hsl(338_80%_50%/0.35)]">
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Mic className="w-6 h-6 text-primary-glow" />
              <div className="text-xl font-semibold">Транскрибация и фиксация решений</div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={startListening} disabled={listening}>Начать запись</Button>
              <Button variant="secondary" onClick={stopListening}>Остановить</Button>
              <Button variant="outline" onClick={syncDecisionsToTasks}>Синхронизировать решения</Button>
              <Button variant="outline" onClick={analyzeTranscriptToTasks} className="transform transition-transform hover:-translate-y-0.5">Сформировать задачи из транскрипта</Button>
            </div>
            <Textarea rows={6} value={transcript} onChange={e => setTranscript(e.target.value)} placeholder="Транскрипт" />
          </div>
        </Card>

        <Card className="p-6 bg-card border-primary/20 shadow-glow rounded-xl transform transition-all hover:-translate-y-1 hover:shadow-[0_0_50px_hsl(338_80%_50%/0.35)]">
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary-glow" />
              <div className="text-xl font-semibold">Уточняющие вопросы и напоминания</div>
            </div>
            <div className="space-y-2">
              <Label>Предложения вопросов</Label>
              <div className="flex flex-wrap gap-2">
                {spec ? spec.split(/\.|\n/).filter(Boolean).slice(0, 5).map((q, i) => (
                  <Badge key={i} variant="outline" className="text-xs">Требует уточнения: {q.slice(0, 40)}...</Badge>
                )) : <Badge variant="secondary" className="text-xs">Введите ТЗ для предложений</Badge>}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Work;

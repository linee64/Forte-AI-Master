import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Users, Sparkles, ArrowLeft } from "lucide-react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

type Msg = { role: "user" | "assistant"; content: string };
type Plan = { epic: string; tasks: { title: string; subtasks: string[] }[] };

const AIChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [lastPlan, setLastPlan] = React.useState<Plan | null>(null);

  const analyzePlan = (text: string): Plan => {
    const lower = text.toLowerCase();
    const epic = (text.split(/\.|\n|!/)[0] || "Эпик").trim().slice(0, 80);
    const tasks: Plan["tasks"] = [];
    const pushSub = (title: string, subs: string[]) => tasks.push({ title, subtasks: subs });
    const has = (k: RegExp) => k.test(lower);
    if (has(/crm|истор(ия|и)|обращен|тикет|support|helpdesk/)) {
      pushSub("Дизайн схемы данных обращений", [
        "Сущности: Клиент, Обращение, Коммуникация",
        "Статусы и приоритеты",
        "Связи и нормализация",
        "Индексы для поиска",
      ]);
      pushSub("Интерфейс менеджера", [
        "Список обращений с фильтрами",
        "Карточка обращения и таймлайн",
        "Поиск и сортировка",
        "Метки и категории",
      ]);
      pushSub("Права и доступ", [
        "Роли и разрешения",
        "Доступ к чувствительным данным",
        "Журнал действий",
        "Аудит изменений",
      ]);
      pushSub("Интеграция с существующей CRM", [
        "API контракт",
        "Маппинг полей",
        "Миграция данных",
        "Синхронизация",
      ]);
      pushSub("Уведомления и SLA", [
        "Алерты о новых обращениях",
        "Контроль сроков SLA",
        "Каналы уведомлений",
        "Настройки пользователя",
      ]);
    }
    if (has(/вход|логин|аутентиф|нов(ое|ый)?\s*устр|device/)) {
      pushSub("Детектирование входов с новых устройств", [
        "Определение критериев 'нового' устройства",
        "Сбор и хранение device fingerprint",
        "Сравнение с базой известных устройств",
        "Генерация события безопасности",
      ]);
    }
    if (has(/уведомлен|push|мобильн|app|android|ios/)) {
      pushSub("Отправка уведомлений в мобильное приложение", [
        "Интеграция провайдера push",
        "Связка аккаунта и устройства",
        "Шаблоны уведомлений",
        "Трассировка доставки",
      ]);
    }
    if (has(/почт|email|корпорат|smtp/)) {
      pushSub("Отправка уведомлений в корпоративную почту", [
        "Интеграция SMTP/почтового сервиса",
        "Шаблоны писем",
        "Доставка и ретраи",
        "Журнал исходящих",
      ]);
    }
    if (has(/лог|аудит|audit|trace/)) {
      pushSub("Логирование и аудит", [
        "Схема журнала событий",
        "Ретеншн и доступ",
        "Корреляция событий",
        "Экспорт и отчёты",
      ]);
    }
    if (has(/монитор|sla|алерт|оповещ/)) {
      pushSub("Мониторинг и алерты", [
        "Метрики и дашборды",
        "Пороговые алерты",
        "Дежурства и каналы",
        "Проверки работоспособности",
      ]);
    }
    if (!tasks.length) {
      pushSub("Анализ требований", [
        "Интервью со стейкхолдерами",
        "Описание сценариев и ограничений",
        "Формализация требований и критериев приёмки",
        "План работ и риски",
      ]);
      pushSub("Дизайн", [
        "Информационная архитектура",
        "Схема данных и контракты API",
        "Прототипы интерфейса",
        "Планирование интеграций",
      ]);
      pushSub("Разработка", [
        "Инициализация модулей",
        "Реализация API и сервисов",
        "Интеграция с БД",
        "Настройка CI",
      ]);
      pushSub("Тестирование", [
        "Юнит‑тесты и покрытие",
        "Интеграционные тесты",
        "E2E сценарии",
        "Настройка тестового стенда",
      ]);
    }
    return { epic, tasks };
  };

  const formatPlan = (plan: { epic: string; tasks: { title: string; subtasks: string[] }[] }) => {
    const lines: string[] = [];
    lines.push(`Эпик: ${plan.epic}`);
    lines.push("Задачи:");
    plan.tasks.forEach((t, i) => {
      lines.push(`${i + 1}. ${t.title}`);
      if (t.subtasks.length) {
        t.subtasks.forEach((s, j) => {
          lines.push(`  - ${s}`);
        });
      }
    });
    return lines.join("\n");
  };

  const parsePlanFromText = (text: string): Plan | null => {
    const lines = text.split(/\r?\n/).map(l => l.trimEnd());
    const epicLine = lines.find(l => l.startsWith("Эпик:"));
    const idxTasks = lines.findIndex(l => /^Задачи:?$/.test(l));
    if (!epicLine || idxTasks === -1) return null;
    const epic = epicLine.replace(/^Эпик:\s*/, "").trim();
    const tasks: { title: string; subtasks: string[] }[] = [];
    let i = idxTasks + 1;
    while (i < lines.length) {
      const line = lines[i];
      const m = line.match(/^\d+\.\s+(.*)$/);
      if (m) {
        const title = m[1].trim();
        const subtasks: string[] = [];
        i++;
        while (i < lines.length && /^\s*-\s/.test(lines[i])) {
          const s = lines[i].replace(/^\s*-\s*/, "").trim();
          if (s) subtasks.push(s);
          i++;
        }
        tasks.push({ title, subtasks });
        continue;
      }
      i++;
    }
    return { epic, tasks };
  };

  const send = async () => {
    if (!input.trim()) return;
    setSending(true);
    const userMsg: Msg = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    const plan = analyzePlan(input.trim());
    const reply = formatPlan(plan);
    setLastPlan(plan);
    const assistantMsg: Msg = { role: "assistant", content: reply };
    setMessages(prev => [...prev, assistantMsg]);
    setInput("");
    setSending(false);
  };

  const applyToWork = () => {
    if (!lastPlan) return;
    const spec = formatPlan(lastPlan);
    localStorage.setItem("aiPlan", JSON.stringify(lastPlan));
    localStorage.setItem("aiPlanText", spec);
    navigate("/work");
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <section className="relative min-h-screen flex items-start justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-16 max-w-5xl w-full grid gap-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/")} className="transform transition-transform hover:-translate-y-0.5">
            <ArrowLeft className="w-4 h-4 mr-2" /> Назад
          </Button>
        </div>
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary shadow-glow mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">Forte AI‑Master</h1>
          <p className="text-lg text-muted-foreground">Полноценный чат: вставь ТЗ — получи план задач</p>
        </div>

        <Card className="p-6 bg-card border-primary/20 shadow-glow rounded-xl">
          <div className="grid gap-4">
            <div className="h-[360px] overflow-y-auto rounded-md border border-primary/20 p-4 bg-card/50">
              {messages.length === 0 ? (
                <div className="text-sm text-muted-foreground">Начни диалог: вставь ТЗ или опиши цель</div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <Card
                      key={i}
                      className={
                        m.role === "user"
                          ? "p-3 bg-card/70 border-border"
                          : "p-3 bg-secondary/30 border-primary/20"
                      }
                    >
                      <div className="text-xs mb-2 text-muted-foreground">{m.role === "user" ? "Вы" : "AI‑Master"}</div>
                      {m.role === "assistant" && parsePlanFromText(m.content) ? (
                        (() => {
                          const plan = parsePlanFromText(m.content)!;
                          return (
                            <div className="space-y-3">
                              <div className="font-semibold text-foreground">Эпик: {plan.epic}</div>
                              <div className="space-y-2">
                                {plan.tasks.map((t, idx) => (
                                  <div key={idx} className="space-y-1">
                                    <div className="font-medium">{idx + 1}. {t.title}</div>
                                    {t.subtasks.length ? (
                                      <ul className="list-disc pl-5 text-muted-foreground">
                                        {t.subtasks.map((s, j) => (
                                          <li key={j}>{s}</li>
                                        ))}
                                      </ul>
                                    ) : null}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="whitespace-pre-wrap leading-relaxed text-foreground">{m.content}</div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
            {lastPlan ? (
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Задач: {lastPlan.tasks.length}</div>
                <div className="flex flex-wrap gap-2">
                  {lastPlan.tasks.map((t, i) => (
                    <Badge key={i} variant="outline" className="text-xs max-w-[280px] truncate" title={t.title}>{t.title}</Badge>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="space-y-2">
              <Textarea rows={4} value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} placeholder="Вставь ТЗ или опиши цель" />
              <div className="flex gap-3">
                <Button onClick={send} disabled={sending || !input.trim()} className="transform transition-transform hover:-translate-y-0.5">Отправить</Button>
                <Button variant="secondary" onClick={applyToWork} disabled={!lastPlan} className="transform transition-transform hover:-translate-y-0.5">Применить на странице работы</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AIChat;

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const defaultTasks = [
  {
    id: "FORTE-123",
    title: "Разработка API для интеграции с Jira",
    status: "В работе",
    priority: "Высокий",
    assignee: "АК",
    assigneeName: "Андрей Козлов",
    statusIcon: Clock,
    statusColor: "text-primary-glow",
  },
  {
    id: "FORTE-124",
    title: "Настройка транскрибации встреч",
    status: "Выполнено",
    priority: "Средний",
    assignee: "ДМ",
    assigneeName: "Дмитрий Мартынов",
    statusIcon: CheckCircle2,
    statusColor: "text-green-500",
  },
  {
    id: "FORTE-125",
    title: "Внедрение AI-модели для декомпозиции",
    status: "Требует внимания",
    priority: "Высокий",
    assignee: "ЕС",
    assigneeName: "Елена Смирнова",
    statusIcon: AlertCircle,
    statusColor: "text-yellow-500",
  },
];

const DashboardPreview = () => {
  const mapSaved = (items: any[]) =>
    items.map((t, i) => {
      const status = t.status || "Новое";
      const priority = t.priority || "Средний";
      const icon = status === "Выполнено" ? CheckCircle2 : status === "Требует внимания" ? AlertCircle : Clock;
      const color =
        status === "Выполнено"
          ? "text-green-500"
          : status === "Требует внимания"
          ? "text-yellow-500"
          : status === "В процессе"
          ? "text-orange-500"
          : "text-primary-glow";
      return {
        id: t.id || `LOCAL-${i}`,
        title: t.title,
        status,
        priority,
        assignee: t.assignee || "",
        assigneeName: t.assigneeName || "",
        statusIcon: icon,
        statusColor: color,
      };
    });

  const [tasks, setTasks] = React.useState(defaultTasks);
  const [projectName, setProjectName] = React.useState("Forte AI-Master");
  const [editOpen, setEditOpen] = React.useState(false);
  const [editName, setEditName] = React.useState("");
  const [editTasks, setEditTasks] = React.useState<typeof tasks>([]);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("homeTasks");
      const proj = localStorage.getItem("homeProjectName");
      if (proj) setProjectName(proj);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) setTasks(mapSaved(parsed));
      }
    } catch {}
  }, []);

  const doneCount = tasks.filter((t) => t.status === "Выполнено").length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  const initials = (name?: string) => {
    if (!name) return "?";
    const parts = name.split(/\s+/).filter(Boolean);
    if (!parts.length) return "?";
    const a = parts[0]?.[0] || "";
    const b = parts[1]?.[0] || "";
    return (a + b || a).toUpperCase();
  };
  const statusInfo = (s: string) => (
    s === "Выполнено"
      ? { Icon: CheckCircle2, color: "text-green-500" }
      : s === "Требует внимания"
      ? { Icon: AlertCircle, color: "text-yellow-500" }
      : s === "В процессе"
      ? { Icon: Loader2, color: "text-orange-500" }
      : { Icon: Clock, color: "text-primary-glow" }
  );
  const statusClasses = (s: string) =>
    s === "Выполнено"
      ? "border-green-500/50 text-green-600"
      : s === "Требует внимания"
      ? "border-yellow-500/50 text-yellow-600"
      : s === "В процессе"
      ? "border-orange-500/50 text-orange-600"
      : "border-primary/40 text-primary/80";
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-4xl sm:text-5xl font-bold">
            <span className="text-foreground">Контроль в </span>
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              реальном времени
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Следите за прогрессом команды и управляйте задачами из единого интерфейса
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto">
          <Card className="p-6 sm:p-8 bg-card border-border shadow-card">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
              <div>
                <h3 className="text-2xl font-display font-bold text-foreground">
                  Проект: {projectName}
                </h3>
                <p className="text-muted-foreground mt-1">Спринт 3 • 5 дней до завершения</p>
              </div>
              <div className="flex gap-2 items-center">
                <Badge variant="outline" className="border-primary text-primary">
                  {tasks.length} задач
                </Badge>
                <Badge variant="outline" className="border-green-500/50 text-green-500">
                  {doneCount} выполнено
                </Badge>
                <Dialog
                  open={editOpen}
                  onOpenChange={(v) => {
                    setEditOpen(v);
                    if (v) {
                      setEditName(projectName);
                      setEditTasks(tasks.map((t) => ({ ...t })));
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" className="text-xs">Редактировать</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Редактировать проект</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <label className="text-sm text-muted-foreground">Название проекта</label>
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder={projectName} />
                      <div className="text-sm font-medium mt-2">Задачи</div>
                      <div className="grid gap-2 max-h-[320px] overflow-y-auto">
                        {editTasks.map((t, i) => (
                          <div key={i} className="grid gap-2 rounded-md border border-border p-2">
                            <div className="text-sm font-medium">{t.title}</div>
                            <div className="flex flex-wrap items-center gap-2">
                              <Select
                                value={t.status}
                                onValueChange={(v) => {
                                  const next = [...editTasks];
                                  next[i] = { ...t, status: v };
                                  setEditTasks(next);
                                }}
                              >
                                <SelectTrigger className={cn("h-8 w-[160px] text-xs", statusClasses(t.status))}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Новое">Новое</SelectItem>
                                  <SelectItem value="В работе">В работе</SelectItem>
                                  <SelectItem value="В процессе">В процессе</SelectItem>
                                  <SelectItem value="Требует внимания">Требует внимания</SelectItem>
                                  <SelectItem value="Выполнено">Выполнено</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select
                                value={t.priority}
                                onValueChange={(v) => {
                                  const next = [...editTasks];
                                  next[i] = { ...t, priority: v };
                                  setEditTasks(next);
                                }}
                              >
                                <SelectTrigger className="h-8 w-[140px] text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Высокий">Высокий</SelectItem>
                                  <SelectItem value="Средний">Средний</SelectItem>
                                  <SelectItem value="Низкий">Низкий</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                className="h-8 text-xs max-w-[180px]"
                                placeholder="Исполнитель"
                                value={t.assigneeName || ""}
                                onChange={(e) => {
                                  const next = [...editTasks];
                                  next[i] = { ...t, assigneeName: e.target.value };
                                  setEditTasks(next);
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          const nextName = editName.trim() || projectName;
                          setProjectName(nextName);
                          localStorage.setItem("homeProjectName", nextName);
                          const toSave = editTasks.map((t) => ({ title: t.title, status: t.status, priority: t.priority, assigneeName: t.assigneeName }));
                          localStorage.setItem("homeTasks", JSON.stringify(toSave));
                          setTasks(editTasks);
                          setEditOpen(false);
                          setEditName("");
                        }}
                      >
                        Сохранить
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {tasks.map((task) => {
                const Info = statusInfo(task.status);
                const StatusIcon = Info.Icon;
                return (
                  <Card
                    key={task.id}
                    className="p-4 bg-secondary/30 border-border hover:border-primary/30 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <StatusIcon className={`w-5 h-5 ${Info.color}`} />
                          <span className="text-sm font-medium text-muted-foreground">
                            {task.id}
                          </span>
                          <Badge
                            variant={task.priority === "Высокий" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-foreground group-hover:text-primary-glow transition-colors">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className={cn("text-xs", statusClasses(task.status))}>{task.status}</Badge>
                        </div>
                      </div>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Avatar className="border-2 border-primary/20 cursor-pointer">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                              {initials(task.assigneeName || task.assignee)}
                            </AvatarFallback>
                          </Avatar>
                        </HoverCardTrigger>
                        <HoverCardContent className="text-sm">
                          <div className="font-medium text-foreground">{task.assigneeName}</div>
                          <div className="text-muted-foreground">Исполнитель задачи</div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Прогресс спринта</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;

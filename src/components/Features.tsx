import { Card } from "@/components/ui/card";
import { 
  FileText, 
  GitBranch, 
  Mic, 
  MessageSquare, 
  Bell, 
  Users 
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Автосоздание задач",
    description: "Автоматически создаёт задачи и эпики в Jira на основе технического задания",
    gradient: "from-primary to-primary-glow",
  },
  {
    icon: GitBranch,
    title: "Декомпозиция задач",
    description: "Разбивает сложные задачи на подзадачи и распределяет их по исполнителям",
    gradient: "from-primary-glow to-primary",
  },
  {
    icon: Mic,
    title: "Транскрибация встреч",
    description: "Подключается к звонкам, записывает и фиксирует ключевые решения",
    gradient: "from-primary to-primary-dark",
  },
  {
    icon: MessageSquare,
    title: "Умные вопросы",
    description: "Задаёт уточняющие вопросы в чате во время встреч для лучшего понимания",
    gradient: "from-primary-dark to-primary",
  },
  {
    icon: Bell,
    title: "Контроль дедлайнов",
    description: "Отслеживает прогресс и напоминает команде о приближающихся дедлайнах",
    gradient: "from-primary-glow to-primary-dark",
  },
  {
    icon: Users,
    title: "Управление командой",
    description: "Создавайте команды для проектов и эффективно распределяйте задачи",
    gradient: "from-primary to-primary-glow",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="font-display text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Возможности
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Всё, что нужно для эффективного управления Scrum-процессами
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="group relative p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 shadow-card hover:shadow-glow overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative space-y-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} p-2.5 shadow-glow`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-primary-glow transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

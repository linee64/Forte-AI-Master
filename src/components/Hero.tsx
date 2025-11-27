import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
const Hero = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm hidden">
            <Sparkles className="w-4 h-4 text-primary-glow" />
            <span className="text-sm font-medium text-foreground">
              Новое поколение Scrum мастеров
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Forte AI-Master
            </span>
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Ваш AI Scrum-мастер
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Автоматизируйте Scrum-процессы: управление Jira, декомпозиция задач, 
            транскрибация встреч и контроль дедлайнов — всё в одном AI-агенте
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="group bg-primary hover:bg-primary-glow transition-all duration-300 shadow-glow hover:shadow-[0_0_50px_hsl(338_80%_50%/0.5)]">
              <Link to="/work">Начать<ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
            
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-12 max-w-3xl mx-auto">
            {[{
            value: "80%",
            label: "Экономия времени"
          }, {
            value: "До 100%",
            label: "Точность записей"
          }, {
            value: "24/7",
            label: "Доступность"
          }, {
            value: "0",
            label: "Пропущенных задач"
          }].map((stat, idx) => <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-display font-bold text-primary-glow">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;

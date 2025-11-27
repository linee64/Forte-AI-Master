import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto relative">
        <Card className="max-w-4xl mx-auto p-8 sm:p-12 bg-gradient-to-br from-card to-secondary/30 border-primary/20 shadow-glow">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary shadow-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            {/* Heading */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
              <span className="text-foreground">Готовы начать с </span>
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Forte AI-Master
              </span>
              <span className="text-foreground">?</span>
            </h2>

            {/* Description */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Присоединяйтесь к командам, которые уже автоматизировали свои Scrum-процессы 
              и повысили продуктивность на 80%
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button 
                size="lg" 
                className="group bg-primary hover:bg-primary-glow transition-all duration-300 shadow-glow hover:shadow-[0_0_50px_hsl(338_80%_50%/0.5)] text-lg px-8"
              >
                Начать бесплатный пробный период
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-glow" />
                <span>Бесплатно 14 дней</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-glow" />
                <span>Без кредитной карты</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary-glow" />
                <span>Отмена в любое время</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CallToAction;

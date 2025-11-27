import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
const Header = () => {
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Forte AI-Master
            </span>
          </div>

          {/* Navigation */}
          

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex transform transition-transform hover:-translate-y-0.5">
              <Link to="/login">Войти</Link>
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary-glow transition-colors shadow-glow transform transition-transform hover:-translate-y-0.5">
              <Link to="/register">Зарегистрироваться</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;

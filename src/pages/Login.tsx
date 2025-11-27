import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import * as React from "react";
import { Sparkles } from "lucide-react";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Вход выполнен", description: "Добро пожаловать" });
    navigate("/");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-glow/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={() => navigate("/")} className="transform transition-transform hover:-translate-y-0.5">Назад</Button>
        </div>
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-card to-secondary/30 border-primary/20 shadow-glow transform transition-transform duration-300 hover:-translate-y-1">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary shadow-glow mx-auto">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="font-display text-2xl">Вход</CardTitle>
            <CardDescription>Введите email и пароль, чтобы продолжить</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <div className="flex justify-end">
                  <a href="#" className="text-primary hover:text-primary/90 transform transition-transform duration-200 hover:-translate-y-0.5">Забыли пароль?</a>
                </div>
              </div>
              <Button type="submit" className="w-full transform transition-transform duration-200 hover:-translate-y-0.5">Войти</Button>
            </form>
          </CardContent>
          <CardFooter className="justify-between">
            <div className="text-sm text-muted-foreground">Нет аккаунта?</div>
            <Link to="/register" className="text-primary hover:text-primary/90 transform transition-transform duration-200 hover:-translate-y-0.5">Зарегистрироваться</Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default Login;

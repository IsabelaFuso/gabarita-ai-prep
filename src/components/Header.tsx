import { Brain, User, Settings, Bell, Menu, Home, BookOpen, PenTool, Trophy, BarChart3, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  currentView?: string;
  onNavigate?: (view: string) => void;
}

export const Header = ({ currentView = 'dashboard', onNavigate }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navigationItems = [
    { 
      title: "Início", 
      href: "#", 
      icon: Home,
      value: "dashboard",
      description: "Dashboard principal e estatísticas"
    },
    { 
      title: "Simulados", 
      href: "#", 
      icon: BookOpen,
      value: "simulados",
      description: "Simulados completos e personalizados",
      submenu: [
        { title: "Simulado Completo", description: "Prova completa com todas as matérias" },
        { title: "Simulado Rápido", description: "30 questões em 60 minutos" },
        { title: "Simulado por Área", description: "Foque em matérias específicas" }
      ]
    },
    { 
      title: "Redação", 
      href: "#", 
      icon: PenTool,
      value: "redacao",
      description: "Prática de redação dissertativo-argumentativa"
    },
    { 
      title: "Questões", 
      href: "#", 
      icon: Trophy,
      value: "questoes",
      description: "Banco de questões por matéria",
      submenu: [
        { title: "Por Matéria", description: "Questões organizadas por disciplina" },
        { title: "Questões Comentadas", description: "Com explicações detalhadas" },
        { title: "Minhas Dificuldades", description: "Questões onde você mais erra" }
      ]
    },
    { 
      title: "Desempenho", 
      href: "#", 
      icon: BarChart3,
      value: "desempenho",
      description: "Relatórios e análise de progresso"
    }
  ];

  return (
    <header className="glass-strong sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center animate-glow">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Gabarita.AI
              </h1>
              <p className="text-xs text-muted-foreground">Sua preparação inteligente</p>
            </div>
          </div>

          {/* Navigation Menu - Hidden on mobile */}
          <div className="hidden lg:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.value}>
                    {item.submenu ? (
                      <>
                        <NavigationMenuTrigger 
                          className={cn(
                            "bg-transparent hover:bg-primary/10",
                            currentView === item.value && "bg-primary/20 text-primary"
                          )}
                        >
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.submenu.map((subItem) => (
                              <NavigationMenuLink
                                key={subItem.title}
                                className={cn(
                                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                                )}
                                onClick={() => onNavigate?.(item.value)}
                              >
                                <div className="text-sm font-medium leading-none">{subItem.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {subItem.description}
                                </p>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                          currentView === item.value && "bg-primary/20 text-primary"
                        )}
                        onClick={() => onNavigate?.(item.value)}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.title}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu & User Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-strong">
                  <DropdownMenuLabel>Menu Principal</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {navigationItems.map((item) => (
                    <DropdownMenuItem 
                      key={item.value} 
                      onClick={() => onNavigate?.(item.value)}
                      className={cn(
                        "cursor-pointer",
                        currentView === item.value && "bg-primary/20 text-primary"
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs animate-pulse"
              >
                3
              </Badge>
            </Button>

            {/* Help Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-strong">
                <DropdownMenuLabel>Ajuda</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Como Usar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trophy className="mr-2 h-4 w-4" />
                  Dicas de Estudo
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Suporte
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 hover:bg-primary/10 p-3 rounded-xl">
                  <div className="w-9 h-9 bg-gradient-primary rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  {user && (
                    <div className="text-left hidden md:block">
                      <p className="text-sm font-medium truncate max-w-[150px]">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Plano Gratuito</p>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-strong">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Histórico
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button variant="premium" size="sm" className="w-full justify-start">
                    Upgrade para Pro
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive hover:bg-destructive/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
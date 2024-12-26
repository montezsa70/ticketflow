import { Home, BarChart2, Users, Settings, PlusCircle, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

interface AdminSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function AdminSidebar({ activeView, setActiveView }: AdminSidebarProps) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Successfully signed out!");
    navigate('/auth');
  };

  const items = [
    {
      title: "Dashboard",
      icon: Home,
      view: "dashboard",
    },
    {
      title: "Analytics",
      icon: BarChart2,
      view: "analytics",
    },
    {
      title: "Create Event",
      icon: PlusCircle,
      view: "create",
    },
    {
      title: "Manage Attendees",
      icon: Users,
      view: "attendees",
    },
    {
      title: "Customization",
      icon: Settings,
      view: "settings",
    },
  ]

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.view}>
                  <SidebarMenuButton
                    onClick={() => setActiveView(item.view)}
                    data-active={activeView === item.view}
                    className="transition-all duration-200 hover:scale-105"
                    tooltip={item.title}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSignOut}
                  className="text-destructive hover:text-destructive transition-all duration-200 hover:scale-105"
                  tooltip="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
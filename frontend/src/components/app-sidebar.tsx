"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpenText, Compass, Library, SunMoon, Ticket } from "lucide-react"
import { useTheme } from "next-themes"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const NAVIGATIONS = [
  {
    label: "Platform",
    items: [
      {
        label: "Discover",
        href: "/",
        icon: Compass,
      },
    ],
  },
  {
    label: "Portfolio",
    items: [
      {
        label: "Courses",
        href: "/dashboard",
        icon: BookOpenText,
      },
      {
        label: "Certificates",
        href: "/certificates",
        icon: Ticket,
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  const { setTheme, resolvedTheme } = useTheme()

  return (
    <>
      <Sidebar variant="floating">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2">
            <Library className="size-6" />
            <h1 className="text-lg font-bold">Redacted</h1>
          </Link>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          {NAVIGATIONS.map((nav, index) => (
            <SidebarGroup key={index}>
              <SidebarGroupLabel>{nav.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {nav.items.map((item, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-6" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() =>
                      setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                  >
                    <SunMoon className="size-6" />
                    <span>Toogle Theme</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {
          //<SidebarFooter>
          //<SidebarMenu>
          //<SidebarMenuItem>
          //<DropdownMenu>
          //<DropdownMenuTrigger asChild>
          //<SidebarMenuButton
          //onClick={(e) => {
          //if (!account) {
          //e.preventDefault()
          //setOpen(true)
          //}
          //}}
          //size="lg"
          //className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          //>
          //<Avatar className="h-8 w-8 rounded-lg">
          //<AvatarImage
          //className="object-cover"
          //alt={name.data || account?.address}
          ///>
          //<AvatarFallback className="rounded-lg">
          //{name.data?.slice(0, 1) ||
          //account?.address.slice(2, 5) ||
          //"?"}
          //</AvatarFallback>
          //</Avatar>
          //<div className="grid flex-1 text-left text-sm leading-tight">
          //<span className="truncate font-semibold">
          //{name.data ||
          //account?.address.slice(0, 16) ||
          //"Connect Wallet"}
          //</span>
          //<span className="inline-flex items-center gap-1 truncate text-xs text-muted-foreground">
          //{account?.address ? (
          //balance.data?.totalBalance ? (
          //<>
          //Balance{" "}
          //{formatSuiDecimal(balance.data.totalBalance)}{" "}
          //<SuiIcon className="size-3" />
          //</>
          //) : (
          //"Loading Balance"
          //)
          //) : (
          //"Please Connect Wallet"
          //)}
          //</span>
          //</div>
          //<ChevronsUpDown className="ml-auto size-4" />
          //</SidebarMenuButton>
          //</DropdownMenuTrigger>
          //{account && (
          //<DropdownMenuContent className="min-w-40">
          //<DropdownMenuLabel>Account</DropdownMenuLabel>
          //<DropdownMenuSeparator />
          //<DropdownMenuGroup>
          //<DropdownMenuItem
          //onClick={() => {
          //navigator.clipboard.writeText(account.address)
          //toast.success("Address copied to clipboard")
          //}}
          //>
          //<Copy className="mr-2 size-4" />
          //<span>Copy Address</span>
          //</DropdownMenuItem>
          //<DropdownMenuItem
          //onClick={async () => {
          //await requestSuiFromFaucet(account.address)
          //toast.success("Faucet requested")
          //balance.refetch()
          //}}
          //>
          //<Droplets className="mr-2 size-4" />
          //<span>Devnet Faucet Request</span>
          //</DropdownMenuItem>
          //</DropdownMenuGroup>
          //<DropdownMenuSeparator />
          //<DropdownMenuGroup>
          //<DropdownMenuItem
          //onClick={async () => {
          //await disconnect()
          //toast.success("Wallet disconnected")
          //}}
          //>
          //<LogOut className="mr-2 size-4" />
          //<span>Disconnect</span>
          //</DropdownMenuItem>
          //</DropdownMenuGroup>
          //</DropdownMenuContent>
          //)}
          //</DropdownMenu>
          //</SidebarMenuItem>
          //</SidebarMenu>
          //</SidebarFooter>
        }
      </Sidebar>
    </>
  )
}

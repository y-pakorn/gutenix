"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import _ from "lodash"
import {
  BookOpenText,
  ChevronsUpDown,
  Compass,
  Copy,
  Droplets,
  Library,
  LogOut,
  SunMoon,
  Ticket,
} from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import {
  useAccount,
  useBalance,
  useEnsAvatar,
  useEnsName,
  useSwitchChain,
} from "wagmi"

import { chains } from "@/config/web3"
import { useChain } from "@/hooks/useChain"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

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

  const privy = usePrivy()

  const account = useAccount()
  const name = useEnsName({
    address: account?.address,
  })
  const avatar = useEnsAvatar({
    name: name.data || undefined,
  })
  const balance = useBalance({
    address: account?.address,
  })
  const chain = useChain()
  const { switchChainAsync } = useSwitchChain()

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
          <SidebarGroup>
            <SidebarGroupLabel>Protocol</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <img
                        className="aspect-square size-4 rounded-full"
                        alt={chain.name}
                        src={chain.icon}
                      />
                      <span>{chain.name}</span>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Protocol</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuRadioGroup
                      value={`${chain.id}`}
                      onValueChange={async (value) => {
                        switchChainAsync({
                          chainId: parseInt(value) as any,
                        })
                        toast.success("Chain switched", {
                          description: `Switched to ${chains[parseInt(value)].name}`,
                        })
                      }}
                    >
                      {_.chain(chains)
                        .map((c) => (
                          <DropdownMenuRadioItem key={c.id} value={`${c.id}`}>
                            <img
                              className="mr-2 aspect-square size-4 rounded-full"
                              alt={c.name}
                              src={c.icon}
                            />
                            <span>{c.name}</span>
                          </DropdownMenuRadioItem>
                        ))
                        .value()}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

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
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    onClick={(e) => {
                      if (!privy.authenticated) {
                        e.preventDefault()
                        privy.login()
                      }
                    }}
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      {privy.authenticated ? (
                        <>
                          <AvatarImage
                            className="object-cover"
                            src={avatar.data || undefined}
                            alt={name.data || account.address}
                          />
                          <AvatarFallback className="rounded-lg">
                            {name.data?.slice(0, 1) ||
                              account.address?.slice(2, 4) ||
                              "?"}
                          </AvatarFallback>
                        </>
                      ) : (
                        <AvatarFallback className="rounded-lg">
                          ?
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {privy.authenticated
                          ? name.data || account.address?.slice(0, 16)
                          : "Connect Wallet"}
                      </span>
                      <span className="inline-flex items-center gap-1 truncate text-xs text-muted-foreground">
                        {privy.authenticated ? (
                          balance.data ? (
                            <>
                              Balance {balance.data.formatted}{" "}
                              {balance.data.symbol}
                            </>
                          ) : (
                            "Loading Balance"
                          )
                        ) : (
                          "Please Connect Wallet"
                        )}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                {privy.authenticated && (
                  <DropdownMenuContent className="min-w-40">
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => {
                          if (!account.address) return
                          navigator.clipboard.writeText(account.address!)
                          toast.success("Address copied to clipboard")
                        }}
                      >
                        <Copy className="mr-2 size-4" />
                        <span>Copy Address</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={async () => {}}>
                        <Droplets className="mr-2 size-4" />
                        <span>Faucet Request</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={async () => {
                          await privy.logout()
                          toast.success("Wallet disconnected")
                        }}
                      >
                        <LogOut className="mr-2 size-4" />
                        <span>Disconnect</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}

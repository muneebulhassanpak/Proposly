"use client"

import type { ReactNode } from "react"
import { Loader2, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLogout } from "../hooks/use-logout.hook"
import type { Profile } from "@/lib/auth.utils"

interface TopNavProps {
  profile: Pick<Profile, "full_name" | "email" | "avatar_url" | "role">
  notificationSlot?: ReactNode
}

export function TopNav({ profile, notificationSlot }: TopNavProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const { logout, isLoggingOut } = useLogout()
  const initials =
    profile.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?"

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Loader2
              size={24}
              strokeWidth={1.5}
              className="animate-spin text-ink-mute"
            />
            <p className="text-sm text-ink-mute">Logging out...</p>
          </div>
        </div>
      )}
      <header className="flex h-14 shrink-0 items-center border-b border-hairline bg-surface px-4">
        <SidebarTrigger size="icon" />

        <div className="flex-1" />

        {notificationSlot}

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="mr-1"
        >
          {resolvedTheme === "dark" ? (
            <Sun size={18} strokeWidth={1.5} />
          ) : (
            <Moon size={18} strokeWidth={1.5} />
          )}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 rounded-full p-0"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile.avatar_url ?? undefined} />
                <AvatarFallback className="text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-ink">
                {profile.full_name ?? "User"}
              </p>
              <p className="text-xs text-ink-mute">{profile.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={logout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </>
  )
}

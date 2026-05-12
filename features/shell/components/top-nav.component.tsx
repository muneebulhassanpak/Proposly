"use client"

import { Bell, Moon, Sun } from "lucide-react"
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
import { logoutAction } from "@/features/auth/actions/auth.action"
import type { Profile } from "@/lib/auth.utils"

interface TopNavProps {
  profile: Pick<Profile, "full_name" | "email" | "avatar_url" | "role">
}

export function TopNav({ profile }: TopNavProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const initials =
    profile.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?"

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-hairline bg-surface px-4">
      <SidebarTrigger size="icon" />

      <div className="flex-1" />

      {/* Notification bell — wired in Sprint 08 */}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        disabled
        className="mr-1"
      >
        <Bell size={18} strokeWidth={1.5} />
      </Button>

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
          <DropdownMenuItem asChild>
            <form action={logoutAction} className="w-full">
              <button type="submit" className="w-full cursor-pointer text-left">
                Log out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

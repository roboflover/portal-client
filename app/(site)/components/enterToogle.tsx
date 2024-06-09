"use client"
 
import * as React from "react"
import { Moon, Sun, CircleUser } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
 
export function EnterToggle({toggleMenu}:any) {
  

  return (
    <Button onClick={toggleMenu} variant="outline" size="icon" className="mr-5">
    <CircleUser className="" />
    <span className="sr-only">Enter</span>
    </Button>
  )
}
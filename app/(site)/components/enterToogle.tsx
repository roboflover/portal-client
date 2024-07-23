"use client"
 
import * as React from "react"
import Link from 'next/link';
import { Moon, Sun, CircleUser } from "lucide-react"

import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/app/context/AuthContext";
 
export function EnterToggle({toggleMenu}:any) {
  
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <>
    {/* <Sun className="h-6 w-6 text-gray-900 dark:text-white" /> */}
        <DropdownMenu>  
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="mr-5">
          <CircleUser className=" rotate-0 scale-100 transition-all text-gray-900 dark:text-white" />  
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem /*onClick={() => setTheme("light")}*/>
          <Link href="/profile">
          Профиль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem /*onClick={() => setTheme("dark")}*/>
          Мои билеты
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    {/* <Button onClick={toggleMenu} variant="outline" size="icon" className="mr-5">
      <CircleUser className="" />
      <span className="sr-only">Enter</span>
    </Button> */}
    
    </>
  )
}
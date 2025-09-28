import { useState } from "react";
import React from "react";
import MultiCity from "@/ways/Multi-city";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Bus, User, MapPin, Ticket, Settings, LogOut, UserCircle } from "lucide-react";

// Mock user state - in real app this would come from auth context
const mockUser = {
  isAuthenticated: false, // Change to true to see authenticated state
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "",
};

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Bus className="h-8 w-8 text-primary  cursor-pointer text-blue-600" />
            <span className="text-2xl font-bold  ">BusGo</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Book</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <NavigationMenuLink asChild>
                      <Link to="/search" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Search Buses</div>
                          <div className="text-sm text-muted-foreground">Find and compare bus routes</div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/multi-city" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent">
                        <Bus className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium">Popular Routes</div>
                          <div className="text-sm text-muted-foreground">Explore trending destinations</div>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/manage-booking"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Manage Booking
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/refund"
                    className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Help
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {mockUser.isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
                      <AvatarFallback>
                        {mockUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{mockUser.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{mockUser.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/manage">
                      <Ticket className="mr-2 h-4 w-4" />
                      <span>My Bookings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile?tab=settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild >
                  <Link to="/auth/login">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Link
                  to="/search"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Search Buses</span>
                </Link>
                <Link
                  to="/routes"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  <Bus className="h-5 w-5 text-primary" />
                  <span>Popular Routes</span>
                </Link>
                <Link
                  to="/manage"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  <Ticket className="h-5 w-5 text-primary" />
                  <span>Manage Booking</span>
                </Link>
                <Link
                  to="/help"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-5 w-5 text-primary" />
                  <span>Help</span>
                </Link>
                
                <div className="border-t pt-4">
                  {mockUser.isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-3 p-3 mb-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={mockUser.avatar || "/placeholder.svg"} alt={mockUser.name} />
                          <AvatarFallback>
                            {mockUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{mockUser.name}</p>
                          <p className="text-xs text-muted-foreground">{mockUser.email}</p>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent"
                        onClick={() => setIsOpen(false)}
                      >
                        <UserCircle className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/manage"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent"
                        onClick={() => setIsOpen(false)}
                      >
                        <Ticket className="h-5 w-5" />
                        <span>My Bookings</span>
                      </Link>
                      <div className="border-t mt-4 pt-4">
                        <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent w-full text-left">
                          <LogOut className="h-5 w-5" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full justify-start " asChild>
                        <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                          <User className="h-4 w-4 mr-2" />
                          Login
                        </Link>
                      </Button>
                      <Button className="w-full" asChild>
                        <Link to="/auth/register" onClick={() => setIsOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
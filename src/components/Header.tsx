'use client';

import Link from 'next/link';
import { BookOpen, Menu, X, LogIn, LogOut, Shield, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-800 transition-opacity hover:opacity-80">
              <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                Engbook
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {/* Desktop Navigation Removed */}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Desktop Right Nav - Auth UI */}
          <div className="hidden md:flex items-center gap-2">
            {status === 'loading' ? (
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : session ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {session.user?.name || session.user?.email}
                  </span>
                  {session.user?.role === 'ADMIN' && (
                    <Shield className="w-4 h-4 text-purple-600" />
                  )}
                </div>
                {session.user?.role === 'ADMIN' && (
                  <Button variant="ghost" size="sm" asChild className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                    <Link href="/admin/users">
                      <Shield className="w-4 h-4 mr-2" /> Admin
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                <Link href="/login">
                  <LogIn className="w-4 h-4 mr-2" /> Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 py-2 bg-white/95">
            <nav className="flex flex-col space-y-1">
              {/* Mobile Navigation Links Removed */}

              {/* Mobile Auth */}
              <div className="border-t border-slate-200 pt-2 mt-2">
                {session ? (
                  <>
                    <div className="px-3 py-2 text-sm font-medium text-slate-700">
                      {session.user?.name || session.user?.email}
                      {session.user?.role === 'ADMIN' && (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Admin</span>
                      )}
                    </div>
                    {session.user?.role === 'ADMIN' && (
                      <Button variant="ghost" asChild className="justify-start w-full text-purple-600">
                        <Link href="/admin/users" onClick={() => setMobileMenuOpen(false)}>
                          <Shield className="w-4 h-4 mr-2" /> Admin Dashboard
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="justify-start w-full text-red-600"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" asChild className="justify-start w-full text-blue-600">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <LogIn className="w-4 h-4 mr-2" /> Sign In
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

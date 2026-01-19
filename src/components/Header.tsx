'use client';

import Link from 'next/link';
import {
  BookOpen, Menu, X, LogIn, LogOut, Shield, User,
  BookA, GraduationCap, NotebookPen, Dumbbell, Youtube, Layers, Languages, Headphones
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 dark:supports-[backdrop-filter]:bg-slate-950/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 transition-opacity hover:opacity-80">
              <div className="p-1.5 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300">
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
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800 rounded-lg border border-blue-200 dark:border-slate-700">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {session.user?.name || session.user?.email}
                  </span>
                  {(session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN') && (
                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
                {(session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN') && (
                  <Button variant="ghost" size="sm" asChild className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20">
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
              {/* Mobile Navigation Links */}
              <div className="px-2 pb-3 space-y-1">
                <Link
                  href="/vocab"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <BookA className="w-5 h-5 mr-3 text-blue-600" /> Vocabulary
                </Link>
                <Link
                  href="/grammar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-purple-600 transition-colors"
                >
                  <GraduationCap className="w-5 h-5 mr-3 text-purple-600" /> Grammar
                </Link>
                <Link
                  href="/youglish"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-red-600 transition-colors"
                >
                  <Youtube className="w-5 h-5 mr-3 text-red-600" /> Pronunciation
                </Link>
                <Link
                  href="/flashcard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                >
                  <Layers className="w-5 h-5 mr-3 text-indigo-600" /> Flashcards
                </Link>
                <Link
                  href="/notes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-yellow-600 transition-colors"
                >
                  <NotebookPen className="w-5 h-5 mr-3 text-yellow-600" /> Notes
                </Link>
                <Link
                  href="/exercises"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-green-600 transition-colors"
                >
                  <Dumbbell className="w-5 h-5 mr-3 text-green-600" /> Exercises
                </Link>
                <Link
                  href="/listening"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-cyan-600 transition-colors"
                >
                  <Headphones className="w-5 h-5 mr-3 text-cyan-600" /> Listening
                </Link>
                <Link
                  href="/translate"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-base font-medium text-slate-700 rounded-md hover:bg-slate-50 hover:text-orange-600 transition-colors"
                >
                  <Languages className="w-5 h-5 mr-3 text-orange-600" /> Translator
                </Link>
              </div>

              {/* Mobile Auth */}
              <div className="border-t border-slate-200 pt-2 mt-2">
                {session ? (
                  <>
                    <div className="px-3 py-2 text-sm font-medium text-slate-700">
                      {session.user?.name || session.user?.email}
                      {(session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN') && (
                        <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Admin</span>
                      )}
                    </div>
                    {(session.user?.role === 'ADMIN' || session.user?.role === 'SUPER_ADMIN') && (
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

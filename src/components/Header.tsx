'use client';

import Link from 'next/link';
import { BookOpen, GraduationCap, PenTool, Library, StickyNote, FileText, Book, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export default function Header() {
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
          <nav className="hidden sm:flex space-x-1">
            <Button variant="ghost" asChild className="text-sm font-medium hover:bg-slate-100/50 hover:text-blue-600 transition-all">
              <Link href="/">
                <Library className="w-4 h-4 mr-2" /> Vocabulary
              </Link>
            </Button>
            <Button variant="ghost" asChild className="text-sm font-medium text-slate-600 hover:bg-slate-100/50 hover:text-blue-600 transition-all">
              <Link href="/grammar">
                <GraduationCap className="w-4 h-4 mr-2" /> Grammar
              </Link>
            </Button>
            <Button variant="ghost" asChild className="text-sm font-medium text-slate-600 hover:bg-slate-100/50 hover:text-blue-600 transition-all">
              <Link href="/listening">
                <PenTool className="w-4 h-4 mr-2" /> Listening
              </Link>
            </Button>
            <Button variant="ghost" asChild className="text-sm font-medium text-slate-600 hover:bg-slate-100/50 hover:text-blue-600 transition-all">
              <Link href="/flashcard">
                <StickyNote className="w-4 h-4 mr-2" /> Flashcard
              </Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Desktop Right Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100/50">
              <Book className="w-4 h-4 mr-2" /> Handbook
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 hover:bg-slate-100/50">
              <FileText className="w-4 h-4 mr-2" /> Tests
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 py-2 bg-white/95">
            <nav className="flex flex-col space-y-1">
              <Button variant="ghost" asChild className="justify-start text-sm font-medium hover:bg-slate-100/50 hover:text-blue-600">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Library className="w-4 h-4 mr-2" /> Vocabulary
                </Link>
              </Button>
              <Button variant="ghost" asChild className="justify-start text-sm font-medium hover:bg-slate-100/50 hover:text-blue-600">
                <Link href="/grammar" onClick={() => setMobileMenuOpen(false)}>
                  <GraduationCap className="w-4 h-4 mr-2" /> Grammar
                </Link>
              </Button>
              <Button variant="ghost" asChild className="justify-start text-sm font-medium hover:bg-slate-100/50 hover:text-blue-600">
                <Link href="/listening" onClick={() => setMobileMenuOpen(false)}>
                  <PenTool className="w-4 h-4 mr-2" /> Listening
                </Link>
              </Button>
              <Button variant="ghost" asChild className="justify-start text-sm font-medium hover:bg-slate-100/50 hover:text-blue-600">
                <Link href="/flashcard" onClick={() => setMobileMenuOpen(false)}>
                  <StickyNote className="w-4 h-4 mr-2" /> Flashcard
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

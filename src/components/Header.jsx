import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Menu, X, Shield, Code, Zap } from 'lucide-react'

const navLinks = [
  { name: 'Accueil', href: '#hero' },
  { name: 'À propos', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Projets', href: '#portfolio' },
  { name: 'Contact', href: '#contact' },
]

export default function Header() {
  const headerRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)

    // GSAP entrance animation
    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    )

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (scrolled) {
      gsap.to(headerRef.current, {
        backgroundColor: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 30px rgba(59, 130, 246, 0.1)',
        duration: 0.3,
      })
    } else {
      gsap.to(headerRef.current, {
        backgroundColor: 'transparent',
        backdropFilter: 'blur(0px)',
        boxShadow: 'none',
        duration: 0.3,
      })
    }
  }, [scrolled])

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-atom-blue-500 to-atom-blue-700 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-atom-blue-500/30 transition-shadow duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-atom-blue-400 to-atom-green-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold font-display tracking-wider bg-gradient-to-r from-white to-atom-blue-200 bg-clip-text text-transparent">
              ATOMIXIA
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-atom-blue-500 to-atom-green-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
              </a>
            ))}
            <a
              href="#contact"
              className="ml-4 px-6 py-2.5 bg-gradient-to-r from-atom-blue-600 to-atom-blue-500 hover:from-atom-blue-500 hover:to-atom-blue-400 text-white text-sm font-semibold rounded-full shadow-lg shadow-atom-blue-500/25 hover:shadow-atom-blue-500/40 transition-all duration-300 hover:scale-105"
            >
              Devis gratuit
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="md:hidden pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block mx-4 mt-4 px-6 py-3 bg-gradient-to-r from-atom-blue-600 to-atom-blue-500 text-white text-center font-semibold rounded-full"
            >
              Devis gratuit
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}

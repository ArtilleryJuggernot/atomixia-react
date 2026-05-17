import React from 'react'
import { Zap, Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-atom-dark-900 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-atom-blue-500 to-atom-blue-700 flex items-center justify-center">
                <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold font-display tracking-wider text-white">
                ATOMIXIA
              </span>
            </div>
            <p className="text-gray-400 max-w-sm mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Expert en cybersécurité et développement web basé à Lyon.
              Nous accompagnons les entreprises d'Auvergne-Rhône-Alpes.
            </p>
            <div className="flex gap-2 sm:gap-3">
              {[
                { icon: Github, href: 'https://github.com/ArtilleryJuggernot', label: 'GitHub' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Mail, href: 'mailto:hugo.jacquel@atomixia.fr', label: 'Email' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-atom-blue-500/10 hover:border-atom-blue-500/20 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Services</h4>
            <ul className="space-y-2 sm:space-y-3">
              {['Site Web & SaaS', 'Pentest & Audit', 'Conseil SI', 'Sensibilisation'].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-gray-400 hover:text-atom-blue-300 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Informations</h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: 'Mentions légales', href: '/mentions-legales' },
                { name: 'CGV', href: '/cgv' },
                { name: 'Confidentialité', href: '/politique-confidentialite' },
                { name: 'Contact', href: '#contact' },
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-400 hover:text-atom-blue-300 transition-colors text-sm">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs sm:text-sm">
            © {new Date().getFullYear()} Atomixia. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-1">
            Fait avec <Heart className="w-3 h-3 text-red-400 fill-red-400" /> à Lyon
          </p>
        </div>
      </div>
    </footer>
  )
}

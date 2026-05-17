import React from 'react'
import { Zap, Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="absolute inset-0 bg-gradient-to-t from-atom-dark-900 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-atom-blue-500 to-atom-blue-700 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-display tracking-wider text-white">
                ATOMIXIA
              </span>
            </div>
            <p className="text-gray-400 max-w-md mb-6 leading-relaxed">
              Expert en cybersécurité et développement web basé à Lyon.
              Nous accompagnons les entreprises d'Auvergne-Rhône-Alpes
              dans leurs projets numériques.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <a href="https://github.com/ArtilleryJuggernot" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-atom-blue-500/10 hover:border-atom-blue-500/20 transition-all duration-300"
              >
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-atom-blue-500/10 hover:border-atom-blue-500/20 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-atom-blue-500/10 hover:border-atom-blue-500/20 transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a href="mailto:hugo.jacquel@atomixia.fr"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-atom-blue-500/10 hover:border-atom-blue-500/20 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {['Site Web & SaaS', 'Pentest & Audit', 'Conseil SI', 'Sensibilisation Cyber'].map((item) => (
                <li key={item}>
                  <a href="#services" className="text-gray-400 hover:text-atom-blue-300 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Informations</h4>
            <ul className="space-y-3">
              {[
                { name: 'Mentions légales', href: '/mentions-legales' },
                { name: 'CGV', href: '/cgv' },
                { name: 'Politique de confidentialité', href: '/politique-confidentialite' },
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

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Atomixia. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Fait avec <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> à Lyon
          </p>
        </div>
      </div>
    </footer>
  )
}

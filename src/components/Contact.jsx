import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useInView } from 'react-intersection-observer'
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, Clock } from 'lucide-react'

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')
  const titleRef = useRef(null)
  const [inViewRef, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    gsap.fromTo('.contact-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
    gsap.fromTo('.contact-info', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.15 })
    gsap.fromTo('.contact-form', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.25 })
  }, [inView])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    await new Promise((r) => setTimeout(r, 1500))
    setStatus('success')
    setFormState({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setStatus('idle'), 3000)
  }

  const contactItems = [
    { icon: Mail, label: 'Email', value: 'hugo.jacquel@atomixia.fr', href: 'mailto:hugo.jacquel@atomixia.fr' },
    { icon: Phone, label: 'Téléphone', value: '07 81 22 31 71', href: 'tel:+33781223171' },
    { icon: MapPin, label: 'Zone', value: 'Lyon & Auvergne-Rhône-Alpes', href: null },
    { icon: Clock, label: 'Horaires', value: '10h - 18h (24-48h réponse)', href: null },
  ]

  return (
    <section id="contact" ref={inViewRef} className="py-16 sm:py-20 lg:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-atom-dark-900 to-atom-dark-800" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-atom-blue-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={titleRef} className="text-center mb-12 sm:mb-16">
          <span className="contact-title inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-atom-blue-500/10 border border-atom-blue-500/20 text-atom-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            Contact
          </span>
          <h2 className="contact-title text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Parlons de votre
            </span>{' '}
            <span className="bg-gradient-to-r from-atom-blue-400 to-atom-green-400 bg-clip-text text-transparent">
              projet
            </span>
          </h2>
          <p className="contact-title text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Un projet en tête ? Contactez-moi pour en discuter. Réponse sous 24 à 48h.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Info */}
          <div className="contact-info lg:col-span-2 space-y-4 sm:space-y-6">
            {contactItems.map((item) => {
              const Icon = item.icon
              const content = (
                <>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-atom-blue-500/10 border border-atom-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-atom-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm sm:text-base mb-0.5">{item.label}</h4>
                    <span className="text-gray-400 text-sm">{item.value}</span>
                  </div>
                </>
              )

              if (item.href) {
                return (
                  <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} className="flex items-start gap-3 sm:gap-4 group">
                    {content}
                  </a>
                )
              }
              return (
                <div key={item.label} className="flex items-start gap-3 sm:gap-4 group">
                  {content}
                </div>
              )
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="contact-form lg:col-span-3 space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Nom</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-atom-dark-800/60 border border-white/10 text-white placeholder-gray-500 focus:border-atom-blue-500/50 focus:ring-1 focus:ring-atom-blue-500/25 outline-none transition-all text-sm sm:text-base"
                  placeholder="Votre nom"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Email</label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-atom-dark-800/60 border border-white/10 text-white placeholder-gray-500 focus:border-atom-blue-500/50 focus:ring-1 focus:ring-atom-blue-500/25 outline-none transition-all text-sm sm:text-base"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Sujet</label>
              <select
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-atom-dark-800/60 border border-white/10 text-white focus:border-atom-blue-500/50 focus:ring-1 focus:ring-atom-blue-500/25 outline-none transition-all text-sm sm:text-base"
                required
              >
                <option value="" className="bg-atom-dark-800">Choisir un sujet</option>
                <option value="site-web" className="bg-atom-dark-800">Site Web / SaaS</option>
                <option value="pentest" className="bg-atom-dark-800">Pentest / Audit</option>
                <option value="conseil" className="bg-atom-dark-800">Conseil SI / Automatisation</option>
                <option value="formation" className="bg-atom-dark-800">Sensibilisation Cyber</option>
                <option value="autre" className="bg-atom-dark-800">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">Message</label>
              <textarea
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                rows={4}
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-atom-dark-800/60 border border-white/10 text-white placeholder-gray-500 focus:border-atom-blue-500/50 focus:ring-1 focus:ring-atom-blue-500/25 outline-none transition-all resize-none text-sm sm:text-base"
                placeholder="Décrivez votre projet..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-atom-blue-600 to-atom-blue-500 hover:from-atom-blue-500 hover:to-atom-blue-400 text-white font-semibold rounded-full shadow-xl shadow-atom-blue-500/25 hover:shadow-atom-blue-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {status === 'loading' ? (
                <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> Envoi...</>
              ) : status === 'success' ? (
                <><CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Envoyé !</>
              ) : (
                <><Send className="w-4 h-4 sm:w-5 sm:h-5" /> Envoyer le message</>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

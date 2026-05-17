import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useInView } from 'react-intersection-observer'
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react'

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle, loading, success, error
  const titleRef = useRef(null)
  const formRef = useRef(null)
  const [inViewRef, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    gsap.fromTo(
      '.contact-title',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
    gsap.fromTo(
      '.contact-info',
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    )
    gsap.fromTo(
      '.contact-form',
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    )
  }, [inView])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    // Simulate form submission
    await new Promise((r) => setTimeout(r, 1500))
    setStatus('success')
    setFormState({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <section
      id="contact"
      ref={inViewRef}
      className="py-24 lg:py-32 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-atom-dark-900 to-atom-dark-800" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-atom-blue-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-20">
          <span className="contact-title inline-block px-4 py-1.5 rounded-full bg-atom-blue-500/10 border border-atom-blue-500/20 text-atom-blue-400 text-sm font-medium mb-6">
            Contact
          </span>
          <h2 className="contact-title text-4xl sm:text-5xl lg:text-6xl font-black font-display mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Parlons de votre
            </span>{' '}
            <span className="bg-gradient-to-r from-atom-blue-400 to-atom-green-400 bg-clip-text text-transparent">
              projet
            </span>
          </h2>
          <p className="contact-title text-lg text-gray-400 max-w-2xl mx-auto">
            Un projet en tête ? N'hésitez pas à me contacter pour en discuter.
            Réponse sous 24 à 48h.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="contact-info lg:col-span-2 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-atom-blue-500/10 border border-atom-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-atom-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Email</h4>
                <a href="mailto:hugo.jacquel@atomixia.fr" className="text-gray-400 hover:text-atom-blue-300 transition-colors">
                  hugo.jacquel@atomixia.fr
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-atom-blue-500/10 border border-atom-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-atom-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Téléphone</h4>
                <a href="tel:+33781223171" className="text-gray-400 hover:text-atom-blue-300 transition-colors">
                  07 81 22 31 71
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-atom-blue-500/10 border border-atom-blue-500/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-atom-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Zone d'intervention</h4>
                <p className="text-gray-400">Lyon & Auvergne-Rhône-Alpes</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-atom-blue-500/10 border border-atom-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-atom-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Horaires</h4>
                <p className="text-gray-400">10h - 18h (réponse sous 24-48h)</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="contact-form lg:col-span-3 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-atom-dark-800/60 border border-white/10 text-white placeholder-gray-500 focus:border-atom-blue-500/50 focus:ring-1 focus:ring-atom-blue-500/25 outline-none transition-all"
                  placeholder="Votre nom"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-atom-dark-800/60 border border-white/10 text-white placeholder-gray-500 focus:border-atom-blue-500/50 focus:ring-1 focus:ring-atom-blue-500/25 outline-none transition-all"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sujet</label>
              <select
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-atom-dark-800/60 border border-white/10 text-white focus:border-atom-blue-500/50 focus:ring-1 focus:ring-atom-blue-500/25 outline-none transition-all"
                required
              >
                <option value="" className="bg-atom-dark-800">Choisir un sujet</option>
                <option value="site-web" className="bg-atom-dark-800">Site Web / SaaS</option>
                <option value="pentest" className="bg-atom-dark-800">Pentest / Audit</option>
                <option value="conseil" className="bg-atom-dark-800">Conseil SI / Automatisation</option>
                <option value="formation" className="bg-atom-dark-800">Sensibilisation Cybersécurité</option>
                <option value="autre" className="bg-atom-dark-800">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-atom-dark-800/60 border border-white/10 text-white placeholder-gray-500 focus:border-atom-blue-500/50 focus:ring-1 focus:ring-atom-blue-500/25 outline-none transition-all resize-none"
                placeholder="Décrivez votre projet..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-atom-blue-600 to-atom-blue-500 hover:from-atom-blue-500 hover:to-atom-blue-400 text-white font-semibold rounded-full shadow-xl shadow-atom-blue-500/25 hover:shadow-atom-blue-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : status === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Message envoyé !
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer le message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

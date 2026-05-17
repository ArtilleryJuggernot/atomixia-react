import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useInView } from 'react-intersection-observer'
import { Globe, ShieldCheck, Cpu, GraduationCap, ArrowRight, Sparkles } from 'lucide-react'

const services = [
  {
    icon: Globe,
    title: 'Site Web & SaaS',
    description: 'Création de sites vitrines et e-commerce sur mesure. Solutions SaaS adaptées à vos processus métier.',
    features: ['Sites vitrines', 'E-commerce', 'SaaS', 'Hébergement'],
    color: 'from-atom-blue-500 to-cyan-500',
    available: true,
  },
  {
    icon: ShieldCheck,
    title: 'Pentest & Audit',
    description: 'Tests de sécurité réseau et applicatifs. Rapports détaillés avec recommandations.',
    features: ['Audit réseau', 'Intrusion', 'Applicatif', 'Rapport'],
    color: 'from-atom-green-500 to-emerald-500',
    available: false,
  },
  {
    icon: Cpu,
    title: 'Conseil SI & Automatisation',
    description: 'Optimisation de votre SI. Automatisation de tâches répétitives avec des agents IA.',
    features: ['Audit SI', 'Automatisation', 'IA', 'Low-code'],
    color: 'from-purple-500 to-violet-500',
    available: false,
  },
  {
    icon: GraduationCap,
    title: 'Sensibilisation Cyber',
    description: 'Ateliers pratiques pour vos équipes : phishing, malware, ingénierie sociale.',
    features: ['Phishing', 'Formation', 'Simulation', 'Pratiques'],
    color: 'from-orange-500 to-red-500',
    available: false,
  },
]

function ServiceCard({ service, index }) {
  const cardRef = useRef(null)
  const [inViewRef, inView] = useInView({ threshold: 0.15, triggerOnce: true })

  useEffect(() => {
    if (!inView || !cardRef.current) return
    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: index * 0.1, ease: 'power3.out' }
    )
  }, [inView, index])

  const Icon = service.icon

  return (
    <div ref={(el) => { cardRef.current = el; inViewRef(el) }} className="group relative">
      <div className="relative h-full p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-atom-dark-800/60 border border-white/5 hover:border-atom-blue-500/30 transition-all duration-500 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

        {!service.available && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span className="text-[10px] sm:text-xs font-medium text-yellow-400">Bientôt</span>
          </div>
        )}

        <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
        </div>

        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-4 group-hover:text-atom-blue-300 transition-colors">
          {service.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 leading-relaxed">
          {service.description}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
          {service.features.map((feature) => (
            <span
              key={feature}
              className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-gray-300 bg-white/5 rounded-full border border-white/5"
            >
              {feature}
            </span>
          ))}
        </div>

        <a
          href="#contact"
          className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-300 group-hover:gap-3 ${
            service.available ? 'text-atom-blue-400 hover:text-atom-blue-300' : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          {service.available ? 'Demander un devis' : 'Être notifié'}
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>
      </div>
    </div>
  )
}

export default function Services() {
  const titleRef = useRef(null)
  const [inViewRef, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    gsap.fromTo('.services-title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' })
  }, [inView])

  return (
    <section id="services" ref={inViewRef} className="py-16 sm:py-20 lg:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-atom-dark-900 to-atom-blue-950/30" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={titleRef} className="text-center mb-12 sm:mb-16">
          <span className="services-title inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-atom-blue-500/10 border border-atom-blue-500/20 text-atom-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            Nos Services
          </span>
          <h2 className="services-title text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Des solutions sur mesure
            </span>
            <br />
            <span className="bg-gradient-to-r from-atom-blue-400 to-atom-green-400 bg-clip-text text-transparent">
              pour votre succès
            </span>
          </h2>
          <p className="services-title text-sm sm:text-base text-gray-400 max-w-xl sm:max-w-2xl mx-auto">
            De la conception à la mise en production, nous vous accompagnons avec expertise et innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useInView } from 'react-intersection-observer'
import { Globe, ShieldCheck, Cpu, GraduationCap, ArrowRight, Sparkles } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: Globe,
    title: 'Site Web & SaaS',
    description: 'Création de sites vitrines et e-commerce sur mesure. Solutions SaaS adaptées à vos processus métier, avec hébergement sécurisé.',
    features: ['Sites vitrines', 'E-commerce', 'Applications SaaS', 'Hébergement sécurisé'],
    color: 'from-atom-blue-500 to-cyan-500',
    available: true,
  },
  {
    icon: ShieldCheck,
    title: 'Pentest & Audit',
    description: 'Tests de sécurité réseau et applicatifs sur votre infrastructure. Rapports détaillés avec recommandations.',
    features: ['Audit réseau', 'Test d\'intrusion', 'Audit applicatif', 'Rapport détaillé'],
    color: 'from-atom-green-500 to-emerald-500',
    available: false,
  },
  {
    icon: Cpu,
    title: 'Conseil SI & Automatisation',
    description: 'Optimisation de votre système d\'information. Automatisation de tâches répétitives avec des agents IA.',
    features: ['Audit SI', 'Automatisation', 'Agents IA', 'Low-code'],
    color: 'from-purple-500 to-violet-500',
    available: false,
  },
  {
    icon: GraduationCap,
    title: 'Sensibilisation Cyber',
    description: 'Ateliers pratiques pour vos équipes : phishing, malware, ingénierie sociale. Formations adaptées.',
    features: ['Ateliers phishing', 'Formation équipes', 'Simulations', 'Bonnes pratiques'],
    color: 'from-orange-500 to-red-500',
    available: false,
  },
]

function ServiceCard({ service, index }) {
  const cardRef = useRef(null)
  const [inViewRef, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  useEffect(() => {
    if (!inView || !cardRef.current) return

    gsap.fromTo(
      cardRef.current,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 0.7,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 85%' }
      }
    )
  }, [inView, index])

  const Icon = service.icon

  return (
    <div
      ref={(el) => { cardRef.current = el; inViewRef(el) }}
      className="group relative"
    >
      <div className="relative h-full p-8 rounded-2xl bg-atom-dark-800/60 border border-white/5 hover:border-atom-blue-500/30 transition-all duration-500 overflow-hidden">
        {/* Hover gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

        {/* Coming soon badge */}
        {!service.available && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span className="text-xs font-medium text-yellow-400">Bientôt</span>
          </div>
        )}

        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-atom-blue-300 transition-colors">
          {service.title}
        </h3>
        <p className="text-gray-400 mb-6 leading-relaxed">
          {service.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-6">
          {service.features.map((feature) => (
            <span
              key={feature}
              className="px-3 py-1 text-xs font-medium text-gray-300 bg-white/5 rounded-full border border-white/5"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className={`inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3 ${
            service.available
              ? 'text-atom-blue-400 hover:text-atom-blue-300'
              : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          {service.available ? 'Demander un devis' : 'Être notifié'}
          <ArrowRight className="w-4 h-4" />
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
    gsap.fromTo(
      '.services-title',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
  }, [inView])

  return (
    <section
      id="services"
      ref={inViewRef}
      className="py-24 lg:py-32 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-atom-dark-900 to-atom-blue-950/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-20">
          <span className="services-title inline-block px-4 py-1.5 rounded-full bg-atom-blue-500/10 border border-atom-blue-500/20 text-atom-blue-400 text-sm font-medium mb-6">
            Nos Services
          </span>
          <h2 className="services-title text-4xl sm:text-5xl lg:text-6xl font-black font-display mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Des solutions sur mesure
            </span>
            <br />
            <span className="bg-gradient-to-r from-atom-blue-400 to-atom-green-400 bg-clip-text text-transparent">
              pour votre succès
            </span>
          </h2>
          <p className="services-title text-lg text-gray-400 max-w-2xl mx-auto">
            De la conception à la mise en production, nous vous accompagnons
            avec expertise et innovation.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

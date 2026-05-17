import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useInView } from 'react-intersection-observer'
import { Shield, Code, Lightbulb, Heart, Rocket, Award } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const values = [
  {
    icon: Shield,
    title: 'Sécurisation',
    description: 'Audits complets pour protéger vos systèmes et vos données. Veille permanente sur les dernières failles.',
    color: 'from-atom-blue-500 to-atom-blue-700',
  },
  {
    icon: Code,
    title: 'Développement',
    description: 'Applicatifs sur mesure avec des fonctionnalités étendues, adaptés à vos besoins métier.',
    color: 'from-atom-green-500 to-atom-green-700',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Solutions SaaS modernes et architectures scalables pour vos projets les plus ambitieux.',
    color: 'from-purple-500 to-purple-700',
  },
  {
    icon: Heart,
    title: 'Proximité',
    description: 'Accompagnement personnalisé et écoute active. Votre projet, notre priorité.',
    color: 'from-pink-500 to-pink-700',
  },
  {
    icon: Rocket,
    title: 'Performance',
    description: 'Optimisation continue pour des applications rapides, fiables et performantes.',
    color: 'from-orange-500 to-orange-700',
  },
  {
    icon: Award,
    title: 'Rigueur',
    description: 'Méthodologie professionnelle et suivi rigoureux de la conception à la livraison.',
    color: 'from-yellow-500 to-yellow-700',
  },
]

export default function About() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])
  const [inViewRef, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    if (!inView) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-title',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%' }
        }
      )

      cardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.fromTo(
            card,
            { y: 40, opacity: 0, scale: 0.95 },
            {
              y: 0, opacity: 1, scale: 1,
              duration: 0.5,
              delay: i * 0.08,
              ease: 'power3.out',
              scrollTrigger: { trigger: card, start: 'top 90%' }
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [inView])

  return (
    <section
      id="about"
      ref={(el) => { sectionRef.current = el; inViewRef(el) }}
      className="py-16 sm:py-20 lg:py-28 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-atom-dark-900 via-atom-dark-800 to-atom-dark-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-atom-blue-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-12 sm:mb-16">
          <span className="about-title inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-atom-blue-500/10 border border-atom-blue-500/20 text-atom-blue-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            Pourquoi Atomixia ?
          </span>
          <h2 className="about-title text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              L'expertise qui fait
            </span>
            <br />
            <span className="bg-gradient-to-r from-atom-blue-400 to-atom-green-400 bg-clip-text text-transparent">
              la différence
            </span>
          </h2>
          <p className="about-title text-sm sm:text-base text-gray-400 max-w-xl sm:max-w-2xl mx-auto">
            Basée à Lyon, Atomixia accompagne les entreprises d'Auvergne-Rhône-Alpes
            dans la sécurisation, le développement et l'innovation de leurs projets numériques.
          </p>
        </div>

        {/* Values grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {values.map((value, i) => {
            const Icon = value.icon
            return (
              <div
                key={value.title}
                ref={(el) => (cardsRef.current[i] = el)}
                className="group relative p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl bg-atom-dark-800/50 border border-white/5 hover:border-atom-blue-500/20 transition-all duration-500 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>

                <h3 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-atom-blue-300 transition-colors">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 sm:mt-14">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-atom-blue-600 to-atom-blue-500 hover:from-atom-blue-500 hover:to-atom-blue-400 text-white font-semibold rounded-full shadow-xl shadow-atom-blue-500/25 hover:shadow-atom-blue-500/40 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            Discutons de votre projet
          </a>
        </div>
      </div>
    </section>
  )
}

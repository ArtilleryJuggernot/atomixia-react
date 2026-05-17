import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Hero() {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const ctaRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '.hero-glow',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'elastic.out(1, 0.5)' }
      )
        .fromTo(
          titleRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          '-=1'
        )
        .fromTo(
          '.hero-line',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8 },
          '-=0.5'
        )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.4'
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          '.hero-stat',
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          '-=0.2'
        )

      // Floating particles — fewer on mobile
      particlesRef.current.forEach((particle, i) => {
        if (!particle) return
        gsap.to(particle, {
          y: `random(-20, 20)`,
          x: `random(-15, 15)`,
          duration: `random(4, 7)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        })
      })

      gsap.to('.hero-glow', {
        scale: 1.15,
        opacity: 0.5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden px-4"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-atom-dark-900 via-atom-dark-800 to-atom-blue-950" />

        {/* Glow orbs — smaller on mobile */}
        <div className="hero-glow absolute top-1/4 left-1/4 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-atom-blue-500/20 rounded-full blur-[80px] sm:blur-[120px]" />
        <div className="hero-glow absolute bottom-1/4 right-1/4 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-atom-green-400/10 rounded-full blur-[60px] sm:blur-[100px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Particles — reduced count */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (particlesRef.current[i] = el)}
            className="absolute w-1 h-1 bg-atom-blue-400/30 rounded-full"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge — compact on mobile */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-atom-blue-500/10 border border-atom-blue-500/20 mb-6 sm:mb-8">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-atom-blue-400" />
          <span className="text-xs sm:text-sm text-atom-blue-300 font-medium">
            Cybersécurité & Dev Web à Lyon
          </span>
        </div>

        {/* Title — responsive sizes */}
        <h1
          ref={titleRef}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-display tracking-tight mb-4 sm:mb-6"
        >
          <span className="bg-gradient-to-r from-white via-atom-blue-100 to-atom-blue-300 bg-clip-text text-transparent">
            Sécurisez
          </span>
          <br />
          <span className="bg-gradient-to-r from-atom-blue-400 via-atom-blue-500 to-atom-green-400 bg-clip-text text-transparent">
            & Développez
          </span>
          <br />
          <span className="text-white/90">vos idées</span>
        </h1>

        {/* Line */}
        <div className="hero-line w-16 sm:w-24 h-1 bg-gradient-to-r from-atom-blue-500 to-atom-green-400 mx-auto rounded-full mb-4 sm:mb-6" />

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2"
        >
          Basée à <span className="text-atom-blue-300 font-semibold">Lyon</span>, Atomixia accompagne les entreprises d'
          <span className="text-atom-blue-300 font-semibold">Auvergne-Rhône-Alpes</span> dans la sécurisation et le développement de leurs projets numériques.
        </p>

        {/* CTAs — stacked on mobile */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16">
          <a
            href="#services"
            className="w-full sm:w-auto group flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-atom-blue-600 to-atom-blue-500 hover:from-atom-blue-500 hover:to-atom-blue-400 text-white font-semibold rounded-full shadow-xl shadow-atom-blue-500/25 hover:shadow-atom-blue-500/40 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            Découvrir nos services
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 border border-atom-blue-500/30 hover:border-atom-blue-400/50 text-atom-blue-300 hover:text-white font-semibold rounded-full hover:bg-atom-blue-500/10 transition-all duration-300 text-sm sm:text-base"
          >
            Demander un devis gratuit
          </a>
        </div>

        {/* Stats — compact on mobile */}
        <div className="flex justify-center gap-6 sm:gap-12 lg:gap-16">
          <div className="hero-stat text-center">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-atom-blue-400 to-atom-green-400 bg-clip-text text-transparent">
              +10
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Projets livrés</p>
          </div>
          <div className="hero-stat text-center">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-atom-blue-400 to-atom-green-400 bg-clip-text text-transparent">
              100%
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Satisfaction</p>
          </div>
          <div className="hero-stat text-center">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-atom-blue-400 to-atom-green-400 bg-clip-text text-transparent">
              Lyon
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">& AURA</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator — hidden on very small screens */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 border-2 border-gray-600 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2.5 bg-atom-blue-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, Shield, Code, Sparkles } from 'lucide-react'

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
          { y: 80, opacity: 0 },
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
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.4'
        )
        .fromTo(
          ctaRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.3'
        )
        .fromTo(
          '.hero-stat',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          '-=0.2'
        )

      // Floating particles
      particlesRef.current.forEach((particle, i) => {
        gsap.to(particle, {
          y: `random(-30, 30)`,
          x: `random(-20, 20)`,
          rotation: `random(-180, 180)`,
          duration: `random(3, 6)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2,
        })
      })

      // Continuous glow pulse
      gsap.to('.hero-glow', {
        scale: 1.2,
        opacity: 0.6,
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-b from-atom-dark-900 via-atom-dark-800 to-atom-blue-950" />

        {/* Animated glow orbs */}
        <div className="hero-glow absolute top-1/4 left-1/4 w-96 h-96 bg-atom-blue-500/20 rounded-full blur-[120px]" />
        <div className="hero-glow absolute bottom-1/4 right-1/4 w-80 h-80 bg-atom-green-400/10 rounded-full blur-[100px]" />
        <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-atom-blue-600/5 rounded-full blur-[150px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (particlesRef.current[i] = el)}
            className="absolute w-1 h-1 bg-atom-blue-400/40 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-atom-blue-500/10 border border-atom-blue-500/20 mb-8">
          <Sparkles className="w-4 h-4 text-atom-blue-400" />
          <span className="text-sm text-atom-blue-300 font-medium">
            Expert Cybersécurité & Développement Web à Lyon
          </span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-5xl sm:text-7xl lg:text-8xl font-black font-display tracking-tight mb-6"
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

        {/* Decorative line */}
        <div className="hero-line w-24 h-1 bg-gradient-to-r from-atom-blue-500 to-atom-green-400 mx-auto rounded-full mb-8" />

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Basée à <span className="text-atom-blue-300 font-semibold">Lyon</span>, Atomixia accompagne les entreprises d'
          <span className="text-atom-blue-300 font-semibold">Auvergne-Rhône-Alpes</span> dans la sécurisation et le développement de leurs projets numériques.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#services"
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-atom-blue-600 to-atom-blue-500 hover:from-atom-blue-500 hover:to-atom-blue-400 text-white font-semibold rounded-full shadow-xl shadow-atom-blue-500/25 hover:shadow-atom-blue-500/40 transition-all duration-300 hover:scale-105"
          >
            Découvrir nos services
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 px-8 py-4 border border-atom-blue-500/30 hover:border-atom-blue-400/50 text-atom-blue-300 hover:text-white font-semibold rounded-full hover:bg-atom-blue-500/10 transition-all duration-300"
          >
            Demander un devis gratuit
          </a>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
          <div className="hero-stat text-center">
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-atom-blue-400 to-atom-green-400 bg-clip-text text-transparent">
              +10
            </p>
            <p className="text-sm text-gray-500 mt-1">Projets livrés</p>
          </div>
          <div className="hero-stat text-center">
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-atom-blue-400 to-atom-green-400 bg-clip-text text-transparent">
              100%
            </p>
            <p className="text-sm text-gray-500 mt-1">Satisfaction</p>
          </div>
          <div className="hero-stat text-center">
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-atom-blue-400 to-atom-green-400 bg-clip-text text-transparent">
              Lyon
            </p>
            <p className="text-sm text-gray-500 mt-1">& AURA</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-gray-500 uppercase tracking-widest">Scroll</span>
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-atom-blue-400 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, Layers } from 'lucide-react'

const projects = [
  {
    title: 'Zeus',
    description: 'Gestionnaire de productivité — tâches, projets, notes et catégories.',
    tags: ['Laravel', 'Tailwind', 'Livewire', 'MySQL'],
    status: 'En production',
    color: 'from-atom-blue-500 to-cyan-500',
  },
  {
    title: 'MorningGlory',
    description: 'Application de routines et gestion de groupes avec planning partagé.',
    tags: ['Next.js', 'Prisma', 'MariaDB', 'NextAuth'],
    status: 'En production',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Homecook',
    description: 'Gestionnaire de recettes, meal plans et inventaire alimentaire.',
    tags: ['Laravel', 'SQLite', 'Docker', 'Open Food Facts'],
    status: 'En production',
    color: 'from-atom-green-500 to-emerald-500',
  },
  {
    title: 'Hermes Agent',
    description: 'Agent IA autonome avec MCP servers, mémoire persistante et multi-platform.',
    tags: ['Python', 'React', 'MCP', 'OAuth2'],
    status: 'En production',
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Superstylefit',
    description: 'Application de fitness et suivi de progression sportive.',
    tags: ['Flutter', 'Dart', 'Firebase'],
    status: 'En développement',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    title: 'Atomixia.fr',
    description: 'Site vitrine avec animations GSAP et design system moderne.',
    tags: ['React', 'Vite', 'Tailwind', 'GSAP'],
    status: 'En développement',
    color: 'from-atom-blue-400 to-atom-green-400',
  },
]

const filters = ['Tous', 'En production', 'En développement']

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('Tous')
  const titleRef = useRef(null)
  const [inViewRef, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    gsap.fromTo(
      '.portfolio-title',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
  }, [inView])

  const filtered = activeFilter === 'Tous'
    ? projects
    : projects.filter((p) => p.status === activeFilter)

  return (
    <section
      id="portfolio"
      ref={inViewRef}
      className="py-24 lg:py-32 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-atom-blue-950/30 to-atom-dark-900" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="portfolio-title inline-block px-4 py-1.5 rounded-full bg-atom-blue-500/10 border border-atom-blue-500/20 text-atom-blue-400 text-sm font-medium mb-6">
            Nos Projets
          </span>
          <h2 className="portfolio-title text-4xl sm:text-5xl lg:text-6xl font-black font-display mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Réalisations &
            </span>{' '}
            <span className="bg-gradient-to-r from-atom-blue-400 to-atom-green-400 bg-clip-text text-transparent">
              innovations
            </span>
          </h2>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-atom-blue-500 text-white shadow-lg shadow-atom-blue-500/25'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <div
              key={project.title}
              className="group relative rounded-2xl bg-atom-dark-800/60 border border-white/5 hover:border-atom-blue-500/20 transition-all duration-500 overflow-hidden hover:-translate-y-1"
            >
              {/* Gradient header */}
              <div className={`h-2 bg-gradient-to-r ${project.color}`} />

              <div className="p-6">
                {/* Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    project.status === 'En production'
                      ? 'bg-atom-green-500/10 text-atom-green-400 border border-atom-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {project.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-500 hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-atom-blue-300 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-medium text-gray-300 bg-white/5 rounded-md border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

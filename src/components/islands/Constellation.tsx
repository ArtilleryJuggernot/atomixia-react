import { useState } from 'react';

export type ConstellationNode = {
  id: string;
  title: string;
  role: string;
  short: string;
  x: number;
  y: number;
  href: string;
};

export type ConstellationLink = {
  from: string;
  to: string;
  label: string;
};

type Props = {
  nodes: ConstellationNode[];
  links: ConstellationLink[];
  hint: string;
  instanceId: string;
  variant?: 'compact' | 'full';
};

function starPath(cx: number, cy: number, radius: number): string {
  const arm = radius * 0.28;
  const points = [
    [cx, cy - radius],
    [cx + arm, cy - arm],
    [cx + radius, cy],
    [cx + arm, cy + arm],
    [cx, cy + radius],
    [cx - arm, cy + arm],
    [cx - radius, cy],
    [cx - arm, cy - arm],
  ];
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point[0]} ${point[1]}`).join(' ') + 'Z';
}

export default function Constellation({ nodes, links, hint, instanceId, variant = 'full' }: Props) {
  const [activeId, setActiveId] = useState(nodes[0]?.id ?? '');
  const active = nodes.find((node) => node.id === activeId) ?? nodes[0];

  if (!active) return null;

  const byId = new Map(nodes.map((node) => [node.id, node]));
  const activeLinks = links.filter((link) => link.from === active.id || link.to === active.id);

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
      <div className={variant === 'compact' ? 'lg:col-span-12' : 'lg:col-span-7'}>
        <svg viewBox="0 0 100 88" className="h-auto w-full" role="group" aria-label="Constellation des agents">
          <circle cx="50" cy="44" r="30" fill="none" stroke="rgba(217,165,33,0.16)" strokeWidth="0.25" />
          {links.map((link, index) => {
            const from = byId.get(link.from);
            const to = byId.get(link.to);
            if (!from || !to) return null;
            const hot = link.from === active.id || link.to === active.id;
            return (
              <path
                key={`${link.from}-${link.to}`}
                className={`constellation-line d${index}`}
                data-hot={hot ? 'true' : 'false'}
                pathLength={1}
                d={`M${from.x} ${from.y} L${to.x} ${to.y}`}
              />
            );
          })}
          {nodes.map((node) => {
            const selected = node.id === active.id;
            const labelId = `${instanceId}-legend-${node.id}`;
            return (
              <a
                key={node.id}
                href={node.href}
                data-active={selected ? 'true' : 'false'}
                aria-describedby={variant === 'full' ? labelId : undefined}
                aria-label={variant === 'full' ? node.title : `${node.title}. ${node.role}`}
                onMouseEnter={() => setActiveId(node.id)}
                onFocus={() => setActiveId(node.id)}
              >
                <circle cx={node.x} cy={node.y} r="7" fill="transparent" />
                <circle className="star-ring" cx={node.x} cy={node.y} r="5.4" />
                <path className="star-core" d={starPath(node.x, node.y, node.id === 'sur-mesure' ? 2.5 : 3.1)} />
              </a>
            );
          })}
        </svg>
        <p className="meta mt-3">{hint}</p>
      </div>

      <div className={variant === 'compact' ? 'lg:col-span-12' : 'lg:col-span-5'}>
        <p className="meta text-cyan-flux">{active.title}</p>
        <p className="mt-2 font-display text-2xl tracking-tight text-parchment">{active.role}</p>
        <p className="mt-3 text-parchment-dim">{active.short}</p>
        {variant === 'full' && activeLinks.length > 0 && (
          <ul className="mt-4 space-y-1">
            {activeLinks.map((link) => {
              const otherId = link.from === active.id ? link.to : link.from;
              const other = byId.get(otherId);
              return (
                <li key={`${link.from}-${link.to}`} className="text-sm text-parchment-dim">
                  <span className="text-gold-300">{link.label}</span>
                  {other ? ` — ${other.title}` : ''}
                </li>
              );
            })}
          </ul>
        )}
        <a href={active.href} className="mt-5 inline-flex text-gold-300 underline decoration-gold-500/50 underline-offset-4">
          Voir {active.title.toLowerCase()}
        </a>

        <ul className={variant === 'compact' ? 'sr-only' : 'mt-8 space-y-3 border-t border-parchment/10 pt-5'}>
          {nodes.map((node) => (
            <li key={node.id} id={`${instanceId}-legend-${node.id}`} className={node.id === active.id ? 'text-parchment' : 'text-parchment-dim'}>
              <span className="meta mr-3 text-gold-400">{node.title}</span>
              <span>{node.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { BarChart3, Users, FileText, Briefcase, BookOpen, Mail } from 'lucide-react';

const cards = [
  {
    label: 'Sobre',
    href: '/admin/sobre',
    icon: Users,
    desc: 'Editar informações pessoais',
  },
  {
    label: 'Tecnologias',
    href: '/admin/tecnologias',
    icon: BarChart3,
    desc: 'Gerenciar stack tecnológico',
  },
  {
    label: 'Experiência',
    href: '/admin/experiencia',
    icon: Briefcase,
    desc: 'CRUD de experiências profissionais',
  },
  {
    label: 'Projetos',
    href: '/admin/projetos',
    icon: FileText,
    desc: 'Gerenciar portfólio de projetos',
  },
  {
    label: 'Formação',
    href: '/admin/formacao',
    icon: BookOpen,
    desc: 'Editar educação e cursos',
  },
  {
    label: 'Contato',
    href: '/admin/contato',
    icon: Mail,
    desc: 'Gerenciar informações de contato',
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo, <span className="text-[#7CFF3B]">Admin!</span>
        </h1>
        <p className="text-gray-400">Gerencie seu portfólio de forma simples e intuitiva</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <div className="h-full p-6 bg-gray-900 border border-gray-800 rounded-lg hover:border-[#7CFF3B] hover:bg-gray-800/50 transition-all cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#7CFF3B]/10 rounded-lg">
                    <Icon size={24} className="text-[#7CFF3B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{card.label}</h3>
                    <p className="text-sm text-gray-400 mt-1">{card.desc}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 p-6 bg-gray-900 border border-gray-800 rounded-lg">
        <h2 className="font-semibold mb-3">💡 Dica</h2>
        <p className="text-gray-400 text-sm">
          Use o menu à esquerda para navegar entre as seções e gerenciar seus dados. Todas as mudanças são salvas automaticamente.
        </p>
      </div>
    </div>
  );
}

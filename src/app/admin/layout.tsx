'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { LogOut, Menu, X } from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Sobre', href: '/admin/sobre' },
  { label: 'Tecnologias', href: '/admin/tecnologias' },
  { label: 'Experiência', href: '/admin/experiencia' },
  { label: 'Projetos', href: '/admin/projetos' },
  { label: 'Formação', href: '/admin/formacao' },
  { label: 'Contato', href: '/admin/contato' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.push('/admin/login');
    }
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  if (loading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${open ? 'w-64' : 'w-0 md:w-64'} transition-all duration-300 bg-gray-950 border-r border-gray-800 overflow-hidden`}>
          <div className="p-6">
            <h1 className="text-2xl font-bold">
              Admin <span className="text-[#7CFF3B]">Panel</span>
            </h1>
          </div>

          <nav className="space-y-2 px-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-[#7CFF3B] text-black font-semibold'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-6 left-4 right-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="md:hidden p-4 border-b border-gray-800">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <div className="p-6 md:p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

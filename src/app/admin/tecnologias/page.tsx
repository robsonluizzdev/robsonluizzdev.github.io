'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, Loader, ChevronUp, ChevronDown } from 'lucide-react';

interface Technology {
  id: string;
  name: string;
  sort_order?: number | null;
}

export default function AdminTechnologies() {
  const [techs, setTechs] = useState<Technology[]>([]);
  const [newTech, setNewTech] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTechs();
  }, []);

  async function fetchTechs() {
    try {
      const { data, error } = await supabase
        .from('technologies')
        .select('*')
        .order('sort_order', { nullsFirst: false })
        .order('name');

      if (error) throw error;
      setTechs(data || []);
    } catch (err) {
      console.error('Erro ao carregar tecnologias:', err);
    } finally {
      setLoading(false);
    }
  }

  async function addTech() {
    if (!newTech.trim()) return;
    setSaving(true);

    try {
      const nextOrder =
        techs.reduce((max, t) => Math.max(max, t.sort_order || 0), 0) + 1;
      const { error } = await supabase
        .from('technologies')
        .insert([{ name: newTech, sort_order: nextOrder }]);

      if (error) throw error;

      await fetchTechs();
      setNewTech('');
      setMessage('✅ Tecnologia adicionada!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`❌ Erro ao adicionar: ${err.message || 'tente novamente'}`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function removeTech(id: string) {
    try {
      const { error } = await supabase.from('technologies').delete().eq('id', id);
      if (error) throw error;
      setTechs(techs.filter((t) => t.id !== id));
      setMessage('✅ Tecnologia removida!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Erro ao remover');
      console.error(err);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= techs.length) return;
    const a = techs[index];
    const b = techs[target];
    // Swap sort_order values in the DB
    const orderA = a.sort_order ?? index + 1;
    const orderB = b.sort_order ?? target + 1;
    try {
      await Promise.all([
        supabase.from('technologies').update({ sort_order: orderB }).eq('id', a.id),
        supabase.from('technologies').update({ sort_order: orderA }).eq('id', b.id),
      ]);
      await fetchTechs();
    } catch (err) {
      setMessage('❌ Erro ao reordenar');
      console.error(err);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Tecnologias</h1>
        <p className="text-gray-400">
          Adicione, remova e use as setas para organizar a ordem no site
        </p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-900/20 border border-green-900 rounded-lg text-green-400">
          {message}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTech}
          onChange={(e) => setNewTech(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTech()}
          className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
          placeholder="Ex: React, Node.js, TypeScript..."
        />
        <button
          onClick={addTech}
          disabled={saving}
          className="px-4 py-2 bg-[#7CFF3B] text-black font-semibold rounded-lg hover:bg-[#6fe62f] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader size={18} className="animate-spin" /> : <Plus size={18} />}
        </button>
      </div>

      <div className="space-y-2">
        {techs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma tecnologia adicionada ainda
          </div>
        ) : (
          techs.map((tech, index) => (
            <div
              key={tech.id}
              className="flex items-center justify-between p-4 bg-gray-900 border border-gray-800 rounded-lg"
            >
              <span className="font-medium">{tech.name}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Mover para cima"
                >
                  <ChevronUp size={18} />
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === techs.length - 1}
                  className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Mover para baixo"
                >
                  <ChevronDown size={18} />
                </button>
                <button
                  onClick={() => removeTech(tech.id)}
                  className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Remover"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

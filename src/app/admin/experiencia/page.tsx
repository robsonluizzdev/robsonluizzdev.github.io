'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Trash2, Plus, Loader, Edit2, X, ChevronUp, ChevronDown } from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  role: string;
  items: string[];
  sort_order?: number | null;
}

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Experience>({
    id: '',
    company: '',
    role: '',
    items: [],
  });
  const [newItem, setNewItem] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('sort_order', { nullsFirst: false })
        .order('company');

      if (error) throw error;
      setExperiences(data || []);
    } catch (err) {
      console.error('Erro ao carregar experiências:', err);
    } finally {
      setLoading(false);
    }
  }

  function startNew() {
    setFormData({ id: '', company: '', role: '', items: [] });
    setEditing('new');
  }

  function editExperience(exp: Experience) {
    setFormData(exp);
    setEditing(exp.id);
    setNewItem('');
  }

  async function saveExperience() {
    if (!formData.company || !formData.role) {
      setMessage('❌ Preencha todos os campos');
      return;
    }

    try {
      const { id, ...payload } = formData;
      if (id) {
        const { error } = await supabase
          .from('experiences')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } else {
        const nextOrder =
          experiences.reduce((max, e) => Math.max(max, e.sort_order || 0), 0) + 1;
        const { error } = await supabase
          .from('experiences')
          .insert([{ ...payload, sort_order: nextOrder }]);
        if (error) throw error;
      }

      await fetchExperiences();
      setEditing(null);
      setMessage('✅ Experiência salva!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`❌ Erro ao salvar: ${err.message || 'tente novamente'}`);
      console.error(err);
    }
  }

  async function deleteExperience(id: string) {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setExperiences(experiences.filter((e) => e.id !== id));
      setMessage('✅ Experiência removida!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Erro ao remover');
      console.error(err);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= experiences.length) return;
    const a = experiences[index];
    const b = experiences[target];
    const orderA = a.sort_order ?? index + 1;
    const orderB = b.sort_order ?? target + 1;
    try {
      await Promise.all([
        supabase.from('experiences').update({ sort_order: orderB }).eq('id', a.id),
        supabase.from('experiences').update({ sort_order: orderA }).eq('id', b.id),
      ]);
      await fetchExperiences();
    } catch (err) {
      setMessage('❌ Erro ao reordenar');
      console.error(err);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Experiências</h1>
        <p className="text-gray-400">Adicione e edite suas experiências profissionais</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-900/20 border border-green-900 rounded-lg text-green-400">
          {message}
        </div>
      )}

      {editing ? (
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editing === 'new' ? 'Nova Experiência' : 'Editar Experiência'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Empresa</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Cargo</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Atividades</label>
              <div className="space-y-2 mb-3">
                {formData.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                    <span className="text-sm flex-1">{item}</span>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          items: formData.items.filter((_, i) => i !== idx),
                        })
                      }
                      className="p-1 text-red-400 hover:bg-red-900/20 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B] text-sm"
                  placeholder="Adicionar atividade..."
                />
                <button
                  onClick={() => {
                    if (newItem.trim()) {
                      setFormData({
                        ...formData,
                        items: [...formData.items, newItem],
                      });
                      setNewItem('');
                    }
                  }}
                  className="px-4 py-2 bg-[#7CFF3B]/30 text-[#7CFF3B] rounded-lg text-sm hover:bg-[#7CFF3B]/50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={saveExperience}
                className="flex-1 py-2 bg-[#7CFF3B] text-black font-semibold rounded-lg hover:bg-[#6fe62f] flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Salvar
              </button>
              <button
                onClick={() => setEditing(null)}
                className="flex-1 py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={startNew}
            className="mb-6 px-6 py-2 bg-[#7CFF3B] text-black font-semibold rounded-lg hover:bg-[#6fe62f] flex items-center gap-2"
          >
            <Plus size={18} />
            Nova Experiência
          </button>

          <div className="space-y-3">
            {experiences.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma experiência adicionada
              </div>
            ) : (
              experiences.map((exp, index) => (
                <div key={exp.id} className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exp.company}</h3>
                      <p className="text-sm text-gray-400">{exp.role}</p>
                      <ul className="text-sm text-gray-500 mt-2">
                        {exp.items.map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        className="p-2 text-gray-400 hover:bg-gray-800 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover para cima"
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button
                        onClick={() => move(index, 1)}
                        disabled={index === experiences.length - 1}
                        className="p-2 text-gray-400 hover:bg-gray-800 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Mover para baixo"
                      >
                        <ChevronDown size={18} />
                      </button>
                      <button
                        onClick={() => editExperience(exp)}
                        className="p-2 text-[#7CFF3B] hover:bg-[#7CFF3B]/10 rounded"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="p-2 text-red-400 hover:bg-red-900/20 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

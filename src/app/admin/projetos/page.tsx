'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Trash2, Plus, Edit2, X } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  demoUrl?: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Project>({
    id: '',
    name: '',
    description: '',
    tech: [],
    demoUrl: '',
  });
  const [newTech, setNewTech] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
    } finally {
      setLoading(false);
    }
  }

  function startNew() {
    setFormData({ id: '', name: '', description: '', tech: [], demoUrl: '' });
    setEditing('new');
  }

  function editProject(project: Project) {
    setFormData(project);
    setEditing(project.id);
  }

  async function saveProject() {
    if (!formData.name || !formData.description) {
      setMessage('❌ Preencha todos os campos');
      return;
    }

    try {
      if (formData.id) {
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([formData]);
        if (error) throw error;
      }

      await fetchProjects();
      setEditing(null);
      setMessage('✅ Projeto salvo!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Erro ao salvar');
      console.error(err);
    }
  }

  async function deleteProject(id: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(projects.filter((p) => p.id !== id));
      setMessage('✅ Projeto removido!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Erro ao remover');
      console.error(err);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Projetos</h1>
        <p className="text-gray-400">Adicione e edite seus projetos do portfólio</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-900/20 border border-green-900 rounded-lg text-green-400">
          {message}
        </div>
      )}

      {editing ? (
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editing === 'new' ? 'Novo Projeto' : 'Editar Projeto'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Nome do Projeto</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B] h-24 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">URL Demo</label>
              <input
                type="text"
                value={formData.demoUrl || ''}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B] text-sm"
                placeholder="/projects/projeto/index.html"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Tecnologias</label>
              <div className="space-y-2 mb-3">
                {formData.tech.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-800 rounded">
                    <span className="text-sm flex-1">{t}</span>
                    <button
                      onClick={() =>
                        setFormData({
                          ...formData,
                          tech: formData.tech.filter((_, i) => i !== idx),
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
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B] text-sm"
                  placeholder="Ex: React, Node.js..."
                />
                <button
                  onClick={() => {
                    if (newTech.trim()) {
                      setFormData({
                        ...formData,
                        tech: [...formData.tech, newTech],
                      });
                      setNewTech('');
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
                onClick={saveProject}
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
            Novo Projeto
          </button>

          <div className="space-y-3">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum projeto adicionado
              </div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.tech.map((t) => (
                          <span key={t} className="text-xs bg-[#7CFF3B]/10 text-[#7CFF3B] px-2 py-1 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editProject(project)}
                        className="p-2 text-[#7CFF3B] hover:bg-[#7CFF3B]/10 rounded"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
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

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Trash2, Plus, Edit2 } from 'lucide-react';

interface Education {
  id: string;
  course: string;
  institution: string;
}

export default function AdminEducation() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Education>({
    id: '',
    course: '',
    institution: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEducations();
  }, []);

  async function fetchEducations() {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('course');

      if (error) throw error;
      setEducations(data || []);
    } catch (err) {
      console.error('Erro ao carregar formação:', err);
    } finally {
      setLoading(false);
    }
  }

  function startNew() {
    setFormData({ id: '', course: '', institution: '' });
    setEditing('new');
  }

  function editEducation(edu: Education) {
    setFormData(edu);
    setEditing(edu.id);
  }

  async function saveEducation() {
    if (!formData.course || !formData.institution) {
      setMessage('❌ Preencha todos os campos');
      return;
    }

    try {
      const { id, ...payload } = formData;
      if (id) {
        const { error } = await supabase
          .from('education')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('education')
          .insert([payload]);
        if (error) throw error;
      }

      await fetchEducations();
      setEditing(null);
      setMessage('✅ Formação salva!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`❌ Erro ao salvar: ${err.message || 'tente novamente'}`);
      console.error(err);
    }
  }

  async function deleteEducation(id: string) {
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEducations(educations.filter((e) => e.id !== id));
      setMessage('✅ Formação removida!');
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
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Formação</h1>
        <p className="text-gray-400">Adicione seus cursos e instituições</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-900/20 border border-green-900 rounded-lg text-green-400">
          {message}
        </div>
      )}

      {editing ? (
        <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editing === 'new' ? 'Nova Formação' : 'Editar Formação'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Curso</label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
                placeholder="Ex: Sistemas de Informação"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Instituição</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
                placeholder="Ex: UEG"
              />
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={saveEducation}
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
            Nova Formação
          </button>

          <div className="space-y-3">
            {educations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma formação adicionada
              </div>
            ) : (
              educations.map((edu) => (
                <div key={edu.id} className="p-4 bg-gray-900 border border-gray-800 rounded-lg flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{edu.course}</h3>
                    <p className="text-sm text-gray-400">{edu.institution}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editEducation(edu)}
                      className="p-2 text-[#7CFF3B] hover:bg-[#7CFF3B]/10 rounded"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="p-2 text-red-400 hover:bg-red-900/20 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
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

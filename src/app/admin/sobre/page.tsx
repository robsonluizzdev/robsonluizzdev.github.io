'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Loader } from 'lucide-react';

interface AboutData {
  id: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  linkedin: string;
}

export default function AdminSobre() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data: result, error } = await supabase
        .from('about')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (result) {
        setData(result);
      } else {
        setData({
          id: '',
          title: 'Robson Luiz',
          bio: '',
          email: 'robsonluizmmpp@gmail.com',
          phone: '(61) 99661-1397',
          linkedin: 'linkedin.com/in/desenvolvedor-robson-luiz',
        });
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!data) return;
    setSaving(true);

    try {
      const { id, ...payload } = data;
      if (id) {
        const { error } = await supabase
          .from('about')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about')
          .insert([payload]);
        if (error) throw error;
      }

      await fetchData();
      setMessage('✅ Dados salvos com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`❌ Erro ao salvar: ${err.message || 'tente novamente'}`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Editar Sobre</h1>
        <p className="text-gray-400">Atualize suas informações pessoais</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-900/20 border border-green-900 rounded-lg text-green-400">
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Título/Nome</label>
          <input
            type="text"
            value={data?.title || ''}
            onChange={(e) => setData({ ...data!, title: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Biografia</label>
          <textarea
            value={data?.bio || ''}
            onChange={(e) => setData({ ...data!, bio: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B] h-32 resize-none"
            placeholder="Conte sobre você..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={data?.email || ''}
            onChange={(e) => setData({ ...data!, email: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Telefone</label>
          <input
            type="tel"
            value={data?.phone || ''}
            onChange={(e) => setData({ ...data!, phone: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">LinkedIn</label>
          <input
            type="text"
            value={data?.linkedin || ''}
            onChange={(e) => setData({ ...data!, linkedin: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 w-full py-2 bg-[#7CFF3B] text-black font-semibold rounded-lg hover:bg-[#6fe62f] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader size={18} className="animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save size={18} />
              Salvar Alterações
            </>
          )}
        </button>
      </div>
    </div>
  );
}

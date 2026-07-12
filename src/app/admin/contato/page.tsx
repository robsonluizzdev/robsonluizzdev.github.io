'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Loader } from 'lucide-react';

interface Contact {
  id: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  github?: string;
}

export default function AdminContact() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContact();
  }, []);

  async function fetchContact() {
    try {
      const { data, error } = await supabase
        .from('contact')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setContact(data);
      } else {
        setContact({
          id: '',
          email: 'robsonluizmmpp@gmail.com',
          phone: '(61) 99661-1397',
          whatsapp: '5561996611397',
          linkedin: 'linkedin.com/in/desenvolvedor-robson-luiz',
          github: '',
        });
      }
    } catch (err) {
      console.error('Erro ao carregar contato:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!contact) return;
    setSaving(true);

    try {
      if (contact.id) {
        const { error } = await supabase
          .from('contact')
          .update(contact)
          .eq('id', contact.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('contact')
          .insert([contact]);
        if (error) throw error;
      }

      setMessage('✅ Contato salvo com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Erro ao salvar dados');
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
        <h1 className="text-3xl font-bold mb-2">Gerenciar Contato</h1>
        <p className="text-gray-400">Atualize suas informações de contato</p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-900/20 border border-green-900 rounded-lg text-green-400">
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={contact?.email || ''}
            onChange={(e) => setContact({ ...contact!, email: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Telefone</label>
          <input
            type="tel"
            value={contact?.phone || ''}
            onChange={(e) => setContact({ ...contact!, phone: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">WhatsApp (com código país)</label>
          <input
            type="text"
            value={contact?.whatsapp || ''}
            onChange={(e) => setContact({ ...contact!, whatsapp: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
            placeholder="5561996611397"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">LinkedIn</label>
          <input
            type="text"
            value={contact?.linkedin || ''}
            onChange={(e) => setContact({ ...contact!, linkedin: e.target.value })}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#7CFF3B]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">GitHub (opcional)</label>
          <input
            type="text"
            value={contact?.github || ''}
            onChange={(e) => setContact({ ...contact!, github: e.target.value })}
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

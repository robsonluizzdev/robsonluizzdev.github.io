'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, FileText, Loader, ExternalLink, Trash2 } from 'lucide-react';

const BUCKET = 'curriculo';
const FILE_NAME = 'curriculo-robson-luiz.pdf';

export default function AdminCurriculo() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkExisting();
  }, []);

  async function checkExisting() {
    try {
      const { data } = await supabase.storage.from(BUCKET).list('', {
        search: FILE_NAME,
      });

      if (data && data.length > 0) {
        const { data: urlData } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(FILE_NAME);
        // Cache-bust so a freshly replaced file shows up
        setCurrentUrl(`${urlData.publicUrl}?t=${Date.now()}`);
      } else {
        setCurrentUrl(null);
      }
    } catch (err) {
      console.error('Erro ao verificar currículo:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage('❌ Envie um arquivo PDF');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(FILE_NAME, file, {
          upsert: true,
          contentType: 'application/pdf',
        });

      if (error) throw error;

      await checkExisting();
      setMessage('✅ Currículo atualizado com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`❌ Erro ao enviar: ${err.message || 'tente novamente'}`);
      console.error(err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleRemove() {
    if (!confirm('Remover o currículo atual?')) return;

    try {
      const { error } = await supabase.storage.from(BUCKET).remove([FILE_NAME]);
      if (error) throw error;
      setCurrentUrl(null);
      setMessage('✅ Currículo removido');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ Erro ao remover');
      console.error(err);
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Currículo</h1>
        <p className="text-gray-400">
          Faça upload ou troque o PDF do seu currículo. O botão &ldquo;Baixar
          Currículo&rdquo; do site usa este arquivo.
        </p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-900/20 border border-green-900 rounded-lg text-green-400">
          {message}
        </div>
      )}

      {/* Current file */}
      {currentUrl ? (
        <div className="mb-6 p-5 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#7CFF3B]/10 rounded-lg">
              <FileText size={24} className="text-[#7CFF3B]" />
            </div>
            <div>
              <p className="font-medium">Currículo atual</p>
              <p className="text-sm text-gray-400">{FILE_NAME}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#7CFF3B] hover:bg-[#7CFF3B]/10 rounded-lg transition-colors"
              title="Visualizar"
            >
              <ExternalLink size={18} />
            </a>
            <button
              onClick={handleRemove}
              className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              title="Remover"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-5 bg-gray-900/50 border border-dashed border-gray-700 rounded-lg text-center text-gray-500">
          Nenhum currículo enviado ainda
        </div>
      )}

      {/* Upload area */}
      <label
        className={`block p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
          uploading
            ? 'border-gray-700 bg-gray-900/30'
            : 'border-gray-700 hover:border-[#7CFF3B] hover:bg-[#7CFF3B]/5'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <Loader size={32} className="text-[#7CFF3B] animate-spin" />
              <p className="text-gray-300">Enviando...</p>
            </>
          ) : (
            <>
              <div className="p-4 bg-[#7CFF3B]/10 rounded-full">
                <Upload size={28} className="text-[#7CFF3B]" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  {currentUrl ? 'Trocar currículo' : 'Enviar currículo'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Clique para selecionar um PDF
                </p>
              </div>
            </>
          )}
        </div>
      </label>
    </div>
  );
}

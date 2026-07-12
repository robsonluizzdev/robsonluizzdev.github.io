'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Trash2, Plus, Edit2, X, Upload, Loader, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  demoUrl?: string;
  screenshot?: string;
}

const BUCKET = 'projects';

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
    screenshot: '',
  });
  const [newTech, setNewTech] = useState('');
  const [message, setMessage] = useState('');
  const [uploadingShot, setUploadingShot] = useState(false);
  const [uploadingDemo, setUploadingDemo] = useState(false);
  const shotRef = useRef<HTMLInputElement>(null);
  const demoRef = useRef<HTMLInputElement>(null);

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
      const mapped = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        tech: p.tech || [],
        demoUrl: p.demo_url || '',
        screenshot: p.screenshot || '',
      }));
      setProjects(mapped);
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
    } finally {
      setLoading(false);
    }
  }

  async function uploadToBucket(file: File, kind: 'image' | 'html') {
    const ext = kind === 'html' ? 'html' : file.name.split('.').pop() || 'png';
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: kind === 'html' ? 'text/html' : file.type,
      upsert: false,
    });
    if (error) throw error;
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  async function handleScreenshot(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage('❌ Envie um arquivo de imagem');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setUploadingShot(true);
    try {
      const url = await uploadToBucket(file, 'image');
      setFormData((f) => ({ ...f, screenshot: url }));
      setMessage('✅ Imagem enviada!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`❌ Erro no upload: ${err.message || 'tente novamente'}`);
    } finally {
      setUploadingShot(false);
      if (shotRef.current) shotRef.current.value = '';
    }
  }

  async function handleDemo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.html')) {
      setMessage('❌ Envie um arquivo .html (com CSS/JS embutidos)');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setUploadingDemo(true);
    try {
      const url = await uploadToBucket(file, 'html');
      setFormData((f) => ({ ...f, demoUrl: url }));
      setMessage('✅ HTML enviado!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`❌ Erro no upload: ${err.message || 'tente novamente'}`);
    } finally {
      setUploadingDemo(false);
      if (demoRef.current) demoRef.current.value = '';
    }
  }

  function startNew() {
    setFormData({ id: '', name: '', description: '', tech: [], demoUrl: '', screenshot: '' });
    setEditing('new');
  }

  function editProject(project: Project) {
    setFormData(project);
    setEditing(project.id);
  }

  async function saveProject() {
    if (!formData.name || !formData.description) {
      setMessage('❌ Preencha nome e descrição');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        tech: formData.tech,
        demo_url: formData.demoUrl || null,
        screenshot: formData.screenshot || null,
      };
      if (formData.id) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
      }

      await fetchProjects();
      setEditing(null);
      setMessage('✅ Projeto salvo!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`❌ Erro ao salvar: ${err.message || 'tente novamente'}`);
      console.error(err);
    }
  }

  async function deleteProject(id: string) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
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

            {/* Imagem (screenshot) */}
            <div>
              <label className="block text-sm mb-2">Imagem do Projeto</label>
              {formData.screenshot ? (
                <div className="mb-2 flex items-center gap-3 p-2 bg-gray-800 rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.screenshot}
                    alt="Preview"
                    className="h-16 w-24 object-cover rounded"
                  />
                  <span className="text-xs text-gray-400 flex-1 truncate">Imagem enviada</span>
                  <button
                    onClick={() => setFormData({ ...formData, screenshot: '' })}
                    className="p-1 text-red-400 hover:bg-red-900/20 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : null}
              <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-[#7CFF3B] hover:bg-[#7CFF3B]/5 transition-colors text-sm">
                <input
                  ref={shotRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshot}
                  disabled={uploadingShot}
                  className="hidden"
                />
                {uploadingShot ? (
                  <>
                    <Loader size={16} className="animate-spin text-[#7CFF3B]" /> Enviando imagem...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="text-[#7CFF3B]" />
                    {formData.screenshot ? 'Trocar imagem' : 'Enviar imagem (PNG/JPG)'}
                  </>
                )}
              </label>
            </div>

            {/* Demo HTML */}
            <div>
              <label className="block text-sm mb-2">Demo (HTML)</label>
              {formData.demoUrl ? (
                <div className="mb-2 flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
                  <span className="text-xs text-gray-400 flex-1 truncate">{formData.demoUrl}</span>
                  <a
                    href={formData.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-[#7CFF3B] hover:bg-[#7CFF3B]/10 rounded"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={() => setFormData({ ...formData, demoUrl: '' })}
                    className="p-1 text-red-400 hover:bg-red-900/20 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : null}
              <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-[#7CFF3B] hover:bg-[#7CFF3B]/5 transition-colors text-sm">
                <input
                  ref={demoRef}
                  type="file"
                  accept=".html,text/html"
                  onChange={handleDemo}
                  disabled={uploadingDemo}
                  className="hidden"
                />
                {uploadingDemo ? (
                  <>
                    <Loader size={16} className="animate-spin text-[#7CFF3B]" /> Enviando HTML...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="text-[#7CFF3B]" />
                    {formData.demoUrl ? 'Trocar HTML' : 'Enviar HTML (arquivo único)'}
                  </>
                )}
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Envie um HTML com CSS/JS embutidos no próprio arquivo.
              </p>
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
                      setFormData({ ...formData, tech: [...formData.tech, newTech] });
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
              <div className="text-center py-8 text-gray-500">Nenhum projeto adicionado</div>
            ) : (
              projects.map((project) => (
                <div key={project.id} className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {project.screenshot ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.screenshot}
                          alt={project.name}
                          className="h-14 w-20 object-cover rounded shrink-0"
                        />
                      ) : null}
                      <div className="min-w-0">
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
                    </div>
                    <div className="flex gap-2 shrink-0">
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

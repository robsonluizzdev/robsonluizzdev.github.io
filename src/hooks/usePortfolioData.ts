import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface PortfolioData {
  about: { title: string; bio: string; email: string; phone: string; linkedin: string } | null;
  technologies: string[];
  experiences: { company: string; role: string; items: string[] }[];
  projects: { name: string; description: string; tech: string[]; demoUrl?: string }[];
  education: { course: string; institution: string }[];
  contact: { email: string; phone: string; whatsapp: string; linkedin: string; github?: string } | null;
}

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>({
    about: null,
    technologies: [],
    experiences: [],
    projects: [],
    education: [],
    contact: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
    subscribeToChanges();
  }, []);

  async function fetchAllData() {
    try {
      const [aboutRes, techRes, expRes, projRes, eduRes, contactRes] = await Promise.all([
        supabase.from('about').select('*').single(),
        supabase.from('technologies').select('name').order('name'),
        supabase.from('experiences').select('*').order('company'),
        supabase.from('projects').select('*').order('name'),
        supabase.from('education').select('*').order('course'),
        supabase.from('contact').select('*').single(),
      ]);

      setData({
        about: aboutRes.data,
        technologies: techRes.data?.map((t: { name: string }) => t.name) || [],
        experiences: expRes.data || [],
        projects: projRes.data || [],
        education: eduRes.data || [],
        contact: contactRes.data,
      });
    } catch (err) {
      console.error('Erro ao carregar dados do portfólio:', err);
    } finally {
      setLoading(false);
    }
  }

  function subscribeToChanges() {
    // Subscribe to all tables for real-time updates
    const subscription = supabase
      .channel('portfolio_changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchAllData();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  return { data, loading };
}

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface PortfolioContextType {
  data: any;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
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
        technologies: techRes.data?.map((t: any) => t.name) || [],
        experiences: expRes.data || [],
        projects: projRes.data || [],
        education: eduRes.data || [],
        contact: contactRes.data,
      });
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  useEffect(() => {
    refreshData();
    setLoading(false);

    // Real-time subscription
    const subscription = supabase
      .channel('portfolio_changes')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        refreshData();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <PortfolioContext.Provider value={{ data, loading, refreshData }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioContext() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolioContext deve ser usado dentro de PortfolioProvider');
  }
  return context;
}

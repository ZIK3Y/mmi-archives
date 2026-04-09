import { DOMAINE } from '@/constants/IPServer';
import { Sae, SaeFormData, Ue, Competence, Domaine, GroupeWorkFormData } from '@/types/types';

const handleResponse = async <T>(res: Response): Promise<T | null> => {
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const authHeaders = (token?: string): Record<string, string> => {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
};

// ── SAÉ ──────────────────────────────────────────────────────

export const fetchAllSae = async (): Promise<Sae[]> => {
  try {
    const res = await fetch(`${DOMAINE}/saes`);
    return (await handleResponse<Sae[]>(res)) ?? [];
  } catch { return []; }
};

export const fetchSaeById = async (id: number | string): Promise<Sae | null> => {
  try {
    const res = await fetch(`${DOMAINE}/saes/${id}`);
    return handleResponse<Sae>(res);
  } catch { return null; }
};

export const fetchSaeByAnnee = async (annee: string): Promise<Sae[]> => {
  try {
    const res = await fetch(`${DOMAINE}/saes/annee/${encodeURIComponent(annee)}`);
    return (await handleResponse<Sae[]>(res)) ?? [];
  } catch { return []; }
};

export const fetchSaeByDomaine = async (domaine: string): Promise<Sae[]> => {
  try {
    const res = await fetch(`${DOMAINE}/saes/domaine/${encodeURIComponent(domaine)}`);
    return (await handleResponse<Sae[]>(res)) ?? [];
  } catch { return []; }
};

export const fetchSaeByNote = async (): Promise<Sae[]> => {
  try {
    const res = await fetch(`${DOMAINE}/saes/classement`);
    if (res.ok) {
      const data = await handleResponse<Sae[]>(res);
      if (data && data.length > 0) return data;
    }
    const all = await fetchAllSae();
    return [...all].sort((a, b) => b.note - a.note);
  } catch {
    const all = await fetchAllSae();
    return [...all].sort((a, b) => b.note - a.note);
  }
};

export const createSae = async (data: SaeFormData, token?: string): Promise<Sae | null> => {
  try {
    const res = await fetch(`${DOMAINE}/saes`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (res.status !== 201 && res.status !== 200) return null;
    return handleResponse<Sae>(res);
  } catch { return null; }
};

export const updateSae = async (id: number, data: SaeFormData, token?: string): Promise<Sae | null> => {
  try {
    const res = await fetch(`${DOMAINE}/saes/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return handleResponse<Sae>(res);
  } catch { return null; }
};

export const deleteSae = async (id: number, token?: string): Promise<boolean> => {
  try {
    const res = await fetch(`${DOMAINE}/saes/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    return res.ok;
  } catch { return false; }
};

// ── GROUPES ──────────────────────────────────────────────────

export const createGroupeWork = async (data: GroupeWorkFormData, token?: string): Promise<any> => {
  try {
    const res = await fetch(`${DOMAINE}/groupes`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (res.status !== 201 && res.status !== 200) return null;
    return handleResponse<any>(res);
  } catch { return null; }
};

export const fetchGroupeById = async (id: number | string): Promise<any> => {
  try {
    const res = await fetch(`${DOMAINE}/groupes/${id}`);
    return handleResponse<any>(res);
  } catch { return null; }
};

export const updateGroupe = async (id: number, data: GroupeWorkFormData, token?: string): Promise<any> => {
  try {
    const res = await fetch(`${DOMAINE}/groupes/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return handleResponse<any>(res);
  } catch { return null; }
};

export const deleteGroupe = async (idGroupe: number, token?: string): Promise<boolean> => {
  try {
    const res = await fetch(`${DOMAINE}/groupes/${idGroupe}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    return res.ok;
  } catch { return false; }
};

// ── RÉFÉRENTIELS ──────────────────────────────────────────────

export const fetchAllUes = async (): Promise<Ue[]> => {
  try {
    const res = await fetch(`${DOMAINE}/ues`);
    return (await handleResponse<Ue[]>(res)) ?? [];
  } catch { return []; }
};

export const fetchAllCompetences = async (): Promise<Competence[]> => {
  try {
    const res = await fetch(`${DOMAINE}/competences`);
    return (await handleResponse<Competence[]>(res)) ?? [];
  } catch { return []; }
};

export const fetchAllDomaines = async (): Promise<Domaine[]> => {
  try {
    const res = await fetch(`${DOMAINE}/domaines`);
    return (await handleResponse<Domaine[]>(res)) ?? [];
  } catch { return []; }
};

// ── IMAGES ────────────────────────────────────────────────────

export const fetchImagesBySae = async (idSae: number | string): Promise<string[]> => {
  try {
    const res = await fetch(`${DOMAINE}/saes/${idSae}/images`);
    return (await handleResponse<string[]>(res)) ?? [];
  } catch { return []; }
};

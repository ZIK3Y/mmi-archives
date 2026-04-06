import { DOMAINE } from '@/constants/IPServer';
import { Sae, SaeFormData } from '@/types/types';

const handleResponse = async <T>(res: Response): Promise<T | null> => {
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
};

// Récupère toutes les SAé
export const fetchAllSae = async (): Promise<Sae[]> => {
  try {
    const res = await fetch(`${DOMAINE}/saes`);
    const data = await handleResponse<Sae[]>(res);
    return data ?? [];
  } catch {
    return [];
  }
};

// Récupère une SAé par son id
export const fetchSaeById = async (id: number | string): Promise<Sae | null> => {
  try {
    const res = await fetch(`${DOMAINE}/saes/${id}`);
    return handleResponse<Sae>(res);
  } catch {
    return null;
  }
};

// Récupère les SAé par année (MMI2 ou MMI3)
export const fetchSaeByAnnee = async (annee: string): Promise<Sae[]> => {
  try {
    const res = await fetch(`${DOMAINE}/saes/annee/${encodeURIComponent(annee)}`);
    const data = await handleResponse<Sae[]>(res);
    return data ?? [];
  } catch {
    return [];
  }
};

// Récupère les SAé par domaine
export const fetchSaeByDomaine = async (domaine: string): Promise<Sae[]> => {
  try {
    const res = await fetch(`${DOMAINE}/saes/domaine/${encodeURIComponent(domaine)}`);
    const data = await handleResponse<Sae[]>(res);
    return data ?? [];
  } catch {
    return [];
  }
};

// Récupère les SAé triées par note (décroissant)
// Fallback : fetchAllSae + tri local si l'endpoint /classement n'existe pas
export const fetchSaeByNote = async (): Promise<Sae[]> => {
  try {
    const res = await fetch(`${DOMAINE}/saes/classement`);
    if (res.ok) {
      const data = await handleResponse<Sae[]>(res);
      if (data && data.length > 0) return data;
    }
    // Fallback : toutes les SAé triées localement
    const all = await fetchAllSae();
    return [...all].sort((a, b) => b.note - a.note);
  } catch {
    const all = await fetchAllSae();
    return [...all].sort((a, b) => b.note - a.note);
  }
};

// Crée une nouvelle SAé (requiert authentification)
export const createSae = async (
  data: SaeFormData,
  token?: string
): Promise<Sae | null> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${DOMAINE}/saes`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (res.status !== 201 && res.status !== 200) return null;
    return handleResponse<Sae>(res);
  } catch {
    return null;
  }
};

// Récupère toutes les images d'une SAé
export const fetchImagesBySae = async (idSae: number | string): Promise<string[]> => {
  try {
    const res = await fetch(`${DOMAINE}/saes/${idSae}/images`);
    const data = await handleResponse<string[]>(res);
    return data ?? [];
  } catch {
    return [];
  }
};

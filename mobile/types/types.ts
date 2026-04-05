export interface Sae {
  id: number;
  titre: string;
  description: string;
  semestre: string;
  anneePromo: string; // MMI2 | MMI3
  domaine: string;
  competences: string;
  ressourcesHumaines: string;
  dateDebut: string;
  dateFin: string;
  note: number;
  tauxReussite: number;
  ue: string;
  lienSite: string;
  lienProduction: string;
  images: string[];
  groupe: GroupeMembre[];
}

export interface GroupeMembre {
  id: number;
  nom: string;
  prenom: string;
}

export interface SaeFormData {
  titre: string;
  description: string;
  semestre: string;
  annee: string;
  domaine: string;
  competences: string;
  ressourcesHumaines: string;
  dateDebut: string;
  dateFin: string;
  note: number;
  tauxReussite: number;
  ue: string;
  lienSite: string;
  lienProduction: string;
}

export interface AuthUser {
  username: string;
  token: string;
}

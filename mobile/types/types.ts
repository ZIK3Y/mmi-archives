export interface Domaine {
  idDomaine: number;
  libelle: string;
  description: string;
}

export interface Ue {
  idUe: number;
  codeUe: string;
  libelle: string;
  semestre: number;
}

export interface Competence {
  idCompetence: number;
  codeCompetence: string;
  libelle: string;
}

export interface Groupe {
  idGroupe: number;
  nomGroupe: string;
  membres: string[];
  anneePromo: string;
}

export interface Image {
  idImage: number;
  url: string;
  legende: string;
  ordre: number;
}

export interface Sae {
  idSae: number;
  titre: string;
  description: string;
  anneePromo: string;
  semestre: string;
  ue: string;
  domaine: string;
  note: number;
  tauxReussite: number;
  dateDebut: string;
  dateFin: string;
  lienSite: string;
  lienProduction: string;
  ressourcesHumaines: string;
  competences: Competence[];
  groupes: Groupe[];
  images: Image[];
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

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

export interface Image {
  idImage: number;
  url: string;
  legende: string;
  ordre: number;
}

export interface Groupe {
  idGroupe: number;
  nomGroupe: string;
  membres: string[];
  anneePromo: string;
  note: number;
  lienSite: string;
  lienProduction: string;
  images: Image[];
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
  anneePromo: string;
  domaineId: number | null;
  ueIds: number[];
  competenceIds: number[];
  ressourcesHumaines: string;
  dateDebut: string;
  dateFin: string;
  lienSite: string;
  lienProduction: string;
}

export interface GroupeWorkFormData {
  idSae: number | null;
  nomGroupe: string;
  anneePromo: string;
  etudiant1: string;
  etudiant2: string;
  etudiant3: string;
  etudiant4: string;
  etudiant5: string;
  note: string;
  lienSite: string;
  lienProduction: string;
  images: { url: string; legende: string; ordre: number }[];
}

export interface AuthUser {
  username: string;
  token: string;
}

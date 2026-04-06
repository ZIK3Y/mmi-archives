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
  description: string;
}

export interface Groupe {
  idGroupe: number;
  nomGroupe: string;
  etudiant1: string | null;
  etudiant2: string | null;
  etudiant3: string | null;
  etudiant4: string | null;
  etudiant5: string | null;
  anneePromo: string;
}

export interface Image {
  idImage: number;
  url: string;
  legende: string;
  ordre: number;
}


export interface GroupeSae {
  groupe: Groupe;
  note: number;
}


export interface SaeCompetence {
  competence: Competence;
}

export interface Sae {
  idSae: number;
  titre: string;
  description: string;
  semestre: string;             // "S3" | "S4" | "S5" | "S6"
  anneePromo: string;           // "MMI2" | "MMI3"
  domaine: string;              // libelle du Domaine
  competences: string;          // codes concaténés ex: "C1, C2, C4"
  ressourcesHumaines: string;   // noms des groupes concaténés
  dateDebut: string;            // "YYYY-MM-DD"
  dateFin: string;              // "YYYY-MM-DD"
  note: number;                 // moyenne des notes des groupeSaes
  tauxReussite: number;
  ue: string;                   // codeUe ex: "UE3.4"
  lienSite: string;
  lienProduction: string;
  images: string[];             // liste d'URLs
  groupe: GroupeMembre[];       // membres extraits des Groupe liés
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
  annee: string;                // "MMI2" | "MMI3"
  domaine: string;              
  competences: string;
  ressourcesHumaines: string;
  dateDebut: string;            // "YYYY-MM-DD"
  dateFin: string;              // "YYYY-MM-DD"
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

USE `mmi-archive`;

-- ==============================
-- DROP (safe)
-- ==============================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS image;
DROP TABLE IF EXISTS groupe_sae;
DROP TABLE IF EXISTS sae_competence;
DROP TABLE IF EXISTS sae;
DROP TABLE IF EXISTS groupe;
DROP TABLE IF EXISTS competence;
DROP TABLE IF EXISTS ue;
DROP TABLE IF EXISTS domaine;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================
-- TABLES SANS FK
-- ==============================

CREATE TABLE domaine (
  id_domaine  BIGINT PRIMARY KEY,
  libelle     VARCHAR(255),
  description TEXT
);

CREATE TABLE ue (
  id_ue    BIGINT PRIMARY KEY,
  code_ue  VARCHAR(255),
  libelle  VARCHAR(255),
  semestre INT
);

CREATE TABLE competence (
  id_competence   BIGINT PRIMARY KEY,
  code_competence VARCHAR(255),
  libelle         VARCHAR(255),
  description     TEXT
);

CREATE TABLE groupe (
  id_groupe   BIGINT PRIMARY KEY,
  nom_groupe  VARCHAR(255),
  etudiant1   VARCHAR(255),
  etudiant2   VARCHAR(255),
  etudiant3   VARCHAR(255),
  etudiant4   VARCHAR(255),
  etudiant5   VARCHAR(255),
  annee_promo VARCHAR(255)
);

-- ==============================
-- TABLE SAE (avec FK)
-- ==============================

CREATE TABLE sae (
  id_sae          BIGINT PRIMARY KEY,
  titre           VARCHAR(255),
  description     TEXT,
  annee_promo     VARCHAR(255),
  date_debut      DATE,
  date_fin        DATE,
  taux_reussite   FLOAT,
  lien_site       VARCHAR(255),
  lien_production VARCHAR(255),
  id_domaine      BIGINT,
  id_ue           BIGINT,
  FOREIGN KEY (id_domaine) REFERENCES domaine(id_domaine),
  FOREIGN KEY (id_ue)      REFERENCES ue(id_ue)
);

-- ==============================
-- TABLES DE LIAISON
-- ==============================

CREATE TABLE sae_competence (
  id_sae        BIGINT,
  id_competence BIGINT,
  PRIMARY KEY (id_sae, id_competence),
  FOREIGN KEY (id_sae)        REFERENCES sae(id_sae),
  FOREIGN KEY (id_competence) REFERENCES competence(id_competence)
);

CREATE TABLE groupe_sae (
  id_groupe BIGINT,
  id_sae    BIGINT,
  note      FLOAT,
  PRIMARY KEY (id_groupe, id_sae),
  FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe),
  FOREIGN KEY (id_sae)    REFERENCES sae(id_sae)
);

CREATE TABLE image (
  id_image BIGINT PRIMARY KEY,
  url      VARCHAR(255),
  legende  VARCHAR(255),
  ordre    INT,
  id_sae   BIGINT,
  FOREIGN KEY (id_sae) REFERENCES sae(id_sae)
);

-- ==============================
-- DOMAINES
-- ==============================

INSERT INTO domaine (id_domaine, libelle, description) VALUES
(1, 'Développement Web',         'Développement front-end, back-end et full-stack'),
(2, 'Dispositifs Interactifs',   'Applications interactives, UX et interfaces utilisateur'),
(3, 'Création Numérique',        'Design graphique, motion design, identité visuelle'),
(4, 'Audiovisuel',               'Production vidéo, podcast, contenu multimédia'),
(5, 'Stratégie & Communication', 'Communication numérique, SEO, réseaux sociaux'),
(6, 'Données & Visualisation',   'Visualisation de données, data viz, applications interactives');

-- ==============================
-- UE — parcours DWeb-DI, semestres 3 à 5
-- Source : Programme national BUT MMI 2022
-- ==============================

INSERT INTO ue (id_ue, code_ue, libelle, semestre) VALUES
(1,  'UE3.1', 'Comprendre les écosystèmes et les besoins utilisateurs',         3),
(2,  'UE3.2', 'Concevoir ou co-concevoir une réponse stratégique',               3),
(3,  'UE3.3', 'Exprimer un message avec les médias numériques',                  3),
(4,  'UE3.4', 'Développer pour le web et les médias numériques',                 3),
(5,  'UE3.5', 'Entreprendre dans le secteur du numérique',                       3),
(6,  'UE4.1', 'Comprendre (S4)',                                                 4),
(7,  'UE4.2', 'Concevoir (S4)',                                                  4),
(8,  'UE4.3', 'Exprimer (S4)',                                                   4),
(9,  'UE4.4', 'Développer — applications web interactives',                      4),
(10, 'UE4.5', 'Entreprendre (S4)',                                               4),
(11, 'UE5.1', 'Comprendre (S5)',                                                 5),
(12, 'UE5.2', 'Concevoir (S5)',                                                  5),
(13, 'UE5.3', 'Exprimer (S5)',                                                   5),
(14, 'UE5.4', 'Développer — systèmes d''information et dispositifs interactifs', 5),
(15, 'UE5.5', 'Entreprendre (S5)',                                               5);

-- ==============================
-- COMPETENCES — 5 compétences BUT MMI
-- Source : Référentiel de compétences, Programme national 2022
-- ==============================

INSERT INTO competence (id_competence, code_competence, libelle, description) VALUES
(1, 'C1', 'Comprendre',   'Comprendre les écosystèmes, les besoins des utilisateurs et les dispositifs de communication numérique'),
(2, 'C2', 'Concevoir',    'Concevoir ou co-concevoir une réponse stratégique pertinente à une problématique complexe'),
(3, 'C3', 'Exprimer',     'Exprimer un message avec les médias numériques pour informer et communiquer'),
(4, 'C4', 'Développer',   'Développer pour le web et les médias numériques'),
(5, 'C5', 'Entreprendre', 'Entreprendre dans le secteur du numérique');

-- ==============================
-- GROUPES
-- Source : Groupes_SAE_303.pdf (MMI2) et Groupes_SAE_501.pdf (MMI3)
-- ==============================

INSERT INTO groupe (id_groupe, nom_groupe, etudiant1, etudiant2, etudiant3, etudiant4, etudiant5, annee_promo) VALUES
-- SAÉ 303 — MMI2
(1,  'G303-01', 'ADJAOUD Rayane',       'HUANG Patrick',             'NIEWIDZIALA-BECKER Zoran', 'LOUBARESSE Victor',   NULL, 'MMI2'),
(2,  'G303-02', 'LUFUNDU Océane',       'BOREL Maïlys',              'MONNERAT Maxime',           NULL,                  NULL, 'MMI2'),
(3,  'G303-03', 'DA COSTA Timéo',       'GADAGNI Soumiyya',          'JANVIER Charly',            'TREFFAULT Axel',      NULL, 'MMI2'),
(4,  'G303-04', 'MORANCY Manon',        'ONESTAS Radji',             'MAUDET Dylan',              'MOYEUX Dorian',       NULL, 'MMI2'),
(5,  'G303-05', 'GÜNDEM Enes',          'PICARD-ALVAREZ Erwan',      'ROBERT Lucas',              NULL,                  NULL, 'MMI2'),
(6,  'G303-06', 'ABDI Enzo',            'CORPET Kilian',             'THEVIN Alexis',             NULL,                  NULL, 'MMI2'),
(7,  'G303-07', 'LACHAB Imène',         'GERANCE Lény',              NULL,                        NULL,                  NULL, 'MMI2'),
(8,  'G303-08', 'PARADIS Jérémy',       'GIROUX Benjamin',           NULL,                        NULL,                  NULL, 'MMI2'),
(9,  'G303-09', 'SAIDJ Sofiane',        'YO KING CHUEN Darel',       'REDOT Naël',                NULL,                  NULL, 'MMI2'),
(10, 'G303-10', 'LAUDET Mathieu',       'JOUAN Gregoire',            'GOSMAT Adam',               'FARRUGGIA Maxime',    NULL, 'MMI2'),
(11, 'G303-11', 'DERENNES Maxime',      'KERGASTEL Témi',            'TOCQUEVILLE Joachim',       NULL,                  NULL, 'MMI2'),
(12, 'G303-12', 'CHISIU Sébastien',     'DRAME Ibrahim',             NULL,                        NULL,                  NULL, 'MMI2'),
(13, 'G303-13', 'CHOUDJAY Dylan',       'SAVOURIN Thomas',           'GUIDDIR Naïm',              'CHUPIN Nathan',       NULL, 'MMI2'),
(14, 'G303-14', 'COSTE Maxence',        'RABARIJAONA Samuel',        'GUESNON Clément',           'DELEN Corentin',      NULL, 'MMI2'),
(15, 'G303-15', 'SAMOURA Diaba',        'ADMI Séfora',               'GILET Amel',                NULL,                  NULL, 'MMI2'),
(16, 'G303-16', 'LEBRETON Laura',       'LUYEYE POLYDOR Nelly',      NULL,                        NULL,                  NULL, 'MMI2'),
(17, 'G303-17', 'BOULLARD Raphaël',     'KADI Wassim',               NULL,                        NULL,                  NULL, 'MMI2'),
(18, 'G303-18', 'SIMON-JEAN Leana',     'MARTON Eliot',              'FLEURY Noa',                NULL,                  NULL, 'MMI2'),
(19, 'G303-19', 'ANDOUARD Liam',        'BOUQUET Ethan',             'JEULAND Enzo',              'TRELLE Florian',      NULL, 'MMI2'),
-- SAÉ 501 — MMI3
(20, 'G501-01', 'BEN BOUBAKER Sheinez', 'BAL Zeinabou',              NULL,                        NULL,                  NULL, 'MMI3'),
(21, 'G501-02', 'HOUNSOU Markhus',      'MHOUMADI Makine',           NULL,                        NULL,                  NULL, 'MMI3'),
(22, 'G501-03', 'BUHOT Yanis',          'CHAPUT Théo',               'HAMON Alexandre',           NULL,                  NULL, 'MMI3'),
(23, 'G501-04', 'VANDELET Marin',       'CHTIOUI Ibtissem',          NULL,                        NULL,                  NULL, 'MMI3'),
(24, 'G501-05', 'GONCALVES Hugo Vitor', 'PEREIRA Ruben',             NULL,                        NULL,                  NULL, 'MMI3'),
(25, 'G501-06', 'MAHJOUB Assia',        'KONATE Hamed',              NULL,                        NULL,                  NULL, 'MMI3'),
(26, 'G501-07', 'KECKET-BAKER Trystan', 'MANSOIBOU Warrick',         NULL,                        NULL,                  NULL, 'MMI3'),
(27, 'G501-08', 'CHEURFA Liam',         'BRUSA Joris',               'CARPENTIER Timothé',        NULL,                  NULL, 'MMI3'),
(28, 'G501-09', 'MONLAY Tom',           'ZAIEM Sarah',               'BROUILLARD Thilya',         NULL,                  NULL, 'MMI3'),
(29, 'G501-10', 'BUISSET Nicolas',      'HENRIQUES MATEUS Léonardo', NULL,                        NULL,                  NULL, 'MMI3'),
(30, 'G501-11', 'THIABAS HOULAI Keyla', 'EDDABACHI Younes',          NULL,                        NULL,                  NULL, 'MMI3'),
(31, 'G501-12', 'KOUASSI Emmanuel',     'PEREZ SANCHEZ John',        NULL,                        NULL,                  NULL, 'MMI3'),
(32, 'G501-13', 'THEVAKUMAR Aathavan',  'VIGNESWARAN Abi',           NULL,                        NULL,                  NULL, 'MMI3'),
(33, 'G501-14', 'SALAOUDINE Saffana',   'BAER Oscar',                NULL,                        NULL,                  NULL, 'MMI3'),
(34, 'G501-15', 'LAWSON Killian',       'VEOPRASEUTH Nolan',         NULL,                        NULL,                  NULL, 'MMI3'),
(35, 'G501-16', 'ZENATI Mehdi',         'PREVOST Adrien',            NULL,                        NULL,                  NULL, 'MMI3'),
(36, 'G501-17', 'VASANTHAN Luxchan',    'KRISHNAKUMAR Abeeschan',    NULL,                        NULL,                  NULL, 'MMI3'),
(37, 'G501-18', 'ANTUNES Enzo',         'RANNOU Nicolas',            NULL,                        NULL,                  NULL, 'MMI3'),
(38, 'G501-19', 'BALDINETTI Mattéo',    'DINH Ken',                  NULL,                        NULL,                  NULL, 'MMI3'),
(39, 'G501-20', 'ROURE Vincent',        'SEGHIRI Marwan',            NULL,                        NULL,                  NULL, 'MMI3'),
(40, 'G501-21', 'CAMELIN Yannis',       'RAKOTOMAVO Mathias',        NULL,                        NULL,                  NULL, 'MMI3'),
(41, 'G501-22', 'SOM Yohan',            'LOPERE Alexandre',          NULL,                        NULL,                  NULL, 'MMI3');

-- ==============================
-- SAE
-- SAÉ 3.DWeb-DI.03 — S3, MMI2 → id_ue=4 (UE3.4 Développer), id_domaine=6
-- SAÉ 5.DWeb-DI.01 — S5, MMI3 → id_ue=14 (UE5.4 Développer), id_domaine=1
-- ==============================

INSERT INTO sae (id_sae, titre, description, annee_promo, date_debut, date_fin,
                 taux_reussite, lien_site, lien_production, id_domaine, id_ue) VALUES
(1,
 'SAÉ 3.03 — Visualisations de données et application interactive',
 'Concevoir des visualisations de données pour le web et une application interactive. Développement de dashboards et outils de data viz avec JavaScript, D3.js et Chart.js.',
 'MMI2', '2024-09-01', '2024-12-20', 78.95, '', '', 6, 4),

(2,
 'SAÉ 5.01 — Parcours utilisateur dans un système d''information',
 'Développer des parcours utilisateur au sein d''un système d''information. Conception et développement d''une application web ou mobile complète avec back-end, API REST et front-end réactif.',
 'MMI3', '2025-09-01', '2026-01-31', 86.36, '', '', 1, 14);

-- ==============================
-- SAE_COMPETENCE
-- SAÉ 303 : C1 Comprendre, C2 Concevoir, C4 Développer
-- SAÉ 501 : C1 Comprendre, C2 Concevoir, C4 Développer, C5 Entreprendre
-- ==============================

INSERT INTO sae_competence (id_sae, id_competence) VALUES
(1, 1), (1, 2), (1, 4),
(2, 1), (2, 2), (2, 4), (2, 5);

-- ==============================
-- GROUPE_SAE avec notes moyennées par groupe
-- KERGASTEL Témi (CAN), MONLAY Tom et HENRIQUES MATEUS Léonardo
-- (sans note) sont exclus du calcul de moyenne
-- ==============================

INSERT INTO groupe_sae (id_groupe, id_sae, note) VALUES
-- SAÉ 303 (id_sae = 1)
-- G303-01 : ADJAOUD 13,75 + HUANG 11,75 + NIEWIDZIALA 11,75 + LOUBARESSE 13
(1,  1, 12.56),
-- G303-02 : LUFUNDU 9,75 + BOREL 9,25 + MONNERAT 10,5
(2,  1, 9.83),
-- G303-03 : DA COSTA 17 + GADAGNI 17,25 + JANVIER 17 + TREFFAULT 17
(3,  1, 17.06),
-- G303-04 : MORANCY 5,25 + ONESTAS 5,25 + MAUDET 5,25 + MOYEUX 5,25
(4,  1, 5.25),
-- G303-05 : GÜNDEM 15,25 + PICARD-ALVAREZ 15,5 + ROBERT 15,25
(5,  1, 15.33),
-- G303-06 : ABDI 17,75 + CORPET 13,25 + THEVIN 13
(6,  1, 14.67),
-- G303-07 : LACHAB 14,25 + GERANCE 14,75
(7,  1, 14.50),
-- G303-08 : PARADIS 10,25 + GIROUX 10,25
(8,  1, 10.25),
-- G303-09 : SAIDJ 14 + YO KING CHUEN 10,25 + REDOT 10,25
(9,  1, 11.50),
-- G303-10 : LAUDET 15 + JOUAN 14,75 + GOSMAT 14,5 + FARRUGGIA 14,5
(10, 1, 14.69),
-- G303-11 : DERENNES 17,75 + KERGASTEL (exclu) + TOCQUEVILLE 12,5
(11, 1, 15.13),
-- G303-12 : CHISIU 16,25 + DRAME 13
(12, 1, 14.63),
-- G303-13 : CHOUDJAY 11,5 + SAVOURIN 11,75 + GUIDDIR 11,25 + CHUPIN 11
(13, 1, 11.38),
-- G303-14 : COSTE 16,25 + RABARIJAONA 15,75 + GUESNON 5 + DELEN 15,75
(14, 1, 13.19),
-- G303-15 : SAMOURA 15,75 + ADMI 11 + GILET 15,5
(15, 1, 14.08),
-- G303-16 : LEBRETON 14 + LUYEYE POLYDOR 10,5
(16, 1, 12.25),
-- G303-17 : BOULLARD 14,5 + KADI 11,5
(17, 1, 13.00),
-- G303-18 : SIMON-JEAN 11,5 + MARTON 11,5 + FLEURY 14
(18, 1, 12.33),
-- G303-19 : ANDOUARD 13,25 + BOUQUET 14,25 + JEULAND 13,25 + TRELLE 13,25
(19, 1, 13.50),

-- SAÉ 501 (id_sae = 2)
-- G501-01 : BEN BOUBAKER 10,05 + BAL 13,05
(20, 2, 11.55),
-- G501-02 : HOUNSOU 12,3 + MHOUMADI 10,8
(21, 2, 11.55),
-- G501-03 : BUHOT 12 + CHAPUT 12,375 + HAMON 13,125
(22, 2, 12.50),
-- G501-04 : VANDELET 15 + CHTIOUI 13,45
(23, 2, 14.23),
-- G501-05 : GONCALVES 11,7 + PEREIRA 11,7
(24, 2, 11.70),
-- G501-06 : MAHJOUB 10,7 + KONATE 10,65
(25, 2, 10.68),
-- G501-07 : KECKET-BAKER 10,4 + MANSOIBOU 10,4
(26, 2, 10.40),
-- G501-08 : CHEURFA 15,05 + BRUSA 11,3 + CARPENTIER 13,05
(27, 2, 13.13),
-- G501-09 : MONLAY (exclu) + ZAIEM 12,75 + BROUILLARD 11,75
(28, 2, 12.25),
-- G501-10 : BUISSET 15,25 + HENRIQUES MATEUS (exclu)
(29, 2, 15.25),
-- G501-11 : THIABAS HOULAI 10,95 + EDDABACHI 10,45
(30, 2, 10.70),
-- G501-12 : KOUASSI 11,7 + PEREZ SANCHEZ 12,2
(31, 2, 11.95),
-- G501-13 : THEVAKUMAR 15,55 + VIGNESWARAN 11,8
(32, 2, 13.68),
-- G501-14 : SALAOUDINE 13,8 + BAER 12,55
(33, 2, 13.18),
-- G501-15 : LAWSON 13,275 + VEOPRASEUTH 10,9
(34, 2, 12.09),
-- G501-16 : ZENATI 12,65 + PREVOST 14,15
(35, 2, 13.40),
-- G501-17 : VASANTHAN 11,55 + KRISHNAKUMAR 12,8
(36, 2, 12.18),
-- G501-18 : ANTUNES 10,8 + RANNOU 10,3
(37, 2, 10.55),
-- G501-19 : BALDINETTI 15,95 + DINH 18,7
(38, 2, 17.33),
-- G501-20 : ROURE 15,45 + SEGHIRI 13,45
(39, 2, 14.45),
-- G501-21 : CAMELIN 14,05 + RAKOTOMAVO 13,8
(40, 2, 13.93),
-- G501-22 : SOM 15,175 + LOPERE 13,55
(41, 2, 14.36);
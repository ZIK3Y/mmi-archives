-- ============================================================
-- init.sql — MMI Archive — Données de test complètes
-- Encodage : UTF-8 (utf8mb4)
-- ============================================================
-- IMPORTANT : Les libellés de domaine correspondent EXACTEMENT
-- aux chips du front mobile (parDomaine.tsx) :
--   'Web', 'Développement', 'DI', '3D', 'Création', 'Autre'
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

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

-- ============================================================
-- TABLES
-- La table groupe_sae stocke les liens du groupe (site, code source).
-- La table image est liée à un groupe (id_groupe NOT NULL).
-- ============================================================

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

CREATE TABLE sae_competence (
  id_sae        BIGINT,
  id_competence BIGINT,
  PRIMARY KEY (id_sae, id_competence),
  FOREIGN KEY (id_sae)        REFERENCES sae(id_sae),
  FOREIGN KEY (id_competence) REFERENCES competence(id_competence)
);

CREATE TABLE groupe_sae (
  id_groupe        BIGINT NOT NULL,
  id_sae           BIGINT NOT NULL,
  note             FLOAT  NOT NULL DEFAULT 0,
  lien_site        VARCHAR(500) DEFAULT '',
  lien_production  VARCHAR(500) DEFAULT '',
  PRIMARY KEY (id_groupe, id_sae),
  FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe),
  FOREIGN KEY (id_sae)    REFERENCES sae(id_sae)
);

CREATE TABLE image (
  id_image  BIGINT       NOT NULL AUTO_INCREMENT,
  url       VARCHAR(500) NOT NULL,
  legende   VARCHAR(255),
  ordre     INT          NOT NULL DEFAULT 0,
  id_groupe BIGINT       NOT NULL,
  PRIMARY KEY (id_image),
  FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- DOMAINES
-- ⚠️ Les libellés DOIVENT correspondre aux chips du front :
--    'Web', 'Développement', 'DI', '3D', 'Création', 'Autre'
-- ============================================================
INSERT INTO domaine (id_domaine, libelle, description) VALUES
(1, 'Web',           'Développement front-end, back-end et full-stack'),
(2, 'Développement', 'Applications interactives, logiciels, scripts, APIs'),
(3, 'DI',            'Dispositifs Interactifs — UX, interfaces, expériences numériques'),
(4, '3D',            'Modélisation 3D, animation, motion design'),
(5, 'Création',      'Design graphique, identité visuelle, communication numérique'),
(6, 'Autre',         'Autres domaines du BUT MMI');
-- id_domaine: Web=1, Développement=2, DI=3, 3D=4, Création=5, Autre=6


-- ============================================================
-- UE — BUT MMI, semestres 3 à 6
-- Format d'affichage attendu : "UE 3.1 Comprendre", "UE 3.4 Développer", etc.
-- ============================================================
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
(15, 'UE5.5', 'Entreprendre (S5)',                                               5),
(16, 'UE6.1', 'Comprendre (S6)',                                                 6),
(17, 'UE6.2', 'Concevoir (S6)',                                                  6),
(18, 'UE6.3', 'Exprimer (S6)',                                                   6),
(19, 'UE6.4', 'Développer (S6)',                                                 6),
(20, 'UE6.5', 'Entreprendre (S6)',                                               6);
-- id_ue: UE3.4=4, UE5.4=14


-- ============================================================
-- COMPÉTENCES — Compétences techniques réelles du BUT MMI
-- L'affichage front-end utilise uniquement le libelle (pas le code)
-- ============================================================
INSERT INTO competence (id_competence, code_competence, libelle, description) VALUES
(1, 'C1', 'Développement Front-End', 'Intégration web, HTML/CSS, JavaScript, frameworks front-end (React, Vue)'),
(2, 'C2', 'Développement Back-End',  'APIs REST, Spring Boot, bases de données, authentification'),
(3, 'C3', 'Design UI/UX',            'Conception d''interfaces, maquettage Figma, expérience utilisateur'),
(4, 'C4', 'Modélisation 3D',         'Modélisation, animation 3D, motion design, Blender'),
(5, 'C5', 'Hébergement & Déploiement', 'Mise en production, Docker, CI/CD, cloud hosting');


-- ============================================================
-- GROUPES MMI2 — SAÉ 3.03
-- ============================================================
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


-- ============================================================
-- SAÉ
-- SAÉ 3.03 → domaine 'Développement' (id=2), UE3.4 (id=4)
-- SAÉ 5.01 → domaine 'Web' (id=1), UE5.4 (id=14)
-- taux_reussite calculé depuis les notes de groupe
-- ============================================================
INSERT INTO sae (id_sae, titre, description, annee_promo, date_debut, date_fin,
                 taux_reussite, lien_site, lien_production, id_domaine, id_ue)
VALUES
(1,
 'SAÉ 3.03 — Visualisations de données et application interactive',
 'Concevoir et développer des visualisations de données pour le web ainsi qu''une application interactive. Les groupes ont produit des dashboards et outils de data viz en utilisant JavaScript, D3.js et Chart.js, à partir de jeux de données publics (open data). Chaque projet devait intégrer au minimum 3 types de visualisations différentes et une interface de navigation responsive.',
 'MMI2', '2024-09-02', '2024-12-20', 78.95,
 'https://sae303.iut-mlv.fr',
 'https://github.com/iut-mlv-mmi/sae303-dataviz',
 2, 4),

(2,
 'SAÉ 5.01 — Parcours utilisateur dans un système d''information',
 'Concevoir et développer une application web ou mobile complète intégrée dans un système d''information existant. Les groupes ont travaillé en binôme sur la conception UX, le développement back-end (Spring Boot, API REST) et front-end (React Native). Le projet inclut une base de données relationnelle, une documentation technique et une soutenance orale.',
 'MMI3', '2025-09-01', '2026-01-31', 86.36,
 'https://sae501.iut-mlv.fr',
 'https://github.com/iut-mlv-mmi/sae501-si',
 1, 14);
-- id_sae: 1=SAÉ 3.03, 2=SAÉ 5.01


-- ============================================================
-- COMPÉTENCES ASSOCIÉES
-- SAÉ 303 : Développement Front-End (C1), Back-End (C2), Modélisation 3D (C4)
-- SAÉ 501 : Développement Front-End (C1), Back-End (C2), Modélisation 3D (C4), Hébergement (C5)
-- ============================================================
INSERT INTO sae_competence (id_sae, id_competence) VALUES
(1, 1), (1, 2), (1, 4),           -- 3.03 : Front-End, Back-End, Modélisation 3D
(2, 1), (2, 2), (2, 4), (2, 5);   -- 5.01 : + Hébergement & Déploiement


-- ============================================================
-- GROUPE_SAE — Notes + liens par groupe
-- Le taux de réussite et la note moyenne sont calculés
-- automatiquement par SaeDTO.java depuis ces valeurs
-- ============================================================
INSERT INTO groupe_sae (id_groupe, id_sae, note, lien_site, lien_production) VALUES
-- ── SAÉ 3.03 ─────────────────────────────────────────────────
(1,  1, 12.56, 'https://adjaoud-huang-dataviz.netlify.app',    'https://github.com/g303-01/dataviz'),
(2,  1, 9.83,  '',                                              'https://github.com/g303-02/dataviz'),
(3,  1, 17.06, 'https://dacosta-gadagni-dataviz.netlify.app',  'https://github.com/g303-03/dataviz'),
(4,  1, 5.25,  '',                                              ''),
(5,  1, 15.33, 'https://gundem-picard-dataviz.netlify.app',    'https://github.com/g303-05/dataviz'),
(6,  1, 14.67, 'https://abdi-corpet-dataviz.netlify.app',      'https://github.com/g303-06/dataviz'),
(7,  1, 14.50, 'https://lachab-gerance-dataviz.netlify.app',   'https://github.com/g303-07/dataviz'),
(8,  1, 10.25, '',                                              'https://github.com/g303-08/dataviz'),
(9,  1, 11.50, 'https://saidj-yo-dataviz.netlify.app',         'https://github.com/g303-09/dataviz'),
(10, 1, 14.69, 'https://laudet-jouan-dataviz.netlify.app',     'https://github.com/g303-10/dataviz'),
(11, 1, 15.13, 'https://derennes-tocqueville-dataviz.netlify.app', 'https://github.com/g303-11/dataviz'),
(12, 1, 14.63, 'https://chisiu-drame-dataviz.netlify.app',     'https://github.com/g303-12/dataviz'),
(13, 1, 11.38, '',                                              'https://github.com/g303-13/dataviz'),
(14, 1, 13.19, 'https://coste-rabarijaona-dataviz.netlify.app','https://github.com/g303-14/dataviz'),
(15, 1, 14.08, 'https://samoura-admi-dataviz.netlify.app',     'https://github.com/g303-15/dataviz'),
(16, 1, 12.25, '',                                              'https://github.com/g303-16/dataviz'),
(17, 1, 13.00, 'https://boullard-kadi-dataviz.netlify.app',    'https://github.com/g303-17/dataviz'),
(18, 1, 12.33, '',                                              'https://github.com/g303-18/dataviz'),
(19, 1, 13.50, 'https://andouard-bouquet-dataviz.netlify.app', 'https://github.com/g303-19/dataviz'),
-- ── SAÉ 5.01 ─────────────────────────────────────────────────
(20, 2, 11.55, 'https://benboubaker-bal-sae501.netlify.app',   'https://github.com/g501-01/mmi-archive'),
(21, 2, 11.55, 'https://hounsou-mhoumadi-sae501.netlify.app',  'https://github.com/g501-02/mmi-archive'),
(22, 2, 12.50, 'https://buhot-chaput-sae501.netlify.app',      'https://github.com/g501-03/mmi-archive'),
(23, 2, 14.23, 'https://vandelet-chtioui-sae501.netlify.app',  'https://github.com/g501-04/mmi-archive'),
(24, 2, 11.70, 'https://goncalves-pereira-sae501.netlify.app', 'https://github.com/g501-05/mmi-archive'),
(25, 2, 10.68, '',                                              'https://github.com/g501-06/mmi-archive'),
(26, 2, 10.40, '',                                              'https://github.com/g501-07/mmi-archive'),
(27, 2, 13.13, 'https://cheurfa-brusa-sae501.netlify.app',     'https://github.com/g501-08/mmi-archive'),
(28, 2, 12.25, '',                                              'https://github.com/g501-09/mmi-archive'),
(29, 2, 15.25, 'https://buisset-sae501.netlify.app',           'https://github.com/g501-10/mmi-archive'),
(30, 2, 10.70, '',                                              'https://github.com/g501-11/mmi-archive'),
(31, 2, 11.95, '',                                              'https://github.com/g501-12/mmi-archive'),
(32, 2, 13.68, 'https://thevakumar-vigneswaran-sae501.netlify.app','https://github.com/g501-13/mmi-archive'),
(33, 2, 13.18, 'https://salaoudine-baer-sae501.netlify.app',   'https://github.com/g501-14/mmi-archive'),
(34, 2, 12.09, '',                                              'https://github.com/g501-15/mmi-archive'),
(35, 2, 13.40, 'https://zenati-prevost-sae501.netlify.app',     'https://github.com/g501-16/mmi-archive'),
(36, 2, 12.18, '',                                              'https://github.com/g501-17/mmi-archive'),
(37, 2, 10.55, '',                                              'https://github.com/g501-18/mmi-archive'),
(38, 2, 17.33, 'https://baldinetti-dinh-sae501.netlify.app',   'https://github.com/g501-19/mmi-archive'),
(39, 2, 14.45, 'https://roure-seghiri-sae501.netlify.app',     'https://github.com/g501-20/mmi-archive'),
(40, 2, 13.93, 'https://camelin-rakotomavo-sae501.netlify.app', 'https://github.com/g501-21/mmi-archive'),
(41, 2, 14.36, 'https://som-lopere-sae501.netlify.app',         'https://github.com/g501-22/mmi-archive');


-- ============================================================
-- IMAGES — Liées aux groupes (id_groupe)
-- Images de test via picsum.photos (seed stable = même image toujours)
-- ============================================================

-- G303-03 (id=3) — meilleur groupe SAÉ 3.03
INSERT INTO image (url, legende, ordre, id_groupe) VALUES
('https://picsum.photos/seed/g303-03-a/800/600', 'Dashboard data viz — vue principale',    1, 3),
('https://picsum.photos/seed/g303-03-b/800/600', 'Graphique en barres interactif',          2, 3),
('https://picsum.photos/seed/g303-03-c/800/600', 'Carte choroplèthe France',                3, 3),
('https://picsum.photos/seed/g303-03-d/800/600', 'Vue mobile responsive',                   4, 3);

-- G303-05 (id=5)
INSERT INTO image (url, legende, ordre, id_groupe) VALUES
('https://picsum.photos/seed/g303-05-a/800/600', 'Interface principale',                    1, 5),
('https://picsum.photos/seed/g303-05-b/800/600', 'Diagramme circulaire D3.js',              2, 5);

-- G303-11 (id=11)
INSERT INTO image (url, legende, ordre, id_groupe) VALUES
('https://picsum.photos/seed/g303-11-a/800/600', 'Timeline interactive',                    1, 11),
('https://picsum.photos/seed/g303-11-b/800/600', 'Filtres dynamiques',                      2, 11),
('https://picsum.photos/seed/g303-11-c/800/600', 'Export PDF',                              3, 11);

-- G501-19 BALDINETTI DINH (id=38) — meilleur groupe SAÉ 5.01
INSERT INTO image (url, legende, ordre, id_groupe) VALUES
('https://picsum.photos/seed/g501-19-a/800/600', 'Écran accueil — app mobile React Native', 1, 38),
('https://picsum.photos/seed/g501-19-b/800/600', 'Liste des SAÉ — scroll infini',           2, 38),
('https://picsum.photos/seed/g501-19-c/800/600', 'Page détail groupe avec galerie',          3, 38),
('https://picsum.photos/seed/g501-19-d/800/600', 'Formulaire ajout SAÉ',                    4, 38),
('https://picsum.photos/seed/g501-19-e/800/600', 'Schéma base de données',                  5, 38);

-- G501-10 BUISSET (id=29)
INSERT INTO image (url, legende, ordre, id_groupe) VALUES
('https://picsum.photos/seed/g501-10-a/800/600', 'Architecture Spring Boot',                1, 29),
('https://picsum.photos/seed/g501-10-b/800/600', 'Maquettes Figma',                        2, 29),
('https://picsum.photos/seed/g501-10-c/800/600', 'Interface admin',                         3, 29);

-- G501-04 VANDELET CHTIOUI (id=23)
INSERT INTO image (url, legende, ordre, id_groupe) VALUES
('https://picsum.photos/seed/g501-04-a/800/600', 'Page accueil',                            1, 23),
('https://picsum.photos/seed/g501-04-b/800/600', 'Classement des SAÉ',                      2, 23);

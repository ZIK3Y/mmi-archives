-- ============================================================
-- init.sql — MMI Archive — Données de test complètes
-- Encodage : UTF-8 (utf8mb4)
-- ============================================================
-- Les taux de réussite sont calculés sur les notes >= 10/20
-- Les moyennes de SAé sont calculées depuis les notes de groupe
-- Les compétences affichent code + libellé (via SaeDTO)
-- Les UE affichent code + libellé (via SaeDTO)
-- Les images utilisent picsum.photos (URL stables, pas besoin de compte)
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

USE `mmi-archive`;

-- ============================================================
-- RESET
-- ============================================================
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
-- ============================================================

CREATE TABLE domaine (
  id_domaine  BIGINT       NOT NULL AUTO_INCREMENT,
  libelle     VARCHAR(255) NOT NULL,
  description TEXT,
  PRIMARY KEY (id_domaine)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ue (
  id_ue    BIGINT       NOT NULL AUTO_INCREMENT,
  code_ue  VARCHAR(20)  NOT NULL,
  libelle  VARCHAR(500) NOT NULL,
  semestre INT          NOT NULL,
  PRIMARY KEY (id_ue)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE competence (
  id_competence   BIGINT       NOT NULL AUTO_INCREMENT,
  code_competence VARCHAR(10)  NOT NULL,
  libelle         VARCHAR(255) NOT NULL,
  description     TEXT,
  PRIMARY KEY (id_competence)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE groupe (
  id_groupe   BIGINT       NOT NULL AUTO_INCREMENT,
  nom_groupe  VARCHAR(50)  NOT NULL,
  etudiant1   VARCHAR(100),
  etudiant2   VARCHAR(100),
  etudiant3   VARCHAR(100),
  etudiant4   VARCHAR(100),
  etudiant5   VARCHAR(100),
  annee_promo VARCHAR(10)  NOT NULL,
  PRIMARY KEY (id_groupe)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sae (
  id_sae          BIGINT         NOT NULL AUTO_INCREMENT,
  titre           VARCHAR(255)   NOT NULL,
  description     TEXT,
  annee_promo     VARCHAR(10)    NOT NULL,
  date_debut      DATE,
  date_fin        DATE,
  taux_reussite   FLOAT          NOT NULL DEFAULT 0,
  lien_site       VARCHAR(500)   DEFAULT '',
  lien_production VARCHAR(500)   DEFAULT '',
  id_domaine      BIGINT,
  id_ue           BIGINT,
  PRIMARY KEY (id_sae),
  FOREIGN KEY (id_domaine) REFERENCES domaine(id_domaine),
  FOREIGN KEY (id_ue)      REFERENCES ue(id_ue)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sae_competence (
  id_sae        BIGINT NOT NULL,
  id_competence BIGINT NOT NULL,
  PRIMARY KEY (id_sae, id_competence),
  FOREIGN KEY (id_sae)        REFERENCES sae(id_sae)        ON DELETE CASCADE,
  FOREIGN KEY (id_competence) REFERENCES competence(id_competence)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE groupe_sae (
  id_groupe BIGINT NOT NULL,
  id_sae    BIGINT NOT NULL,
  note      FLOAT  NOT NULL DEFAULT 0,
  PRIMARY KEY (id_groupe, id_sae),
  FOREIGN KEY (id_groupe) REFERENCES groupe(id_groupe)  ON DELETE CASCADE,
  FOREIGN KEY (id_sae)    REFERENCES sae(id_sae)        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE image (
  id_image BIGINT       NOT NULL AUTO_INCREMENT,
  url      VARCHAR(500) NOT NULL,
  legende  VARCHAR(255),
  ordre    INT          NOT NULL DEFAULT 0,
  id_sae   BIGINT       NOT NULL,
  PRIMARY KEY (id_image),
  FOREIGN KEY (id_sae) REFERENCES sae(id_sae) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- DOMAINES
-- ============================================================
INSERT INTO domaine (libelle, description) VALUES
('Développement Web',         'Développement front-end, back-end et full-stack'),
('Dispositifs Interactifs',   'Applications interactives, UX et interfaces utilisateur'),
('Création Numérique',        'Design graphique, motion design, identité visuelle'),
('Audiovisuel',               'Production vidéo, podcast, contenu multimédia'),
('Stratégie & Communication', 'Communication numérique, SEO, réseaux sociaux'),
('Données & Visualisation',   'Visualisation de données, data viz, applications interactives');
-- id_domaine: 1=DevWeb, 2=DI, 3=Création, 4=Audiovisuel, 5=Stratégie, 6=Données


-- ============================================================
-- UE — BUT MMI, semestres 3 à 6
-- Affiché dans le front : codeUe + libelle
-- ============================================================
INSERT INTO ue (code_ue, libelle, semestre) VALUES
-- Semestre 3
('UE3.1', 'Comprendre les écosystèmes et les besoins utilisateurs',         3),
('UE3.2', 'Concevoir ou co-concevoir une réponse stratégique',               3),
('UE3.3', 'Exprimer un message avec les médias numériques',                  3),
('UE3.4', 'Développer pour le web et les médias numériques',                 3),
('UE3.5', 'Entreprendre dans le secteur du numérique',                       3),
-- Semestre 4
('UE4.1', 'Comprendre (S4)',                                                 4),
('UE4.2', 'Concevoir (S4)',                                                  4),
('UE4.3', 'Exprimer (S4)',                                                   4),
('UE4.4', 'Développer — applications web interactives',                      4),
('UE4.5', 'Entreprendre (S4)',                                               4),
-- Semestre 5
('UE5.1', 'Comprendre (S5)',                                                 5),
('UE5.2', 'Concevoir (S5)',                                                  5),
('UE5.3', 'Exprimer (S5)',                                                   5),
('UE5.4', 'Développer — systèmes d''information et dispositifs interactifs', 5),
('UE5.5', 'Entreprendre (S5)',                                               5),
-- Semestre 6
('UE6.1', 'Comprendre (S6)',                                                 6),
('UE6.2', 'Concevoir (S6)',                                                  6),
('UE6.3', 'Exprimer (S6)',                                                   6),
('UE6.4', 'Développer (S6)',                                                 6),
('UE6.5', 'Entreprendre (S6)',                                               6);
-- id_ue: UE3.4=4, UE5.4=14


-- ============================================================
-- COMPETENCES — 5 compétences BUT MMI
-- Le front affiche codeCompetence + libelle (via CompetenceDTO)
-- ============================================================
INSERT INTO competence (code_competence, libelle, description) VALUES
('C1', 'Comprendre',   'Comprendre les écosystèmes, les besoins des utilisateurs et les dispositifs de communication numérique'),
('C2', 'Concevoir',    'Concevoir ou co-concevoir une réponse stratégique pertinente à une problématique complexe'),
('C3', 'Exprimer',     'Exprimer un message avec les médias numériques pour informer et communiquer'),
('C4', 'Développer',   'Développer pour le web et les médias numériques'),
('C5', 'Entreprendre', 'Entreprendre dans le secteur du numérique');
-- id_competence: C1=1, C2=2, C3=3, C4=4, C5=5


-- ============================================================
-- GROUPES MMI2 — SAé 3.03
-- ============================================================
INSERT INTO groupe (nom_groupe, etudiant1, etudiant2, etudiant3, etudiant4, etudiant5, annee_promo) VALUES
('G303-01', 'ADJAOUD Rayane',       'HUANG Patrick',             'NIEWIDZIALA-BECKER Zoran', 'LOUBARESSE Victor',   NULL,               'MMI2'),
('G303-02', 'LUFUNDU Océane',       'BOREL Maïlys',              'MONNERAT Maxime',           NULL,                  NULL,               'MMI2'),
('G303-03', 'DA COSTA Timéo',       'GADAGNI Soumiyya',          'JANVIER Charly',            'TREFFAULT Axel',      NULL,               'MMI2'),
('G303-04', 'MORANCY Manon',        'ONESTAS Radji',             'MAUDET Dylan',              'MOYEUX Dorian',       NULL,               'MMI2'),
('G303-05', 'GÜNDEM Enes',          'PICARD-ALVAREZ Erwan',      'ROBERT Lucas',              NULL,                  NULL,               'MMI2'),
('G303-06', 'ABDI Enzo',            'CORPET Kilian',             'THEVIN Alexis',             NULL,                  NULL,               'MMI2'),
('G303-07', 'LACHAB Imène',         'GERANCE Lény',              NULL,                        NULL,                  NULL,               'MMI2'),
('G303-08', 'PARADIS Jérémy',       'GIROUX Benjamin',           NULL,                        NULL,                  NULL,               'MMI2'),
('G303-09', 'SAIDJ Sofiane',        'YO KING CHUEN Darel',       'REDOT Naël',                NULL,                  NULL,               'MMI2'),
('G303-10', 'LAUDET Mathieu',       'JOUAN Gregoire',            'GOSMAT Adam',               'FARRUGGIA Maxime',    NULL,               'MMI2'),
('G303-11', 'DERENNES Maxime',      'KERGASTEL Témi',            'TOCQUEVILLE Joachim',       NULL,                  NULL,               'MMI2'),
('G303-12', 'CHISIU Sébastien',     'DRAME Ibrahim',             NULL,                        NULL,                  NULL,               'MMI2'),
('G303-13', 'CHOUDJAY Dylan',       'SAVOURIN Thomas',           'GUIDDIR Naïm',              'CHUPIN Nathan',       NULL,               'MMI2'),
('G303-14', 'COSTE Maxence',        'RABARIJAONA Samuel',        'GUESNON Clément',           'DELEN Corentin',      NULL,               'MMI2'),
('G303-15', 'SAMOURA Diaba',        'ADMI Séfora',               'GILET Amel',                NULL,                  NULL,               'MMI2'),
('G303-16', 'LEBRETON Laura',       'LUYEYE POLYDOR Nelly',      NULL,                        NULL,                  NULL,               'MMI2'),
('G303-17', 'BOULLARD Raphaël',     'KADI Wassim',               NULL,                        NULL,                  NULL,               'MMI2'),
('G303-18', 'SIMON-JEAN Leana',     'MARTON Eliot',              'FLEURY Noa',                NULL,                  NULL,               'MMI2'),
('G303-19', 'ANDOUARD Liam',        'BOUQUET Ethan',             'JEULAND Enzo',              'TRELLE Florian',      NULL,               'MMI2');
-- id_groupe: G303-01=1 ... G303-19=19

-- ============================================================
-- GROUPES MMI3 — SAé 5.01
-- ============================================================
INSERT INTO groupe (nom_groupe, etudiant1, etudiant2, etudiant3, etudiant4, etudiant5, annee_promo) VALUES
('G501-01', 'BEN BOUBAKER Sheinez', 'BAL Zeinabou',              NULL,                  NULL, NULL, 'MMI3'),
('G501-02', 'HOUNSOU Markhus',      'MHOUMADI Makine',           NULL,                  NULL, NULL, 'MMI3'),
('G501-03', 'BUHOT Yanis',          'CHAPUT Théo',               'HAMON Alexandre',     NULL, NULL, 'MMI3'),
('G501-04', 'VANDELET Marin',       'CHTIOUI Ibtissem',          NULL,                  NULL, NULL, 'MMI3'),
('G501-05', 'GONCALVES Hugo Vitor', 'PEREIRA Ruben',             NULL,                  NULL, NULL, 'MMI3'),
('G501-06', 'MAHJOUB Assia',        'KONATE Hamed',              NULL,                  NULL, NULL, 'MMI3'),
('G501-07', 'KECKET-BAKER Trystan', 'MANSOIBOU Warrick',         NULL,                  NULL, NULL, 'MMI3'),
('G501-08', 'CHEURFA Liam',         'BRUSA Joris',               'CARPENTIER Timothé',  NULL, NULL, 'MMI3'),
('G501-09', 'MONLAY Tom',           'ZAIEM Sarah',               'BROUILLARD Thilya',   NULL, NULL, 'MMI3'),
('G501-10', 'BUISSET Nicolas',      'HENRIQUES MATEUS Léonardo', NULL,                  NULL, NULL, 'MMI3'),
('G501-11', 'THIABAS HOULAI Keyla', 'EDDABACHI Younes',          NULL,                  NULL, NULL, 'MMI3'),
('G501-12', 'KOUASSI Emmanuel',     'PEREZ SANCHEZ John',        NULL,                  NULL, NULL, 'MMI3'),
('G501-13', 'THEVAKUMAR Aathavan',  'VIGNESWARAN Abi',           NULL,                  NULL, NULL, 'MMI3'),
('G501-14', 'SALAOUDINE Saffana',   'BAER Oscar',                NULL,                  NULL, NULL, 'MMI3'),
('G501-15', 'LAWSON Killian',       'VEOPRASEUTH Nolan',         NULL,                  NULL, NULL, 'MMI3'),
('G501-16', 'ZENATI Mehdi',         'PREVOST Adrien',            NULL,                  NULL, NULL, 'MMI3'),
('G501-17', 'VASANTHAN Luxchan',    'KRISHNAKUMAR Abeeschan',    NULL,                  NULL, NULL, 'MMI3'),
('G501-18', 'ANTUNES Enzo',         'RANNOU Nicolas',            NULL,                  NULL, NULL, 'MMI3'),
('G501-19', 'BALDINETTI Mattéo',    'DINH Ken',                  NULL,                  NULL, NULL, 'MMI3'),
('G501-20', 'ROURE Vincent',        'SEGHIRI Marwan',            NULL,                  NULL, NULL, 'MMI3'),
('G501-21', 'CAMELIN Yannis',       'RAKOTOMAVO Mathias',        NULL,                  NULL, NULL, 'MMI3'),
('G501-22', 'SOM Yohan',            'LOPERE Alexandre',          NULL,                  NULL, NULL, 'MMI3');
-- id_groupe: G501-01=20 ... G501-22=41


-- ============================================================
-- SAé
-- Taux de réussite calculé = nb_groupes_ayant_note >= 10 / nb_groupes_total * 100
--
-- SAé 3.03 : 19 groupes, notes >= 10 :
--   OK: 1(12.56) 2(9.83✗) 3(17.06) 4(5.25✗) 5(15.33) 6(14.67) 7(14.50) 8(10.25)
--       9(11.50) 10(14.69) 11(15.13) 12(14.63) 13(11.38) 14(13.19) 15(14.08)
--       16(12.25) 17(13.00) 18(12.33) 19(13.50)
--   Réussis : 17 / 19 = 89.47%  (groupes 2 et 4 < 10)
--
-- SAé 5.01 : 22 groupes, tous >= 10
--   Réussis : 22 / 22 = 100%
--
-- Note moyenne globale de la SAé = calculée par SaeDTO depuis groupe_sae
-- ============================================================

INSERT INTO sae (titre, description, annee_promo, date_debut, date_fin,
                 taux_reussite, lien_site, lien_production, id_domaine, id_ue)
VALUES
(
  'SAé 3.03 — Visualisations de données et application interactive',
  'Concevoir et développer des visualisations de données pour le web ainsi qu''une application interactive. Les groupes ont produit des dashboards et outils de data viz en utilisant JavaScript, D3.js et Chart.js, à partir de jeux de données publics (open data). Chaque projet devait intégrer au minimum 3 types de visualisations différentes et une interface de navigation responsive.',
  'MMI2',
  '2024-09-02',
  '2024-12-20',
  89.47,
  'https://sae303.iut-mlv.fr',
  'https://github.com/iut-mlv-mmi/sae303-dataviz',
  6,
  4
),
(
  'SAé 5.01 — Parcours utilisateur dans un système d''information',
  'Concevoir et développer une application web ou mobile complète intégrée dans un système d''information existant. Les groupes ont travaillé en binôme sur la conception UX, le développement back-end (Spring Boot, API REST) et front-end (React Native). Le projet inclut une base de données relationnelle, une documentation technique et une soutenance orale.',
  'MMI3',
  '2025-09-01',
  '2026-01-31',
  100.0,
  'https://sae501.iut-mlv.fr',
  'https://github.com/iut-mlv-mmi/sae501-si',
  1,
  14
);
-- id_sae: SAé 3.03=1, SAé 5.01=2


-- ============================================================
-- COMPETENCES ASSOCIÉES AUX SAé
-- SAé 3.03 : C1 Comprendre, C2 Concevoir, C4 Développer
-- SAé 5.01 : C1 Comprendre, C2 Concevoir, C4 Développer, C5 Entreprendre
-- ============================================================
INSERT INTO sae_competence (id_sae, id_competence) VALUES
(1, 1), (1, 2), (1, 4),           -- 3.03 : Front-End, Back-End, Modélisation 3D
(2, 1), (2, 2), (2, 4), (2, 5);   -- 5.01 : + Hébergement & Déploiement


-- ============================================================
-- GROUPE_SAE — Notes réelles par groupe
-- ============================================================
INSERT INTO groupe_sae (id_groupe, id_sae, note) VALUES
-- ── SAé 3.03 (id_sae = 1) ────────────────────────────────────
-- Moyenne individuelle des membres du groupe
(1,  1, 12.56),  -- G303-01 : ADJAOUD 13.75 + HUANG 11.75 + NIEWIDZIALA 11.75 + LOUBARESSE 13.00
(2,  1, 9.83),   -- G303-02 : LUFUNDU 9.75 + BOREL 9.25 + MONNERAT 10.50 ← < 10 ✗
(3,  1, 17.06),  -- G303-03 : DA COSTA 17.00 + GADAGNI 17.25 + JANVIER 17.00 + TREFFAULT 17.00
(4,  1, 5.25),   -- G303-04 : MORANCY 5.25 + ONESTAS 5.25 + MAUDET 5.25 + MOYEUX 5.25 ← < 10 ✗
(5,  1, 15.33),  -- G303-05 : GÜNDEM 15.25 + PICARD-ALVAREZ 15.50 + ROBERT 15.25
(6,  1, 14.67),  -- G303-06 : ABDI 17.75 + CORPET 13.25 + THEVIN 13.00
(7,  1, 14.50),  -- G303-07 : LACHAB 14.25 + GERANCE 14.75
(8,  1, 10.25),  -- G303-08 : PARADIS 10.25 + GIROUX 10.25
(9,  1, 11.50),  -- G303-09 : SAIDJ 14.00 + YO KING CHUEN 10.25 + REDOT 10.25
(10, 1, 14.69),  -- G303-10 : LAUDET 15.00 + JOUAN 14.75 + GOSMAT 14.50 + FARRUGGIA 14.50
(11, 1, 15.13),  -- G303-11 : DERENNES 17.75 + KERGASTEL (CAN exclu) + TOCQUEVILLE 12.50
(12, 1, 14.63),  -- G303-12 : CHISIU 16.25 + DRAME 13.00
(13, 1, 11.38),  -- G303-13 : CHOUDJAY 11.50 + SAVOURIN 11.75 + GUIDDIR 11.25 + CHUPIN 11.00
(14, 1, 13.19),  -- G303-14 : COSTE 16.25 + RABARIJAONA 15.75 + GUESNON 5.00 + DELEN 15.75
(15, 1, 14.08),  -- G303-15 : SAMOURA 15.75 + ADMI 11.00 + GILET 15.50
(16, 1, 12.25),  -- G303-16 : LEBRETON 14.00 + LUYEYE POLYDOR 10.50
(17, 1, 13.00),  -- G303-17 : BOULLARD 14.50 + KADI 11.50
(18, 1, 12.33),  -- G303-18 : SIMON-JEAN 11.50 + MARTON 11.50 + FLEURY 14.00
(19, 1, 13.50),  -- G303-19 : ANDOUARD 13.25 + BOUQUET 14.25 + JEULAND 13.25 + TRELLE 13.25

-- ── SAé 5.01 (id_sae = 2) ────────────────────────────────────
(20, 2, 11.55),  -- G501-01 : BEN BOUBAKER 10.05 + BAL 13.05
(21, 2, 11.55),  -- G501-02 : HOUNSOU 12.30 + MHOUMADI 10.80
(22, 2, 12.50),  -- G501-03 : BUHOT 12.00 + CHAPUT 12.375 + HAMON 13.125
(23, 2, 14.23),  -- G501-04 : VANDELET 15.00 + CHTIOUI 13.45
(24, 2, 11.70),  -- G501-05 : GONCALVES 11.70 + PEREIRA 11.70
(25, 2, 10.68),  -- G501-06 : MAHJOUB 10.70 + KONATE 10.65
(26, 2, 10.40),  -- G501-07 : KECKET-BAKER 10.40 + MANSOIBOU 10.40
(27, 2, 13.13),  -- G501-08 : CHEURFA 15.05 + BRUSA 11.30 + CARPENTIER 13.05
(28, 2, 12.25),  -- G501-09 : MONLAY (exclu) + ZAIEM 12.75 + BROUILLARD 11.75
(29, 2, 15.25),  -- G501-10 : BUISSET 15.25 + HENRIQUES MATEUS (exclu)
(30, 2, 10.70),  -- G501-11 : THIABAS HOULAI 10.95 + EDDABACHI 10.45
(31, 2, 11.95),  -- G501-12 : KOUASSI 11.70 + PEREZ SANCHEZ 12.20
(32, 2, 13.68),  -- G501-13 : THEVAKUMAR 15.55 + VIGNESWARAN 11.80
(33, 2, 13.18),  -- G501-14 : SALAOUDINE 13.80 + BAER 12.55
(34, 2, 12.09),  -- G501-15 : LAWSON 13.275 + VEOPRASEUTH 10.90
(35, 2, 13.40),  -- G501-16 : ZENATI 12.65 + PREVOST 14.15
(36, 2, 12.18),  -- G501-17 : VASANTHAN 11.55 + KRISHNAKUMAR 12.80
(37, 2, 10.55),  -- G501-18 : ANTUNES 10.80 + RANNOU 10.30
(38, 2, 17.33),  -- G501-19 : BALDINETTI 15.95 + DINH 18.70
(39, 2, 14.45),  -- G501-20 : ROURE 15.45 + SEGHIRI 13.45
(40, 2, 13.93),  -- G501-21 : CAMELIN 14.05 + RAKOTOMAVO 13.80
(41, 2, 14.36);  -- G501-22 : SOM 15.175 + LOPERE 13.55


-- ============================================================
-- IMAGES
-- ============================================================
-- On utilise picsum.photos : images aléatoires stables par seed.
-- Format : https://picsum.photos/seed/MOT_CLE/LARGEUR/HAUTEUR
-- Chaque seed = URL stable et reproductible, pas besoin de compte.
--
-- COMMENT AJOUTER TES PROPRES IMAGES ?
-- Option 1 — URL publique (recommandée) :
--   Héberge tes captures sur Imgur, Cloudinary, ou ton propre serveur,
--   puis insère l'URL directe dans le champ `url`.
--   Ex: 'https://i.imgur.com/XXXX.jpg'
--
-- Option 2 — Depuis le back-end Spring Boot :
--   Ajoute un endpoint POST /api/images/upload (multipart/form-data)
--   qui stocke les fichiers dans /uploads et retourne l'URL publique.
--   Ex: 'http://localhost:8080/uploads/mon-image.jpg'
--
-- Option 3 — Pour du vrai contenu statique en dev :
--   Place tes images dans docker/images/ et monte le volume dans docker-compose :
--   volumes:
--     - ./images:/app/static/images
--   Puis accède à : 'http://localhost:8080/static/images/mon-image.jpg'
-- ============================================================

-- Images SAé 3.03 (data viz)
INSERT INTO image (url, legende, ordre, id_sae) VALUES
('https://picsum.photos/seed/dataviz-dashboard/800/600',   'Dashboard principal — visualisations multiples',  1, 1),
('https://picsum.photos/seed/dataviz-chart/800/600',       'Graphique en barres — données par catégorie',     2, 1),
('https://picsum.photos/seed/dataviz-map/800/600',         'Carte choroplèthe — répartition géographique',    3, 1),
('https://picsum.photos/seed/dataviz-mobile/800/600',      'Vue responsive sur mobile',                       4, 1),
('https://picsum.photos/seed/dataviz-timeline/800/600',    'Timeline interactive',                            5, 1),
('https://picsum.photos/seed/dataviz-donut/800/600',       'Diagramme circulaire',                            6, 1);

-- Images SAé 5.01 (app mobile / SI)
INSERT INTO image (url, legende, ordre, id_sae) VALUES
('https://picsum.photos/seed/sae501-accueil/800/600',      'Écran d''accueil de l''application',              1, 2),
('https://picsum.photos/seed/sae501-liste/800/600',        'Liste des SAé — interface principale',            2, 2),
('https://picsum.photos/seed/sae501-detail/800/600',       'Page détail d''une SAé',                         3, 2),
('https://picsum.photos/seed/sae501-ajout/800/600',        'Formulaire d''ajout de SAé',                     4, 2),
('https://picsum.photos/seed/sae501-schema/800/600',       'Schéma d''architecture — back-end Spring Boot',  5, 2),
('https://picsum.photos/seed/sae501-bdd/800/600',          'Modèle de base de données',                      6, 2),
('https://picsum.photos/seed/sae501-figma/800/600',        'Maquettes Figma — parcours utilisateur',          7, 2);

-- ============================================================
-- BURKINA SOLAR ENERGY — Schéma de base de données
-- Version 1.0 — Juin 2026
-- ============================================================

USE bse_db;

-- ─── 1. USERS (Administrateurs backoffice) ───────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nom           VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 2. CATEGORIES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nom        VARCHAR(100)  NOT NULL,
  slug       VARCHAR(120)  NOT NULL UNIQUE,
  image      VARCHAR(255)  DEFAULT NULL,
  ordre      INT           DEFAULT 0,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 3. PRODUCTS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(150)  NOT NULL,
  description TEXT          DEFAULT NULL,
  prix        DECIMAL(10,0) NOT NULL,
  image       VARCHAR(255)  DEFAULT NULL,
  category_id INT           NOT NULL,
  visible     TINYINT(1)    DEFAULT 1,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 4. PROJECTS (Références réalisées) ──────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  titre       VARCHAR(200)  NOT NULL,
  description TEXT          DEFAULT NULL,
  image       VARCHAR(255)  DEFAULT NULL,
  date        DATE          DEFAULT NULL,
  visible     TINYINT(1)    DEFAULT 1,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 5. SITE_CONTENT (Textes éditables du site) ──────────────
CREATE TABLE IF NOT EXISTS site_content (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  cle        VARCHAR(100)  NOT NULL UNIQUE,
  valeur     TEXT          DEFAULT NULL,
  updated_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─── 6. MESSAGES (Formulaire de contact) ─────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nom        VARCHAR(100)  NOT NULL,
  telephone  VARCHAR(20)   DEFAULT NULL,
  email      VARCHAR(150)  DEFAULT NULL,
  adresse    VARCHAR(255)  DEFAULT NULL,
  message    TEXT          NOT NULL,
  lu         TINYINT(1)    DEFAULT 0,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DONNÉES DE DÉMONSTRATION
-- ============================================================

-- ─── ADMIN USER (mot de passe : Admin2026!) ──────────────────
INSERT INTO users (nom, email, password_hash) VALUES (
  'Administrateur BSE',
  'admin@burkina-solar.com',
  '$2b$10$2LMQAh220mZF.Lg6v5vsj.Ep15ej3Bi1/onULQMJov48bQAsBfQdm'
);

-- ─── CATEGORIES ──────────────────────────────────────────────
INSERT INTO categories (nom, slug, ordre) VALUES
  ('Panneaux Solaires',         'panneaux-solaires',         1),
  ('Onduleurs',                 'onduleurs',                 2),
  ('Batteries',                 'batteries',                 3),
  ('Accessoires Solaires',      'accessoires-solaires',      4),
  ('Téléphones',                'telephones',                5),
  ('Tablettes',                 'tablettes',                 6),
  ('Accessoires Électroniques', 'accessoires-electroniques', 7);

-- ─── PRODUCTS ────────────────────────────────────────────────
INSERT INTO products (nom, description, prix, category_id, visible) VALUES
  ('Panneau Solaire 100W Monocristallin', 'Panneau haute performance pour usage résidentiel et professionnel. Rendement optimal même par temps nuageux.', 45000, 1, 1),
  ('Panneau Solaire 200W Polycristallin', 'Idéal pour les installations moyennes. Excellente durabilité et résistance aux intempéries.', 85000, 1, 1),
  ('Panneau Solaire 400W Monocristallin', 'Panneau grande puissance pour installations industrielles et agricoles.', 160000, 1, 1),
  ('Onduleur Hybride 3KVA', 'Onduleur hybride avec régulateur MPPT intégré. Compatible batteries lithium et plomb.', 250000, 2, 1),
  ('Onduleur Pur Sinus 1KVA', 'Onduleur pur sinus pour protection des appareils sensibles. Idéal pour la maison.', 95000, 2, 1),
  ('Batterie Lithium 100Ah 12V', 'Batterie lithium longue durée. Plus de 2000 cycles de charge. Légère et performante.', 180000, 3, 1),
  ('Batterie AGM 200Ah 12V', 'Batterie sans entretien, idéale pour les systèmes solaires résidentiels.', 120000, 3, 1),
  ('Câble Solaire 6mm² (rouleau 100m)', 'Câble solaire certifié TÜV, résistant aux UV et aux intempéries.', 35000, 4, 1),
  ('Régulateur MPPT 40A', 'Régulateur à technologie MPPT pour une charge optimale des batteries.', 55000, 4, 1),
  ('Samsung Galaxy A35 5G', 'Écran AMOLED 6.6", 128Go, triple caméra 50MP. Parfait pour un usage quotidien.', 185000, 5, 1),
  ('Tecno Spark 20 Pro', 'Smartphone 4G, écran 6.78", batterie 5000mAh. Rapport qualité/prix exceptionnel.', 95000, 5, 1),
  ('iPad 10ème Génération', 'Tablette Apple 10.9", puce A14, idéale pour le travail et le divertissement.', 380000, 6, 1),
  ('Chargeur Solaire Portable 20W', 'Chargeur solaire pliable, compatible tous smartphones. Idéal pour les déplacements.', 18000, 7, 1);

-- ─── PROJECTS ────────────────────────────────────────────────
INSERT INTO projects (titre, description, date, visible) VALUES
  ('Installation solaire 5KW — Résidence Ouaga 2000', 'Installation complète d\'un système solaire hybride 5KW pour une villa à Ouaga 2000. Comprend 12 panneaux 400W, onduleur hybride et banc de batteries lithium.', '2024-03-15', 1),
  ('Électrification école primaire — Koudougou', 'Projet d\'électrification solaire pour une école primaire de 8 classes à Koudougou. Éclairage complet et alimentation des équipements pédagogiques.', '2024-06-20', 1),
  ('Système solaire agricole — Bobo-Dioulasso', 'Installation d\'un système de pompage solaire pour irrigation agricole. Puissance totale 10KW, couvrant 5 hectares de cultures maraîchères.', '2024-09-10', 1),
  ('Boutique solaire connectée — Pissy', 'Équipement solaire complet pour une boutique commerciale avec climatisation, éclairage LED et système de surveillance.', '2025-01-05', 1),
  ('Mini-centrale solaire — Village de Saponé', 'Installation d\'une mini-centrale solaire communautaire de 20KW pour alimenter 50 foyers du village de Saponé.', '2025-04-18', 1);

-- ─── SITE CONTENT ────────────────────────────────────────────
INSERT INTO site_content (cle, valeur) VALUES
  ('hero_titre_1',        'L\'Énergie Solaire au Service du Burkina'),
  ('hero_sous_titre_1',   'Des solutions solaires fiables et accessibles pour votre maison et votre entreprise'),
  ('hero_titre_2',        'Votre Spécialiste en Énergie Renouvelable'),
  ('hero_sous_titre_2',   'Panneaux, onduleurs, batteries — tout pour votre autonomie énergétique'),
  ('hero_titre_3',        'Électronique Grand Public de Qualité'),
  ('hero_sous_titre_3',   'Téléphones, tablettes et accessoires aux meilleurs prix à Ouagadougou'),
  ('slogan',              'L\'énergie du soleil, la force du Burkina'),
  ('about_titre',         'Qui sommes-nous ?'),
  ('about_texte',         'Burkina Solar Energy (BSE) est une entreprise burkinabè spécialisée dans la vente et l\'installation de matériel d\'énergie solaire et de produits électroniques. Basée à Ouagadougou, BSE s\'engage à offrir des solutions énergétiques durables et accessibles à tous les Burkinabè.'),
  ('contact_telephone',   '+226 00 00 00 00'),
  ('contact_email',       'contact@burkina-solar.com'),
  ('contact_adresse',     'Ouagadougou, Burkina Faso — Secteur 15, Rue des Entrepreneurs'),
  ('whatsapp_number',     '22600000000'),
  ('compteur_clients',    '500'),
  ('compteur_projets',    '120'),
  ('compteur_experience', '8');
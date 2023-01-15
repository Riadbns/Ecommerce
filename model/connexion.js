import { existsSync } from "fs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

/**
 * Constante indiquant si la base de données existe au démarrage du serveur
 * ou non.
 */
const IS_NEW = !existsSync(process.env.DB_FILE);

/**
 * Crée une base de données par défaut pour le serveur. Des données fictives
 * pour tester le serveur y ont été ajouté.
 */
const createDatabase = async (connectionPromise) => {
  let connection = await connectionPromise;

  await connection.exec(
    `CREATE TABLE IF NOT EXISTS type_utilisateur(
            id_type_utilisateur INTEGER PRIMARY KEY,
            type TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS utilisateur(
            id_utilisateur INTEGER PRIMARY KEY,
            id_type_utilisateur INTEGER NOT NULL,
            courriel TEXT NOT NULL UNIQUE,
            mot_passe TEXT NOT NULL,
            prenom TEXT NOT NULL,
            nom TEXT NOT NULL,
            CONSTRAINT fk_type_utilisateur 
                FOREIGN KEY (id_type_utilisateur)
                REFERENCES type_utilisateur(id_type_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS cours(
            id_cours INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            description TEXT NOT NULL,
            capacite INTEGER NOT NULL,
            date_debut INTEGER NOT NULL,
            nb_cours INTEGER NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS cours_utilisateur(
            id_cours INTEGER,
            id_utilisateur INTEGER,
            PRIMARY KEY (id_cours, id_utilisateur),
            CONSTRAINT fk_cours_utilisateur 
                FOREIGN KEY (id_cours)
                REFERENCES cours(id_cours) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            CONSTRAINT fk_utilisateur_cours 
                FOREIGN KEY (id_utilisateur)
                REFERENCES utilisateur(id_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        INSERT INTO type_utilisateur (type) VALUES 
            ('regulier'),
            ('administrateur');

        INSERT INTO utilisateur (id_type_utilisateur, courriel, mot_passe, prenom, nom) VALUES 
            (2, 'admin@admin.com', 'admin', 'Admin', 'Admin'),
            (1, 'john_doe@gmail.com', 'passw0rd', 'John', 'Doe'),
            (1, 'sera@gmail.com', 'passw0rd', 'Seraphina', 'Lopez'),
            (1, 'arlo_shield@gmail.com', 'passw0rd', 'Arlo', 'Shield'),
            (1, 'blyke_ray@gmail.com', 'passw0rd', 'Blyke', 'Leclerc'),
            (1, 'remi_fast@gmail.com', 'passw0rd', 'Remi', 'Smith'),
            (1, 'isen_radar@gmail.com', 'passw0rd', 'Isen', 'Turner'),
            (1, 'elaine_doc@gmail.com', 'passw0rd', 'Elaine', 'Nelson'),
            (1, 'zeke_the_form@gmail.com', '1234', 'Zeke', 'Anderson');
            
            INSERT INTO cours (nom, date_debut, nb_cours, capacite, description) VALUES 
            ('Sécurité informatique', 1662508800000, 10, 12, 'Ce programme vise à former des personnes désirant se lancer en sécurité informatique. À la fin de ce programme, l''étudiant sera en mesure d’effectuer toutes les opérations nécessaires afin de sécuriser un système informatique existant.'),
            ('Maintenance informatique', 1662681600000, 10, 24,'Dans cette formation vous : Explorez le matériel informatique et découvrez les subtilités des systèmes d''exploitation.
            Explorez les systèmes informatiques et les réseaux les plus récents.En savoir plus sur la sécurité informatique et réseau.
            Assemblez et maintenez des systèmes qui permettront aux utilisateurs d’activer leurs activités créatives, commerciales et de communication.
             Cette formation vous aidera à débuter une carrière dans le support technique au sein des entreprises.'),
            ('Gestion de projet informatique', 1661522400000, 8, 20,'Ce cours fortement axé sur la pratique et inspiré des meilleures pratiques de l''industrie s''adresse à ceux qui désirent mieux comprendre comment mettre en application les outils, techniques et méthodes les plus utiles à la gestion de projets, et ce, dans un contexte de projet informatique.'),
            ('Gestion de réseaux informatiques ', 1662418800000, 15, 10,'Ce programme vise la formation d''administrateurs de réseaux informatiques qui travailleront au sein d''entreprise qui possèdent leur propre service informatique ou,à titre de consultant, dans différentes entreprises.'),
            ('Installation et administration de réseaux', 1662465600000, 15, 25, 'La formation Installation et administration de réseaux offre aux étudiants la possibilité, grâce aux technologies Cisco et Microsoft, d’approfondir leurs aptitudes et leurs connaissances informatiques pour le développement et la gestion des applications de réseaux.'),
            ('Conception web', 1662588000000, 5, 15, 'Ce programme permettant d’acquérir les compétences pour intervenir tout au long du processus de production d’un site Web et de ses interfaces de programmation. On y apprend entre autres à assurer des tâches variées telles que l’analyse d’un devis de projet, la planification des tâches, la conception et la programmation des interfaces interactives, 
            la programmation des fonctionnalités du serveur ainsi que l’utilisation de base de données en ligne.'),
            ('Cloud computing', 1667257200000, 1, 200, 'Des cours de formation Cloud Computing locaux et sous la direction d''un instructeur démontrent, à travers la pratique, les principes fondamentaux de l''informatique en nuage et comment tirer parti du cloud computing ');
        
      INSERT INTO cours_utilisateur (id_cours, id_utilisateur) VALUES 
            (1, 5),
            (1, 6),
            (1, 7),
            (2, 2),
            (2, 3),
            (3, 9),
            (6, 4),
            (6, 5),
            (6, 6),
            (6, 7),
            (6, 8),
            (7, 2),
            (7, 3),
            (7, 4),
            (7, 5),
            (7, 6),
            (7, 7),
            (7, 8);`
  );

  return connection;
};

// Base de données dans un fichier
let connectionPromise = open({
  filename: process.env.DB_FILE,
  driver: sqlite3.Database,
});

// Si le fichier de base de données n'existe pas, on crée la base de données
// et on y insère des données fictive de test.
if (IS_NEW) {
  connectionPromise = createDatabase(connectionPromise);
}

export default connectionPromise;

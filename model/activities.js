import connectionPromise from "./connexion.js";
//*************PAGE DE VISUALISATION *********** */

//Lister toute les activiities qui existe
export async function getActivities() {
  try {
    let connexion = await connectionPromise;
    let resultat = await connexion.all(
      "SELECT * FROM cours  order by id_cours"
    );

    return resultat;
  } catch (error) {
    console.log(error);
  }
}

//S'inscrire a une activite

export async function sinscrireCours(idcour, courriel) {
  try {
    let connexion = await connectionPromise;

    let resultat = await connexion.run(
      ` insert into cours_utilisateur(id_cours,id_utilisateur) 
values(?,(select id_utilisateur from utilisateur
           where   courriel=?)    )
    `,
      [idcour, courriel]
    );
  } catch (error) {
    // Si on détecte une erreur de conflit, on retourne false pour
    // retourner une erreur 409
    if (error.code === "SQLITE_CONSTRAINT") {
      return false;
    } else {
      console.log(error);
    }
  }
}

//**************UTILISATEUR  ************** */

//Lister toutes les activities d'un utilisateur
export async function getActivitiesUser(courriel) {
  try {
    let connexion = await connectionPromise;
    let resultat = await connexion.all(
      `SELECT * FROM cours
                                    INNER JOIN cours_utilisateur
                                    ON 
                                    id_utilisateur = (select id_utilisateur from utilisateur where courriel= ? )and cours_utilisateur.id_cours=cours.id_cours`,
      [courriel]
    );

    return resultat;
  } catch (error) {
    response.status(409).end();
  }
}
//Desabonner d'une activitie
export async function DesabonnerCours(idcour, courriel) {
  let connexion = await connectionPromise;
  let resultat = await connexion.run(
    `DELETE FROM cours_utilisateur
                                  WHERE 
                                      id_cours= ? and id_utilisateur=(select id_utilisateur from utilisateur
                                      where   courriel=?)`,
    [idcour, courriel]
  );
}
//**********COMPTE ADMIN************* */

//Supprimer une activité de la base de données
export async function supprimActivite(idcour) {
  try {
    let connexion = await connectionPromise;
    let resultat = await connexion.run(
      `DELETE FROM cours
                                  WHERE 
                                     id_cours= ? `,
      [idcour]
    );
  } catch (error) {
    console.log(error);
  }
}
//trouver tous les utilisateur inscrit a 1 cours
export async function getUseraActi(id_cours) {
  try {
    let connexion = await connectionPromise;
    let resultat = connexion.all(
      `Select nom, prenom, utilisateur.id_utilisateur from utilisateur
    inner join cours_utilisateur
    on utilisateur.id_utilisateur=cours_utilisateur.id_utilisateur
    and cours_utilisateur.id_cours=? `,
      [id_cours]
    );
    return resultat;
  } catch (error) {
    console.log(error);
  }
}

//Ajout d'une activité
export async function ajouterActivite(
  nom,
  dateD,
  nbreCour,
  capacite,
  description
) {
  try {
    let connexion = await connectionPromise;
    let resultat = await connexion.run(
      `INSERT INTO cours (nom, date_debut, nb_cours, capacite, description) 
                                    VALUES 
                                    (?, ?, ?, ?, ?) `,
      [nom, dateD, nbreCour, capacite, description]
    );
  } catch (error) {
    console.log(error);
  }
}
//Recuperer le dernier id du cours de la base de donnée
export async function getId() {
  let connexion = await connectionPromise;
  let resultat = connexion.all(`SELECT MAX(id_cours) FROM cours LIMIT 1`);
  return resultat;
}

//Requete nombre d'inscription:
export async function nombreInscriActivitie(id_cours) {
  try {
    let connection = await connectionPromise;
    let resultat = await connection.all(
      "select count(id_utilisateur) from cours_utilisateur where id_cours=?",
      [id_cours]
    );
    return resultat;
  } catch (error) {
    console.log(error);
  }
}

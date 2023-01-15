import connectionPromise from "./connexion.js";
import { hash } from "bcrypt";
//Page de creation de compte
export async function ajouteruser(nomUser, prenomUser, courriel, password) {
  let connexion = await connectionPromise;
  let passwordHash = await hash(password, 10);

  let resultat = await connexion.run(
    ` INSERT INTO utilisateur (id_type_utilisateur,nom,prenom,courriel,mot_passe)
                                    VALUES 
                                    (?, ?, ?, ?, ?) `,
    [1, nomUser, prenomUser, courriel, passwordHash]
  );
}

export async function getUserByCourriel(courriel) {
  let connexion = await connectionPromise;

  let user = await connexion.get(
    `SELECT  id_utilisateur, id_type_utilisateur,nom,prenom,courriel, mot_passe
    FROM utilisateur 
    WHERE courriel=?`,
    [courriel]
  );
  return user;
}

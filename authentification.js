import { compare } from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import { getUserByCourriel } from "./model/utilisateur.js";
// Configuration générale de la stratégie.
// On indique ici qu'on s'attends à ce que le client
// envoit un variable "courriel" et "password" au
// serveur pour l'authentification.
let config = {
  usernameField: "courriel",
  passwordField: "password",
};
// Configuration de quoi faire avec l'identifiant et password pour les valider
passport.use(
  new Strategy(config, async (courriel, password, done) => {
    // S'il y a une erreur avec la base de données,on retourne l'erreur au serveur
    try {
      // On va chercher l'utilisateur dans la base de données avec son courriel
      let user = await getUserByCourriel(courriel);
      // Si on ne trouve pas l'utilisateur, on retourne que l'authentification a échoué avec un message
      if (!user) {
        return done(null, false, { erreur: "erreur_courriel" });
      }
      // Si on a trouvé l'utilisateur, on compare son password avec celui envoyé au serveur.
      // On utilise une fonction de bcrypt pour le faire
      let valide = await compare(password, user.mot_passe);
      // Si password ne concorde pas, on
      // retourne que l'authentification a échoué avec un message
      if (!valide) {
        return done(null, false, { erreur: "erreur_password" });
      }

      // Si password concorde, on retourne l'information de l'utilisateur au serveur
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.courriel);
});

passport.deserializeUser(async (courriel, done) => {
  try {
    let user = await getUserByCourriel(courriel);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

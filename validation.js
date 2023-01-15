//******************************Validation Activite - Formulaire****************************************** */
//validation pour le nom d'activitie
const validateNomActivitie = (nomActivitie) => {
  return typeof nomActivitie === "string" && !!nomActivitie;
};
//validation pour la description d'activitie
const validateDescriptionActivitie = (descriptionActivitie) => {
  return (
    typeof descriptionActivitie === "string" &&
    !!descriptionActivitie &&
    descriptionActivitie.length >= 10 &&
    descriptionActivitie.length <= 500
  );
};
//validation pour la capacité d'activitie
const validateCapacite = (Capacite) => {
  if (Capacite === null) {
    return true;
  } else {
    return typeof Capacite === "number" && Capacite > 0 && Capacite <= 32;
  }
};
//validation pour le nombre d'activitie
const validateNbrActivitie = (nbrActivitie) => {
  if (nbrActivitie === null) {
    return true;
  } else {
    return (
      typeof nbrActivitie === "number" && nbrActivitie > 0 && nbrActivitie <= 12
    );
  }
};
//validation pour l'id
export const validateIdActivitie = (id) => {
  return typeof id === "number" && !!id;
};
//******************************Validation Creation utilisateur****************************************** */
// Retourne une valeur indiquant si le nom utilisateur en paramètre est valide
const validateNomUser = (nomUser) => {
  return typeof nomUser === "string" && !!nomUser;
};
// Retourne une valeur indiquant si le prenom utilisateur en paramètre est valide
const validatePrenomUser = (prenomUser) => {
  return typeof prenomUser === "string" && !!prenomUser;
};
// Retourne une valeur indiquant si le courriel en paramètre est valide
const validateCourriel = (courriel) => {
  return (
    typeof courriel === "string" &&
    !!courriel &&
    courriel.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  );
};
//Retourne une valeur indiquant si le mot de passe en paramètre est valide
const validatePassword = (password) => {
  return typeof password === "string" && !!password;
};

//retourner la validité de tout les champs d'activite
export const validateActivitie = (body) => {
  return (
    validateNomActivitie(body.nom) &&
    validateDescriptionActivitie(body.description) &&
    validateCapacite(body.capacite) &&
    validateNbrActivitie(body.nbreCour)
  );
};
//Retourne une valeur indiquant si tous les champs inserer dans le formulaire de creation user sont valide
export const validateCreationUser = (body) => {
  return (
    validateNomUser(body.nomUser) &&
    validatePrenomUser(body.prenomUser) &&
    validateCourriel(body.courriel) &&
    validatePassword(body.password)
  );
};
//Retourne une valeur indiquant si tous les champs inserer dans la connection user sont valide
export const validateConnexionUser = (body) => {
  return validateCourriel(body.courriel) && validatePassword(body.password);
};

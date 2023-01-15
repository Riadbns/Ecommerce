//Declaration des variables
let nomActivitieInserer = document.getElementById("nomActivitie");
let descriptionActivitieInserer = document.getElementById(
  "descriptionActivitie"
);
let capaciteActivitieInserer = document.getElementById("capaciteActivitie");
let nbrActivitie = document.getElementById("nbrActivitie");
let dateActivitie = document.getElementById("dateActivitie");
let form = document.getElementById("formActivitie");
let nomErreur = document.getElementById("nomError");
let descriptionErreur = document.getElementById("descriptionError");
let capaciteErreur = document.getElementById("capaciteError");
let nbrActiviteErreur = document.getElementById("nbrActiviteError");
let dateErreur = document.getElementById("dateError");

/** Élément HTML du bouton pour supprimer une activitie . */
let supprimerActivities = document.querySelectorAll("#supprimerActivitie");

//Fonction qui supprime Activitie dans le serveur
const suprimmerActivitie = (id) => {
  // Listeners pour le clic pour inscrire a une activitie
  let data = {
    idcour: parseInt(id),
  };
  fetch(`/admin`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};
supprimerActivities.forEach((activitie) => {
  activitie.addEventListener("click", (event) => {
    suprimmerActivitie(event.currentTarget.dataset.id);
    location.reload();
  });
});
//*****************************Validation du formulaire************************ */
//  Validation nom - formulaire
const validateNom = () => {
  if (nomActivitieInserer.validity.valid) {
    nomErreur.style.display = "none";
  } else if (nomActivitieInserer.validity.valueMissing) {
    nomErreur.innerText = "Erreur champs requis";
    nomErreur.style.display = "block";
  }
};
form.addEventListener("submit", validateNom);

// Validation description -formulaire
const validateDescription = () => {
  if (descriptionActivitieInserer.validity.valid) {
    descriptionErreur.style.display = "none";
  } else if (descriptionActivitieInserer.validity.valueMissing) {
    descriptionErreur.innerText = "Erreur champs requis";
    descriptionErreur.style.display = "block";
  }
};
form.addEventListener("submit", validateDescription);

//Validation capacité -formulaire
const validateCapacite = () => {
  if (capaciteActivitieInserer.validity.valid) {
    capaciteErreur.style.display = "none";
  } else if (capaciteActivitieInserer.validity.rangeUnderflow) {
    capaciteErreur.innerText = "doit être supérieure à 0";
    capaciteErreur.style.display = "block";
  } else if (capaciteActivitieInserer.validity.rangeOverflow) {
    capaciteErreur.innerText = "doit être inférieure ou égale à 32";
    capaciteErreur.style.display = "block";
  }
};
form.addEventListener("submit", validateCapacite);
//Validation nombre d'activité -formulaire
const validateNombreActivite = () => {
  if (nbrActivitie.validity.valid) {
    nbrActiviteErreur.style.display = "none";
  } else if (nbrActivitie.validity.rangeUnderflow) {
    nbrActiviteErreur.innerText = "doit être supérieure à 0";
    nbrActiviteErreur.style.display = "block";
  } else if (nbrActivitie.validity.rangeOverflow) {
    nbrActiviteErreur.innerText = "doit être inférieure ou égale à 12";
    nbrActiviteErreur.style.display = "block";
  }
};
form.addEventListener("submit", validateNombreActivite);

//Conversion de la date
const convertToMilliseconds = () => {
  let D = dateActivitie.value;
  const d = new Date(D);
  let time = d.getTime();
  return time;
};
//*********************Fonction Ajouter Activite coté serveur */
const AjouterActivitie = (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    return;
  }
  let data = {
    nom: String(nomActivitieInserer.value),
    dateD: convertToMilliseconds(),
    nbreCour: Number(nbrActivitie.value),
    capacite: Number(capaciteActivitieInserer.value),
    description: String(descriptionActivitieInserer.value),
  };
  fetch(`/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    nomActivitieInserer.value = "";
    nbrActivitie.value = "";
    capaciteActivitieInserer.value = "";
    descriptionActivitieInserer.value = "";
  }
};

form.addEventListener("submit", AjouterActivitie);

/***********************************Partie temps réel - Administrateur**************************** */
let source = new EventSource("/stream");
//1- Ajout d'une activite en temps rée;
source.addEventListener("add-Activitie", (event) => {
  let data = JSON.parse(event.data);
  form.addEventListener(
    "submit",
    AjouterActivitiesu(
      data.nom,
      data.dateD,
      data.nbreCour,
      data.capacite,
      data.description,
      data.id_cours
    )
  );
});
//2- La suppression d'une activite  en temps réel
source.addEventListener("sup-CoursM", (event) => {
  let data = JSON.parse(event.data);
  //Recuperer le input pour lequel on veut supprimer son parent
  let inputsupprimer = document.querySelector(
    `input[data-id="${data.id_cours}"]`
  );
  //Supprimer le div (parent)du inputsupprimer
  inputsupprimer.parentElement.remove();
});

//3- Ajout d'un utilisateur inscrit dans un cour en temps réel
source.addEventListener("add-CoursUser", (event) => {
  let data = JSON.parse(event.data);
  //Recuperation de div ou on va inserer le user, on récuperant le id de inputsupprimer
  let inputsupprimer = document.querySelector(
    `input[data-id="${data.id_cours}"]`
  );
  let div = inputsupprimer.parentElement;

  //Creation du p qui va contenir les information de utilisateur

  let userElement = document.createElement("p");
  //Ajouter un id
  userElement.setAttribute("id", "nomUser");
  userElement.setAttribute("data-id", `${data.id_user}`);
  userElement.innerHTML = `<span> * </span>${data.nom} ${data.prenom}`;
  //Insertion de utilisateur ajouter avant le bouton supprimer
  div.insertBefore(userElement, div.lastElementChild);
});

//4- Supression d'un utilisateur lors de desabonnement

source.addEventListener("desabonner-CourUser", (event) => {
  let data = JSON.parse(event.data);

  let inputsupprimer = document.querySelector(
    `input[data-id="${data.id_cours}"]`
  );
  //Récuper le div en question
  let div = inputsupprimer.parentElement;

  let p = div.querySelector(`p[data-id="${data.id_user}"]`);
  //Supprimer l'utilisateur qui a desabonner
  div.removeChild(p);
});

//La fonction qui ajoute une activite cote client en temps réel
const AjouterActivitiesu = (
  nom,
  dateD,
  nb_cours,
  capacite,
  description,
  id_cours
) => {
  //Pour Ajouter une activité il faut ajouter un div a la page
  let div = document.createElement("div");
  div.className = "card";

  // Ajout du nom de l'activite
  let nomElement = document.createElement("h2");
  //Attribuer un id
  nomElement.setAttribute("id", "activitie");
  nomElement.innerText = nom;
  div.appendChild(nomElement);

  // Ajout de la description de l'activite
  let descElement = document.createElement("p");
  descElement.setAttribute("id", "description");
  descElement.innerHTML = `<span>discription: </span> ${description}`;
  div.appendChild(descElement);

  // Ajout de la capacité de l'activite
  let capacElement = document.createElement("p");
  capacElement.setAttribute("id", "capacite");
  capacElement.innerHTML = `<span>Capacité: </span> ${capacite}`;
  div.appendChild(capacElement);

  // Ajout du nombre de cours de l'activite
  let nbrCoursElement = document.createElement("p");
  nbrCoursElement.setAttribute("id", "nbCours");
  nbrCoursElement.innerHTML = `<span> Nombre de cours: </span> ${nb_cours}`;
  div.appendChild(nbrCoursElement);

  // Ajout du nombre inscrit de l'activite
  let nbreInscritElement = document.createElement("p");
  nbreInscritElement.setAttribute("id", "nbreInscrit");
  nbreInscritElement.innerHTML = `<span> Nombre de personne inscrit: </span>0/${capacite}`;
  div.appendChild(nbreInscritElement);

  // Ajout de la date de l'activite
  let dateElement = document.createElement("p");
  dateElement.setAttribute("id", "Date");
  dateElement.innerHTML = `<span> Date début: </span> ${afficheDAte(dateD)}`;
  div.appendChild(dateElement);

  // Ajout des nom des utilisateurs iscrit de l'activite
  let userElement = document.createElement("p");
  userElement.innerHTML = "les utilisateurs inscrits";
  div.appendChild(userElement);

  // Ajout du input de l'activite
  let submitElement = document.createElement("input");
  submitElement.setAttribute("id", "supprimerActivitie");
  submitElement.setAttribute("type", "submit");
  submitElement.setAttribute("data-id", id_cours);
  submitElement.setAttribute("value", "Supprimer");
  div.appendChild(submitElement);

  let maindiv = document.getElementById("wrapper");

  maindiv.insertBefore(div, maindiv.lastElementChild);
  submitElement.addEventListener("click", (event) => {
    suprimmerActivitie(event.currentTarget.dataset.id);
  });
};
//Fonction qui afffiche la date
const afficheDAte = (date) => {
  let d = new Date(date);
  return d.toLocaleDateString("fr-CA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

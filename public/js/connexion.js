//Declaraton des variables
let courrielInserer = document.getElementById("input-courriel");
let passwordInserer = document.getElementById("input-password");
let courrielError = document.getElementById("courrielErrorconn");
let passwordError = document.getElementById("passwordErrorconn");
let formulaire = document.getElementById("form-connexion");
let erreurConnexion = document.getElementById("erreurConn");
//Validation du courriel
const validateCourriel = () => {
  if (courrielInserer.validity.valid) {
    courrielError.style.display = "none";
  } else if (courrielInserer.validity.valueMissing) {
    courrielError.innerHTML = "Erreur Courriel requis";
    courrielError.style.display = "block";
  }
};
formulaire.addEventListener("submit", validateCourriel);
//Validation mot de passe
const validatePassword = () => {
  if (passwordInserer.validity.valid) {
    passwordError.style.display = "none";
  } else if (passwordInserer.validity.valueMissing) {
    passwordError.innerHTML = "Erreur mot de passe requis";
    passwordError.style.display = "block";
  }
};

formulaire.addEventListener("submit", validatePassword);
//Soumission
formulaire.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!formulaire.checkValidity()) {
    return;
  }

  const data = {
    courriel: courrielInserer.value,
    password: passwordInserer.value,
  };

  let response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    // Si l'authentification est réussi, on
    // redirige vers une autre page
    window.location.replace("/activitie");
  } else if (response.status === 401) {
    let info = await response.json();
    // Afficher erreur dans l'interface graphique
    erreurConnexion.innerHTML = "Erreur mot de passe ou courriel";
    erreurConnexion.style.display = "block";
    courrielInserer.value = "";
    passwordInserer.value = "";

    console.log(info);
  } else {
    // Afficher erreur dans l'interface graphique
    erreurConnexion.innerHTML = "Erreur inconnue";
    erreurConnexion.style.display = "block";
    console.log("Erreur inconnu");
  }
});

//Changement de couleur de nav de la page d'accueil
let accueil = document.getElementById("activities");
accueil.style.backgroundColor = "blue";
/** Élément HTML du bouton pour inscrire a une activitie. */

let inscrireActivities = document.querySelectorAll("#inscireActivitie");
//Fonction qui inscrit l'utilisateur au cour
const inscrireActivitie = (id, courriel) => {
  // Listeners pour le clic pour inscrire a une activitie
  let data = {
    idcour: id,
    courriel: courriel,
  };
  fetch(`/activitie`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  location.reload();
};
inscrireActivities.forEach((activitie) => {
  activitie.addEventListener("click", (event) => {
    inscrireActivitie(event.currentTarget.dataset.id);
  });
});

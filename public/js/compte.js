//Changement de couleur de nav de la page compte
let compte = document.getElementById("compte");
compte.style.backgroundColor = "blue";
/** Élément HTML du bouton pour désinscrire d'une activitie . */
let desinscrireActivities = document.querySelectorAll("#desinscireActivitie");

const desinscrireActivitie = (id, courriel) => {
  // Listeners pour le clic pour désinscrire a une activitie
  let data = {
    idcour: parseInt(id),
    courriel: courriel,
  };
  fetch(`/compte`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};
desinscrireActivities.forEach((activitie) => {
  activitie.addEventListener("click", (event) => {
    console.log(event.currentTarget.dataset.id);
    desinscrireActivitie(event.currentTarget.dataset.id);
    location.reload();
  });
});

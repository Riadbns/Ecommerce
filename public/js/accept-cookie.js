//Declaration des variables
let buttonCookie = document.getElementById("button-cookie");
let messageCookie = document.getElementById("message-cookie");
//Ajouter un evenenment au clique du bouton
if (buttonCookie) {
  buttonCookie.addEventListener("click", async () => {
    let response = await fetch("/accept", {
      method: "POST",
    });

    if (response.ok) {
      messageCookie.remove();
    }
  });
}

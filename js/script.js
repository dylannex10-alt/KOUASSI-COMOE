console.log("JS OK");


const conteneur = document.querySelector("#liste-projets");
let tousLesProjets = [];

function creerCarte(p) {
  return `
    <article class="col">
      <div class="card carte-projet h-100">
        <img src="${p.image}" class="card-img-top" alt="Capture de ${p.titre}">
        <div class="card-body">
          <h3 class="card-title h5">${p.titre}</h3>
          <p class="card-text">${p.description}</p>
          <a href="${p.lien}" class="btn btn-primary">Voir le projet</a>
        </div>
      </div>
    </article>`;
}

function afficherProjets(liste) {
  conteneur.innerHTML = liste.map(creerCarte).join("");
}

async function chargerProjets() {
  try {
    const reponse = await fetch("data/projets.json");
    const donnees = await reponse.json();
    tousLesProjets = donnees;
    afficherProjets(tousLesProjets);
  } catch (erreur) {
    console.error("Erreur de chargement :", erreur);
    conteneur.innerHTML = `<p class="text-danger">Impossible de charger les projets.</p>`;
  }
}

chargerProjets();


document.querySelector("#filtres").addEventListener("click", (event) => {
  const btn = event.target.closest("button");
  if (!btn) return;

  const categorie = btn.dataset.categorie;
  if (categorie === "tous") {
    afficherProjets(tousLesProjets);
  } else {
    afficherProjets(tousLesProjets.filter(p => p.categorie === categorie));
  }

  document.querySelectorAll("#filtres button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
});


const btnTheme = document.querySelector("#btn-theme");

function appliquerTheme(theme) {
  document.documentElement.setAttribute("data-bs-theme", theme);
  btnTheme.textContent = theme === "dark" ? "Mode clair" : "Mode sombre";
  localStorage.setItem("theme", theme);
}

appliquerTheme(localStorage.getItem("theme") || "light");

btnTheme.addEventListener("click", () => {
  const actuel = document.documentElement.getAttribute("data-bs-theme");
  appliquerTheme(actuel === "dark" ? "light" : "dark");
});


const btnTop = document.querySelector("#btn-top");

window.addEventListener("scroll", () => {
  btnTop.classList.toggle("d-none", window.scrollY <= 300);
});

btnTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


const form = document.querySelector("#form-contact");
const zoneMessage = document.querySelector("#form-message");

function marquer(champ, estValide) {
  champ.classList.toggle("is-valid", estValide);
  champ.classList.toggle("is-invalid", !estValide);
  return estValide;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const champNom = document.querySelector("#nom");
  const champEmail = document.querySelector("#email");
  const champMessage = document.querySelector("#message");
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nomOk = marquer(champNom, champNom.value.trim().length >= 2);
  const emailOk = marquer(champEmail, regexEmail.test(champEmail.value.trim()));
  const messageOk = marquer(champMessage, champMessage.value.trim().length >= 10);

  if (nomOk && emailOk && messageOk) {
    const nom = champNom.value.trim();            // on garde le nom AVANT reset()
    const alerte = document.createElement("div");
    alerte.className = "alert alert-success";
    alerte.textContent = `Merci ${nom}, votre message a bien été envoyé !`; // textContent : pas de risque XSS
    zoneMessage.replaceChildren(alerte);

    form.reset();
    [champNom, champEmail, champMessage].forEach(c => c.classList.remove("is-valid"));
  } else {
    zoneMessage.innerHTML = "";
  }
});

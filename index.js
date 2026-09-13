/* =========================================
   COMPTES
========================================= */

let comptes = JSON.parse(
    localStorage.getItem("comptes")
) || [];


/* =========================================
   CREER MANAGER PAR DEFAUT
========================================= */

if (comptes.length === 0) {

    comptes.push({
        id: 1,
        username: "manager",
        nomComplet: "Administrateur",
        role: "Manager",
        motDePasse: "1234"
    });

    localStorage.setItem(
        "comptes",
        JSON.stringify(comptes)
    );
}


/* =========================================
   ELEMENTS
========================================= */

const pageConnexion =
    document.getElementById("pageConnexion");

const application =
    document.getElementById("application");

const connexionForm =
    document.getElementById("connexionForm");

const messageConnexion =
    document.getElementById("messageConnexion");


/* =========================================
   VERIFIER SESSION
========================================= */

function verifierSession() {

    const session =
        JSON.parse(
            sessionStorage.getItem(
                "utilisateurConnecte"
            )
        );


    if (session) {

        afficherApplication(session);

    } else {

        pageConnexion.classList.remove("hidden");

        application.classList.add("hidden");

    }

}


/* =========================================
   AFFICHER APPLICATION
========================================= */

function afficherApplication(utilisateur) {

    pageConnexion.classList.add("hidden");

    application.classList.remove("hidden");


    const bienvenue =
        document.getElementById(
            "bienvenueUtilisateur"
        );


    if (bienvenue) {

        bienvenue.textContent =
            "Connecté en tant que : " +
            utilisateur.nomComplet +
            " — " +
            utilisateur.role;

    }


    const managerLink =
        document.getElementById(
            "managerLink"
        );


    if (managerLink) {

        if (
            utilisateur.role === "Manager"
        ) {

            managerLink.style.display =
                "inline-block";

        } else {

            managerLink.style.display =
                "none";

        }

    }

}


/* =========================================
   CONNEXION
========================================= */

connexionForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const username =
            document.getElementById(
                "username"
            ).value.trim();


        const password =
            document.getElementById(
                "password"
            ).value;


        const utilisateur =
            comptes.find(
                function(compte) {

                    return (
                        compte.username
                            .toLowerCase() ===
                        username.toLowerCase()

                        &&

                        compte.motDePasse ===
                        password
                    );

                }
            );


        /* Mauvais identifiants */

        if (!utilisateur) {

            messageConnexion.textContent =
                "Nom d'utilisateur ou mot de passe incorrect.";

            messageConnexion.className =
                "message error";

            return;

        }


        /* =================================
           CREER SESSION
        ================================= */

        sessionStorage.setItem(
            "utilisateurConnecte",
            JSON.stringify({
                id: utilisateur.id,
                username: utilisateur.username,
                nomComplet: utilisateur.nomComplet,
                role: utilisateur.role
            })
        );


        messageConnexion.textContent =
            "Connexion réussie.";

        messageConnexion.className =
            "message success";


        /* Afficher directement l'application */

        afficherApplication(
            utilisateur
        );

    }
);


/* =========================================
   DECONNEXION
========================================= */

const btnDeconnexion =
    document.getElementById(
        "btnDeconnexion"
    );


if (btnDeconnexion) {

    btnDeconnexion.addEventListener(
        "click",
        function() {

            sessionStorage.removeItem(
                "utilisateurConnecte"
            );

            location.reload();

        }
    );

}


/* =========================================
   RECHERCHE
========================================= */

const btnRecherche =
    document.getElementById(
        "btnRecherche"
    );


if (btnRecherche) {

    btnRecherche.addEventListener(
        "click",
        rechercher
    );

}


function rechercher() {

    const recherche =
        document.getElementById(
            "searchInput"
        )
        .value
        .toLowerCase()
        .trim();


    const resultat =
        document.getElementById(
            "resultatRecherche"
        );


    const personnes =
        JSON.parse(
            localStorage.getItem(
                "personnes"
            )
        ) || [];


    if (recherche === "") {

        resultat.innerHTML =
            "<p>Veuillez entrer une recherche.</p>";

        return;

    }


    const trouvees =
        personnes.filter(
            function(personne) {

                return (

                    String(
                        personne.nom || ""
                    )
                    .toLowerCase()
                    .includes(recherche)

                    ||

                    String(
                        personne.prenom || ""
                    )
                    .toLowerCase()
                    .includes(recherche)

                    ||

                    String(
                        personne.identite || ""
                    )
                    .toLowerCase()
                    .includes(recherche)

                    ||

                    String(
                        personne.telephone || ""
                    )
                    .toLowerCase()
                    .includes(recherche)

                );

            }
        );


    if (trouvees.length === 0) {

        resultat.innerHTML =
            "<p>Aucune personne trouvée.</p>";

        return;

    }


    resultat.innerHTML = "";


    trouvees.forEach(
        function(personne) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "resultat-personne";


            div.innerHTML = `

                <h3>
                    ${personne.nom || ""}
                    ${personne.prenom || ""}
                </h3>

                <p>
                    Carte :
                    ${personne.identite || ""}
                </p>

                <p>
                    Téléphone :
                    ${personne.telephone || ""}
                </p>

                <p>
                    Province :
                    ${personne.province || ""}
                </p>

                <p>
                    Commune :
                    ${personne.commune || ""}
                </p>

                <p>
                    Colline :
                    ${personne.colline || ""}
                </p>

                <p>
                    Sous-colline :
                    ${personne.sousColline || ""}
                </p>

            `;


            resultat.appendChild(div);

        }
    );

}


/* =========================================
   DEMARRER
========================================= */

verifierSession();
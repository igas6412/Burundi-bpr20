/* =========================================
   PROTECTION MANAGER
========================================= */

const session =
    JSON.parse(
        sessionStorage.getItem(
            "utilisateurConnecte"
        )
    );


if (!session) {

    window.location.href =
        "index.html";

}


if (session.role !== "Manager") {

    alert(
        "Accès réservé au Manager."
    );

    window.location.href =
        "index.html";

}


/* =========================================
   API
========================================= */

const API_URL =
    "https://TON-DOMAINE.com/api";


/* =========================================
   COMPTES UTILISATEURS
========================================= */

function chargerComptes() {

    const comptes =
        JSON.parse(
            localStorage.getItem(
                "comptes"
            )
        ) || [];


    const tbody =
        document.getElementById(
            "comptesBody"
        );


    const total =
        document.getElementById(
            "totalComptes"
        );


    total.textContent =
        comptes.length;


    tbody.innerHTML = "";


    comptes.forEach(
        function(compte) {

            const ligne =
                document.createElement(
                    "tr"
                );


            ligne.innerHTML = `

                <td>
                    ${compte.id}
                </td>

                <td>
                    ${compte.username}
                </td>

                <td>
                    ${compte.nomComplet}
                </td>

                <td>
                    ${compte.role}
                </td>

                <td>

                    <button
                        onclick="modifierCompte(${compte.id})"
                        class="btn-actualiser">

                        Modifier

                    </button>


                    <button
                        onclick="supprimerCompte(${compte.id})"
                        class="btn-deconnexion">

                        Supprimer

                    </button>

                </td>

            `;


            tbody.appendChild(
                ligne
            );

        }
    );

}


/* =========================================
   PERSONNES
========================================= */

async function chargerPersonnes() {

    try {

        const response =
            await fetch(
                `${API_URL}/personnes`
            );


        if (!response.ok) {

            throw new Error(
                "Erreur serveur"
            );

        }


        const personnes =
            await response.json();


        afficherPersonnes(
            personnes
        );


    } catch (error) {

        console.log(
            "API indisponible, utilisation des données locales."
        );


        const personnes =
            JSON.parse(
                localStorage.getItem(
                    "personnes"
                )
            ) || [];


        afficherPersonnes(
            personnes
        );

    }

}


/* =========================================
   AFFICHER PERSONNES
========================================= */

function afficherPersonnes(
    personnes
) {

    const tbody =
        document.getElementById(
            "tableBody"
        );


    const total =
        document.getElementById(
            "totalPersonnes"
        );


    tbody.innerHTML = "";


    total.textContent =
        personnes.length;


    if (
        personnes.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="12">

                    Aucune personne enregistrée.

                </td>

            </tr>

        `;

        return;

    }


    personnes.forEach(
        function(personne) {

            const ligne =
                document.createElement(
                    "tr"
                );


            ligne.innerHTML = `

                <td>
                    ${personne.id || ""}
                </td>

                <td>
                    ${personne.nom || ""}
                </td>

                <td>
                    ${personne.prenom || ""}
                </td>

                <td>
                    ${personne.sexe || ""}
                </td>

                <td>
                    ${personne.dateNaissance || ""}
                </td>

                <td>
                    ${personne.identite || ""}
                </td>

                <td>
                    ${personne.telephone || ""}
                </td>

                <td>
                    ${personne.province || ""}
                </td>

                <td>
                    ${personne.commune || ""}
                </td>

                <td>
                    ${personne.zone || ""}
                </td>

                <td>
                    ${personne.colline || ""}
                </td>

                <td>
                    ${personne.sousColline || ""}
                </td>

            `;


            tbody.appendChild(
                ligne
            );

        }
    );

}


/* =========================================
   MODIFIER COMPTE
========================================= */

function modifierCompte(id) {

    const comptes =
        JSON.parse(
            localStorage.getItem(
                "comptes"
            )
        ) || [];


    const compte =
        comptes.find(
            c =>
                String(c.id)
                === String(id)
        );


    if (!compte) {
        return;
    }


    const nouveauNom =
        prompt(
            "Nom complet:",
            compte.nomComplet
        );


    if (
        nouveauNom === null
    ) {
        return;
    }


    compte.nomComplet =
        nouveauNom.trim();


    localStorage.setItem(
        "comptes",
        JSON.stringify(
            comptes
        )
    );


    chargerComptes();

}


/* =========================================
   SUPPRIMER COMPTE
========================================= */

function supprimerCompte(id) {

    let comptes =
        JSON.parse(
            localStorage.getItem(
                "comptes"
            )
        ) || [];


    const compte =
        comptes.find(
            c =>
                String(c.id)
                === String(id)
        );


    if (!compte) {
        return;
    }


    if (
        compte.role === "Manager"
        &&
        comptes.filter(
            c =>
                c.role === "Manager"
        ).length === 1
    ) {

        alert(
            "Impossible de supprimer le dernier Manager."
        );

        return;

    }


    if (
        !confirm(
            "Voulez-vous supprimer " +
            compte.username +
            " ?"
        )
    ) {

        return;

    }


    comptes =
        comptes.filter(
            c =>
                String(c.id)
                !== String(id)
        );


    localStorage.setItem(
        "comptes",
        JSON.stringify(
            comptes
        )
    );


    chargerComptes();

}


/* =========================================
   CSV
========================================= */

function telechargerCSV() {

    const personnes =
        JSON.parse(
            localStorage.getItem(
                "personnes"
            )
        ) || [];


    if (
        personnes.length === 0
    ) {

        alert(
            "Aucune personne enregistrée."
        );

        return;

    }


    let csv =
        "ID,Nom,Prénom,Sexe,Date naissance,Carte identité,Téléphone,Province,Commune,Zone,Colline,Sous-colline,Adresse\n";


    personnes.forEach(
        function(p) {

            csv += [

                p.id,
                p.nom,
                p.prenom,
                p.sexe,
                p.dateNaissance,
                p.identite,
                p.telephone,
                p.province,
                p.commune,
                p.zone,
                p.colline,
                p.sousColline,
                p.adresse

            ]
            .map(
                function(value) {

                    return `"${String(
                        value || ""
                    ).replace(
                        /"/g,
                        '""'
                    )}"`;

                }
            )
            .join(",");


            csv += "\n";

        }
    );


    const fichier =
        new Blob(
            [
                "\ufeff" + csv
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            fichier
        );


    const lien =
        document.createElement(
            "a"
        );


    lien.href =
        url;


    lien.download =
        "liste_personnes.csv";


    document.body.appendChild(
        lien
    );


    lien.click();


    document.body.removeChild(
        lien
    );


    URL.revokeObjectURL(
        url
    );

}


/* =========================================
   DECONNEXION
========================================= */

document
    .getElementById(
        "btnDeconnexion"
    )
    .addEventListener(
        "click",
        function() {

            sessionStorage.removeItem(
                "utilisateurConnecte"
            );


            window.location.href =
                "index.html";

        }
    );


/* =========================================
   ACTUALISER
========================================= */

document
    .getElementById(
        "btnActualiser"
    )
    .addEventListener(
        "click",
        function() {

            chargerPersonnes();

            chargerComptes();

        }
    );


/* =========================================
   DEMARRAGE
========================================= */

chargerComptes();

chargerPersonnes();


/* =========================================
   ACTUALISATION AUTOMATIQUE
========================================= */

setInterval(
    chargerPersonnes,
    5000
);
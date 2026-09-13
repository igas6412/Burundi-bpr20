const API_URL = "https://TON-DOMAINE.com/api";


/* =========================================
   ENREGISTRER PERSONNE
========================================= */

async function enregistrerPersonne(personne) {

    try {

        const response = await fetch(
            `${API_URL}/personnes`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(personne)
            }
        );


        if (!response.ok) {
            throw new Error(
                "Erreur serveur"
            );
        }


        const resultat =
            await response.json();


        console.log(
            "Personne synchronisée automatiquement.",
            resultat
        );


        alert(
            "Personne enregistrée et synchronisée."
        );


    } catch (error) {

        console.error(error);

        /* Internet absent */

        let attente =
            JSON.parse(
                localStorage.getItem(
                    "syncAttente"
                )
            ) || [];


        attente.push(personne);


        localStorage.setItem(
            "syncAttente",
            JSON.stringify(attente)
        );


        alert(
            "Internet absent. La personne sera synchronisée automatiquement dès que la connexion revient."
        );

    }

}


/* =========================================
   SYNCHRONISATION AUTOMATIQUE
========================================= */

async function synchroniserTout() {

    if (!navigator.onLine) {
        return;
    }


    let attente =
        JSON.parse(
            localStorage.getItem(
                "syncAttente"
            )
        ) || [];


    if (attente.length === 0) {
        return;
    }


    const restantes = [];


    for (const personne of attente) {

        try {

            const response =
                await fetch(
                    `${API_URL}/personnes`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                personne
                            )
                    }
                );


            if (!response.ok) {

                restantes.push(
                    personne
                );

            }

        } catch (error) {

            restantes.push(
                personne
            );

        }

    }


    localStorage.setItem(
        "syncAttente",
        JSON.stringify(restantes)
    );


    if (restantes.length === 0) {

        console.log(
            "Synchronisation terminée."
        );

    }

}


/* =========================================
   INTERNET REVIENT
========================================= */

window.addEventListener(
    "online",
    function() {

        synchroniserTout();

    }
);


/* =========================================
   VERIFICATION AUTOMATIQUE
========================================= */

setInterval(
    synchroniserTout,
    10000
);


/* =========================================
   SYNCHRONISER AU DEMARRAGE
========================================= */

synchroniserTout();



/* =========================================
   DONNEES PROVINCES ET COMMUNES
========================================= */

const provincesEtCommunes = {

    buhumuza: [
        "Butaganzwa",
        "Butihinda",
        "Cankuzo",
        "Gisagara",
        "Gisuru",
        "Muyinga",
        "Ruyigi"
    ],

    bujumbura: [
        "Bubanza",
        "Bukinanyana",
        "Cibitoke",
        "Isare",
        "Mpanda",
        "Mugere",
        "Mugina",
        "Muhuta",
        "Mukaza",
        "Ntahangwa",
        "Rwibaga"
    ],

    burunga: [
        "Bururi",
        "Makamba",
        "Matana",
        "Musongati",
        "Nyanza",
        "Rumonge",
        "Rutana"
    ],

    butanyerera: [
        "Busoni",
        "Kayanza",
        "Kiremba",
        "Kirundo",
        "Matongo",
        "Muhanga",
        "Ngozi",
        "Tangara"
    ],

    gitega: [
        "Bugendana",
        "Gishubi",
        "Gitega",
        "Karusi",
        "Kiganda",
        "Muramvya",
        "Mwaro",
        "Nyabihanga",
        "Shombo"
    ]

};


/* =========================================
   ELEMENTS
========================================= */

const province =
    document.getElementById("province");

const commune =
    document.getElementById("commune");

const form =
    document.getElementById("personForm");


/* =========================================
   PROVINCE → COMMUNE
========================================= */

province.addEventListener(
    "change",
    function () {

        const provinceChoisie =
            this.value;

        commune.innerHTML =
            '<option value="">-- Choisir une commune --</option>';


        if (
            provinceChoisie === ""
        ) {
            return;
        }


        const communes =
            provincesEtCommunes[
                provinceChoisie
            ];


        communes.forEach(
            function (nomCommune) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    nomCommune;

                option.textContent =
                    nomCommune;


                commune.appendChild(
                    option
                );

            }
        );

    }
);


/* =========================================
   ENREGISTREMENT
========================================= */

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        let personnes =
            JSON.parse(
                localStorage.getItem(
                    "personnes"
                )
            ) || [];


        const personne = {

            id: Date.now(),

            nom:
                document.getElementById(
                    "nom"
                ).value.trim(),

            prenom:
                document.getElementById(
                    "prenom"
                ).value.trim(),

            sexe:
                document.getElementById(
                    "sexe"
                ).value,

            dateNaissance:
                document.getElementById(
                    "dateNaissance"
                ).value,

            identite:
                document.getElementById(
                    "identite"
                ).value.trim(),

            telephone:
                document.getElementById(
                    "telephone"
                ).value.trim(),

            province:
                province.value,

            commune:
                commune.value,

            zone:
                document.getElementById(
                    "zone"
                ).value.trim(),

            colline:
                document.getElementById(
                    "colline"
                ).value.trim(),

            sousColline:
                document.getElementById(
                    "sousColline"
                ).value.trim(),

            adresse:
                document.getElementById(
                    "adresse"
                ).value.trim()

        };


        personnes.push(
            personne
        );


        localStorage.setItem(
            "personnes",
            JSON.stringify(personnes)
        );


        document.getElementById(
            "message"
        ).textContent =
            "Personne enregistrée avec succès !";


        document.getElementById(
            "message"
        ).className =
            "message success";


        form.reset();


        commune.innerHTML =
            '<option value="">-- Choisir d\'abord une province --</option>';

    }
);


/* =========================================
   NOUVEAU
========================================= */

document
    .getElementById("btnNouveau")
    .addEventListener(
        "click",
        function () {

            form.reset();

            commune.innerHTML =
                '<option value="">-- Choisir d\'abord une province --</option>';

            document.getElementById(
                "message"
            ).textContent = "";

        }
    );


/* =========================================
   DECONNEXION
========================================= */

document
    .getElementById(
        "btnDeconnexion"
    )
    .addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "utilisateurConnecte"
            );

            window.location.href =
                "index.html";

        }
    );
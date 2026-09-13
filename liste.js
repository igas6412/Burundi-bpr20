let personnes =
    JSON.parse(
        localStorage.getItem("personnes")
    ) || [];


const tableBody =
    document.getElementById(
        "tableBody"
    );


function afficherPersonnes(
    liste = personnes
) {

    tableBody.innerHTML = "";


    document.getElementById(
        "totalPersonnes"
    ).textContent =
        liste.length;


    liste.forEach(function(p) {

        const ligne =
            document.createElement("tr");


        ligne.innerHTML = `

            <td>${p.id}</td>

            <td>${p.nom}</td>

            <td>${p.prenom}</td>

            <td>${p.sexe}</td>

            <td>${p.identite}</td>

            <td>${p.telephone}</td>

            <td>${p.province}</td>

            <td>${p.commune}</td>

            <td>${p.zone}</td>

            <td>${p.colline}</td>

            <td>${p.sousColline || ""}</td>

            <td>

                <button
                    class="btn btn-edit"
                    onclick="modifier(${p.id})"
                >
                    Modifier
                </button>

                <button
                    class="btn btn-delete"
                    onclick="supprimer(${p.id})"
                >
                    Supprimer
                </button>

            </td>
        `;


        tableBody.appendChild(
            ligne
        );

    });

}


/* RECHERCHE */

function rechercherDansListe() {

    const recherche =
        document.getElementById(
            "listeSearch"
        )
        .value
        .toLowerCase()
        .trim();


    const resultat =
        personnes.filter(function(p) {

            return (

                p.nom
                .toLowerCase()
                .includes(recherche)

                ||

                p.prenom
                .toLowerCase()
                .includes(recherche)

                ||

                p.identite
                .toLowerCase()
                .includes(recherche)

                ||

                p.telephone
                .toLowerCase()
                .includes(recherche)

                ||

                p.province
                .toLowerCase()
                .includes(recherche)

                ||

                p.commune
                .toLowerCase()
                .includes(recherche)

            );

        });


    afficherPersonnes(
        resultat
    );

}


/* MODIFIER */

function modifier(id) {

    const personne =
        personnes.find(
            p => p.id == id
        );


    if (!personne) return;


    localStorage.setItem(
        "personneModification",
        JSON.stringify(personne)
    );


    window.location.href =
        "inscription.html";

}


/* SUPPRIMER */

function supprimer(id) {

    const confirmation =
        confirm(
            "Voulez-vous supprimer cette personne ?"
        );


    if (!confirmation) return;


    personnes =
        personnes.filter(
            p => p.id != id
        );


    localStorage.setItem(
        "personnes",
        JSON.stringify(personnes)
    );


    afficherPersonnes();

}


afficherPersonnes();
document.addEventListener('DOMContentLoaded', function () {
    // deplacer le modal List
    const listModal = document.getElementById("listModal");

    window.addEventListener('click', function (event) {
        if (event.target === listModal) {
            listModal.style.display = "none"; 
        }
    });

    // Script pour la recherche des caisse dans la home page
    const inputRecherche = document.getElementById('recherche');
    const caisseOptions = document.querySelectorAll('.caisse-option');
    const noCaisseFoundMessage = document.getElementById('noCaisseFoundMessage');

    inputRecherche.addEventListener('input', function () {
        const rechercheValue = inputRecherche.value.toLowerCase();
        let caisseFound = false;

        caisseOptions.forEach(function (option) {
            const texteOption = option.textContent.toLowerCase();
            if (texteOption.includes(rechercheValue)) {
                option.style.display = 'block';
                caisseFound = true;
            } else {
                option.style.display = 'none';
            }
        });

        if (!caisseFound) {
            noCaisseFoundMessage.style.display = 'block';
        } else {
            noCaisseFoundMessage.style.display = 'none';
        }
    });

    window.addEventListener('beforeunload', function () {
        resetForm();
    });

    function resetForm() {
        const rechercheTraitement = document.getElementById('rechercheTraitement');
        const recherche = document.getElementById('recherche');
        const commentaireCloture = document.getElementById('commentaireCloture');
        const commentaireError = document.getElementById('commentaireError');
        rechercheTraitement.value = '';
        recherche.value = '';
        commentaireCloture.value = '';
        commentaireError.value = '';
    }

    // Script pour les options de filtre
    const scenarioBtn = document.getElementById('scenarioBtn');
    const caisseBtn = document.getElementById('caisseBtn');
    const poolBtn = document.getElementById('poolBtn');

    const scenarioCheckboxes = document.getElementById('scenarioCheckboxes');
    const caisseExploitCheckboxes = document.getElementById('caisseExploitCheckboxes');
    const poolVmCheckboxes = document.getElementById('poolVmCheckboxes');

    scenarioBtn.addEventListener('click', function () {
        // Afficher ou masquer les checkboxes en fonction de l'état actuel
        scenarioCheckboxes.style.display = (scenarioCheckboxes.style.display === 'block') ? 'none' : 'block';

        // Vous pouvez également masquer les autres options si nécessaire
        caisseExploitCheckboxes.style.display = 'none';
        poolVmCheckboxes.style.display = 'none';
    });

    // Vous pouvez ajouter des événements similaires pour les autres boutons si nécessaire
    caisseBtn.addEventListener('click', function () {
        caisseExploitCheckboxes.style.display = (caisseExploitCheckboxes.style.display === 'block') ? 'none' : 'block';
        scenarioCheckboxes.style.display = 'none';
        poolVmCheckboxes.style.display = 'none';
    });

    poolBtn.addEventListener('click', function () {
        poolVmCheckboxes.style.display = (poolVmCheckboxes.style.display === 'block') ? 'none' : 'block';
        scenarioCheckboxes.style.display = 'none';
        caisseExploitCheckboxes.style.display = 'none';
    });

    document.getElementById('arrow').addEventListener('click', function() {
        var container = document.getElementById('caisseScrollContainer');
        var itemHeight = container.scrollHeight / container.children.length;
        container.scrollTop += itemHeight;
    });

    var scrollInterval;

    document.getElementById('arrow').addEventListener('mousedown', function() {
        scrollInterval = setInterval(function() {
            var container = document.getElementById('caisseScrollContainer');
            var itemHeight = container.scrollHeight / container.children.length;
            container.scrollTop += itemHeight;
        }, 100); // Répéter toutes les 100 millisecondes (ajustez selon vos besoins)
    });
    
    document.getElementById('arrow').addEventListener('mouseup', function() {
        clearInterval(scrollInterval);
    });
    
    document.getElementById('arrow').addEventListener('mouseleave', function() {
        clearInterval(scrollInterval);
    });

});

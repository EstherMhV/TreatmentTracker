document.addEventListener("DOMContentLoaded", function() {
    // deplacer le modal Create
    const modal = document.getElementById("myModal");
    const saveButton = document.getElementById("saveButton");
    
    let isDragging = false;
    let offset = { x: 0, y: 0 };
    
    document.addEventListener("mouseleave", () => {
        if (isDragging) {
            isDragging = false;
            modal.style.cursor = "grab";
        }
    });
    
    modal.addEventListener("mousedown", (e) => {
        isDragging = true;
        offset.x = e.clientX - modal.getBoundingClientRect().left;
        offset.y = e.clientY - modal.getBoundingClientRect().top;
        modal.style.cursor = "grabbing";
    });
    
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        modal.style.left = e.clientX - offset.x + "px";
        modal.style.top = e.clientY - offset.y + "px";
    });
    
    document.addEventListener("mouseup", () => {
        isDragging = false;
        modal.style.cursor = "grab";
    });
    
    saveButton.addEventListener("click", (event) => {
        if (!validateForm()) {
            event.preventDefault();
        } else {
            modal.style.display = "none"; 
        }
    });
    

    function validateForm() {
        var valid = true;

        const caisse = document.getElementById("caisse");
        if (caisse.value === "Tous") {
            alert("Veuillez choisir une caisse de traitement.");
            valid = false;
        }

        if (caisseSelect.value === "Tous") {
            alert("Veuillez choisir une caisse exploitante.");
            valid = false;
        }
        
        if (poolSelect.value === "Tous") {
            alert("Veuillez choisir une pool.");
            valid = false;
        }

        const vmContainers = document.querySelectorAll('.vm-container');
        let totalSelectedVMs = 0;
        
        vmContainers.forEach(function (container) {
            const checkbox = container.querySelector('.vm-checkbox');
            if (checkbox) {
                totalSelectedVMs++;
            }
        });
        
        if (totalSelectedVMs === 0) {
            alert("Vous devez sélectionner au moins une VM.");
            valid = false;
        }

        if (scenarioSelect.value === "Tous") {
            alert("Veuillez choisir un scénario.");
            valid = false;
        }

        function isValidDateTime(dateTimeString) {
            // Format de date et heure local (ISO 8601)
            const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        
            // Vérifier si la chaîne de date correspond au format
            return dateTimeRegex.test(dateTimeString);
        }

        const dateDebut = document.getElementById("datedebut");
        const dateFin = document.getElementById("datefin");
        if (!isValidDateTime(dateDebut.value)) {
            alert("Veuillez entrer une date de début valide.");
            valid = false;
        }
    
        if (!isValidDateTime(dateFin.value)) {
            alert("Veuillez entrer une date de fin valide.");
            valid = false;
        }


        const processContainers = document.querySelectorAll('.process-container');
        let totalSelectedProcess = 0;
        
        processContainers.forEach(function (container) {
            const checkbox = container.querySelector('.process-checkbox');
            if (checkbox.checked) {
                totalSelectedProcess++;
            }
        });

       
        if (totalSelectedProcess === 0) {
            alert("Vous devez sélectionner au moins un process.");
            valid = false;
        }

        return valid; 
    }

    document.getElementById("nbredossier").addEventListener("input", function () {
        const nbredossier = this.value;
        if (nbredossier < 0 || nbredossier > 100000) {
            alert("Veuillez entrer une valeur 0 et 100 000.");
            this.value = "";
        }
    });

    const datedebutInput = document.getElementById("datedebut");
    const datefinInput = document.getElementById("datefin");

    datedebutInput.addEventListener("input", function () {
        const datedebut = new Date(datedebutInput.value);
        const datefin = new Date(datefinInput.value);

        if (isNaN(datedebut) || datedebut.getFullYear() < 2018 || datedebut.getFullYear() > 2043) {
            alert("La date de début est invalide.");
            datedebutInput.value = "";
        } else if (!isNaN(datefin) && datedebut > datefin) {
            alert("La date de début ne peut pas être supérieure à la date de fin.");
            datedebutInput.value = "";
        }
    });

    datefinInput.addEventListener("input", function () {
        const datedebut = new Date(datedebutInput.value);
        const datefin = new Date(datefinInput.value);

        if (isNaN(datefin) || datefin.getFullYear() < 2018 || datefin.getFullYear() > 2043) {
            alert("La date de fin est invalide.");
            datefinInput.value = "";
        } else if (!isNaN(datedebut) && datedebut > datefin) {
            alert("La date de fin ne peut pas être inférieure à la date de début.");
            datefinInput.value = "";
        }
    });


    function resetAllCheckboxes() {
        // Reset process checkboxes
        processCheckboxes1.forEach(function (checkbox) {
            checkbox.checked = false;
            checkbox.disabled = false;

        });
    
    
        // Reset VM checkboxes
        vmCheckboxes1.forEach(function (vmCheckbox) {
            vmCheckbox.checked = false;
            vmCheckbox.disabled = false;
        });
    
        // Recalculate estimated time after resetting checkboxes
        calculateEstimatedTime();
    }


    // Sélectionnez le sélecteur de caisse
    const caisseExploit = document.getElementById("caisse_exploit");

    caisseExploit.addEventListener("change", function() {
        poolSelect.value = 'Tous';

        allCheckboxesContainer.style.display = 'none';

        const selectedPoolId = poolSelect.value;

        // Parcourez les conteneurs VM et affichez-les en fonction de la caisse sélectionné
        vmContainers.forEach(function(container) {
            const vmPoolId = container.getAttribute("data-pool");

            if (selectedPoolId === vmPoolId) {
                container.style.display = "block";
            } else {
                container.style.display = "none";
            }
        });
    });


    // Sélectionnez le sélecteur de pool
    const poolSelect = document.getElementById("pool");

    // Sélectionnez les conteneurs VM
    const vmContainers = document.querySelectorAll(".vm-container");

 // Ajoutez un gestionnaire d'événements de changement au sélecteur de pool
    poolSelect.addEventListener("change", function() {
        const selectedPoolId = poolSelect.value;

        // Vérifiez si l'option "Choisir une pool" est sélectionnée
        if (poolSelect.value === 'Tous') {
            scenarioSelect.value = 'Tous';
            document.querySelector('#Scenario option[value="Tous"]').style.display = 'block';
        }

        // Parcourez les conteneurs VM et affichez-les en fonction du pool sélectionné
        vmContainers.forEach(function(container) {
            const vmPoolId = container.getAttribute("data-pool");

            if (selectedPoolId === vmPoolId) {
                container.style.display = "block";
            } else {
                container.style.display = "none";
            }
        });
    });
    


    // Sélectionnez le sélecteur de pool
    const scenarioSelect = document.getElementById("scenario");

    // Sélectionnez les conteneurs VM
    const processContainers = document.querySelectorAll(".process-container");

    // Ajoutez un gestionnaire d'événements de changement au sélecteur de pool
    scenarioSelect.addEventListener("change", function() {
        const selectedProcess = scenarioSelect.value;

        // Parcourez les conteneurs VM et affichez-les en fonction du pool sélectionné
        processContainers.forEach(function(container) {
            const scenarioId = container.getAttribute("data-scenario");

            if (selectedProcess === scenarioId) {
                container.style.display = "block";
            } else {
                container.style.display = "none";
            }
        });
        resetAllCheckboxes();
    });

    


    // Sélectionnez le sélecteur de caisse exploitante
    const caisseSelect = document.getElementById("caisse_exploit");

    // Sélectionnez les options de pool
    const poolOptions = document.querySelectorAll(".pool-option");

    // Ajoutez un gestionnaire d'événements de changement au sélecteur de caisse
    caisseSelect.addEventListener("change", function() {
        const selectedCaisseId = caisseSelect.value;

        // Parcourez les options de pool et affichez-les en fonction de la caisse sélectionnée
        poolOptions.forEach(function(option) {
            const poolCaisseId = option.getAttribute("data-caisse");

            if (selectedCaisseId === poolCaisseId) {
                option.style.display = "block"; 
            } else {
                option.style.display = "none";
            }
        });
    });


    // GESTIONNAIRE DES ÉVÉNEMENTS POUR LES CASES À COCHER DES PROCESSUS
    const processCheckboxes1 = document.querySelectorAll('.process-checkbox');
    const multiprocessDiv1 = document.querySelector('.multiprocess');
    const monoprocessDiv1 = document.querySelector('.monoprocess');
    const monoprocessCheckboxes1 = document.querySelectorAll('.monoprocess .process-checkbox');

    function toggleDivs() {
        const selectedScenario2 = scenarioSelect.options[scenarioSelect.selectedIndex].text;

        multiprocessDiv1.style.display = selectedScenario2.includes('PUMA') ? 'block' : 'none';
        monoprocessDiv1.style.display = selectedScenario2.includes('PUMA') ? 'none' : 'block';
        

    }

    toggleDivs();

    scenarioSelect.addEventListener('change', toggleDivs);


        // GESTIONNAIRE DE DES EVENEMENT DU CHOIX DE PROCESS 
    monoprocessCheckboxes1.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const currentProcessId1 = this.value;
            const vmContainers1 = document.querySelectorAll(`.monoprocess .vm-container[data-process="${currentProcessId1}"]`);

            if (this.checked) {

                vmContainers1.forEach(container => container.style.display = 'block');
                // Uncheck other monoprocess checkboxes based on the div
                monoprocessCheckboxes1.forEach(otherCheckbox => {
                    if (otherCheckbox !== this) {
                        otherCheckbox.checked = false;
                    }else {
                        vmContainers1.forEach(container => container.style.display = 'none');
                    }
        
                });
            }
        });
    });
    
    processCheckboxes1.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const processId1 = this.value;
            const vmContainers1 = document.querySelectorAll(`.vm-container[data-process="${processId1}"]`);
            const selectAllVMCheckbox1 = this.parentElement.querySelector('.allCheckboxes');
            const allVMCheckboxes1 = this.parentElement.querySelectorAll('.vm-checkbox');
    
            // Vérifie si au moins une VM est cochée dans le processus
            const isAnyVMChecked = Array.from(allVMCheckboxes1).some(vmCheckbox => vmCheckbox.checked);
    
            if (selectAllVMCheckbox1.checked) {
                allVMCheckboxes1.forEach(vmCheckbox => vmCheckbox.checked = true);
            }
    
            // Si la case à cocher est cochée, affichez les VMs du processus sélectionné
            if (this.checked) {
                vmContainers1.forEach(container => container.style.display = 'block');
            } else {
                // Réinitialisez les cases à cocher des VMs lorsque le processus est désélectionné
                if (!isAnyVMChecked) {
                    vmContainers1.forEach(container => {
                        container.style.display = 'none';
                        const vmCheckboxes = container.querySelectorAll('.vm-checkbox');
                        vmCheckboxes.forEach(vmCheckbox => vmCheckbox.checked = false);
                    });
                    calculateEstimatedTime(); // Recalculer le temps estimé
                } else {
                    // Empêche le décochage du processus si au moins une VM est cochée
                    this.checked = true;
                    alert("Veuillez décocher d'abord toutes les VMs associées avant de désélectionner le processus.");
                }
            }
        });
    });
    



    // GESTIONNAIRE DES ÉVÉNEMENTS POUR LES CASES À COCHER DES VM
    const vmCheckboxes1 = document.querySelectorAll('.vm-checkbox');
    vmCheckboxes1.forEach(vmCheckbox => {
        vmCheckbox.addEventListener('change', function () {
            const vmName = this.value;
            const otherVMCheckboxes = document.querySelectorAll(`.vm-checkbox[value="${vmName}"]:not(:checked)`);

            // Si la case à cocher est cochée
            if (this.checked) {
                otherVMCheckboxes.forEach(checkbox => checkbox.disabled = true);
            } else {
                // Si la case à cocher est décochée
                otherVMCheckboxes.forEach(checkbox => checkbox.disabled = false);
            }

            // Appel à calculateEstimatedTime seulement après avoir ajusté toutes les cases à cocher des VM
            setTimeout(calculateEstimatedTime, 0);
            console.log(calculateEstimatedTime());
        });
    });




    //CALCUL TEMPS DE TRAITEMENT
    // Sélectionnez les éléments du formulaire
    const nbreDossierInput = document.getElementById('nbredossier');
    const processCheckboxes = document.querySelectorAll('.process-checkbox');
    const vmCheckboxes = document.querySelectorAll('.vm-checkbox');

    const resultSpan = document.getElementById('result');
    const tempsTraitementContainer = document.getElementById('tempsTraitementContainer');
    const scenarioSelect1 = document.getElementById('scenario');
    const poolSelect1 = document.getElementById('pool');

    
    const allCheckboxes = document.getElementById('allCheckboxes');
    const poolDropdown = document.getElementById('pool');
    const allCheckboxesContainer = document.getElementById('allCheckboxesContainer');
    const selectedVMsByPool = {};

    

    
    // Add event listener for "Select All VM" checkbox
    allCheckboxes.addEventListener('change', function() {
        const processId = this.value;
        const vmCheckboxes = document.querySelectorAll(`.vm-container[data-pool="${processId}"] .vm-checkbox`);
        
        // Check or uncheck all VM checkboxes based on the state of the "Select All VM" checkbox
        vmCheckboxes.forEach(vmCheckbox => {
            vmCheckbox.checked = this.checked;
        });

        // Trigger the change event on VM checkboxes to recalculate the estimated time
        vmCheckboxes.forEach(vmCheckbox => {
            vmCheckbox.dispatchEvent(new Event('change'));
        });
    });

    // Écoutez les modifications de l'entrée de nbreDossier, des cases à cocher de process et de la sélection de scénario
    nbreDossierInput.addEventListener('input', calculateEstimatedTime);
    processCheckboxes.forEach(checkbox => checkbox.addEventListener('change', calculateEstimatedTime));
    vmCheckboxes.forEach(checkbox => checkbox.addEventListener('change', calculateEstimatedTime));
    scenarioSelect1.addEventListener('change', resetNbreDossierAndCalculate);
    poolSelect1.addEventListener('change', resetNbreDossierAndCalculate);

    function calculateEstimatedTime() {
        // Récupérez la valeur du champ nbreDossier
        const nbreDossierValue = parseInt(nbreDossierInput.value);

        // Vérifiez si le champ est vide, s'il n'y a aucun process sélectionné, ou si "Tous" est sélectionné pour le scénario
        const selectedProcesses = Array.from(processCheckboxes1).filter(checkbox => checkbox.checked);
        const selectedScenario = scenarioSelect1.value;
        const selectedPool = poolSelect1.value;

        const selectedVMs = Array.from(vmCheckboxes).filter(checkbox => checkbox.checked);
        const numberOfSelectedVMs = selectedVMs.length;
        const selectedPoolId = poolSelect1.value;
        selectedVMsByPool[selectedPoolId] = selectedVMs.map(vm => vm.value);

        const isAllCheckboxesVmChecked = allCheckboxes.checked;
        
        if (isNaN(nbreDossierValue) || nbreDossierValue <= 0 || selectedProcesses.length === 0 || selectedScenario === 'Tous' || selectedPool === 'Tous' || isAllCheckboxesVmChecked === 0 || numberOfSelectedVMs === 0) {
            resultSpan.textContent = ''; // Aucun process sélectionné ou champ vide, affichez rien
            document.getElementById('datefin').value = '';
            document.getElementById('datedebut').value = '';
            tempsTraitementContainer.style.display = 'none';
        } 
        else 
        {
            tempsTraitementContainer.style.display = 'block';

            // Calculate the total process time based on selected processes
            const totalProcessTime = selectedProcesses.reduce((total, checkbox) => {
                const tempsMinuteDossier = parseInt(checkbox.dataset.tempsminutedossier);
                return total + tempsMinuteDossier;
            }, 0);

            // Calculate the total estimated time by multiplying with the number of dossiers
            const totalEstimatedTimeInMinutes = totalProcessTime * nbreDossierValue;

            // Divide the total estimated time by the number of selected VMs
            const totalEstimatedTimePerVm = totalEstimatedTimeInMinutes / numberOfSelectedVMs;

            // Convert the totalEstimatedTime to hours
            const totalEstimatedTimeInHours = totalEstimatedTimePerVm / 60;

            // Update the end date based on the calculated totalEstimatedTimeInMinutes
            const currentDate = new Date();

            // Calculate the start date based on the current date
            const formattedStartDate = currentDate.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:mm

            // Set the value of the datedebut input field
            document.getElementById('datedebut').value = formattedStartDate;

            if (totalEstimatedTimeInHours > 24) {
                const days = Math.floor(totalEstimatedTimeInHours / 24);
                const remainingHours = totalEstimatedTimeInHours % 24;
                const minutes = (remainingHours % 1) * 60;
        
                if (minutes === 0) {
                    resultSpan.textContent = `${days} jour(s), ${Math.floor(remainingHours)} heure(s)`;
                } else {
                    resultSpan.textContent = `${days} jour(s), ${Math.floor(remainingHours)} heure(s) ${Math.round(minutes)} minute(s)`;
                }
            } else {
                const minutes = (totalEstimatedTimeInHours % 1) * 60;

                if (minutes === 0) {
                    resultSpan.textContent = `${Math.floor(totalEstimatedTimeInHours)} heure(s)`;
                } else {
                    resultSpan.textContent = `${Math.floor(totalEstimatedTimeInHours)} heure(s), ${Math.round(minutes)} minute(s)`;
                }
            }
            
        }
    }


    function resetNbreDossierAndCalculate() {
        // Réinitialise la valeur de nbreDossier à 0
        nbreDossierInput.value = '';
        // Appelez la fonction de calcul
        calculateEstimatedTime();
    }


    // JS POUR LA CACHE "COCHER TOUS DANS LE FORM CREATE"

    allCheckboxes.checked = false;

    let previousPoolId = 'Tous';

    poolDropdown.addEventListener('change', () => {
        const selectedPoolId = poolDropdown.value;

        allCheckboxesContainer.style.display = selectedPoolId === 'Tous' ? 'none' : 'block';
        allCheckboxes.checked = false;
        
        // Uncheck checkboxes from the previous pool
        vmCheckboxes.forEach(checkbox => {
            const checkboxPoolId = checkbox.closest('.vm-container').getAttribute('data-pool');
            if (previousPoolId === 'Tous' || checkboxPoolId === previousPoolId) {
                checkbox.checked = false;
            }
        });

        
        previousPoolId = selectedPoolId;

        // Hide all VM containers
        document.querySelectorAll('.vm-container').forEach(container => container.style.display = 'none');

    
        // Show VM containers for the selected pool
        document.querySelectorAll(`.vm-container[data-pool="${selectedPoolId}"]`).forEach(container => container.style.display = 'block');
    });


    // RESET VALEURS FORMULAIRE CREATE ET MODIFIED

    window.addEventListener('beforeunload', function() {
        resetForm();
    });
    
    // Fonction pour réinitialiser les champs du formulaire
    function resetForm() {
        // Réinitialisez les champs du formulaire en affectant des valeurs vides ou par défaut
        const nbreDossierInput = document.getElementById('nbredossier');
        const scenarioSelect = document.getElementById('scenario');
        const datedebutInput = document.getElementById("datedebut");
        const datefinInput = document.getElementById("datefin");
        const caisse = document.getElementById("caisse");
        const caisseExploit = document.getElementById("caisse_exploit");
        const pool = document.getElementById("pool");
        const vmCheckboxes = document.querySelectorAll('.vm-checkbox');
        const processCheckboxes = document.querySelectorAll('.process-checkbox');
        const commentaire = document.getElementById('commentaire');
    
        nbreDossierInput.value = '';
        scenarioSelect.value = 'Tous';
        datedebutInput.value = '';
        datefinInput.value = '';
        caisse.value = 'Tous';
        caisseExploit.value = 'Tous';
        pool.value = "Tous";
        processCheckboxes.forEach(checkbox => checkbox.checked = false);
        vmCheckboxes.forEach(checkbox => checkbox.checked = false);
        commentaire.value = '';

        const nbreDossierInput1 = document.getElementById('newNbredossier');
        const scenarioSelect1 = document.getElementById('newScenario');
        const datedebutInput1 = document.getElementById("newDatedebut");
        const datefinInput1 = document.getElementById("newDatefin");
        const caisse1 = document.getElementById("newCaisse");
        const caisseExploit1 = document.getElementById("newCaisse_exploit");
        const pool1 = document.getElementById("newPool");
        const vmCheckboxes1 = document.querySelectorAll('.vm-checkbox1');
        const processCheckboxes1 = document.querySelectorAll('.process-checkbox1');
    
        nbreDossierInput1.value = '';
        scenarioSelect1.value = 'Tous';
        datedebutInput1.value = '';
        datefinInput1.value = '';
        caisse1.value = 'Tous';
        caisseExploit1.value = 'Tous';
        pool1.value = "Tous";
        processCheckboxes1.forEach(checkbox => checkbox.checked = false);
        vmCheckboxes1.forEach(checkbox => checkbox.checked = false);     
    }
});


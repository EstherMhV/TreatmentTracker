document.addEventListener("DOMContentLoaded", function() {
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    // deplacer et fermer le modal General
    const generalModal = document.getElementById("generalModal");
    const closeGeneralModal = document.getElementById("closeGeneral");

    closeGeneralModal.addEventListener("click", () => {
        generalModal.style.display = "none"; 
    });

    document.addEventListener("mouseleave", () => {
        if (isDragging) {
            isDragging = false;
            generalModal.style.cursor = "grab";
        }
    });
    
    generalModal.addEventListener("mousedown", (e) => {
        isDragging = true;
        offset.x = e.clientX - generalModal.getBoundingClientRect().left;
        offset.y = e.clientY - generalModal.getBoundingClientRect().top;
        generalModal.style.cursor = "grabbing";
    });
    
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        generalModal.style.left = e.clientX - offset.x + "px";
        generalModal.style.top = e.clientY - offset.y + "px";
    });
    
    document.addEventListener("mouseup", () => {
        isDragging = false;
        generalModal.style.cursor = "grab";
    });

    // deplacer et fermer le modal Erreur
    const errorModal = document.getElementById("errorModal");
    const closeErrorModal = document.getElementById("closeError");

    closeErrorModal.addEventListener("click", () => {
        errorModal.style.display = "none"; 
    });

    window.addEventListener('click', function (event) {
        if (event.target === errorModal) {
            errorModal.style.display = "none"; 
        }
    });

    document.addEventListener("mouseleave", () => {
        if (isDragging) {
            isDragging = false;
            generalModal.style.cursor = "grab";
        }
    });
    
    errorModal.addEventListener("mousedown", (e) => {
        isDragging = true;
        offset.x = e.clientX - errorModal.getBoundingClientRect().left;
        offset.y = e.clientY - errorModal.getBoundingClientRect().top;
        errorModal.style.cursor = "grabbing";
    });
    
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        errorModal.style.left = e.clientX - offset.x + "px";
        errorModal.style.top = e.clientY - offset.y + "px";
    });
    
    document.addEventListener("mouseup", () => {
        isDragging = false;
        errorModal.style.cursor = "grab";
    });

    // deplacer et fermer le modal cloture
    const clotureModal = document.getElementById("clotureModal");
    const closeClotureModal = document.getElementById("closeCloture");

    closeClotureModal.addEventListener("click", () => {
        clotureModal.style.display = "none"; 
    });

    window.addEventListener('click', function (event) {
        if (event.target === clotureModal) {
            clotureModal.style.display = "none"; 
        }
    });

    document.addEventListener("mouseleave", () => {
        if (isDragging) {
            isDragging = false;
            generalModal.style.cursor = "grab";
        }
    });
    
    clotureModal.addEventListener("mousedown", (e) => {
        isDragging = true;
        offset.x = e.clientX - clotureModal.getBoundingClientRect().left;
        offset.y = e.clientY - clotureModal.getBoundingClientRect().top;
        clotureModal.style.cursor = "grabbing";
    });
    
    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        clotureModal.style.left = e.clientX - offset.x + "px";
        clotureModal.style.top = e.clientY - offset.y + "px";
    });
    
    document.addEventListener("mouseup", () => {
        isDragging = false;
        clotureModal.style.cursor = "grab";
    });

    // deplacer le modal Edit
    const editModal = document.getElementById("editModal");
    const closeEditModal = document.getElementById("closeEdit");

    closeEditModal.addEventListener("click", () => {
        editModal.style.display = "none"; 
    });

    window.addEventListener('click', function (event) {
        if (event.target === editModal) {
            editModal.style.display = "none"; 
        }
    });

    document.addEventListener("mouseleave", () => {
        if (isDragging) {
        isDragging = false;
        editModal.style.cursor = "grab";
        }
    });

    editModal.addEventListener("mousedown", (e) => {
        isDragging = true;
        offset.x = e.clientX - editModal.getBoundingClientRect().left;
        offset.y = e.clientY - editModal.getBoundingClientRect().top;
        editModal.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        editModal.style.left = e.clientX - offset.x + "px";
        editModal.style.top = e.clientY - offset.y + "px";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        editModal.style.cursor = "grab";
    });

    document.addEventListener("mouseleave", () => {
        if (isDragging) {
        isDragging = false;
        editModal.style.cursor = "grab";
        }
    });

    document.getElementById("newNbredossier").addEventListener("input", function () {
        const nbredossier = this.value;
        if (nbredossier < 0 || nbredossier > 100000) {
            alert("Veuillez entrer une valeur 0 et 100 000.");
            this.value = "";
        }
    });

    const datedebutInput = document.getElementById("newDatedebut");
    const datefinInput = document.getElementById("newDatefin");

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

    // Sélectionnez le sélecteur de caisse
    const caisseExploit = document.getElementById("newCaisse_exploit");


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
    const poolSelect = document.getElementById("newPool");

    // Sélectionnez les conteneurs VM
    const vmContainers = document.querySelectorAll(".vm-container1");

    // Ajoutez un gestionnaire d'événements de changement au sélecteur de pool
    poolSelect.addEventListener("change", function() {
        const selectedPoolId = poolSelect.value;

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

    // Sélectionnez le sélecteur de scénario
    const scenarioSelect = document.getElementById("newScenario");

    // Sélectionnez les conteneurs de processus
    const processContainers = document.querySelectorAll(".process-container1");
    const selectAllVMCheckboxes = document.querySelectorAll('.allCheckboxes1');

    function resetAllCheckboxes() {
        // Reset process checkboxes
        processCheckboxes.forEach(function (checkbox) {
            checkbox.checked = false;
            checkbox.disabled = false;

        });
    
    
        // Reset VM checkboxes
        vmCheckboxes3.forEach(function (vmCheckbox) {
            vmCheckbox.checked = false;
            vmCheckbox.disabled = false;
        });
    
        // Recalculate estimated time after resetting checkboxes
        calculateEstimatedTime1();
    }

    // Ajoutez un gestionnaire d'événements de changement au sélecteur de scénario
    scenarioSelect.addEventListener("change", function() {
        const selectedProcess = scenarioSelect.value;

        // Parcourez les conteneurs de processus et affichez-les en fonction du scénario sélectionné
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
    const caisseSelect = document.getElementById("newCaisse_exploit");

    // Sélectionnez les options de pool
    const poolOptions = document.querySelectorAll(".pool-option");

    // Ajoutez un gestionnaire d'événements de changement au sélecteur de caisse exploitante
    caisseSelect.addEventListener("change", function() {
        const selectedCaisseId = caisseSelect.value;

        // Parcourez les options de pool et affichez-les en fonction de la caisse exploitante sélectionnée
        poolOptions.forEach(function(option) {
            const poolCaisseId = option.getAttribute("data-caisse");

            if (selectedCaisseId === poolCaisseId) {
                option.style.display = "block";
            } else {
                option.style.display = "none";
            }
        });
    });




    const newScenarioSelect = document.getElementById("newScenario");
    const multiprocessDiv = document.querySelector('.multiprocess1');
    const monoprocessDiv = document.querySelector('.monoprocess1');
    const processCheckboxes = document.querySelectorAll('.process-checkbox1');
    const monoprocessCheckboxes = document.querySelectorAll('.monoprocess1 .process-checkbox1');

    function toggleDivsForEdit() {
        const selectedScenario = newScenarioSelect.options[newScenarioSelect.selectedIndex].text;
      
        multiprocessDiv.style.display = selectedScenario.includes('PUMA') ? 'block' : 'none';
        monoprocessDiv.style.display = selectedScenario.includes('PUMA') ? 'none' : 'block';
    }
    
    toggleDivsForEdit();  
    newScenarioSelect.addEventListener('change', toggleDivsForEdit);

       // Modifier TRAITEMENT  
    // GESTIONNAIRE DE DES EVENEMENT DU CHOIX DE PROCESS


    // Additional code to handle VM checkboxes when monoprocessDiv is displayed
    monoprocessCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            console.log('Filtered VMs:', filteredVMs);
            const currentProcessId = this.value;
            const vmContainers = document.querySelectorAll(`.monoprocess1 .vm-container1[data-process="${currentProcessId}"]`);

            if (this.checked) {
                vmContainers.forEach(container => container.style.display = 'block');
            } else {
                vmContainers.forEach(container => container.style.display = 'none');
            }
        });
    });

    //GESTIONNAIRE DES ÉVÉNEMENTS POUR LES CASES À COCHER DES PROCESSUS
    
    processCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const processId1 = this.value;
            const vmContainers = document.querySelectorAll(`.vm-container1[data-process="${processId1}"]`);
            const selectAllVMCheckbox = this.parentElement.querySelector('.allCheckboxes1');
            const allVMCheckboxes = this.parentElement.querySelectorAll('.vm-checkbox1');

            // Vérifie si au moins une VM est cochée dans le processus
            const isAnyVMChecked = Array.from(allVMCheckboxes).some(vmCheckbox => vmCheckbox.checked);

            if (selectAllVMCheckbox.checked) {
                allVMCheckboxes.forEach(vmCheckbox => vmCheckbox.checked = true);
            }

    
            // Si la case à cocher est cochée, affichez les VMs du processus sélectionné
            if (this.checked) {
                vmContainers.forEach(container => container.style.display = 'block');
                // Uncheck other process checkboxes based on the div
                const checkboxesToUncheck = multiprocessDiv.contains(this) ? monoprocessCheckboxes : processCheckboxes;
                checkboxesToUncheck.forEach(otherCheckbox => {
                    if (otherCheckbox !== this) {
                        otherCheckbox.checked = false;
                    }
                });
            } else {
                // Réinitialisez les cases à cocher des VMs lorsque le processus est désélectionné
                if (!isAnyVMChecked) {
                    vmContainers.forEach(container => {
                        container.style.display = 'none';
                        const vmCheckboxes = container.querySelectorAll('.vm-checkbox1');
                        vmCheckboxes.forEach(vmCheckbox => vmCheckbox.checked = false);
                        // Hide the corresponding VM containers
                        vmContainers.forEach(container => container.style.display = 'none');
                    });
                    calculateEstimatedTime1(); // Recalculer le temps estimé
                } else {
                    // Empêche le décochage du processus si au moins une VM est cochée
                    this.checked = true;
                    alert("Veuillez décocher d'abord toutes les VMs associées avant de désélectionner le processus.");
                }
            }
        });
    });

    
   


    // GESTIONNAIRE DES ÉVÉNEMENTS POUR LES CASES À COCHER DES VM

    const vmCheckboxes3 = document.querySelectorAll('.vm-checkbox1');

    vmCheckboxes3.forEach(vmCheckbox => {
        vmCheckbox.addEventListener('change', function () {
            const vmName = this.value;

            // Disable other VM checkboxes with the same name
            const otherVMCheckboxes3 = document.querySelectorAll(`.vm-checkbox1[value="${vmName}"]:not(:checked)`);
            
            // Si la case à cocher est cochée
            if (this.checked) {
                otherVMCheckboxes3.forEach(checkbox => checkbox.disabled = true);
            } else {
                // Si la case à cocher est décochée
                otherVMCheckboxes3.forEach(checkbox => checkbox.disabled = false);
            }

            calculateEstimatedTime1(); // Recalculate the estimated time
        });
    });





    // CALCUL DU TEMPS DE TRAITMEENT DU MODIF FORM
    // Sélectionnez les éléments du formulaire
    
    const nbreDossierInput = document.getElementById('newNbredossier');


    const resultSpan = document.getElementById('newResult');
    const tempsTraitementContainer = document.getElementById('newTempsTraitementContainer');
    const scenarioSelect1 = document.getElementById('newScenario');
    const poolSelect1 = document.getElementById('newPool');

    // Écoutez les modifications de l'entrée de nbreDossier, des cases à cocher de process et de la sélection de scénario
    nbreDossierInput.addEventListener('input', calculateEstimatedTime1);
    processCheckboxes.forEach(checkbox => checkbox.addEventListener('change', calculateEstimatedTime1));
    vmCheckboxes3.forEach(checkbox => checkbox.addEventListener('change', calculateEstimatedTime1));
    scenarioSelect1.addEventListener('change', resetNbreDossierAndCalculate1);
    poolSelect1.addEventListener('change', resetNbreDossierAndCalculate1);


    const poolDropdown = document.getElementById('newPool');
    const allCheckboxesContainer = document.getElementById('allCheckboxesContainer1');
    const selectedVMsByPool = {};

    function calculateEstimatedTime1() {
        // Récupérez la valeur du champ nbreDossier
        const nbreDossierValue = parseInt(nbreDossierInput.value);
    
        // Vérifiez si le champ est vide, s'il n'y a aucun process sélectionné, ou si "Tous" est sélectionné pour le scénario
        const selectedProcesses = Array.from(processCheckboxes).filter(checkbox => checkbox.checked);
        const selectedScenario = scenarioSelect1.value;
        const selectedPool = poolSelect1.value;
       
    
        const selectedVMs = Array.from(vmCheckboxes3).filter(checkbox => checkbox.checked);
        const numberOfSelectedVMs = selectedVMs.length;
        const selectedPoolId = poolSelect1.value;
        selectedVMsByPool[selectedPoolId] = selectedVMs.map(vm => vm.value);

        console.log( numberOfSelectedVMs);
        console.log(selectedProcesses);
        console.log(nbreDossierValue);
        


        const isAllCheckboxesVmChecked = vmCheckboxes3.checked;

        if (isNaN(nbreDossierValue) || nbreDossierValue <= 0 || selectedProcesses.length === 0 || selectedScenario === 'Tous' || selectedPool === 'Tous' || isAllCheckboxesVmChecked === 0 || numberOfSelectedVMs === 0) {
            resultSpan.textContent = ''; // Aucun process sélectionné ou champ vide, affichez rien
            document.getElementById('newDatedebut').value = '';
            document.getElementById('newDatefin').value = '';
            tempsTraitementContainer.style.display = 'none';
            console.log("Nothing to see")
        } 
        else 
        {
            tempsTraitementContainer.style.display = 'block';

            // Calculate the total process time based on selected processes
            const totalProcessTime = selectedProcesses.reduce((total, checkbox) => {
                const tempsMinuteDossier = parseInt(checkbox.dataset.tempsMinuteDossier); // Update the attribute name
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
        
            const formattedStartDate = currentDate.toISOString().slice(0, 16)

            document.getElementById('newDatedebut').value = formattedStartDate;


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

    function resetNbreDossierAndCalculate1() {
        // Réinitialise la valeur de nbreDossier à 0
        nbreDossierInput.value = '';
        // Appelez la fonction de calcul
        calculateEstimatedTime1();
    }


    // JS POUR LA CACHE "COCHER TOUS DANS LE FORM CREATE"
    allCheckboxes.checked = false;

    let previousPoolId = 'Tous';
    
    poolDropdown.addEventListener('change', () => {
        const selectedPoolId = poolDropdown.value;

        allCheckboxesContainer.style.display = selectedPoolId === 'Tous' ? 'none' : 'block';
        allCheckboxes.checked = false;
        
        // Uncheck checkboxes from the previous pool
        vmCheckboxes3.forEach(checkbox => {
            const checkboxPoolId = checkbox.closest('.vm-container1').getAttribute('data-pool');
            if (previousPoolId === 'Tous' || checkboxPoolId === previousPoolId) {
                checkbox.checked = false;
            }
        });
        previousPoolId = selectedPoolId;

        // Hide all VM containers
        document.querySelectorAll('.vm-container1').forEach(container => container.style.display = 'none');

    
        // Show VM containers for the selected pool
        document.querySelectorAll(`.vm-container1[data-pool="${selectedPoolId}"]`).forEach(container => container.style.display = 'block');
    });
});

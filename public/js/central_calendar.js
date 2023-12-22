document.addEventListener('DOMContentLoaded', function() { 

    window.addEventListener('load', function () {
        const popup = document.getElementById('popup');
        const closeButton = document.getElementById('close-button');
        const urgentButton = document.getElementById('urgentButton');
        const importantButton = document.getElementById('importantButton');
        const normalButton = document.getElementById('normalButton');

        function showMessages(priority) {
            const messages = document.querySelectorAll('.popup-messages li');
            messages.forEach(function (message) {
                if (message.dataset.priority === priority) {
                    message.style.display = 'block';
                } else {
                    message.style.display = 'none';
                }
            });
        }
    
        function resetDisplay() {
            const messages = document.querySelectorAll('.popup-messages li');
            messages.forEach(function (message) {
                message.style.display = 'block';
            });
        }
    
        function closePopup() {
            resetDisplay();
            popup.style.display = 'none';
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 1); // set expiration to 1 hour from now
            document.cookie = 'popupDisplayed=true; expires=' + expirationDate.toUTCString();
        }
    
        closeButton.addEventListener('click', closePopup);
    
        window.addEventListener('click', function (event) {
            if (event.target === popup) {
                closePopup();
            }
        });
    
        urgentButton.addEventListener('click', function () {
            showMessages('urgent');
        });
    
        importantButton.addEventListener('click', function () {
            showMessages('important');
        });
    
        normalButton.addEventListener('click', function () {
            showMessages('normal');
        });
    
        // Check if the cookie exists
        if (document.cookie.indexOf('popupDisplayed=true') === -1) {
            // If the cookie doesn't exist, display the popup
            popup.style.display = 'block';
    
            // Add an event to the close button
            closeButton.addEventListener('click', function () {
                resetDisplay();
    
                // Hide the popup
                popup.style.display = 'none';
                // Set a cookie to indicate that the popup has been displayed
                const expirationDate = new Date();
                expirationDate.setHours(expirationDate.getHours() + 1); // set expiration to 1 hour from now
                document.cookie = 'popupDisplayed=true; expires=' + expirationDate.toUTCString();
            });
    
            // Hide the popup after a delay of 4 seconds
            setTimeout(function () {
                popup.style.display = 'none';
                // Set a cookie to indicate that the popup has been displayed
                const expirationDate = new Date();
                expirationDate.setHours(expirationDate.getHours() + 1); // set expiration to 1 hour from now
                document.cookie = 'popupDisplayed=true; expires=' + expirationDate.toUTCString();
            }, 3600000); // 3600000 milliseconds = 1 hour
        }
    });
    

    function openModal(info) {
        const traitementId = info.event.id;
        const generalModal = document.getElementById("generalModal");

        const editButton = document.getElementById("editButton");
        const deleteButton = document.getElementById("deleteButton");
        const cloturerButton = document.getElementById("closeButton");
        const errorButton = document.getElementById("errorButton");

        errorButton.addEventListener("click", () => {
            generalModal.style.display = "none"; 

            const errorValid = document.getElementById("validError");
            const deleteError = document.getElementById("deleteError");

            deleteError.addEventListener("click", () => {
                const confirmation = confirm("Es-tu sûr de vouloir supprimer l'erreur ?");
                if (confirmation) {
                    $.ajax({
                        url: '/delete_error/' + traitementId,
                        method: 'POST', 
                        success: function () {
                            window.location.reload();
                        },
                        error: function () {
                            alert("Erreur dans la requête");
                            window.location.reload();
                        }
                    });

                    modal.style.display = "none"; 
                }
            });

            const modal = document.getElementById("errorModal");
            modal.style.display = "block"; 

            errorValid.addEventListener("click", (event) => {

                if (!validateError()) {
                    event.preventDefault();
                }
                else {
                    const commentaireValue = $('#commentaireError').val();
                    const dataToSend = { commentaire: commentaireValue };

                    const confirmation = confirm("Es-tu sûr de vouloir mettre un message d'erreur ?");

                    if (confirmation) {
                        $.ajax({
                            url: '/traitment_erreur/' + traitementId,
                            method: 'POST', 
                            data: dataToSend,
                            success: function () {
                                window.location.reload();
                            },                                                                   
                            error: function () {
                                alert("Erreur dans la requête");
                                window.location.reload();
                            }
                        });
        
                        modal.style.display = "none"; 
                    }
                }
            });
        });

        cloturerButton.addEventListener("click", () => {
            generalModal.style.display = "none";
            
            const clotureValid = document.getElementById("validCloture");
            const deleteCloture = document.getElementById("deleteCloture");

            deleteCloture.addEventListener("click", () => {
                const confirmation = confirm("Es-tu sûr de vouloir supprimer la clotûre ?");
                if (confirmation) {
                    $.ajax({
                        url: '/delete_cloture/' + traitementId,
                        method: 'POST', 
                        success: function () {
                            window.location.reload();
                        },
                        error: function () {
                            alert("Erreur dans la requête");
                            window.location.reload();
                        }
                    });

                    modal.style.display = "none"; 
                }
            });

            const modal = document.getElementById("clotureModal");
            modal.style.display = "block"; 
            
           clotureValid.addEventListener("click", (event) => {
                if (!validateCloture()) {
                    event.preventDefault();
                }
                else {
                    const commentaireValue = $('#commentaireCloture').val();
                    const dataToSend = { commentaire: commentaireValue };

                    const confirmation = confirm("Es-tu sûr de vouloir clôturer ce traitement ?");

                    if (confirmation) {
                        $.ajax({
                            url: '/traitment_cloture/' + traitementId,
                            method: 'POST', 
                            data: dataToSend,
                            success: function () {
                                window.location.reload();
                            },
                            error: function () {
                                alert("Erreur dans la requête");
                                window.location.reload();
                            }
                        });

                        modal.style.display = "none"; 
                    }
                }
            });

        });

        
        deleteButton.addEventListener("click", () => {
            generalModal.style.display = "none";

            const confirmation = confirm("Es-tu sûr de vouloir supprimer ce(s) traitement(s) ? ");

            if (confirmation) {
                $.ajax({
                    url: '/traitement_delete/' + traitementId,
                    method: 'GET', 
                    success: function () {
                        window.location.reload();
                    },
                    error: function () {
                        alert("Erreur dans la requête");
                        window.location.reload();
                    }
                });

                modal.style.display = "none"; 
            }
        });

        function openEditModal(selectedEvent) {
            const editModal = document.getElementById("editModal");


            document.getElementById('newNbredossier').value = selectedEvent.nbrDossier;
            document.getElementById('newDatedebut').value = formatDate(info.event.start);
            document.getElementById('newDatefin').value = formatDate(info.event.end);

            editModal.style.display = "block";
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
        
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        }
       

        editButton.addEventListener("click", () => {
            generalModal.style.display = "none";

            const selectedEvent = info.event.extendedProps;
            // Check if the event exists
            if (selectedEvent) {
                // Open the editModal and populate form fields with selected event data
                openEditModal(selectedEvent);
            } else {
                console.error('Traitement non trouvé.');
            }

            const saveButton = document.getElementById("newEditButton");

            saveButton.addEventListener("click", (event) => {
                if (!validateForm()) {
                    event.preventDefault();
                } else {
                    const newCaisse = $('#newCaisse').val();
                    const newCaisseExploit = $('#newCaisse_exploit').val();
                    const newPool = $('#newPool').val();
                    const newScenario = $('#newScenario').val();
                    const newNbredossier = $('#newNbredossier').val();
                    const newDatedebut = $('#newDatedebut').val();
                    const newDatefin = $('#newDatefin').val();
                    const newVm = [];
                    $('input[name="newVm_[]"]:checked').each(function () {
                        newVm.push($(this).val());
                    });
                    const newProcess = [];
                    $('input[name="newProcess_[]"]:checked').each(function () {
                        newProcess.push($(this).val());
                    });

                    const dataToSend = {
                        newCaisse: newCaisse,
                        newCaisseExploit: newCaisseExploit,
                        newPool: newPool,
                        newScenario: newScenario,
                        newNbredossier: newNbredossier,
                        newDatedebut: newDatedebut,
                        newDatefin: newDatefin,
                        newVm: newVm,
                        newProcess: newProcess
                    };

                    $.ajax({
                        url: '/edit_traitement/' + traitementId,
                        method: 'POST', 
                        data: dataToSend,
                        success: function (data) {
                            if (data.success) {
                                window.location.reload();
                            } else {
                                alert("Erreur dans la requête");
                            }
                        },
                        error: function (error) {
                            console.error('Erreur lors de la récupération des détails du traitement:', error);
                        }
                    });

                    modal.style.display = "none"; 
                }
            });
        });
    }

    function validateError() {
        const commentaireError = document.getElementById("commentaireError");

        var valid = true;

        if (commentaireError.value.trim() === '' || commentaireError.value.length === 0 || commentaireError.value.length > 300
        ) {
            alert("Veuillez écrire un commentaire entre 1 et 300 caractères.");
            valid = false;
        }

        return valid;
    }

    function validateCloture() {
        const commentaireCloture = document.getElementById("commentaireCloture");

        var valid = true;

        if (commentaireCloture.value.trim() === '' || commentaireCloture.value.length === 0 || commentaireCloture.value.length > 300
        ) {
            alert("Veuillez écrire un commentaire entre 1 et 300 caractères.");
            valid = false;
        }

        return valid;
    }
    
    function validateForm() {
        const caisseT = document.getElementById("newCaisse");
        const caisseE = document.getElementById("newCaisse_exploit");
        const pool = document.getElementById("newPool");
        const scenario = document.getElementById("newScenario");

        var valid = true;

        if (caisseT.value === "Tous") {
            alert("Veuillez choisir une caisse de traitement.");
            valid = false;
        }

        if (caisseE.value === "Tous") {
            alert("Veuillez choisir une caisse exploitante.");
            valid = false;
        }

        if (pool.value === "Tous") {
            alert("Veuillez choisir une pool.");
            valid = false;
        }

        const vmContainers = document.querySelectorAll('.vm-container1');
        let totalSelectedVMs = 0;
        
        vmContainers.forEach(function (container) {
            const checkbox = container.querySelector('.vm-checkbox1');
            if (checkbox.checked) {
                totalSelectedVMs++;
            }
        });
        
        if (totalSelectedVMs === 0) {
            alert("Vous devez sélectionner au moins une VM.");
            valid = false;
        }

        if (scenario.value === "Tous") {
            alert("Veuillez choisir un scénario.");
            valid = false;
        }

        const processContainers = document.querySelectorAll('.process-container1');
        let totalSelectedProcess = 0;
        
        processContainers.forEach(function (container) {
            const checkbox = container.querySelector('.process-checkbox1');
            if (checkbox.checked) {
                totalSelectedProcess++;
            }
        });
        
        if (totalSelectedProcess === 0) {
            alert("Vous devez sélectionner au moins un process.");
            valid = false;
        }
        function isValidDateTime(dateTimeString) {
            // Format de date et heure local (ISO 8601)
            const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        
            // Vérifier si la chaîne de date correspond au format
            return dateTimeRegex.test(dateTimeString);
        }

        const dateDebut = document.getElementById("newDatedebut");
        const dateFin = document.getElementById("newDatefin");
        if (!isValidDateTime(dateDebut.value)) {
            alert("Veuillez entrer une date de début valide.");
            valid = false;
        }
    
        if (!isValidDateTime(dateFin.value)) {
            alert("Veuillez entrer une date de fin valide.");
            valid = false;
        }

        return valid; 
    }
    
    const calendarEl = document.getElementById('calendar');

    const today = new Date();
    const todayDate = today.toISOString().slice(0, 10);

    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'fr',
        timeZone: 'local',
        initialDate: todayDate,
        headerToolbar: {
            left: 'today prev,next traitmentButton annoncesButton listYear',
            center: 'title',
            right: 'resourceTimelineDay resourceTimelineWeek dayGridMonth resourceTimelineYear'
        },
        initialView: 'resourceTimelineDay',
        filterResourcesWithEvents: true,
        aspectRatio: 1.6,
        views: {
            listYear: {
                id: 'buttonAnnonce',
                buttonText: 'Liste',
            },
            resourceTimelineDay: {
                buttonText: 'Jour',
                scrollTime: '00:00',
            },
            resourceTimelineWeek: {
                slotDuration: { days: 1 },
                firstDay: 1, 
                weekNumbers: true, 
                weekNumberContent: (args) => {
                    const date = args.date;
                    const startOfWeek = FullCalendar.Formatter.toMoment(date).startOf('week');
                    const diff = date.diff(startOfWeek, 'days');
                    return Math.ceil((diff + 1) / 7);
                },
            },
            resourceTimelineYear: {
                type: 'resourceTimeline',
                duration: { year: 1 }, // Set the duration to a month
                buttonText: 'Année',
                slotDuration: { days: 1 }, // Set the slot duration to a day
                slotLabelFormat: { month: 'long', day: '2-digit' }, // Set the slot label format
                slotEventOverlap: false,
            },
        },
        editable: false,
        resourceAreaHeaderContent: 'Pool VM',
        customButtons: {
            traitmentButton: {
                text: 'Traitement',
                click: function () {
                    fetch('/verify_role')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur lors de la requête');
                        }
                        return response.json(); 
                    })
                    .then(data => {
                        if (data.success) {
                            const modal = document.getElementById("myModal");
                            const closeButton = document.getElementById("closeCreate");
                            modal.style.display = "block";
                
                            closeButton.addEventListener("click", () => {
                                modal.style.display = "none";
                            });
                
                            window.addEventListener('click', function (event) {
                                if (event.target === modal) {
                                    modal.style.display = "none";
                                }
                            });
                        } else {
                            console.error(data.message); 
                            alert("Vous ne pouvez pas accéder à cette fonctionnalité.");
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });                
                },
            },
            
            annoncesButton: {
                text: 'Annonces',
                click: function() {
                    const popup = document.getElementById("popup");
                    const closeButton = document.getElementById('close-button');
                    popup.style.display = "block";

                    closeButton.addEventListener("click", () => {
                        popup.style.display = "none"; 
                    });
                
                },
            },

            exportCSV: {
                text: 'Export',
                click: function() {
                    exportCSV();
                },
            }
        },

        eventClick: function(info) {
            fetch('/verify_role')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la requête');
                }
                return response.json(); 
            })
            .then(data => {
                if (data.success) {
                    const modal = document.getElementById("generalModal");
                    const closeButton = document.getElementById("closeGeneral");
                    modal.style.display = "block";
        
                    const title = document.getElementById("title");
                    title.innerHTML = "<h4>Traitement n°" + info.event.id + "</h4>";
        
                    closeButton.addEventListener("click", () => {
                        modal.style.display = "none"; 
                    });
        
                    window.addEventListener('click', function (event) {
                        if (event.target === modal) {
                            modal.style.display = "none"; 
                        }
                    });
                    openModal(info);
                } else {
                    console.error(data.message); 
                    alert("Vous ne pouvez pas accéder à cette fonctionnalité.");
                }
            })
            .catch(error => {
                console.error(error);
            });                
        },



        eventMouseEnter: function (info) {
            
            info.el.style.cursor = "pointer";

            var event = info.event;
            var content = '<b style= "color:#81BDEC;">' + event.title + '</b><br><br>'; 
            content += '<b style= "color:#DF3E3E;">' + event.extendedProps.etape + '</b><br>';

            content += '<b>Traitement n°' + event.id + '</b><br>';
            content += '<b>Début</b> : ' + event.start.toLocaleString() + '<br>';
            content += '<b>Fin</b> : ' + event.end.toLocaleString() + '<br>';
            content += '<b>PoolVM</b> : ' + event.extendedProps.poolName + '<br>';
            content += '<b>VM</b> : ' + event.extendedProps.VmName + '<br>';
            content += '<b>Caisse de traitement</b> : ' + event.extendedProps.caisseName + ' (' + event.extendedProps.caisseNum + ')<br>';
            content += '<b>Caisse exploitante</b> : ' + event.extendedProps.caisseExploitName + ' (' + event.extendedProps.caisseExploitNum + ')<br>';
            content += '<b>Scénario</b> : ' + event.extendedProps.scenarioName + '<br>';
            content += '<b>Processus</b> : ' + event.extendedProps.processName + '<br>';
        
            content += '<b>Nbre de dossier</b> : ' + event.extendedProps.nbrDossier + '<br>';
            content += '<b>État</b> : ' + '' + '<b style= "color:#ECCC81;">' + event.extendedProps.etat + '</b><br>';

            if (event.extendedProps.errorComment != null) {
                content += '<b>Commentaire d\'erreur</b> : ' + event.extendedProps.errorComment + '<br>';
            }

            if (event.extendedProps.clotureComment != null) {
                content += '<b>Commentaire de clôture</b> : ' + event.extendedProps.clotureComment + '<br>';
            }
        
            // Utilisez tippy pour afficher l'infobulle

            var tooltip = tippy(info.el, {
                content: content,
                allowHTML: true,
            });
            tooltip.show();
        },
        
        eventMouseLeave: function (info) {
            // Masquer les informations de l'événement lorsque la souris quitte
            var tooltip = info.el._tippy;
            if (tooltip) {
                tooltip.destroy();
            }
        },

        eventContent: function(arg) {
            const event = arg.event;
            const etat = event.extendedProps.etat;
            const eventElement = document.createElement('div');
            eventElement.className = 'calendar-event';
            eventElement.style.backgroundColor = getColorForCaisseExploitName(etat);

            const content = document.createElement('div');
            content.className = 'event-content';
            content.innerHTML = '<b>' + event.title + '</b>';
            eventElement.appendChild(content);

            return { domNodes: [eventElement] };
        },
        
    });
    

    function exportCSV() {
        // Prompt the user for the month and year
        const inputMonthYear = prompt("Entrez l'année et le mois de l'export que vous souhaitez (ex : 2023-01)");
    
        if (!inputMonthYear) {
            return;
        }
    
        const selectedDate = new Date(inputMonthYear + "-01"); // Assuming the day is always the 1st
    
        // Récupérez les événements de votre calendrier pour le mois sélectionné
        const events = calendar.getEvents().filter(event => {
            const eventDate = new Date(event.start);
            return eventDate.getMonth() === selectedDate.getMonth() && eventDate.getFullYear() === selectedDate.getFullYear();
        });
    
        if (events.length === 0) {
            alert("Aucun traitement trouvé pour le mois sélectionné.");
            return;
        }
    
        // Convertissez les événements en texte CSV
        let csvContent = "Debut;Fin;Title;Caisse Exploitante;Caisse de Traitement;Pool;VM;Scenario;Process;Nombre de Dossiers;Etat;Commentaire de cloture;Commentaire erreur\n";
        events.forEach(event => {
            const date_de_debut = event.start.toISOString();
            const date_de_fin = event.end.toISOString();
            const titre = event.title;
            const caisse_exploitante = event.caisseExploitName + event.caisseExploitNum;
            const caisse_de_traitement = event.caisseName + event.caisseNum;
            const pool = event.poolName;
            const vm = event.VmName;
            const scenario = event.scenarioName;
            const process = event.processName;
            const nbr_de_dossiers = event.nbrDossier;
            const etat = event.etat;
            const errorComment = event.errorComment;
            const clotureComment = event.closeButton;
    
            csvContent += `${date_de_debut}, ${date_de_fin}, ${titre}, ${caisse_exploitante}, ${caisse_de_traitement}, 
                            ${pool}, ${vm}, ${scenario}, ${process}, ${nbr_de_dossiers}, ${etat}, ${errorComment}, ${clotureComment}\n`;
        });
    
        // Créez un Blob à partir du contenu CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    
        // Utilisez FileSaver.js pour télécharger le fichier CSV
        saveAs(blob, `pladapath-calendar-${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}.csv`);
    }
    


    function getColorForCaisseExploitName(etat) {
        switch (etat) {
            case 'En cours':
                return '#6698CA';
            case 'Clôturé':
                return '#B2B0B0';
            case 'Erreur':
                return '#D14747';
        }
    }
    
    $.ajax({
        url: '/get_pool_vm_resources',
        method: 'GET',
        success: function (data) {
            const resources = data.map(function (poolVM) {
                const poolVMResource = {
                    id: poolVM.id,
                    title: poolVM.title,
                    children: [],
                };

                /*poolVM.children.forEach(function (vm) {
                    const vmResource = {
                        id: vm.id,
                        title: vm.title,
                    };
                    poolVMResource.children.push(vmResource);
                });*/

                return poolVMResource;
            });
            calendar.setOption('resources', resources);
        }
    });

    $.ajax({
        url: '/get_traitement_events',
        method: 'GET',
        success: function (responseData) {
            data = responseData;
            data.forEach(function (traitement) {
                const event = {
                    id: traitement.id,
                    title: `${traitement.caisseNum} - ${traitement.caisseName} - ${traitement.scenarioName}`,
                    start: traitement.start,
                    end: traitement.end,
                    poolName: traitement.poolName,
                    VmName: traitement.VmName,
                    caisseName: traitement.caisseName,
                    caisseNum: traitement.caisseNum,
                    caisseExploitName: traitement.caisseExploitName,
                    caisseExploitNum: traitement.caisseExploitNum,
                    scenarioName: traitement.scenarioName,
                    processName: traitement.processName,
                    nbrDossier: traitement.nbrDossier,
                    etat: traitement.etat,
                    clotureComment: traitement.clotureComment,
                    errorComment: traitement.errorComment,
                    resourceId: traitement.resourceId,
                    etape: traitement.etape
                };

                calendar.addEvent(event);
            });
            calendar.render();
        }
    });


    // FETCH SCENRIO FOR FILTER
    $.ajax({
        url: '/get_scenario_names',
        method: 'GET',
        success: function (scenarios) {
            const scenarioCheckboxesContainer = document.getElementById('scenarioCheckboxes');

            scenarios.forEach(function (scenario) {
                const scenarioName = scenario.nom_scenario;

            // Concaténer le mot si supéreieur à 15 caractères et afficher en "..."
            const truncatedScenarioName = scenarioName.length > 15
                ? scenarioName.substring(0, 15) + "..."
                : scenarioName;


                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'scenario';
                checkbox.value = scenarioName;

                const label = document.createElement('label');
                label.textContent = truncatedScenarioName; // Utilise le mot concaténer
                label.title = scenarioName; // Afficher le mot complet dans un title au survol

                scenarioCheckboxesContainer.appendChild(checkbox);
                scenarioCheckboxesContainer.appendChild(label);
                scenarioCheckboxesContainer.appendChild(document.createElement('br'));
            });

            // Scenario filtering code
            const checkboxes = document.getElementsByName('scenario');

            checkboxes.forEach(function (checkbox) {
                checkbox.addEventListener('change', function () {
                    // Clear existing events
                    calendar.getEvents().forEach(function (event) {
                        event.remove();
                    });


                    data.forEach(function (traitement) {
                        const scenarioName = traitement.scenarioName;
                        const isScenarioChecked = Array.from(checkboxes)
                            .filter(cb => cb.checked && cb.value === scenarioName)
                            .length > 0;


                        // If the treatment's scenarioName matches any checked checkbox, or no checkboxes are checked
                        if (isScenarioChecked || !Array.from(checkboxes).some(cb => cb.checked)) {
                            const event = {
                                id: traitement.id,
                                title: `${traitement.caisseNum} - ${traitement.caisseName} - ${traitement.scenarioName}`,
                                start: traitement.start,
                                end: traitement.end,
                                poolName: traitement.poolName,
                                VmName: traitement.VmName,
                                caisseName: traitement.caisseName,
                                caisseExploitName: traitement.caisseExploitName,
                                scenarioName: scenarioName,
                                processName: traitement.processName,
                                nbrDossier: traitement.nbrDossier,
                                etat: traitement.etat,
                                clotureComment: traitement.clotureComment,
                                errorComment: traitement.errorComment,
                                resourceId: traitement.resourceId,
                                etape: traitement.etape
                            };

                            calendar.addEvent(event);
                        }
                    });
                    calendar.render();
                });
            });
        }
    });
    

    // FETCH CAISSEEXPLOIT NAME FILTER
    $.ajax({
        url: '/get_caisse_exploit_names',
        method: 'GET',
        success: function (caisseExploit) {
            const caisseExploitCheckboxesContainer = document.getElementById('caisseExploitCheckboxes');

            caisseExploit.forEach(function (caisseExploit) {
                const caisseExploitName = caisseExploit.nom_caisse;

            // Concaténer le mot si supéreieur à 15 caractères et afficher en "..."
            const truncatedCaisseExploitName = caisseExploitName.length > 15
                ? caisseExploitName.substring(0, 15) + "..."
                : caisseExploitName;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'caisseExploit';
                checkbox.value = caisseExploitName;

                const label = document.createElement('label');
                label.textContent = truncatedCaisseExploitName; // Utilise le mot concaténer
                label.title = caisseExploitName; // Afficher le mot complet dans un title au survol

                caisseExploitCheckboxesContainer.appendChild(checkbox);
                caisseExploitCheckboxesContainer.appendChild(label);
                caisseExploitCheckboxesContainer.appendChild(document.createElement('br'));
            });

            // Caisse filtering code
            const checkboxes = document.getElementsByName('caisseExploit');

            checkboxes.forEach(function (checkbox) {
                checkbox.addEventListener('change', function () {
                    // Clear existing events
                    calendar.getEvents().forEach(function (event) {
                        event.remove();
                    });

                    data.forEach(function (traitement) {
                        const caisseExploitName = traitement.caisseExploitName;
                        const isCaisseExploitChecked = Array.from(checkboxes)
                            .filter(cb => cb.checked && cb.value === caisseExploitName)
                            .length > 0;


                        // If the treatment's Caisename matches any checked checkbox, or no checkboxes are checked
                        if (isCaisseExploitChecked || !Array.from(checkboxes).some(cb => cb.checked)) {
                            const event = {
                                id: traitement.id,
                                title: `${traitement.caisseNum} - ${traitement.caisseName} - ${traitement.scenarioName}`,
                                start: traitement.start,
                                end: traitement.end,
                                poolName: traitement.poolName,
                                VmName: traitement.VmName,
                                caisseName: traitement.caisseName,
                            //enlever le traitement devant caisseExploit car c'est cette variable qui sera filtré
                                caisseExploitName: caisseExploitName,
                                scenarioName: traitement.scenarioName,
                                processName: traitement.processName,
                                nbrDossier: traitement.nbrDossier,
                                etat: traitement.etat,
                                clotureComment: traitement.clotureComment,
                                errorComment: traitement.errorComment,
                                resourceId: traitement.resourceId,
                                etape: traitement.etape
                            };

                            calendar.addEvent(event);
                        }
                    });

                    calendar.render();
                });
            });
        }
    });


    // FETCH POOLVM NAME FILTER
    $.ajax({
        url: '/get_poolvm_names',
        method: 'GET',
        success: function (poolVm) {
            const poolVmCheckboxesContainer = document.getElementById('poolVmCheckboxes');

            poolVm.forEach(function (poolVm) {
                const poolName = poolVm.nom_pool;

            // Concaténer le mot si supéreieur à 15 caractères et afficher en "..."
            const truncatedPoolName = poolName.length > 15
                ? poolName.substring(0, 15) + "..."
                : poolName;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'poolVm';
                checkbox.value = poolName;

                const label = document.createElement('label');
                label.textContent = truncatedPoolName; // Utilise le mot concaténer
                label.title = poolName; // Afficher le mot complet dans un title au survol

                poolVmCheckboxesContainer.appendChild(checkbox);
                poolVmCheckboxesContainer.appendChild(label);
                poolVmCheckboxesContainer.appendChild(document.createElement('br'));
            });

            // PoolVm filtering code
            const checkboxes = document.getElementsByName('poolVm');

            checkboxes.forEach(function (checkbox) {
                checkbox.addEventListener('change', function () {
                    // Clear existing events
                    calendar.getEvents().forEach(function (event) {
                        event.remove();
                    });

                    data.forEach(function (traitement) {
                        const poolName = traitement.poolName;
                        const ispoolVmChecked = Array.from(checkboxes)
                            .filter(cb => cb.checked && cb.value === poolName)
                            .length > 0;


                        // If the treatment's Caisename matches any checked checkbox, or no checkboxes are checked
                        if (ispoolVmChecked || !Array.from(checkboxes).some(cb => cb.checked)) {
                            const event = {
                                id: traitement.id,
                                title: `${traitement.caisseNum} - ${traitement.caisseName} - ${traitement.scenarioName}`,
                                start: traitement.start,
                                end: traitement.end,
                        //enlever le traitement devant caisseExploit car c'est cette variable qui sera filtré
                                poolName: poolName,
                                VmName: traitement.VmName,
                                caisseName: traitement.caisseName,
                                caisseExploitName: traitement.caisseExploitName,
                                scenarioName: traitement.scenarioName,
                                processName: traitement.processName,
                                nbrDossier: traitement.nbrDossier,
                                etat: traitement.etat,
                                clotureComment: traitement.clotureComment,
                                errorComment: traitement.errorComment,
                                resourceId: traitement.resourceId,
                                etape: traitement.etape
                            };

                            calendar.addEvent(event);
                        }
                    });

                    calendar.render();
                });
            });
        }
    });

});

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
    
    // definir une variable qui va recupérer la dernière vue utilisé
    var lastView = localStorage.getItem("fcDefaultView") || 'resourceTimelineDay';

    // définir une constante qui va garder la date du jour en mémoire
    const today = new Date();
    const todayDate = today.toISOString().slice(0, 10);

    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'fr',
        timeZone: 'local',
        initialDate: todayDate,
        headerToolbar: {
            left: 'today prev,next traitmentButton annoncesButton listButton',
            center: 'title',
            right: 'resourceTimelineDay resourceTimelineWeek dayGridMonth resourceTimelineYear'
        },
        initialView: lastView,
        filterResourcesWithEvents: true,
        aspectRatio: 1.6,
        views: {
            listYear: {
                buttonText: 'Liste A',
            },
            listMonth: {
                buttonText: 'Liste M',
            },
            listWeek: {
                buttonText: 'Liste S',
            },
            listDay: {
                buttonText: 'Liste J',
            },
            resourceTimelineDay: {
                buttonText: 'Jour',
                scrollTime: '00:00',
                slotLabelFormat: {
                    hour: '2-digit',
                    minute: '2-digit',
                    omitZeroMinute: false,
                    meridiem: false,
                },
            },
            resourceTimelineWeek: {
                slotDuration: { days: 1 },
                firstDay: 1,
                slotLabelFormat: { weekday: 'long', day: '2-digit' }
            },      
            dayGridMonth: {
                dayHeaderFormat: { weekday: 'long' },
                fixedWeekCount: false,
                showNonCurrentDates: false,
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

            listButton: {
                text: 'Liste',
                click: function() {
                    const listModal = document.getElementById("listModal");
                    listModal.style.display = "block";

                    const yearButton = document.getElementById("yearButton");
                    const monthButton = document.getElementById("monthButton");
                    const weekButton = document.getElementById("weekButton");
                    const dayButton = document.getElementById("dayButton");

                    yearButton.addEventListener("click", () => {
                        listModal.style.display = "none"; 
                        calendar.changeView('listYear');
                    });
                    monthButton.addEventListener("click", () => {
                        listModal.style.display = "none"; 
                        calendar.changeView('listMonth');
                    });
                    weekButton.addEventListener("click", () => {
                        listModal.style.display = "none"; 
                        calendar.changeView('listWeek');
                    });
                    dayButton.addEventListener("click", () => {
                        listModal.style.display = "none"; 
                        calendar.changeView('listDay');
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

        datesSet: function (dateInfo) {
            localStorage.setItem("fcDefaultView", dateInfo.view.type);

            // Obtenez la vue actuelle (par jour/semaine/mois/année)
            var currentView = dateInfo.view.type;

             // Obtenez la date sur la vue actuelle
            var currentDate = dateInfo.startStr;

            var endDate = dateInfo.endStr;

            // Ajoutez une condition pour vérifier si la vue actuelle nécessite une nouvelle requête
            if (currentView === 'listYear' || currentView === 'listMonth' || currentView === 'listWeek' || currentView === 'listDay'
                || currentView === 'resourceTimelineYear' || currentView === 'dayGridMonth' || currentView === 'resourceTimelineWeek' 
                || currentView === 'resourceTimelineDay') 
            {
                // Appelez la fonction pour obtenir le pourcentage des process
                getProcessPercentage(currentView, currentDate, endDate);

                // Appelez la fonction pour obtenir le pourcentage des vm
                getVmPercentage(currentView, currentDate, endDate);
            }
        },


    });

    const statistiques = document.getElementById("statistiques");
    const processUtilizationChart = document.getElementById("processUtilizationChart");
    const vmUtilizationChart = document.getElementById("vmUtilizationChart");

    statistiques.addEventListener("click", () => {
        processUtilizationChart.style.display = "none"; 
        vmUtilizationChart.style.display = "block"; 
    });

    var ajaxRequestInProgress = false;
    var ajaxRequestInProgress1 = false;

    // Fonction pour effectuer la requête Ajax et obtenir les vms
    function getVmPercentage(currentView, currentDate, endDate) {
        if (ajaxRequestInProgress1) {
            return;
        }
    
        ajaxRequestInProgress1 = true;

        $.ajax({
            type: "GET",
            url: "/get_all_vms",
            data: {
                currentView: currentView,
                currentDate: currentDate,
                endDate: endDate,
            },
            success: function (poolData) {
                // Créez un tableau pour stocker les noms des pools
                var poolsNames = [];
                // Créez un tableau pour stocker les données pour le graphique
                var percentageData  = [];
                
                // Parcourez les données des processus
                poolData.forEach(function (pool) { 

                    poolsNames.push(pool.nom_pool);

                    // Ajoutez le pourcentage correspondant à la vue actuelle
                    switch (currentView) {
                        case 'resourceTimelineDay':
                        case 'listDay':
                            percentageData.push(pool.percentage);
                            break;
                        case 'resourceTimelineWeek':
                        case 'listWeek':
                            percentageData.push(pool.percentage);
                            break;
                        case 'dayGridMonth':
                        case 'listMonth':
                            percentageData.push(pool.percentage);
                            break;
                        case 'resourceTimelineYear':
                        case 'listYear':
                            percentageData.push(pool.percentage);
                            break;
                        default:
                            percentageData.push(0);
                            break;
                    }

                });

                // Appelez la fonction pour créer le graphique avec les noms des processus
                createChartVms(poolsNames, percentageData, currentView, poolData);

                ajaxRequestInProgress1 = false;
            },
            error: function (error) {
                console.error(error);
                ajaxRequestInProgress1 = false;

            }
        });
    }

    // Fonction pour effectuer la requête Ajax et obtenir les processus
    function getProcessPercentage(currentView, currentDate, endDate) {
        if (ajaxRequestInProgress) {
            return;
        }
    
        ajaxRequestInProgress = true;

        $.ajax({
            type: "GET",
            url: "/get_all_processes",
            data: {
                currentView: currentView,
                currentDate: currentDate,
                endDate: endDate,
            },
            success: function (processData) {
                // Créez un tableau pour stocker les noms des processus
                var processNames = [];
                // Créez un tableau pour stocker les données pour le graphique
                var percentageData  = [];
                
                // Parcourez les données des processus
                processData.forEach(function (process) { 

                    processNames.push(process.nom_process);

                    // Ajoutez le pourcentage correspondant à la vue actuelle
                    switch (currentView) {
                        case 'resourceTimelineDay':
                        case 'listDay':
                            percentageData.push(process.percentageDay);
                            break;
                        case 'resourceTimelineWeek':
                        case 'listWeek':
                            percentageData.push(process.percentageWeek);
                            break;
                        case 'dayGridMonth':
                        case 'listMonth':
                            percentageData.push(process.percentageMonth);
                            break;
                        case 'resourceTimelineYear':
                        case 'listYear':
                            percentageData.push(process.percentageYear);
                            break;
                        default:
                            percentageData.push(0);
                            break;
                    }

                });

                // Appelez la fonction pour créer le graphique avec les noms des processus
                createChartProcess(processNames, percentageData, currentView, processData);

                ajaxRequestInProgress = false;
            },
            error: function (error) {
                console.error(error);
                ajaxRequestInProgress = false;

            }
        });
    }

    // Déclarer une variable pour stocker l'instance du graphique actuel
    var myChart;

    // Déclarer une variable pour suivre la page actuelle
    var currentPage = 0;

    // Fonction pour créer le graphique avec les noms des processus
    function createChartProcess(processNames, percentageData, currentView, processData) {
        // Récupérer l'élément canvas
        var canvas = document.getElementById('processUtilizationChart');

        if (!canvas) {
            console.error("Diagramme non trouvé.");
            return;
        }

        Chart.defaults.color = '#fff';

        // Détruire le graphique actuel s'il existe
        if (myChart) {
            myChart.destroy();
        }

        // Nombre de labels à afficher par page
        const labelsPerPage = 1;

        var messageParagraph = document.getElementById('messageParagraph');

        if (!processNames || processNames.length === 0) {
            messageParagraph.textContent = "Aucun process trouv\u00e9.";
            return; // Ne pas créer de graphique si aucun processus n'est trouvé
        }

        // Calculer le nombre total de pages
        const totalPages = Math.ceil(processNames.length / labelsPerPage);

        // Vérifier si le nombre total de processus est inférieur ou égal à 6
        if (processNames.length <= labelsPerPage) {
            // S'il y a 6 processus ou moins, cacher les boutons de navigation
            document.getElementById('nextPageButton').style.display = 'none';
            document.getElementById('prevPageButton').style.display = 'none';
        } else {
            // S'il y a plus de 6 processus, afficher les boutons de navigation
            document.getElementById('nextPageButton').style.display = 'block';
        }

        function truncateLabel(label, maxLength) {
            if (label.length > maxLength) {
                return label.substring(0, maxLength) + '...';
            }
            return label;
        }

        // Calculer l'index de début et de fin pour la page actuelle
        const startIndex = currentPage * labelsPerPage;
        const endIndex = Math.min(startIndex + labelsPerPage, processNames.length);

        // Utiliser uniquement les pourcentages pour la page actuelle
        const pagePercentageData = percentageData.slice(startIndex, endIndex);

        // Utiliser uniquement les processus pour la page actuelle
        const pageProcessNames = processNames.slice(startIndex, endIndex);

        // Calculer le total des pourcentages pour la page actuelle
        const totalPercentage = pagePercentageData.reduce((acc, percent) => acc + percent, 0);

        if (totalPercentage < 100) {
            const cutoutPercentage = 100 - totalPercentage;

            pagePercentageData.push(cutoutPercentage);
            pageProcessNames.push("Espace libre"); 
        }

        // Utiliser Chart.js pour créer un graphique à secteurs (pie chart)
        var ctx = canvas.getContext('2d');

        // Définir le titre en fonction de la vue actuelle
        var titleText = getTitleText(currentView);

        // Configurer les options du graphique
        var chartOptions = {
            type: 'pie',
            data: {
                labels: pageProcessNames.map(label => truncateLabel(label, 30)),
                datasets: [{
                    data: pagePercentageData,
                    backgroundColor: generateRandomColors(pageProcessNames.length),
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 11,
                                weight: 'bold',
                                color: 'white'
                            },
                            boxWidth: 25,
                            usePointStyle: true,
                            pointStyle: 'rectRounded',
                        },
                    },
                    title: {
                        display: true,
                        text: titleText,
                        font: {
                            size: 20,
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                var value = context.parsed || 0;
                                return value.toFixed(2) + '%';
                            },
                        },
                    },
                },
            },
        };

        if (totalPercentage < 100) {
            chartOptions.data.datasets[0].backgroundColor.push('rgba(255, 255, 255, 1)');
        }

        // Créer un nouveau graphique
        myChart = new Chart(ctx, chartOptions);

        updateChartAndNavigation(processNames, percentageData, currentView, totalPages);
    }

    // Déclarer une variable pour stocker l'instance du graphique actuel
    var myChartVms;

    // Déclarer une variable pour suivre la page actuelle
    var currentPage = 0;

    // Fonction pour créer le graphique avec les noms des processus
    function createChartVms(poolsNames, percentageData, currentView, poolData) {
        // Récupérer l'élément canvas
        var canvas = document.getElementById('vmUtilizationChart');

        if (!canvas) {
            console.error("Diagramme non trouvé.");
            return;
        }

        Chart.defaults.color = '#fff';

        // Détruire le graphique actuel s'il existe
        if (myChartVms) {
            myChartVms.destroy();
        }

        // Nombre de labels à afficher par page
        const labelsPerPage = 1;

        var messageParagraph = document.getElementById('messageParagraph');

        if (!poolsNames || poolsNames.length === 0) {
            messageParagraph.textContent = "Aucun process trouv\u00e9.";
            return; // Ne pas créer de graphique si aucun processus n'est trouvé
        }

        // Calculer le nombre total de pages
        const totalPages = Math.ceil(poolsNames.length / labelsPerPage);

        // Vérifier si le nombre total de processus est inférieur ou égal à 6
        if (poolsNames.length <= labelsPerPage) {
            // S'il y a 6 processus ou moins, cacher les boutons de navigation
            document.getElementById('nextPageButton').style.display = 'none';
            document.getElementById('prevPageButton').style.display = 'none';
        } else {
            // S'il y a plus de 6 processus, afficher les boutons de navigation
            document.getElementById('nextPageButton').style.display = 'block';
        }

        function truncateLabel(label, maxLength) {
            if (label.length > maxLength) {
                return label.substring(0, maxLength) + '...';
            }
            return label;
        }

        // Calculer l'index de début et de fin pour la page actuelle
        const startIndex = currentPage * labelsPerPage;
        const endIndex = Math.min(startIndex + labelsPerPage, poolsNames.length);

        // Utiliser uniquement les pourcentages pour la page actuelle
        const pagePercentageData = percentageData.slice(startIndex, endIndex);

        // Utiliser uniquement les processus pour la page actuelle
        const pageProcessNames = poolsNames.slice(startIndex, endIndex);

        // Calculer le total des pourcentages pour la page actuelle
        const totalPercentage = pagePercentageData.reduce((acc, percent) => acc + percent, 0);

        if (totalPercentage < 100) {
            const cutoutPercentage = 100 - totalPercentage;

            pagePercentageData.push(cutoutPercentage);
            pageProcessNames.push("Espace libre"); 
        }

        // Utiliser Chart.js pour créer un graphique à secteurs (pie chart)
        var ctx = canvas.getContext('2d');

        // Définir le titre en fonction de la vue actuelle
        var titleText = getTitleText1(currentView);

        // Configurer les options du graphique
        var chartOptions = {
            type: 'pie',
            data: {
                labels: pageProcessNames.map(label => truncateLabel(label, 30)),
                datasets: [{
                    data: pagePercentageData,
                    backgroundColor: generateRandomColors(pageProcessNames.length),
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 11,
                                weight: 'bold',
                                color: 'white'
                            },
                            boxWidth: 25,
                            usePointStyle: true,
                            pointStyle: 'rectRounded',
                        },
                    },
                    title: {
                        display: true,
                        text: titleText,
                        font: {
                            size: 20,
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                var value = context.parsed || 0;
                                return value.toFixed(2) + '%';
                            },
                        },
                    },
                },
            },
        };

        if (totalPercentage < 100) {
            chartOptions.data.datasets[0].backgroundColor.push('rgba(255, 255, 255, 1)');
        }

        // Créer un nouveau graphique
        myChartVms = new Chart(ctx, chartOptions);

        updateChartAndNavigation1(poolsNames, percentageData, currentView, totalPages);
    }
        
    function updateChartAndNavigation(processNames, percentageData, currentView, totalPages) {
        // Récupérez les boutons existants
        const prevButton = document.getElementById('prevPageButton');
        const nextButton = document.getElementById('nextPageButton');

        prevButton.innerHTML = '←';
        nextButton.innerHTML = '→';

        prevButton.style.display = currentPage === 0 ? 'none' : 'block';
        nextButton.style.display = currentPage === totalPages - 1 ? 'none' : 'block';
    
        // Retirer les écouteurs d'événements pour éviter les problèmes de liaison multiple
        document.getElementById('nextPageButton').removeEventListener('click', goToNextPage);
        document.getElementById('prevPageButton').removeEventListener('click', goToPrevPage);
    
        // Gérer le clic sur la flèche pour passer à la page suivante
        document.getElementById('nextPageButton').onclick = goToNextPage;

        // Gérer le clic sur la flèche pour revenir à la page précédente
        document.getElementById('prevPageButton').onclick = goToPrevPage;

    
        function goToNextPage() {
            currentPage = Math.min(currentPage + 1, totalPages - 1);
            createChartProcess(processNames, percentageData, currentView);
        }
        
        function goToPrevPage() {
            currentPage = Math.max(currentPage - 1, 0);
            createChartProcess(processNames, percentageData, currentView);
        }
        
    }

    function updateChartAndNavigation1(poolsNames, percentageData, currentView, totalPages) {
        // Récupérez les boutons existants
        const prevButton = document.getElementById('prevPageButton');
        const nextButton = document.getElementById('nextPageButton');

        prevButton.innerHTML = '←';
        nextButton.innerHTML = '→';

        prevButton.style.display = currentPage === 0 ? 'none' : 'block';
        nextButton.style.display = currentPage === totalPages - 1 ? 'none' : 'block';
    
        // Retirer les écouteurs d'événements pour éviter les problèmes de liaison multiple
        document.getElementById('nextPageButton').removeEventListener('click', goToNextPage);
        document.getElementById('prevPageButton').removeEventListener('click', goToPrevPage);
    
        // Gérer le clic sur la flèche pour passer à la page suivante
        document.getElementById('nextPageButton').onclick = goToNextPage;

        // Gérer le clic sur la flèche pour revenir à la page précédente
        document.getElementById('prevPageButton').onclick = goToPrevPage;

    
        function goToNextPage() {
            currentPage = Math.min(currentPage + 1, totalPages - 1);
            createChartVms(poolsNames, percentageData, currentView);
        }
        
        function goToPrevPage() {
            currentPage = Math.max(currentPage - 1, 0);
            createChartVms(poolsNames, percentageData, currentView);
        }
        
    }

    // Fonction pour obtenir des couleurs uniques pour les futurs labels et les stocker dans un cookie
    function generateRandomColors(count) {
        var colors = [];

        // Vérifier si le cookie de couleurs existe
        var storedColors = getCookie('chartColors');
        if (storedColors) {
            colors = JSON.parse(storedColors);
        } else {
            // Générer de nouvelles couleurs si le cookie n'existe pas
            while (colors.length < count) {
                var color = 'rgba(' +
                    Math.floor(Math.random() * 256) + ',' +
                    Math.floor(Math.random() * 256) + ',' +
                    Math.floor(Math.random() * 256) + ',' +
                    '0.7)';
                colors.push(color);
            }

            // Stocker les couleurs dans le cookie
            setCookie('chartColors', JSON.stringify(colors), 1);
        }

        return colors;
    }

    // Fonction pour récupérer la valeur d'un cookie par son nom
    function getCookie(cookieName) {
        var name = cookieName + '=';
        var decodedCookie = decodeURIComponent(document.cookie);
        var cookieArray = decodedCookie.split(';');

        for (var i = 0; i < cookieArray.length; i++) {
            var cookie = cookieArray[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) == 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return null;
    }

    // Fonction pour définir la valeur d'un cookie avec une durée d'expiration
    function setCookie(cookieName, cookieValue, expirationHours) {
        var d = new Date();
        d.setTime(d.getTime() + (expirationHours * 60 * 60 * 1000)); // Temps d'expiration en millisecondes
        var expires = 'expires=' + d.toUTCString();
        document.cookie = cookieName + '=' + cookieValue + '; path=/; ' + expires;
    }

    // Fonction pour obtenir le texte du titre en fonction de la vue actuelle
    function getTitleText1(currentView) {
        switch (currentView) {
            case 'resourceTimelineDay':
                return 'Utilisation des vms par jour';
            case 'resourceTimelineWeek':
                return 'Utilisation des vms par semaine';
            case 'dayGridMonth':
                return 'Utilisation des vms par mois';
            case 'resourceTimelineYear':
                return 'Utilisation des vms par ann\u00e9e';
            case 'listYear':
                return 'Utilisation des vms par ann\u00e9e';
            case 'listMonth':
                return 'Utilisation des vms par mois';
            case 'listWeek':
                return 'Utilisation des vms par semaine';
            case 'listDay':
                return 'Utilisation des vms par jour';
            default:
                return '';
        }
    }

    // Fonction pour obtenir le texte du titre en fonction de la vue actuelle
    function getTitleText(currentView) {
        switch (currentView) {
            case 'resourceTimelineDay':
                return 'Utilisation des process par jour';
            case 'resourceTimelineWeek':
                return 'Utilisation des process par semaine';
            case 'dayGridMonth':
                return 'Utilisation des process par mois';
            case 'resourceTimelineYear':
                return 'Utilisation des process par ann\u00e9e';
            case 'listYear':
                return 'Utilisation des process par ann\u00e9e';
            case 'listMonth':
                return 'Utilisation des process par mois';
            case 'listWeek':
                return 'Utilisation des process par semaine';
            case 'listDay':
                return 'Utilisation des process par jour';
            default:
                return '';
        }
    }

    /*function exportCSV() {
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
    }*/
    


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
            const resourceOrder = resources.map(resource => resource.title);

            calendar.setOption('resources', resources);
            calendar.setOption('resourceOrder', resourceOrder);
        }
    });

    $(document).ready(function() {
        $('#rechercheTraitement').on('input', function() {
            var rechercheTexte = $(this).val().toLowerCase(); // Convertir le texte en minuscules pour une comparaison insensible à la casse
            filtrerEvenements(rechercheTexte);
        });
    
        // Charger les événements initiaux
        chargerEvenements();
    });
    
    function chargerEvenements() {
        $.ajax({
            url: '/get_traitement_events',
            method: 'GET',
            success: function(responseData) {
                data = responseData;
                afficherEvenements(data);
            }
        });
    }
    
    function afficherEvenements(data) {
        data.forEach(function(traitement) {
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
    
    function filtrerEvenements(rechercheTexte) {
        // Effacer les événements actuels du calendrier
        calendar.removeAllEvents();
    
        // Filtrer les événements en fonction du texte de recherche
        data.forEach(function(traitement) {
            const titreEvenement = (
                `${traitement.id} - ${traitement.caisseNum} - ${traitement.caisseName} - ${traitement.caisseExploitNum} - ${traitement.caisseExploitName} - ` +
                `${traitement.scenarioName} - ${traitement.processName} - ${traitement.nbrDossier} - ${traitement.etat} - ${traitement.etape} - ${traitement.clotureComment} - ${traitement.errorComment}`
            ).toLowerCase();
            
            
            if (titreEvenement.includes(rechercheTexte)) {
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
    
                // Ajouter l'événement filtré au calendrier
                calendar.addEvent(event);
            }
        });
    
        // Rendre à nouveau le calendrier
        calendar.render();
    }    


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

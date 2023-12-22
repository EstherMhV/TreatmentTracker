//hide panels

document.addEventListener("DOMContentLoaded", function() {
    $(document).ready(function() {
        // Initially hide all panels
        $(".content-panel").hide();
        $("#mypoolvm").show(); // You can decide which one you want to show by default

        // When a button in the nav is clicked
        $(".buttons .button").click(function() {
            var panelID = $(this).data("id");

            // Hide all panels
            $(".content-panel").hide();

            // Show the selected panel
            $("#" + panelID).show();
        });
    });

    const switches = document.querySelectorAll('.form-check-input');

    switches.forEach(switchElem => {
        switchElem.addEventListener('change', function() {
            if (this.checked) {
                switches.forEach(innerSwitch => {
                    if (innerSwitch !== this) {
                        innerSwitch.checked = false;
                    }
                });
            }
        });
    });
    
    // popup delete traitment
    const deleteLinks = document.querySelectorAll('.delete-link');
    deleteLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const traitementId = this.getAttribute('data-id');
            
            if (confirm('Êtes-vous sûr de vouloir supprimer ce champs ?')) {
                window.location.href = this.getAttribute('href');
            }
        });
    });


    // FILTRES DES DIFFERENTS PANELS DE PARAMETRE 
    //CAISSE
    // Function to filter the table rows based on the input value

    function filterTableCaisse(inputId, tableId) {
        var input = document.getElementById(inputId);
        var filter = input.value.toLowerCase();
        var table = document.getElementById(tableId);
        var rows = table.getElementsByTagName("tr");

        for (var i = 1; i < rows.length; i++) {
            var tdName = rows[i].getElementsByTagName("td")[1]; 
            var tdNumber = rows[i].getElementsByTagName("td")[0];
            if (tdName && tdNumber) {
                var name = tdName.textContent || tdName.innerText;
                var number = tdNumber.textContent || tdNumber.innerText;
                if (name.toLowerCase().indexOf(filter) > -1 || number.toLowerCase().indexOf(filter) > -1) {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            }
        }
    }
    
    // Add event listeners to the input fields
    document.getElementById("caisseSearch").addEventListener("input", function() {
        filterTableCaisse("caisseSearch", "caisseTable");
    });


    //POOL VM
    function filterTablePool() {
        var input, filter, table, tr, td, i, j, txtValue;
        input = document.getElementById("poolSearch");
        filter = input.value.toUpperCase();
        table = document.getElementById("poolVMTable");
        tr = table.getElementsByTagName("tr");

        for (i = 0; i < tr.length; i++) {
            var found = false;
            td = tr[i].getElementsByTagName("td");
            for (j = 1; j < 4; j++) {
                if (td[j]) {
                    txtValue = td[j].textContent || td[j].innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        found = true;
                    }
                }
            }
            if (found) {
                tr[i].style.display = "table-row";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    document.getElementById("poolSearch").addEventListener("input", filterTablePool)



    // VM
    function filterTableVM() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("vmSearch");
        filter = input.value.toUpperCase();
        table = document.getElementById("vmTable");
        tr = table.getElementsByTagName("tr");

        for (i = 0; i < tr.length; i++) {
            var found = false;
            td = tr[i].getElementsByTagName("td")[1]; // Index 1 for "Nom VM" column
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                }
            }
            if (found) {
                tr[i].style.display = "table-row";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    document.getElementById("vmSearch").addEventListener("input", filterTableVM);




    //SCENARIO 
    function filterTableScenario() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("scenarioSearch");
        filter = input.value.toUpperCase();
        table = document.getElementById("scenarioTable");
        tr = table.getElementsByTagName("tr");

        for (i = 0; i < tr.length; i++) {
            var found = false;
            td = tr[i].getElementsByTagName("td")[0]; // Index 1 for "Nom Scenario" column
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                }
            }
            if (found) {
                tr[i].style.display = "table-row";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
    document.getElementById("scenarioSearch").addEventListener("input", filterTableScenario);


    //PROCESS
    function filterTableProcess() {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("processSearch");
        filter = input.value.toUpperCase();
        table = document.getElementById("processTable");
        tr = table.getElementsByTagName("tr");

        for (i = 0; i < tr.length; i++) {
            var found = false;
            td = tr[i].getElementsByTagName("td")[0]; // Index 1 for "Process" column
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    found = true;
                }
            }
            if (found) {
                tr[i].style.display = "table-row";
            } else {
                tr[i].style.display = "none";
            }
        }
    }

    document.getElementById("processSearch").addEventListener("input", filterTableProcess);


    // Traitmeent 
    function filterTable() {
        var input = document.getElementById("traitementSearch").value.toLowerCase();
        var table = document.getElementById("traitementTable");
        var rows = table.getElementsByTagName("tr");

        for (var i = 1; i < rows.length; i++) {
            var row = rows[i];
            var rowData = row.textContent.toLowerCase();


            var combinedData = rowData;
    ;

            if (combinedData.includes(input)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    }

    var traitementSearchInput = document.getElementById("traitementSearch");
    traitementSearchInput.addEventListener("input", filterTable);

    //Message 

    function filterMessageTable() {
        var input = document.getElementById("messageSearch").value.toLowerCase();
        var table = document.getElementById("messageTable");
        var rows = table.getElementsByTagName("tr");

        for (var i = 1; i < rows.length; i++) {
            var row = rows[i];
            var rowData = row.textContent.toLowerCase();

            if (rowData.includes(input)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        }
    }

    var messageSearchInput = document.getElementById("messageSearch");
    messageSearchInput.addEventListener("input", filterMessageTable);



    window.addEventListener('beforeunload', function() {
        resetForm();
    });

    // Fonction pour réinitialiser les champs du formulaire
    function resetForm() {
        // Réinitialisez les champs du formulaire en affectant des valeurs vides ou par défaut
        const messageSearch = document.getElementById('messageSearch');
        const traitementSearch = document.getElementById('traitementSearch');
        const processSearch = document.getElementById("processSearch");
        const scenarioSearch = document.getElementById("scenarioSearch");
        const vmSearch = document.getElementById("vmSearch");
        const poolSearch = document.getElementById("poolSearch");
        const caisseSearch = document.getElementById("caisseSearch");

        messageSearch.value = '';
        traitementSearch.value = '';
        processSearch.value = '';
        scenarioSearch.value = '';
        vmSearch.value = '';
        poolSearch.value = '';
        caisseSearch.value = '';
    }
});
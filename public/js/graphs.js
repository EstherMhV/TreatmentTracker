document.addEventListener('DOMContentLoaded', function () {
    window.updateStatistics = function () {
        // Get the entered year from the input field
        const yearInput = document.getElementById('yearInput');
        const selectedYear = yearInput.value;

    // Récupérer les statistiques depuis le serveur for the selected year
    fetch(`/dossier_statistiques/${selectedYear}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(dossiers => {
            console.log('Fetched Statistics:', dossiers);

            // Filtrer les statistiques par année et mois
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const filteredStatistics = filterStatisticsByYear(dossiers, currentYear);

            console.log('Filtered Statistics:', filteredStatistics);

            // Calculer la somme du nombre de dossiers par mois
            const yearlySum = calculateMonthlySum(filteredStatistics);

            // Créer des graphiques ou effectuer d'autres opérations avec les statistiques filtrées
            updateCharts(filteredStatistics);

            // Utiliser la somme mensuelle comme vous le souhaitez
            console.log('Monthly Sum:', yearlySum);
        })
        .catch(error => console.error('Erreur lors de la récupération des statistiques:', error));

    };

    // Fonction pour filtrer les statistiques par année
    function filterStatisticsByYear(dossiers, selectedYear) {
        return dossiers.filter(stat => {
            // Ensure that the properties are correctly accessed
            const statYear = new Date(stat.year).getFullYear(); // Assuming 'year' is the correct property
            return statYear === parseInt(selectedYear);
        });
    }


    // Fonction pour calculer la somme du nombre de dossiers par mois
    function calculateMonthlySum(dossiers) {
        return dossiers.reduce((sum, stat) => sum + stat.totalDossiers, 0);
    }

    let dossierChartInstance;
// NOMBRES DE DOSSIER SGLOBAL PAR MOIS 
    function createCharts(filteredStatistics) {
        // Exemple d'utilisation de Chart.js (assurez-vous d'inclure la bibliothèque dans votre projet)
        const ctx = document.getElementById('dossierChart1').getContext('2d');
    
        // Destroy the existing Chart instance if it exists
        if (dossierChartInstance) {
            dossierChartInstance.destroy();
        }
    
        // Create an array of month names
        const monthNames = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
    
        // Map month numbers to corresponding month names
        const allMonthsLabels = monthNames;
        
        // Map month numbers to corresponding month names
        const monthData = allMonthsLabels.map(monthName => {
            const matchingStat = filteredStatistics.find(stat => parseInt(stat.month) === allMonthsLabels.indexOf(monthName) + 1);
            return matchingStat ? matchingStat.totalDossiers : 0;
        });
    
        const data = {
            labels: allMonthsLabels, // Use allMonthsLabels instead of monthLabels
            datasets: [{
                label: 'Total Dossiers',
                data: monthData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };
        
        const config = {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    x: {
                        type: 'category',
                        labels: allMonthsLabels, // Use allMonthsLabels instead of monthLabels
                        ticks: {
                            autoSkip: false,
                            maxRotation: 45,
                            minRotation: 45,
                            callback: function (value, index, values) {
                                return monthNames[parseInt(value)]; // Convert month numbers to names
                            }
                        }
                    },
                    y: {
                        type: 'linear',
                        ticks: {
                            beginAtZero: false,
                            precision: 0,

                        }
                    }
                }
            }
        };
        
    
        // Create a new Chart instance and store the reference
        dossierChartInstance = new Chart(ctx, config);
    
        // Log some information for debugging
        console.log(monthData);
        console.log(allMonthsLabels);
    }


    // Fonction pour mettre à jour les graphiques avec les statistiques filtrées
    function updateCharts(filteredStatistics) {
        // Destroy the existing Chart instance if it exists
        if (dossierChartInstance) {
            dossierChartInstance.destroy();
        }

        // Call the createCharts function with the new data
        createCharts(filteredStatistics);
    }

});
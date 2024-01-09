<?php

namespace App\Controller;

use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;



use App\Repository\CaisseExploitRepository;
use App\Repository\CaisseRepository;
use App\Repository\PoolVmRepository;
use App\Repository\VmRepository;
use App\Repository\ProcessRepository;
use App\Repository\ScenarioRepository;
use App\Repository\MessageRepository;
use App\Repository\TraitementRepository;


class StatsController extends AbstractController
{
    /**
     * @Route("statistiques", name="statistiques")
     */
    public function index(CaisseExploitRepository $CaisseExploitRepository, CaisseRepository $CaisseRepository, PoolVmRepository $PoolVmRepository, 
                            VmRepository $VmRepository, ProcessRepository $ProcessRepository,
                            ScenarioRepository $ScenarioRepository, TraitementRepository $TraitementRepository, MessageRepository $MessageRepository,
                            UserInterface $user): Response {

        $num_agent = $user->getNumeroAgent();
        $nom_agent = $user->getNom();
        $prenom_agent = $user->getPrenom();

        // On récupère tous les éléments
        $listAllMessage = $MessageRepository->findAll();
        $listAllScenario = $ScenarioRepository->findAll();     
        $listAllProcess = $ProcessRepository->findAll();
        $listAllPoolVM = $PoolVmRepository->findAll();
        $listAllCaisse = $CaisseRepository->findAll();
        $listAllCaisseExploit = $CaisseExploitRepository->findAll();
        $listAllVM = $VmRepository->findAll();
        $listAllTraitement = $TraitementRepository->findAll();



        // Initialiser un tableau pour stocker le nombre de VMs par caisse
        $vmCountByCaisse = [];

        // Boucle sur chaque caisse
        foreach ($listAllCaisse as $caisse) {
            // Récupérer les traitements associés à la caisse
            $traitements = $caisse->getTraitements();

            // Initialiser le compteur pour cette caisse
            $vmCountByCaisse[$caisse->getNomCaisse()] = 0;

            // Boucle sur chaque traitement associé à la caisse
            foreach ($traitements as $traitement) {
                // Ajouter le nombre de VMs associées au traitement
                $vmCountByCaisse[$caisse->getNomCaisse()] += $traitement->getIdVm()->count();
            }
        }

        // Trier le tableau par le nom de la VM
        uksort($vmCountByCaisse, 'strnatcasecmp');

        // Initialiser un tableau pour stocker le pourcentage d'utilisation par VM
        $utilizationPercentageByVM = [];

        // Boucle sur chaque VM
        foreach ($listAllVM as $vm) {
            // Récupérer les traitements associés à la VM
            $traitements = $vm->getIdTraitement();

            // Initialiser les compteurs pour la durée totale par jour, semaine et mois
            $totalDurationDay = 0;
            $totalDurationWeek = 0;
            $totalDurationMonth = 0;

            // Boucle sur chaque traitement associé à la VM
            foreach ($traitements as $traitement) {
                // Calculer la durée du traitement
                $duration = $traitement->getDateFin()->getTimestamp() - $traitement->getDateDebut()->getTimestamp();

                // Ajouter la durée au compteur approprié
                $totalDurationDay += $duration;
                $totalDurationWeek += $duration;
                $totalDurationMonth += $duration;
            }

            // Calculer le pourcentage d'utilisation par jour, semaine et mois
            $percentageDay = ($totalDurationDay / (24 * 60 * 60)) * 100; // 24 heures * 60 minutes * 60 secondes
            $percentageWeek = ($totalDurationWeek / (7 * 24 * 60 * 60)) * 100; // 7 jours * 24 heures * 60 minutes * 60 secondes
            $percentageMonth = ($totalDurationMonth / (30 * 24 * 60 * 60)) * 100; // 30 jours * 24 heures * 60 minutes * 60 secondes

            // Stocker les pourcentages dans le tableau
            $utilizationPercentageByVM[$vm->getNomVm()] = [
                'day' => $percentageDay,
                'week' => $percentageWeek,
                'month' => $percentageMonth,
            ];
        }

        // Trier le tableau par le nom de la VM
        uksort($utilizationPercentageByVM, 'strnatcasecmp');

        
        // Initialiser un tableau pour stocker le pourcentage d'utilisation par VM et par caisse
        $utilizationPercentageByVMAndCaisse = [];

        // Boucle sur chaque VM
        foreach ($listAllVM as $vm) {
            // Récupérer les traitements associés à la VM
            $traitements = $vm->getIdTraitement();

            // Initialiser les compteurs pour la durée totale par jour, semaine et mois pour chaque caisse
            $totalDurationDayByCaisse = [];
            $totalDurationWeekByCaisse = [];
            $totalDurationMonthByCaisse = [];

            // Boucle sur chaque traitement associé à la VM
            foreach ($traitements as $traitement) {
                // Vérifier si le traitement est associé à une caisse
                $caisse = $traitement->getIdCaisse();
                if ($caisse) {
                    // Calculer la durée du traitement
                    $duration = $traitement->getDateFin()->getTimestamp() - $traitement->getDateDebut()->getTimestamp();
            
                    // Ajouter la durée au compteur approprié pour chaque caisse
                    $caisseName = $caisse->getNomCaisse();
                    $totalDurationDayByCaisse[$caisseName] = ($totalDurationDayByCaisse[$caisseName] ?? 0) + $duration;
                    $totalDurationWeekByCaisse[$caisseName] = ($totalDurationWeekByCaisse[$caisseName] ?? 0) + $duration;
                    $totalDurationMonthByCaisse[$caisseName] = ($totalDurationMonthByCaisse[$caisseName] ?? 0) + $duration;
                }
            }

            // Calculer le pourcentage d'utilisation par jour, semaine et mois pour chaque caisse
            foreach ($listAllCaisse as $caisse) {
                $percentageDay = ($totalDurationDayByCaisse[$caisse->getNomCaisse()] ?? 0) / (24 * 60 * 60) * 100; // 24 heures * 60 minutes * 60 secondes
                $percentageWeek = ($totalDurationWeekByCaisse[$caisse->getNomCaisse()] ?? 0) / (7 * 24 * 60 * 60) * 100; // 7 jours * 24 heures * 60 minutes * 60 secondes
                $percentageMonth = ($totalDurationMonthByCaisse[$caisse->getNomCaisse()] ?? 0) / (30 * 24 * 60 * 60) * 100; // 30 jours * 24 heures * 60 minutes * 60 secondes

                // Stocker les pourcentages dans le tableau, en utilisant le nom de la VM et de la caisse comme clés
                $utilizationPercentageByVMAndCaisse[$vm->getNomVm()][$caisse->getNomCaisse()] = [
                    'day' => $percentageDay,
                    'week' => $percentageWeek,
                    'month' => $percentageMonth,
                ];
            }
        }

        // Trier le tableau par le nom de la caisse
        uksort($utilizationPercentageByVMAndCaisse, 'strnatcasecmp');

        // Initialiser un tableau pour stocker le nombre de PROCESSs par caisse
        $processCountByCaisse = [];

        // Boucle sur chaque caisse
        foreach ($listAllCaisse as $caisse) {
            // Récupérer les traitements associés à la caisse
            $traitements = $caisse->getTraitements();

            // Initialiser le compteur pour cette caisse
            $processCountByCaisse[$caisse->getNomCaisse()] = 0;

            // Boucle sur chaque traitement associé à la caisse
            foreach ($traitements as $traitement) {
                // Ajouter le nombre de VMs associées au traitement
                $processCountByCaisse[$caisse->getNomCaisse()] += $traitement->getIdProcess()->count();
            }
        }

        // Initialiser un tableau pour stocker le pourcentage d'utilisation par process
        $utilizationPercentageByProcess = [];

        // Boucle sur chaque process
        foreach ($listAllProcess as $process) {
            // Récupérer les traitements associés au process
            $traitements = $process->getIdTraitement();

            // Initialiser les compteurs pour la durée totale par jour, semaine et mois pour chaque process
            $totalDurationDayByProcess = 0;
            $totalDurationWeekByProcess = 0;
            $totalDurationMonthByProcess = 0;

            // Boucle sur chaque traitement associé au process
            foreach ($traitements as $traitement) {
                // Calculer la durée du traitement
                $duration = $traitement->getDateFin()->getTimestamp() - $traitement->getDateDebut()->getTimestamp();

                // Ajouter la durée au compteur approprié pour chaque process
                $totalDurationDayByProcess += $duration;
                $totalDurationWeekByProcess += $duration;
                $totalDurationMonthByProcess += $duration;
            }

            // Calculer le pourcentage d'utilisation par jour, par semaine et par mois pour chaque process
            $percentageDay = ($totalDurationDayByProcess / (24 * 60 * 60)) * 100; // 24 heures * 60 minutes * 60 secondes
            $percentageWeek = ($totalDurationWeekByProcess / (7 * 24 * 60 * 60)) * 100; // 7 jours * 24 heures * 60 minutes * 60 secondes
            $percentageMonth = ($totalDurationMonthByProcess / (30 * 24 * 60 * 60)) * 100; // 30 jours * 24 heures * 60 minutes * 60 secondes

            // Stocker les pourcentages dans le tableau, en utilisant le nom du process comme clé
            $utilizationPercentageByProcess[$process->getNomProcess()] = [
                'day' => $percentageDay,
                'week' => $percentageWeek,
                'month' => $percentageMonth,
            ];
        }

        // Trier le tableau par le nom des process
        uksort($utilizationPercentageByProcess, 'strnatcasecmp');



        return $this->render('statistiques/index.html.twig',
            [
                'num_agent' => $num_agent,
                'prenom_agent' => $prenom_agent,
                'nom_agent' => $nom_agent,
                'vmCountByCaisse' => $vmCountByCaisse,
                'processCountByCaisse' => $processCountByCaisse,
                'utilizationPercentageByVM' => $utilizationPercentageByVM,
                'utilizationPercentageByVMAndCaisse' => $utilizationPercentageByVMAndCaisse,
                "listAllPoolVM" => $listAllPoolVM,
            ]
        );
    }

    /**
     * @Route("/dossier_statistiques/{year}", name="dossier_statistiques")
     */
    public function dossierStatistiques(TraitementRepository $traitementRepository, $year): JsonResponse
    {
        $dossiers = $traitementRepository->findByDossierStatisticsTotalByYearAndMonth($year);

        return new JsonResponse($dossiers);
    }

    /**
     * @Route("/dossier_statistiques_per_pool/{year}/{poolVM}", name="dossier_statistiques_per_pool")
     */
    public function statsByPool(TraitementRepository $traitementRepository, $year, $poolVM): JsonResponse
    {
        // Assuming $poolVM is now the ID instead of the name
        $dossiers2 = $traitementRepository->findByPool($year, $poolVM);

        return new JsonResponse($dossiers2);
    }

        
}
<?php

namespace App\Controller;

use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\CaisseExploitRepository;
use App\Repository\CaisseRepository;
use App\Repository\PoolVmRepository;
use App\Repository\VmRepository;
use App\Repository\ProcessRepository;
use App\Repository\ScenarioRepository;
use App\Repository\MessageRepository;
use App\Repository\TraitementRepository;
use App\Entity\Caisse;



class AccueilController extends AbstractController
{
    /**
     * @Route("/", name="app_accueil")
     */
    public function index(CaisseExploitRepository $CaisseExploitRepository, CaisseRepository $CaisseRepository, PoolVmRepository $PoolVmRepository, 
    VmRepository $VmRepository, ProcessRepository $ProcessRepository,
    ScenarioRepository $ScenarioRepository, TraitementRepository $TraitementRepository, MessageRepository $MessageRepository,
    Request $request, UserInterface $user): Response 
    {

        $listAllMessage = $MessageRepository->findAll();

        $listAllScenario = $ScenarioRepository->findAll();     

        $listAllProcess = $ProcessRepository->findAll();

        $listAllPoolVM = $PoolVmRepository->findAll();

        $listAllCaisse = $CaisseRepository->findAll();

        $listAllCaisseExploit = $CaisseExploitRepository->findAll();
        
        $listAllVM = $VmRepository->findAll();

        $listAllTraitement = $TraitementRepository->findAll();

        $selectedDate = $request->query->get('selectedDate');

        $listAllTraitement = $TraitementRepository->findTraitementsForDate(new \DateTimeImmutable($selectedDate));

        $num_agent = $user->getNumeroAgent();
        $nom_agent = $user->getNom();
        $prenom_agent = $user->getPrenom();

        $user = $this->getUser();

        return $this->render('home.html.twig', [
            'num_agent' => $num_agent,
            'nom_agent' => $nom_agent,
            'prenom_agent' => $prenom_agent,
            'user' => $user,
            'controller_name' => 'AccueilController',
            'listAllMessage' => $listAllMessage,
            'listAllCaisse' => $listAllCaisse,
            'listAllCaisseExploit' => $listAllCaisseExploit,
            "listAllPoolVM" => $listAllPoolVM,
            "listAllVM" => $listAllVM,
            "listAllProcess" => $listAllProcess,
            "listAllScenario" => $listAllScenario,
            "listAllTraitement" => $listAllTraitement,

        ]);
    }

    public function infoCaisse (CaisseExploitRepository $CaisseExploitRepository, CaisseRepository $CaisseRepository, PoolVmRepository $PoolVmRepository, 
                                    VmRepository $VmRepository, ProcessRepository $ProcessRepository,
                                    ScenarioRepository $ScenarioRepository, TraitementRepository $TraitementRepository, 
                                    MessageRepository $MessageRepository,EntityManagerInterface $entityManager, UserInterface $user, $id): Response {

        $caisse = $entityManager->getRepository(Caisse::class)->find($id);

        $numCaisse = $caisse->getNumCaisse();

        $currentUser = $user->getCodeOrganisme();

        $roleUser = $user->getRoles();

        if ($currentUser == $numCaisse ||  in_array('ADMINISTRATEUR', $roleUser)) {
        } else {
            $this->addFlash('error', 'Vous ne pouvez pas accéder à la page de cette caisse.');
            return $this->redirectToRoute('app_accueil');
        }

        $listAllMessage = $MessageRepository->findAll();

        $listAllScenario = $ScenarioRepository->findAll();     

        $listAllProcess = $ProcessRepository->findAll();

        $listAllPoolVM = $PoolVmRepository->findAll();

        $listAllCaisse = $CaisseRepository->findAll();

        $listAllCaisseExploit = $CaisseExploitRepository->findAll();
        
        $listAllVM = $VmRepository->findAll();

        $listAllTraitement = $TraitementRepository->findAll();

        $listAllCaisse = $CaisseRepository->findAll();

        $listAllTraitement = $TraitementRepository->findAll();

        $num_agent = $user->getNumeroAgent();
        $nom_agent = $user->getNom();
        $prenom_agent = $user->getPrenom();

        return $this->render('caisse/info_caisse.html.twig',
        [
            'num_agent' => $num_agent,
            'nom_agent' => $nom_agent,
            'prenom_agent' => $prenom_agent,
            'listAllMessage' => $listAllMessage,
            'listAllCaisse' => $listAllCaisse,
            'listAllCaisseExploit' => $listAllCaisseExploit,
            "listAllPoolVM" => $listAllPoolVM,
            "listAllVM" => $listAllVM,
            "listAllProcess" => $listAllProcess,
            "listAllScenario" => $listAllScenario,
            "listAllTraitement" => $listAllTraitement,
            "caisse" => $caisse,
        ]
        );
    }

    /**
     * @Route("/profile", name="profile")
     */
    public function get_profile(TraitementRepository $TraitementRepository, MessageRepository $MessageRepository, UserInterface $user): Response 
    {

        $num_agent = $user->getNumeroAgent();
        $nom_agent = $user->getNom();
        $prenom_agent =  $user->getPrenom();
        $role = implode(', ', $user->getRoles());
        $identifiant = $user->getIdentifiant();
        $codeOrganisme = $user->getCodeOrganisme();

        // Récupérer tous les traitements
        $listAllTraitement = $TraitementRepository->findAll();

        // Filtrer les traitements par auteur
        $auteur = $user->getNom() . ' ' . $user->getPrenom();
        
        $traitementsByAuteur = array_filter($listAllTraitement, function ($traitement) use ($auteur) {
            return $traitement->getAuteur() === $auteur;
        });

        // Récupérer la liste des messages
        $listAllMessage = $MessageRepository->findAll();

        // Filtrer les messages par auteur
        $messagesByUser = array_filter($listAllMessage, function ($message) use ($auteur) {
            return $message->getAuteur() === $auteur;
        });

        // Calculer le nombre total de chaque élément pour l'utilisateur actuel
        $totalTraitementsByAuteur = count($traitementsByAuteur);
        $totalMessagesByUser = count($messagesByUser);

        return $this->render('profile/index.html.twig', [
            'num_agent' => $num_agent,
            'nom_agent' => $nom_agent,
            'prenom_agent' => $prenom_agent,
            'role' => $role,
            'identifiant' => $identifiant,
            'codeOrganisme' => $codeOrganisme,
            'totalTraitementsByAuteur' => $totalTraitementsByAuteur,
            'totalMessagesByUser' => $totalMessagesByUser,
            'traitementsByAuteur' => $traitementsByAuteur,
            'messagesByUser' => $messagesByUser,
        ]);
    }

    /**
     * @Route("/get_all_processes", name="get_all_processes")
     */
    public function getAllProcesses(PoolVmRepository $poolVmRepository, ProcessRepository $processRepository, Request $request): JsonResponse
    {
        $currentDate = new \DateTime($request->query->get('currentDate'));
        $endDate = new \DateTime($request->query->get('endDate'));

        $listAllProcesses = $processRepository->findAll();

        // Initialiser un tableau pour stocker le pourcentage d'utilisation par process
        $processData = [];

        // Boucle sur chaque process
        foreach ($listAllProcesses as $process) {
            // Récupérer les traitements associés au process
            $treatments = $process->getIdTraitement();

            // Initialiser les compteurs pour la durée totale par jour, semaine, mois et année pour chaque process
            $totalDurationDayByProcess = 0;
            $totalDurationWeekByProcess = 0;
            $totalDurationMonthByProcess = 0;
            $totalDurationYearByProcess = 0;

            // Calculer le pourcentage d'utilisation par jour, par semaine et par mois pour chaque process
            $secondsInDay = 24 * 60 * 60;
            $secondsInWeek = 7 * $secondsInDay;
            $secondsInMonth = 30 * $secondsInDay;
            $secondsInYear = 365 * $secondsInDay;

            // Boucle sur chaque traitement associé au process
            foreach ($treatments as $treatment) {
                if ($treatment->getEtat() == 'En cours' && $this->isTreatmentContains($treatment, $currentDate, $endDate)) {
                    // Calculer la durée du traitement
                    $durationInSeconds = $treatment->getDateFin()->getTimestamp() - $treatment->getDateDebut()->getTimestamp();

                    if ($treatment->getDateFin() > $endDate) {
                        $durationUntilEndDate = $endDate->getTimestamp() - $treatment->getDateDebut()->getTimestamp();
                        $durationInSeconds = max(0, $durationUntilEndDate);
                    }

                    $startDateTimestamp = $treatment->getDateDebut()->getTimestamp();
                    $endDateTimestamp = $treatment->getDateFin()->getTimestamp();
                    if ($startDateTimestamp < $currentDate->getTimestamp()) {
                        $startDateTimestamp = $currentDate->getTimestamp();
                        $durationInSeconds = $endDateTimestamp - $startDateTimestamp;
                    }

                    // Ajouter la durée au compteur approprié pour chaque process
                    $totalDurationDayByProcess += min($durationInSeconds, $secondsInDay);
                    $totalDurationWeekByProcess += min($durationInSeconds, $secondsInWeek);
                    $totalDurationMonthByProcess += min($durationInSeconds, $secondsInMonth);
                    $totalDurationYearByProcess += min($durationInSeconds, $secondsInYear);
                }
            }

            // Calculate percentages with a maximum of 100%
            $percentageDay = min(($totalDurationDayByProcess / $secondsInDay) * 100, 100);
            $percentageWeek = min(($totalDurationWeekByProcess / $secondsInWeek) * 100, 100);
            $percentageMonth = min(($totalDurationMonthByProcess / $secondsInMonth) * 100, 100);
            $percentageYear = min(($totalDurationYearByProcess / $secondsInYear) * 100, 100);


            $processData[] = [
                'nom_process' => $process->getNomProcess(),
                'percentageDay' => $percentageDay,
                'percentageWeek' => $percentageWeek,
                'percentageMonth' => $percentageMonth,
                'percentageYear' => $percentageYear,
            ];
        }

        return new JsonResponse($processData);
    }

    /**
     * @Route("/get_all_vms", name="get_all_vms")
     */
    public function getAllVms(PoolVmRepository $poolVmRepository, Request $request): JsonResponse
    {
        $currentDate = new \DateTime($request->query->get('currentDate'));
        $endDate = new \DateTime($request->query->get('endDate'));

        $listAllPool = $poolVmRepository->findAll();

        // Initialiser un tableau pour stocker le nombre de VM utilisé par pool
        $poolData = [];

        // Boucle sur chaque process
        foreach ($listAllPool as $pool) {
            // Récupérer les traitements associés au process
            $treatments = $pool->getTraitements();

            // Initialiser le compteur de VM pour chaque pool
            $totalVmInPool = $pool->getNomVm()->count();
            $vmCountInPool = 0;

            // Boucle sur chaque traitement associé au pool
            foreach ($treatments as $treatment) {
                if ($treatment->getEtat() == 'En cours' && $this->isTreatmentContains($treatment, $currentDate, $endDate)) {
                    // Incrémenter le compteur de VM pour ce traitement
                    $vmCountInTreatment = $treatment->getIdVm()->count();
                    $vmCountInPool += $vmCountInTreatment;
                }
            }

            // Calculer le pourcentage
            $percentage = ($vmCountInPool / $totalVmInPool) * 100;

            $poolData[] = [
                'nom_pool' => $pool->getNomPool(),
                'percentage' => $percentage,
            ];
        }

        return new JsonResponse($poolData);
    }

    private function isTreatmentContains(\App\Entity\Traitement $treatment, \DateTime $currentDate, \DateTime $endDate): bool
    {
        // Assuming that the treatment contains a start date and end date properties
        $startDate = $treatment->getDateDebut();
        $endDateTreatment = $treatment->getDateFin();
    
        // Check if the treatment is ongoing at any point within the specified date range
        return ($startDate <= $endDate && $endDateTreatment >= $currentDate);
    }
    
}


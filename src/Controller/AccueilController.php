<?php

namespace App\Controller;

use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
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

        if ($currentUser == $numCaisse ||  in_array('ROLE_ADMIN', $roleUser)) {
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
    public function get_profile(UserInterface $user): Response 
    {
        
        $num_agent = $user->getNumeroAgent();
        $nom_agent = $user->getNom();
        $prenom_agent =  $user->getPrenom();
        $role = implode(', ', $user->getRoles());
        $identifiant = $user->getIdentifiant();
        $codeOrganisme = $user->getCodeOrganisme();

        return $this->render('profile/index.html.twig', [
            'num_agent' => $num_agent,
            'nom_agent' => $nom_agent,
            'prenom_agent' => $prenom_agent,
            'role' => $role,
            'identifiant' => $identifiant,
            'codeOrganisme' => $codeOrganisme,
        ]);
    }

}

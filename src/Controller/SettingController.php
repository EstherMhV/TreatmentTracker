<?php

namespace App\Controller;

use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\CaisseExploitRepository;
use App\Repository\CaisseRepository;
use App\Repository\PoolVmRepository;
use App\Repository\ProcessRepository;
use App\Repository\ScenarioRepository;
use App\Repository\MessageRepository;
use App\Repository\VmRepository;
use App\Repository\TraitementRepository;


class SettingController extends AbstractController
{
    /**
     * @Route("/setting", name="setting")
     */
    public function index(CaisseExploitRepository $CaisseExploitRepository, CaisseRepository $CaisseRepository, PoolVmRepository $PoolVmRepository, 
                            VmRepository $VmRepository, ProcessRepository $ProcessRepository,
                            ScenarioRepository $ScenarioRepository, MessageRepository $MessageRepository,
                            TraitementRepository $TraitementRepository, UserInterface $user
                            ): Response {

        $roleUser = $user->getRoles();

        if (in_array('ADMINISTRATEUR', $roleUser)) {
        } else {
            $this->addFlash('error', 'Vous ne pouvez pas accéder cette page.');
            return $this->redirectToRoute('app_accueil');
        }
        
        $ListAllTraitment = $TraitementRepository->findAll();
                        
        $ListAllMessage = $MessageRepository->findAll();

        $listAllScenario = $ScenarioRepository->findAll();     

        $listAllProcess = $ProcessRepository->findAll();

        $listAllVM = $VmRepository->findAll([], ['nomvm' => 'ASC']);

        $listAllPoolVM = $PoolVmRepository->findAll();

        $listAllCaisse = $CaisseRepository->findAll();

        $listAllCaisseExploit = $CaisseExploitRepository->findAll();

        $num_agent = $user->getNumeroAgent();
        $nom_agent = $user->getNom();
        $prenom_agent = $user->getPrenom();

        return $this->render('settings.html.twig', 
            [
            'num_agent' => $num_agent,
            'nom_agent' => $nom_agent,   
            'prenom_agent' => $prenom_agent,
            'ListAllMessage' => $ListAllMessage,
            'listAllCaisse' => $listAllCaisse,
            'listAllCaisseExploit' => $listAllCaisseExploit,
            "listAllPoolVM" => $listAllPoolVM,
            "listAllVM" => $listAllVM,
            "listAllProcess" => $listAllProcess,
            "listAllScenario" => $listAllScenario,
            'ListAllTraitment' => $ListAllTraitment
            ]
        );
    }

 
}
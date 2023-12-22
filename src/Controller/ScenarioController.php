<?php

namespace App\Controller;

use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Form\ScenarioType;
use App\Form\UpdateScenarioType;
use App\Entity\Scenario;
use App\Repository\ScenarioRepository;
use Symfony\Component\HttpFoundation\JsonResponse;


class ScenarioController extends AbstractController
{
    /**
     * @Route("/scenario", name="scenario_create")
     */

 
    public function createScenario(UserInterface $user, Request $request, EntityManagerInterface $entityManager): Response
    {
        $scenario = new Scenario();
        $form = $this->createForm(ScenarioType::class, $scenario);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $existingScenario = $entityManager->getRepository(Scenario::class)->findOneBy(['nom_scenario' => $scenario->getNomScenario()]);
            if ($existingScenario) {
                $this->addFlash('scenario_duplicate', 'Duplicate Scenario name.');

                return $this->redirectToRoute('scenario_create'); 
            } else {
                $entityManager->persist($scenario);
                $entityManager->flush();

                return $this->redirectToRoute('setting');

            }
        }

        $num_agent = $user->getNumeroAgent();
        $nom_agent = $user->getNom();
        $prenom_agent = $user->getPrenom();

        return $this->render('scenario/create.scenario.html.twig', [
            'num_agent' => $num_agent,
            'nom_agent' => $nom_agent,
            'prenom_agent' => $prenom_agent,
            'form' => $form->createView(),
        ]);
    }


    public function deleteScenario($id, EntityManagerInterface $entityManager): Response
    {
        $scenario = $entityManager->getRepository(Scenario::class)->find($id);
    
        if (!$scenario) {
            $this->addFlash('error', 'Scénario non trouvé.');
            return $this->redirectToRoute('setting');  
        }

        // Vérifier si le scenario appartient à un traitement
        $traitements = $scenario->getIdTraitement();

        if ($traitements->count() > 0) {
            $this->addFlash('error', 'Ce scénario appartient à des traitements. Veuillez supprimer les traitements avant de supprimer le scénario.');
            return $this->redirectToRoute('setting');
        }

        // Vérifier si la scenari contient des process
        $processInScenario = $scenario->getProcesses();

        if ($processInScenario->count() > 0) {
            // La Pool contient des VM, ajouter un message flash
            $this->addFlash('error', 'Ce scénario contient un ou plusieurs process. Veuillez tous les supprimer, avant de supprimer le scénario.');
            return $this->redirectToRoute('setting');
        }
    
        $entityManager->remove($scenario);
        $entityManager->flush();

        $this->addFlash('success', 'Scénario supprimé !');
    
        return $this->redirectToRoute('setting');  
    }

    
     /**
     * @Route("scenario/edit/{id}", name="scenario_edit", methods={"GET","POST"})
     */
    public function edit(UserInterface $user, Request $request, Scenario $scenario, EntityManagerInterface $entityManager): Response
        {
            $form = $this->createForm(UpdateScenarioType::class, $scenario);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                $entityManager->flush();

                // Redirect or do some other action upon successful update
                return $this->redirectToRoute('setting');
            }
            
            $num_agent = $user->getNumeroAgent();
            $nom_agent = $user->getNom();
            $prenom_agent = $user->getPrenom();

            return $this->render('scenario/edit.scenario.html.twig', [
                'num_agent' => $num_agent,
                'nom_agent' => $nom_agent,
                'prenom_agent' => $prenom_agent,
                'scenario' => $scenario,
                'form' => $form->createView(),
            ]);
        }
    
    /**
     * @Route("/get_scenario_names", name="get_scenario_names")
     */
    public function getScenarioNames(ScenarioRepository $scenarioRepository)
    {
        $scenarioNames = $scenarioRepository->findAllScenarioNames();

        return new JsonResponse($scenarioNames);
    }

}

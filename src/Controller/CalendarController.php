<?php

namespace App\Controller;


use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\Traitement;
use App\Entity\PoolVm;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;


class CalendarController extends AbstractController
{
    /**
     * @Route("/get_traitement_events", name="get_traitement_events", methods={"GET"})
     */
    public function getTraitementEvents(EntityManagerInterface $entityManager): JsonResponse
    {
        $traitements = $entityManager->getRepository(Traitement::class)->findAll();

        $events = [];
        foreach ($traitements as $traitement) {
                $event = [
                    'id' => $traitement->getId(),
                    'title' => $traitement->getId(),
                    'start' => $traitement->getDateDebut()->format('Y-m-d H:i:s'),
                    'end' => $traitement->getDateFin()->format('Y-m-d H:i:s'),
                    'poolName' => $traitement->getIdPool()->getNomPool(),
                    'VmName' => [],
                    'caisseNum' => $traitement->getIdCaisse()->getNumCaisse(),
                    'caisseName' => $traitement->getIdCaisse()->getNomCaisse(),
                    'caisseExploitNum' => $traitement->getIdCaisseExploit()->getNumCaisse(),
                    'caisseExploitName' => $traitement->getIdCaisseExploit()->getNomCaisse(),
                    'scenarioName' => $traitement->getIdScenario()->getNomScenario(),
                    'processName' => [],
                    'nbrDossier' => $traitement->getNbreDossier(),
                    'etat' => $traitement->getEtat(),
                    'errorComment' => $traitement->getErrorComment(),
                    'clotureComment' => $traitement->getClotureComment(),
                    'resourceId' => $traitement->getIdPool()->getId(),
                    'etape' => $traitement->getEtape(),
                ];

                foreach ($traitement->getIdProcess() as $process) {
                    $event['processName'][] = $process->getNomProcess();
                }

                foreach ($traitement->getIdVm() as $vm) {
                    $event['VmName'][] = $vm->getNomVm();
                }

                $events[] = $event;
        }

        return $this->json($events);
    }

    /**
     * @Route("/get_pool_vm_resources", name="get_pool_vm_resources", methods={"GET"})
     */
    public function getPoolVMResources(EntityManagerInterface $entityManager): JsonResponse
    {
        $poolVMs =  $entityManager->getRepository(PoolVm::class)->findAll();

        $resources = [];
        
        foreach ($poolVMs as $poolVM) {
            $poolVMName = $poolVM->getNomPool();
            $associatedVMs = $poolVM->getNomVm();

            $resource = [
                'id' => $poolVM->getId(),
                'title' => $poolVMName,
                'children' => [],
            ];

            foreach ($associatedVMs as $vm) {
                $resource['children'][] = [
                    'id' => $vm->getId(),
                    'title' => $vm->getNomVm(),
                ];
            }

            $resources[] = $resource;
        }

        return $this->json($resources);
    }

    public function deleteTraitement(UserInterface $user, EntityManagerInterface $entityManager, $id): JsonResponse
    {
        $traitement = $entityManager->getRepository(Traitement::class)->find($id);

        if (!$traitement) {
            $this->addFlash('error', 'Traitement non trouvé.');
            return new JsonResponse('error');  
        }

        $currentUser = $user->getNom() . ' ' . $user->getPrenom();

        if ($currentUser !== $traitement->getAuteur()) {
            $this->addFlash('error', 'Vous ne pouvez pas supprimer un traitement dont vous n\'êtes pas l\'auteur.');
            return new JsonResponse('error');
        }

        $vms = $traitement->getIdVm();
        foreach ($vms as $vm) {
            $traitement->removeIdVm($vm);
            $vm->removeIdTraitement($traitement);
        }
        
        $processes = $traitement->getIdProcess();
        foreach ($processes as $process) {
            $traitement->removeIdProcess($process);
            $process->removeIdTraitement($traitement);
        }

        $this->addFlash('success', 'Traitement supprimé.');

        $entityManager->remove($traitement);
        $entityManager->flush();

        $responseData = [
            'success' => true,
        ];

        return new JsonResponse($responseData);
    }

    public function clotureTraitement(EntityManagerInterface $entityManager, Request $request, $id): JsonResponse
    {
        $traitement = $entityManager->getRepository(Traitement::class)->find($id);

        $data = $request->request->all();

        $commentaire = $data['commentaire'];

        if ($traitement->getEtat() === "Erreur") {
            $this->addFlash('error', 'Le traitement ne peut pas être clôturé car il est déjà mis en erreur.');
        } else {
            $traitement->setEtat('Clôturé');
            $traitement->setClotureComment($commentaire);
            $this->addFlash('success', 'Le traitement a été clôturé.');
        }


        $entityManager->persist($traitement);
        $entityManager->flush();

        $responseData = [
            'success' => true,
        ];

        return new JsonResponse($responseData);
    }


    public function erreurTraitement(EntityManagerInterface $entityManager, Request $request, $id): JsonResponse
    {
        $traitement = $entityManager->getRepository(Traitement::class)->find($id);

        $data = $request->request->all();

        $commentaire = $data['commentaire'];

        if ($traitement->getEtat() === "Clôturé") {
            $this->addFlash('error', 'Le traitement ne peut pas être mis en erreur car il est déjà clôturé.');
        } else {
            $traitement->setEtat('Erreur');
            $traitement->setErrorComment($commentaire);
            $this->addFlash('success', 'Le traitement a été mis en erreur.');
        }

        $entityManager->persist($traitement);
        $entityManager->flush();

        $responseData = [
            'success' => true,
        ];

        return new JsonResponse($responseData);
    }    
     
    public function deleteCloture(EntityManagerInterface $entityManager, Request $request, $id): JsonResponse
    {
        $traitement = $entityManager->getRepository(Traitement::class)->find($id);

        if ($traitement->getEtat() === "Erreur") {
            $this->addFlash('error', 'La clôture ne peut pas être supprimé car elle n\'existe pas.');
        } else {
            $traitement->setEtat('En cours');
            $traitement->setClotureComment(null);
            $this->addFlash('success', 'La clôture a été être supprimé.');
        }

        $entityManager->persist($traitement);
        $entityManager->flush();

        $responseData = [
            'success' => true,
        ];

        return new JsonResponse($responseData);
    }


    public function deleteError(EntityManagerInterface $entityManager, $id): JsonResponse
    {
        $traitement = $entityManager->getRepository(Traitement::class)->find($id);

        if ($traitement->getEtat() === "Clôturé") {
            $this->addFlash('error', 'L\'erreur ne peut pas être supprimé car elle n\'existe pas.');
        } else {
            $traitement->setEtat('En cours');
            $traitement->setErrorComment(null);
            $this->addFlash('success', 'L\'erreur a été être supprimé.');
        }

        $entityManager->persist($traitement);
        $entityManager->flush();

        $responseData = [
            'success' => true,
        ];

        return new JsonResponse($responseData);
    }    

    /**
     * @Route("/verify_role", name="verify_role", methods={"GET"})
     */
    public function verifyRole(UserInterface $user): JsonResponse
    {
        $roleUser = $user->getRoles();

        if (!in_array('ROLE_ADMIN', $roleUser)) {
            $responseData = [
                'success' => false,
                'message' => 'Accès refusé. Vous n\'avez pas le rôle requis.',
            ];
            return new JsonResponse($responseData);
        }

        $responseData = [
            'success' => true,
            'role' => 'ROLE_ADMIN',
        ];

        return new JsonResponse($responseData);
    }
}

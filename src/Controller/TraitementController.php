<?php

namespace App\Controller;

use Symfony\Component\Security\Core\User\UserInterface;

use App\Entity\Caisse;
use App\Entity\CaisseExploit;
use App\Entity\Scenario;
use App\Entity\PoolVm;
use App\Entity\Vm;
use App\Entity\Process;
use App\Entity\Traitement;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;


class TraitementController extends AbstractController
{
    private function getTotalVmCountForPumaScenariosByDate(EntityManagerInterface $entityManager, \DateTime $date): int
    {
        $scenarioContains = 'puma';
        $totalVmCount = 0;
    
        $scenarios = $entityManager->getRepository(Scenario::class)->findByCriteria($scenarioContains, $date);
    
        foreach ($scenarios as $scenario) {
            foreach ($scenario->getIdTraitement() as $traitement) {
                // Ajoutez une vérification pour la date du traitement
                if ($traitement->getDateDebut() <= $date && $traitement->getDateFin() >= $date) {
                    $vms = $traitement->getIdVm();
                    $totalVmCount += count($vms);
                }
            }
        }
    
        return $totalVmCount;
    }    


    public function createTraitment(UserInterface $user, Request $request, EntityManagerInterface $entityManager): Response
    {
        $idCaisse = $request->request->get('caisse');
        $idCaisseExploit = $request->request->get('caisse_exploit');

        $idPool = $request->request->get('pool');
        $idScenario = $request->request->get('scenario');

        $selectedVMs = $request->request->get('vm', []);
        $selectedProcesses = $request->request->get('process', []);

        $nbreDossier = $request->request->get('nbredossier');
        $dateDebut = new \DateTime($request->request->get('datedebut'));
        $dateFin = new \DateTime($request->request->get('datefin'));

        // Créer une instance de l'entité Traitement
        $traitement = new Traitement();

        // définition de l'auteur du traitement
        $traitement->setAuteur($user->getNom() . ' ' . $user->getPrenom());

        $traitement->setDateCreation(new \DateTime());
        
        $traitement->setDateDebut($dateDebut);
        $traitement->setDateFin($dateFin);
    
        // Obtenez les entités Caisse et PoolVm à partir de leur ID (suppose que ces entités existent)
        $caisse = $entityManager->getRepository(Caisse::class)->find($idCaisse);
        $caisseExploit = $entityManager->getRepository(CaisseExploit::class)->find($idCaisseExploit);

        $pool = $entityManager->getRepository(PoolVm::class)->find($idPool);    
        $scenario = $entityManager->getRepository(Scenario::class)->find($idScenario);
            
        $traitement->setEtat('En cours');

        $traitement->setErrorComment(null);
        $traitement->setClotureComment(null);

        if (empty($nbreDossier)) {
            $traitement->setNbreDossier('0');
        } else {
            $nbreDossier = intval($nbreDossier);
            $traitement->setNbreDossier($nbreDossier);
        }

        if (!$caisse) {
            $this->addFlash('error', 'Caisse non trouvé.');
            return $this->redirectToRoute('app_accueil');
        } $traitement->setIdCaisse($caisse);

        if (!$caisseExploit) {
            $this->addFlash('error', 'Caisse exploitante non trouvé.');
            return $this->redirectToRoute('app_accueil');
        } $traitement->setIdCaisseExploit($caisseExploit);

        if (!$pool) {
            $this->addFlash('error', 'Pool non trouvé.');
            return $this->redirectToRoute('app_accueil');
        } $traitement->setIdPool($pool);

        if (!$scenario) {
            $this->addFlash('error', 'Scenario non trouvé.');
            return $this->redirectToRoute('app_accueil');
        } $traitement->setIdScenario($scenario);



        // Filtrer les VM en fonction de la pool
        $filteredVMs = [];
        foreach ($selectedVMs as $vmId) {
            $vm = $entityManager->getRepository(Vm::class)->find($vmId);
            if ($vm && $vm->getPoolVm()->getId() == $idPool) {
                $filteredVMs[] = $vm;
            }
        }

        if (empty($filteredVMs)) {
            $this->addFlash('error', 'VM non trouvé.');
            return $this->redirectToRoute('app_accueil');  
        } else {
            foreach ($filteredVMs as $vm) {
                $traitement->addIdVm($vm);
                $vm->addIdTraitement($traitement);
            }
        }

        // Filtrer les processus en fonction du scénario
        $filteredProcesses = [];
        foreach ($selectedProcesses as $processId) {
            $process = $entityManager->getRepository(Process::class)->find($processId);
            foreach ($process->getIdScenario() as $scenario) {
                if ($scenario->getId() == $idScenario) {
                    $filteredProcesses[] = $process;
                }
            }
        }

        // Vérifier si $filteredProcesses est vide après la boucle
        if (empty($filteredProcesses)) {
            $this->addFlash('error', 'Process non trouvé.');
            return $this->redirectToRoute('app_accueil');  
        } else {
            foreach ($filteredProcesses as $process) {
                $traitement->addIdProcess($process);
            }
        }

        // Persister l'entité en base de données
        $traitement->setEtape("Étape 1");
        $entityManager->persist($traitement);
        $entityManager->flush();

        // REPLANIFICATION DES TRAITEMENTS POUR PUMA

        if (stripos($traitement->getIdScenario()->getNomScenario(), 'puma') !== false) {

            $dureePremierTraitement = $traitement->getDateFin()->getTimestamp() - $traitement->getDateDebut()->getTimestamp();

            // Récupérer les délais depuis l'entité Scenario
            $delai1 = $traitement->getIdScenario()->getDelai1();
            $delai2 = $traitement->getIdScenario()->getDelai2();
            $delai3 = $traitement->getIdScenario()->getDelai3();

            // Planifier le deuxième traitement x jours après la date de fin
            $secondTraitement = clone $traitement;
            $secondTraitement->setParentTraitement($traitement);
            // Utiliser cette durée pour calculer la date de fin du deuxième traitement
            $secondTraitement->setDateDebut($traitement->getDateFin()->add(new \DateInterval('P' . $delai1 . 'D')));
            $secondTraitement->setDateFin((new \DateTime())->setTimestamp($secondTraitement->getDateDebut()->getTimestamp() + $dureePremierTraitement));

            // Persister le deuxième traitement en base de données
            $secondTraitement->setEtape("Étape 2");
            $entityManager->persist($secondTraitement);
            $entityManager->flush();

            // Planifier le troisème traitement x jours après la date de fin
            $thirdTraitement = clone $traitement;
            $thirdTraitement->setParentTraitement($secondTraitement);
            // Utiliser cette durée pour calculer la date de fin du deuxième traitement
            $thirdTraitement->setDateDebut($secondTraitement->getDateFin()->add(new \DateInterval('P' . $delai2 . 'D')));
            $thirdTraitement->setDateFin((new \DateTime())->setTimestamp($thirdTraitement->getDateDebut()->getTimestamp() + $dureePremierTraitement));

            // Persister le deuxième traitement en base de données
            $thirdTraitement->setEtape("Étape 3");
            $entityManager->persist($thirdTraitement);
            $entityManager->flush();

            
            // Planifier le quatrième traitement x jours après la date de fin
            $fourthTraitement = clone $traitement;
            $fourthTraitement->setParentTraitement($thirdTraitement);
            // Utiliser cette durée pour calculer la date de fin du deuxième traitement
            $fourthTraitement->setDateDebut($thirdTraitement->getDateFin()->add(new \DateInterval('P' . $delai3 . 'D')));
            $fourthTraitement->setDateFin((new \DateTime())->setTimestamp($fourthTraitement->getDateDebut()->getTimestamp() + $dureePremierTraitement));

            // Persister le deuxième traitement en base de données
            $fourthTraitement->setEtape("Étape 4");
            $entityManager->persist($fourthTraitement);
            $entityManager->flush();
        }
        
        // Vérifier le nombre total de VM pour les scénarios PUMA spécifiques après la replanification
        $dateTraitement = $traitement->getDateDebut(); // Utilisez la date appropriée ici
        $totalVmCountForPumaScenarios = $this->getTotalVmCountForPumaScenariosByDate($entityManager, $dateTraitement);

        // Limite maximale de VM autorisées
        $maxTotalVmCount = 120;

        if ($totalVmCountForPumaScenarios >= $maxTotalVmCount) {
            // Annuler la création du traitement
            $this->addFlash('error', 'La limite du nombre total de VM sur l\'ensemble scénarios PUMA est atteinte (' . $maxTotalVmCount . '). Aucun nouveau traitement ne peut être créé durant cette période.');

            // Supprimer le traitement créé si nécessaire
            $entityManager->remove($traitement);
            $entityManager->flush();

            // Rediriger vers la page d'accueil ou une autre page
            return $this->redirectToRoute('app_accueil');
        }

        $this->addFlash('success', 'Traitement ajouté.');

        return $this->redirectToRoute('app_accueil');

    }

    public function deleteTraitment (UserInterface $user, $id, EntityManagerInterface $entityManager): Response
    { 
        $traitement = $entityManager->getRepository(Traitement::class)->find($id);

        if (!$traitement) {
            $this->addFlash('error', 'Traitement non trouvé.');
            return $this->redirectToRoute('setting');  
        }

        /*
        $currentUser = $user->getNom() . ' ' . $user->getPrenom();

        if ($currentUser !== $traitement->getAuteur()) {
            $this->addFlash('error', 'Vous ne pouvez pas supprimer un traitement dont vous n\'êtes pas l\'auteur.');
            return $this->redirectToRoute('setting');
        }*/

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

        return $this->redirectToRoute('setting');  
    }

    public function editTraitement ($id, Request $request, EntityManagerInterface $entityManager): Response
    {
        $traitement = $entityManager->getRepository(Traitement::class)->find($id);

        if (!$traitement) {
            $this->addFlash('error', 'Traitement non trouvé.');
            return $this->redirectToRoute('app_accueil');  
        } 

        $vms = $traitement->getIdVm();
        foreach ($vms as $vm) {
            $vm->removeIdTraitement($traitement);
        }
         
        $processes = $traitement->getIdProcess();
        foreach ($processes as $process) {
            $traitement->removeIdProcess($process);
            $process->removeIdTraitement($traitement);
        }

        $data = $request->request->all();
        
        $idCaisse = $data['newCaisse'];
        $idCaisseExploit = $data['newCaisseExploit'];

        $idPool = $data['newPool'];
        $idScenario = $data['newScenario'];

        $selectedVMs = $data['newVm'] ?? [];;
        $selectedProcesses = $data['newProcess'] ?? [];;

        $nbreDossier = $data['newNbredossier'];
        $dateDebut = new \DateTime($data['newDatedebut']);
        $dateFin = new \DateTime($data['newDatefin']);

        $traitement->setDateDebut($dateDebut);
        $traitement->setDateFin($dateFin);
    
        // Obtenez les entités Caisse et PoolVm à partir de leur ID (suppose que ces entités existent)
        $caisse = $entityManager->getRepository(Caisse::class)->find($idCaisse);
        $caisseExploit = $entityManager->getRepository(CaisseExploit::class)->find($idCaisseExploit);

        $pool = $entityManager->getRepository(PoolVm::class)->find($idPool);    
        $scenario = $entityManager->getRepository(Scenario::class)->find($idScenario);

        if (empty($nbreDossier)) {
            $traitement->setNbreDossier(null);
        } else {
            $nbreDossier = intval($nbreDossier);
            $traitement->setNbreDossier($nbreDossier);
        }

        if (!$caisse) {
            $this->addFlash('error', 'Caisse non trouvé.');
            return $this->redirectToRoute('app_accueil');
        } $traitement->setIdCaisse($caisse);

        if (!$caisseExploit) {
            $this->addFlash('error', 'Caisse exploitante non trouvé.');
            return $this->redirectToRoute('app_accueil');
        } $traitement->setIdCaisseExploit($caisseExploit);

        if (!$pool) {
            $this->addFlash('error', 'Pool non trouvé.');
            return $this->redirectToRoute('app_accueil');
        } $traitement->setIdPool($pool);

        if (!$scenario) {
            $this->addFlash('error', 'Scenario non trouvé.');
            return $this->redirectToRoute('app_accueil');
        } $traitement->setIdScenario($scenario);


        // Filtrer les VM en fonction de la pool
        $filteredVMs = [];
        foreach ($selectedVMs as $vmId) {
            $vm = $entityManager->getRepository(Vm::class)->find($vmId);
            if ($vm && $vm->getPoolVm()->getId() == $idPool) {
                $filteredVMs[] = $vm;
            }
        }

        // Vérifier si $filteredVMs est vide après la boucle
        if (empty($filteredVMs)) {
            $this->addFlash('error', 'VM non trouvé.');
            return $this->redirectToRoute('app_accueil');
        } else {
            foreach ($filteredVMs as $vm) {
                $traitement->addIdVm($vm);
            }
        }

        // Filtrer les processus en fonction du scénario
        $filteredProcesses = [];
        foreach ($selectedProcesses as $processId) {
            $process = $entityManager->getRepository(Process::class)->find($processId);
            foreach ($process->getIdScenario() as $scenario) {
                if ($scenario->getId() == $idScenario) {
                    $filteredProcesses[] = $process;
                }
            }
        }

        // Vérifier si $filteredProcesses est vide après la boucle
        if (empty($filteredProcesses)) {
            $this->addFlash('error', 'Process non trouvé.');
            return $this->redirectToRoute('app_accueil');
        } else {
            foreach ($filteredProcesses as $process) {
                $traitement->addIdProcess($process);
            }
        }

        $entityManager->persist($traitement);
        $entityManager->flush();

        // REPLANIFICATION DES TRAITEMENTS POUR PUMA
        if (stripos($traitement->getIdScenario()->getNomScenario(), 'puma') !== false) {
            $this->replanifyTreatment($entityManager, $traitement);
        }

        $responseData = [
            'success' => true,
        ];

        $this->addFlash('success', 'Traitement modifié.');

        return new JsonResponse($responseData);

    }
 
    private function replanifyTreatment(EntityManagerInterface $entityManager, Traitement $parentTraitement): void
    {
        $dureePremierTraitement = $parentTraitement->getDateFin()->getTimestamp() - $parentTraitement->getDateDebut()->getTimestamp();

        $idCaisse = $parentTraitement->getIdCaisse();
        $idCaisseExploit = $parentTraitement->getIdCaisseExploit();
        $idScenario = $parentTraitement->getIdScenario();
        $idPool = $parentTraitement->getIdPool();
        $nbrDossier = $parentTraitement->getNbreDossier();

        $idProcesses = $parentTraitement->getIdProcess()->toArray();;
        $idVms = $parentTraitement->getIdVm()->toArray();

        // Récupérer les délais depuis l'entité Scenario
        $delai1 = $parentTraitement->getIdScenario()->getDelai1();
        $delai2 = $parentTraitement->getIdScenario()->getDelai2();
        $delai3 = $parentTraitement->getIdScenario()->getDelai3();

        // Récupérer les traitements liés au parent
        $replanifications = $parentTraitement->getReplanifications();

        // Créer ou mettre à jour le deuxième traitement
        $secondTraitement = $this->UpdateTraitement($parentTraitement, $idCaisse, $idCaisseExploit, $idPool, $idScenario, $idProcesses, $idVms, $delai1, $dureePremierTraitement, 'Etape 2', $nbrDossier, $entityManager);

        // Recalculer la durée du deuxième traitement
        $dureeDeuxiemeTraitement = $secondTraitement->getDateFin()->getTimestamp() - $secondTraitement->getDateDebut()->getTimestamp();

        // Créer ou mettre à jour le troisième traitement avec la même durée que le premier traitement
        $thirdTraitement = $this->UpdateTraitement($secondTraitement, $idCaisse, $idCaisseExploit, $idPool, $idScenario, $idProcesses, $idVms, $delai2, $dureeDeuxiemeTraitement, 'Etape 3', $nbrDossier, $entityManager);

        // Recalculer la durée du troisième traitement
        $dureeThirdTraitement = $thirdTraitement->getDateFin()->getTimestamp() - $thirdTraitement->getDateDebut()->getTimestamp();

        // Créer ou mettre à jour le quatrième traitement avec la même durée que le premier traitement
        $fourthTraitement = $this->UpdateTraitement($thirdTraitement, $idCaisse, $idCaisseExploit, $idPool, $idScenario, $idProcesses, $idVms, $delai3, $dureeThirdTraitement, 'Etape 4', $nbrDossier, $entityManager);
    }

    
    private function UpdateTraitement(Traitement $parentTraitement, $idCaisse, $idCaisseExploit, $idPool, $idScenario, $idProcesses, $idVms, int $delai, int $duree, string $etape, int $nbrDossier, EntityManagerInterface $entityManager): Traitement
    {
        $replanifications = $parentTraitement->getReplanifications();
    
        if (count($replanifications) > 0) {
            $traitement = $replanifications[0];

            $traitement->setIdCaisse($idCaisse);
            $traitement->setIdCaisseExploit($idCaisseExploit);

            $traitement->setIdPool($idPool);
            $traitement->setIdScenario($idScenario);
            $traitement->setNbreDossier($nbrDossier);

            // Suppression des VM du traitement avant de les ajouter
            $vms = $traitement->getIdVm();
            foreach ($vms as $vm) {
                $traitement->removeIdVm($vm);
                $vm->removeIdTraitement($traitement);
            }

            // Suppression des Process du traitement avant de les ajouter
            $processes = $traitement->getIdProcess();
            foreach ($processes as $process) {
                $traitement->removeIdProcess($process);
                $process->removeIdTraitement($traitement);
            }

            // Ajoute les vm une par une
            foreach ($idVms as $idVm) {
                $vm = $entityManager->getRepository(Vm::class)->find($idVm);
                if ($vm) {
                    $traitement->addIdVm($vm);
                    $vm->addIdTraitement($traitement);
                }
            }

            // Vérifier si $idProcesses et $idVms sont non vides avant de les utiliser
            if (!empty($idProcesses)) {
                foreach ($idProcesses as $idProcess) {
                    $process = $entityManager->getRepository(Process::class)->find($idProcess);
                    if ($process && $this->checkProcessScenario($process, $idScenario)) {
                        $traitement->addIdProcess($process);
                    }
                }
            }
            
            $traitement->setEtape($etape);
            $traitement->setDateDebut($parentTraitement->getDateFin()->add(new \DateInterval('P' . $delai . 'D')));
            $traitement->setDateFin((new \DateTime())->setTimestamp($traitement->getDateDebut()->getTimestamp() + $duree));

            $entityManager->flush();

            return $traitement;
        } 
    
        return $parentTraitement;
    } 

    private function checkProcessScenario(Process $process, $idScenario): bool {
        foreach ($process->getIdScenario() as $scenario) {
            if ($scenario->getId() == $idScenario->getId()) {
                return true;
            }
        }
        return false;
    }    
}


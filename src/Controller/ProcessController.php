<?php

namespace App\Controller;

use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Form\ProcessType;
use App\Form\UpdateProcessType;
use App\Entity\Process; 

class ProcessController extends AbstractController
{
    /**
     * @Route("/process", name="process_create")
     */

    public function createProcess(UserInterface $user, Request $request, EntityManagerInterface $entityManager): Response
    {
        $process = new Process();
        $form = $this->createForm(ProcessType::class, $process);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $existingProcess = $entityManager->getRepository(Process::class)->findOneBy(['nom_process' => $process->getNomProcess()]);
            if ($existingProcess) {
                $this->addFlash('process_duplicate', 'Duplicate Process name.');
                return $this->redirectToRoute('process_create');

            } else {
                $entityManager->persist($process);
                $entityManager->flush();
                return $this->redirectToRoute('setting');

            }
             
        }

        $num_agent = $user->getNumeroAgent();
        $nom_agent = $user->getNom();
        $prenom_agent = $user->getPrenom();

        return $this->render('process/create.process.html.twig', [
            'num_agent' => $num_agent,
            'nom_agent' => $nom_agent,
            'prenom_agent' => $prenom_agent,
            'form' => $form->createView(),
        ]);
    }


    public function deleteProcess($id, EntityManagerInterface $entityManager): Response
    {
        $process = $entityManager->getRepository(Process::class)->find($id);
    
        if (!$process) {
            $this->addFlash('error', 'Process non trouvé.');
            return $this->redirectToRoute('setting');  
        }
    
        // Vérifier si le process appartient à un traitement
        $traitements = $process->getIdTraitement();

        if ($traitements->count() > 0) {
            $this->addFlash('error', 'Ce process appartient à des traitements. Veuillez supprimer les traitements avant de supprimer le process.');
            return $this->redirectToRoute('setting');
        }

        $entityManager->remove($process);
        $entityManager->flush();

        $this->addFlash('success', 'Process supprimé !');
    
        return $this->redirectToRoute('setting');  
    }

     /**
     * @Route("process/edit/{id}", name="process_edit", methods={"GET","POST"})
     */
    public function edit(UserInterface $user, Request $request, Process $process, EntityManagerInterface $entityManager): Response
        {
            $form = $this->createForm(UpdateProcessType::class, $process);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                $entityManager->flush();

                // Redirect or do some other action upon successful update
                return $this->redirectToRoute('setting');
            }

            $num_agent = $user->getNumeroAgent();
            $nom_agent = $user->getNom();
            $prenom_agent = $user->getPrenom();

            return $this->render('process/edit.process.html.twig', [
                'num_agent' => $num_agent,
                'nom_agent' => $nom_agent,
                'prenom_agent' => $prenom_agent,
                'process' => $process,
                'form' => $form->createView(),
            ]);
        }
}

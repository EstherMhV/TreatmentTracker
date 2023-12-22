<?php

namespace App\Controller;

use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use App\Form\UpdatePoolVmType;
use App\Entity\PoolVm;
use App\Form\PoolVmType;
use App\Repository\PoolVmRepository;

class PoolVmController extends AbstractController
{
    /**
     * @Route("/poolvm", name="poolvm_create")
     */
    public function createPoolVm(UserInterface $user, Request $request, EntityManagerInterface $entityManager): Response
    {
        $poolVm = new PoolVm();
        $form = $this->createForm(PoolVmType::class, $poolVm);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            
            $existingPoolVm = $entityManager->getRepository(PoolVm::class)->findOneBy(['nom_pool' => $poolVm->getNomPool()]);
            if ($existingPoolVm) {
                $this->addFlash('poolvm_duplicate', 'Duplicate PoolVm name.');

                return $this->redirectToRoute('poolvm_create');
            } else {
            $entityManager->persist($poolVm);
            $entityManager->flush();

            $this->addFlash('success', 'Pool ajouté !');

            return $this->redirectToRoute('setting'); 
            }
        }

        $num_agent = $user->getNumeroAgent();
        $nom_agent = $user->getNom();
        $prenom_agent = $user->getPrenom();

        return $this->render('pool_vm/create.poolvm.html.twig', [
            'num_agent' => $num_agent,
            'nom_agent' => $nom_agent,
            'prenom_agent' => $prenom_agent,
            'form' => $form->createView(),
        ]);
    }


    public function deletePoolVm($id, EntityManagerInterface $entityManager): Response
    {
        $poolvm = $entityManager->getRepository(PoolVm::class)->find($id);
    
        if (!$poolvm) {
            $this->addFlash('error', 'Pool non trouvé.');
            return $this->redirectToRoute('setting');  
        }

        // Vérifier si la Pool appartient à un traitement
        $traitements = $poolvm->getTraitements();

        if ($traitements->count() > 0) {
            $this->addFlash('error', 'Cette Pool appartient à des traitements. Veuillez supprimer les traitements avant de supprimer la Pool.');
            return $this->redirectToRoute('setting');
        }


        // Vérifier si la Pool contient des VM
        $vmsInPool = $poolvm->getNomVm();

        if ($vmsInPool->count() > 0) {
            // La Pool contient des VM, ajouter un message flash
            $this->addFlash('error', 'Cette Pool contient une ou plusieurs VM. Veuillez toutes les supprimer avant de supprimer la Pool.');
            return $this->redirectToRoute('setting');
        }
    
    
        $entityManager->remove($poolvm);
        $entityManager->flush();

        $this->addFlash('success', 'Pool supprimé !');
        
        return $this->redirectToRoute('setting');  
    }


    /**
     * @Route("/poolvm/update/{id}", name="poolvm_edit", methods={"GET","POST"})
     */
    public function edit(UserInterface $user, Request $request, PoolVm $poolvm, EntityManagerInterface $entityManager): Response
        {
            $form = $this->createForm(UpdatePoolVmType::class, $poolvm);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                $entityManager->flush();

                // Redirect or do some other action upon successful update
                return $this->redirectToRoute('setting');
            }

            $num_agent = $user->getNumeroAgent();
            $nom_agent = $user->getNom();
            $prenom_agent = $user->getPrenom();

            return $this->render('pool_vm/edit.poolvm.html.twig', [
                'num_agent' => $num_agent,
                'nom_agent' => $nom_agent,
                'prenom_agent' => $prenom_agent,
                'poolvm' => $poolvm,
                'form' => $form->createView(),
            ]);
    }

    /**
     * @Route("/get_poolvm_names", name="get_poolvm_names")
     */
    public function getCaisseExploitNames(PoolVmRepository $PoolVmRepository)
    {
        $caisseExploitNames = $PoolVmRepository->findAllPoolVmNames();

        return new JsonResponse($caisseExploitNames);
    }
}

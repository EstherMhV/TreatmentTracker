<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Form\UpdateCaisseType;
use App\Form\CaisseType;
use App\Entity\Caisse;

class CaisseController extends AbstractController
{
    /**
     * @Route("/caisse", name="caisse_create")
     */
    public function createCaisse(Request $request, EntityManagerInterface $entityManager): Response
    {
        $caisse = new Caisse();
        $form = $this->createForm(CaisseType::class, $caisse);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            
            $existingCaisse = $entityManager->getRepository(Caisse::class)->findOneBy(['nom_caisse' => $caisse->getNomCaisse()]);
            if ($existingCaisse) {
                $this->addFlash('caisse_duplicate', 'Duplicate Caisse name.');

                return $this->redirectToRoute('caisse_create');
            } else {
            $entityManager->persist($caisse);
            $entityManager->flush();

            return $this->redirectToRoute('setting'); 
            }
        }

        return $this->render('caisse/create.caisse.html.twig', [
            'form' => $form->createView(),
        ]);
    }


    public function deleteCaisse($id, EntityManagerInterface $entityManager): Response
    {
        $caisse = $entityManager->getRepository(Caisse::class)->find($id);
    
        if (!$caisse) {
            $this->addFlash('error', 'Caisse non trouvé.');
            return $this->redirectToRoute('setting');  
        }
    
    
        $entityManager->remove($caisse);
        $entityManager->flush();
    
        return $this->redirectToRoute('setting');  
    }


    /**
     * @Route("/caisse/edit/{id}", name="caisse_edit", methods={"GET","POST"})
     */
    public function edit(Request $request, Caisse $caisse, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(UpdateCaisseType::class, $caisse);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
             $entityManager->flush();

            // Redirect or do some other action upon successful update
            return $this->redirectToRoute('setting');
        }

        return $this->render('caisse/edit.caisse.html.twig', [
            'caisse' => $caisse,
            'form' => $form->createView(),
        ]);
    }

}

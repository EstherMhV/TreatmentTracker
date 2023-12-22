<?php

namespace App\Controller;

use Symfony\Component\Security\Core\User\UserInterface;

use App\Entity\Vm;
use App\Form\VmFormType;
use App\Form\UpdateVmType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class VmController extends AbstractController
{

    /**
     * @Route("vm", name="vm_create") 
     */
    public function createVm(UserInterface $user, Request $request, EntityManagerInterface $entityManager): Response
    {
        $vm = new Vm();
        $form = $this->createForm(VmFormType::class, $vm);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $vm->addIdTraitement(null);
            $entityManager->persist($vm);
            $entityManager->flush();

            //voir si la Vm existe
            $existingVm = $entityManager->getRepository(VM::class)->findOneBy(['nom_vm' => $vm->getNomVm()]);
            if ($existingVm) {
                $this->addFlash('vm_duplicate', 'Duplicate VM name.');

                return $this->redirectToRoute('vm_create');  

            } else {
                $entityManager->persist($vm);
                $entityManager->flush();

                $this->addFlash('success', 'VM ajouté !');

                return $this->redirectToRoute('setting');
            }
        }

        $num_agent = $user->getNumeroAgent();
        $nom_agent = $user->getNom();
        $prenom_agent = $user->getPrenom();

        return $this->render('vm/create.vm.html.twig', [
            'num_agent' => $num_agent,
            'nom_agent' => $nom_agent,
            'prenom_agent' => $prenom_agent,
            'form' => $form->createView(),
        ]);
    }




    
    public function deleteVm($id, EntityManagerInterface $entityManager): Response
    {
        $vm = $entityManager->getRepository(Vm::class)->find($id);

        // Vérifier si la VM existe
        if (!$vm) {
            $this->addFlash('error', 'VM non trouvé.');
            return $this->redirectToRoute('setting');  
        }

        // Vérifier si la VM appartient à un traitement
        $traitements = $vm->getIdTraitement();

        if ($traitements->count() > 0) {
            $this->addFlash('error', 'Cette VM appartient à des traitements. Veuillez supprimer les traitements avant de supprimer la VM.');
            return $this->redirectToRoute('setting');
        }

    
        $entityManager->remove($vm);
        $entityManager->flush();
    
        $this->addFlash('success', 'VM supprimé !');

        return $this->redirectToRoute('setting');  
    }



    /**
     * @Route("vm/edit/{id}", name="vm_edit", methods={"GET","POST"})
     */
    public function edit(UserInterface $user, Request $request, Vm $vm, EntityManagerInterface $entityManager): Response
        {
            $form = $this->createForm(UpdateVmType::class, $vm);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {
                $entityManager->flush();

                // Redirect or do some other action upon successful update
                return $this->redirectToRoute('setting');
            }
            
            $num_agent = $user->getNumeroAgent();
            $nom_agent = $user->getNom();
            $prenom_agent = $user->getPrenom();

            return $this->render('vm/edit.vm.html.twig', [
                'num_agent' => $num_agent,
                'nom_agent' => $nom_agent,
                'prenom_agent' => $prenom_agent,
                'vm' => $vm,
                'form' => $form->createView(),
            ]);
        }
}

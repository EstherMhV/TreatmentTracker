<?php

namespace App\Controller;

use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Message;
use App\Form\MessageType;
use App\Form\UpdateMessageType;

class MessageController extends AbstractController
{
    /**
     * @Route("/message", name="message_create")
     */
    public function createTraitement(UserInterface $user, Request $request, EntityManagerInterface $entityManager): Response
    {
        $message = new Message();

        // définition de l'auteur du message
        $message->setAuteur($user->getNom() . ' ' . $user->getPrenom());

        $form = $this->createForm(MessageType::class, $message);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $entityManager->persist($message);
            $entityManager->flush();

            $this->addFlash('success', 'Message ajouté.');
            return $this->redirectToRoute('setting'); 
        }

        $num_agent = $user->getNumeroAgent();
        $nom_agent = $user->getNom();
        $prenom_agent = $user->getPrenom();

        return $this->render('message/create.message.html.twig', [
            'num_agent' => $num_agent,
            'prenom_agent' => $prenom_agent,
            'nom_agent' => $nom_agent,
            'form' => $form->createView(),
        ]);
    }

    public function deleteMessage(UserInterface $user, $id, EntityManagerInterface $entityManager): Response
    {
        $message = $entityManager->getRepository(Message::class)->find($id);
    
        if (!$message) {
            $this->addFlash('error', 'Message non trouvé.');
            return $this->redirectToRoute('setting');  
        }

        $currentUser = $user->getNom() . ' ' . $user->getPrenom();

        if ($currentUser !== $message->getAuteur()) {
            $this->addFlash('error', 'Vous ne pouvez pas supprimer un message dont vous n\'êtes pas l\'auteur.');
            return $this->redirectToRoute('setting');
        }
    
        $entityManager->remove($message);
        $entityManager->flush();

        $this->addFlash('success', 'Message supprimé.');

        return $this->redirectToRoute('setting');  
    }

     /**
     * @Route("message/edit/{id}", name="message_edit", methods={"GET","POST"})
     */
    public function edit(UserInterface $user, Request $request, Message $message, EntityManagerInterface $entityManager): Response
        {
            $form = $this->createForm(UpdateMessageType::class, $message);
            $form->handleRequest($request);

            if ($form->isSubmitted() && $form->isValid()) {

                $currentUser = $user->getNom() . ' ' . $user->getPrenom();

                if ($currentUser !== $message->getAuteur()) {
                    $this->addFlash('error', 'Vous ne pouvez pas modifier un message dont vous n\'êtes pas l\'auteur.');
                    return $this->redirectToRoute('setting');
                }

                $entityManager->flush();

                $this->addFlash('success', 'Message modifié.');
                // Redirect or do some other action upon successful update
                return $this->redirectToRoute('setting');
            }

            $num_agent = $user->getNumeroAgent();
            $nom_agent = $user->getNom();
            $prenom_agent = $user->getPrenom();

            return $this->render('message/edit.message.html.twig', [
                'num_agent' => $num_agent,
                'nom_agent' => $nom_agent,
                'prenom_agent' => $prenom_agent,
                'message' => $message,
                'form' => $form->createView(),
            ]);
            
        }
}

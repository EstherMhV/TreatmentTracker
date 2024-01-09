<?php

namespace App\Controller;

use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class ContactController extends AbstractController
{
    /**
     * @Route("contact", name="contact")
     */
    public function index(UserInterface $user): Response {

        $num_agent = $user->getNumeroAgent();
        $nom_agent = $user->getNom();
        $prenom_agent = $user->getPrenom();

        return $this->render('contact/index.html.twig',
            [
                'num_agent' => $num_agent,
                'prenom_agent' => $prenom_agent,
                'nom_agent' => $nom_agent,
            ]
        );
    }

    /**
     * @Route("/contact_form", name="contactForm", methods={"POST"})
     */
    public function contactForm(Request $request, MailerInterface $mailer): Response
    {
        // recupération des éléments du formulaire
        $subject = $request->request->get('subject');
        $messageText = $request->request->get('message');

        try {
            $email = (new Email())
                ->from('pladapath@gmail.com')
                ->to('diego.bussu@assurance-maladie.fr')
                ->subject('Contact Form Submission: ' . $subject)
                ->text($messageText)
                ->html('<p>' . $messageText . '</p>');
    
            $mailer->send($email);
    
            $this->addFlash('success', 'Demande envoyé !');

        } catch (TransportExceptionInterface $e) {

            $this->addFlash('error', 'Erreur. Demande non envoyé !');
        }

        return $this->redirectToRoute('contact');
    }
}
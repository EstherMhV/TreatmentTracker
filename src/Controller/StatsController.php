<?php

namespace App\Controller;

use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class StatsController extends AbstractController
{
    /**
     * @Route("statistiques", name="statistiques")
     */
    public function index(UserInterface $user): Response {

        $num_agent = $user->getNumeroAgent();
        $nom_agent = $user->getNom();
        $prenom_agent = $user->getPrenom();

        return $this->render('statistiques/index.html.twig',
            [
                'num_agent' => $num_agent,
                'prenom_agent' => $prenom_agent,
                'nom_agent' => $nom_agent,
            ]
        );
    }
}
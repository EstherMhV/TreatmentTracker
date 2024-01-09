<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MessageRepository")
 */
class Message
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime", options={"default": "CURRENT_TIMESTAMP"})
     */
    private $date;

    /**
     * @ORM\Column(type="string", length=300)
     */
    private $contenu;

    /**
     * @ORM\Column(type="string", length=10)
     */
    private $priorite;

    /**
     * @ORM\Column(type="string", length=50)
     */
    private $auteur;

    
    public function __toString(): string {
        return $this->contenu;
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function __construct()
    {
        $this->date = new \DateTime(); 
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }
    

    public function getContenu(): ?string
    {
        return $this->contenu;
    }

    public function setContenu(string $contenu): self
    {
        $this->contenu = $contenu;

        return $this;
    }

    public function getPriorite(): ?string
    {
        return $this->priorite;
    }

    public function setPriorite(string $priorite): self
    {
        $this->priorite = $priorite;

        return $this;
    }

    public function getAuteur(): ?string
    {
        return $this->auteur;
    }

    public function setAuteur(string $auteur): self
    {
        $this->auteur = $auteur;

        return $this;
    }
}

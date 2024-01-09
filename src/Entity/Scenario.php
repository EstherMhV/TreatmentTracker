<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ScenarioRepository")
 */
class Scenario
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50, unique=true)
     */
    private $nom_scenario;

    /**
     * @ORM\Column(type="integer")
     */
    private $delai1;

    /**
     * @ORM\Column(type="integer")
     */
    private $delai2;

    /**
     * @ORM\Column(type="integer")
     */
    private $delai3;

    /**
     * @ORM\ManyToMany(targetEntity=Process::class, mappedBy="id_scenario")
     */
    private $processes;

    /**
     * @ORM\OneToMany(targetEntity=Traitement::class, mappedBy="id_scenario")
     */
    private $id_traitement;

    public function __construct()
    {
        $this->processes = new ArrayCollection();
        $this->id_traitement = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomScenario(): ?string
    {
        return $this->nom_scenario;
    }

    public function setNomScenario(string $nom_scenario): self
    {
        $this->nom_scenario = $nom_scenario;

        return $this;
    }

    public function getDelai1(): ?int
    {
        return $this->delai1;
    }

    public function setDelai1(int $delai1): self
    {
        $this->delai1 = $delai1;

        return $this;
    }

    public function getDelai2(): ?int
    {
        return $this->delai2;
    }

    public function setDelai2(int $delai2): self
    {
        $this->delai2 = $delai2;

        return $this;
    }

    public function getDelai3(): ?int
    {
        return $this->delai3;
    }

    public function setDelai3(int $delai3): self
    {
        $this->delai3 = $delai3;

        return $this;
    }

    public function __toString(): string
    {
        return $this->nom_scenario;
    }

    /**
     * @return Collection<int, Process>
     */
    public function getProcesses(): Collection
    {
        return $this->processes;
    }

    public function addProcess(Process $process): self
    {
        if (!$this->processes->contains($process)) {
            $this->processes[] = $process;
            $process->addIdScenario($this); // Ensure bidirectional association
        }

        return $this;
    }

    public function removeProcess(Process $process): self
    {
        if ($this->processes->removeElement($process)) {
            $process->removeIdScenario($this); // Ensure bidirectional association
        }

        return $this;
    }

    /**
     * @return Collection<int, Traitement>
     */
    public function getIdTraitement(): Collection
    {
        return $this->id_traitement;
    }

    public function addIdTraitement(Traitement $idTraitement): self
    {
        if (!$this->id_traitement->contains($idTraitement)) {
            $this->id_traitement[] = $idTraitement;
            $idTraitement->setIdScenario($this);
        }

        return $this;
    }

    public function removeIdTraitement(Traitement $idTraitement): self
    {
        if ($this->id_traitement->removeElement($idTraitement)) {
            // set the owning side to null (unless already changed)
            if ($idTraitement->getIdScenario() === $this) {
                $idTraitement->setIdScenario(null);
            }
        }

        return $this;
    }
}

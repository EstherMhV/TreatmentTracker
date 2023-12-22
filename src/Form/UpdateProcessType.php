<?php

namespace App\Form;

use App\Entity\Process;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\Range;

class UpdateProcessType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('nom_process', TextareaType::class, [
                'attr' => [
                    'style' => 'resize: none;',
                    'rows' => 2,
                    'class' => 'form-control',
                ],
                'constraints' => [
                    new Length([
                        'max' => 50,
                        'maxMessage' => 'Le nom ne doit pas dépasser {{ limit }} caractères.',
                    ]),
                ],
                'label' => 'Nom du process',
            ])
            ->add('temps_minute_dossier', null, [
                'label' => 'Temps/min par dossiers',
                'constraints' => [
                    new Range([
                        'min' => 1,
                        'notInRangeMessage' => 'Le délai doit être supérieur ou égal à {{ min }} minute.',
                    ]),
                ],
            ])
            ->add('id_scenario', EntityType::class, [
                'class' => 'App\Entity\Scenario',
                'choice_label' => 'nom_scenario',
                'label' => 'Nom du scenario',
            ])
            ->add('vm_max', null, [
                'label' => 'Limite VM',
                'constraints' => [
                    new Range([
                        'min' => 1,
                        'notInRangeMessage' => 'La limite doit être supérieur ou égal à {{ min }}.',
                    ]),
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Process::class,
        ]);
    }
}

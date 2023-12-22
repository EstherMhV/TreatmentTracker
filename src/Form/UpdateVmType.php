<?php

namespace App\Form;

use App\Entity\Vm;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Validator\Constraints\Length;

class UpdateVmType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
        ->add('nom_vm', TextareaType::class, [
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
            'label' => 'Nom de la vm',
        ])
            ->add('poolVm', EntityType::class, [
                'class' => 'App\Entity\PoolVm',
                'choice_label' => 'nom_pool',
                'label' => 'Pool associé',
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => Vm::class,
        ]);
    }
}

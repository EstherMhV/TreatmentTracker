<?php

namespace App\Form;

use App\Entity\PoolVm;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Validator\Constraints\Length;


class UpdatePoolVmType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('nom_pool', TextareaType::class, [
                'attr' => [
                    'style' => 'resize: none;',
                    'rows' => 2,
                    'class' => 'form-control',
                ],
                'constraints' => [
                    new Length([
                        'max' => 25,
                        'maxMessage' => 'Le nom ne doit pas dépasser {{ limit }} caractères.',
                    ]),
                ],
                'label' => 'Nom de la pool',
            ])
            ->add('id_caisse_exploit', EntityType::class, [
                'class' => 'App\Entity\CaisseExploit',
                'choice_label' => 'nom_caisse',
                'label' => 'Caisse exploitante associé',
            ]);
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => PoolVm::class,
        ]);
    }
}

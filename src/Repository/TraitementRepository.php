<?php

namespace App\Repository;

use App\Entity\Traitement;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;

/**
 * @extends ServiceEntityRepository<Traitement>
 *
 * @method Traitement|null find($id, $lockMode = null, $lockVersion = null)
 * @method Traitement|null findOneBy(array $criteria, array $orderBy = null)
 * @method Traitement[]    findAll()
 * @method Traitement[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TraitementRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Traitement::class);
    }

    public function add(Traitement $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Traitement $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findTraitementsForDate(\DateTimeInterface $selectedDate)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.date_debut <= :selectedDate')
            ->andWhere('t.date_fin >= :selectedDate')
            ->setParameter('selectedDate', $selectedDate)
            ->getQuery()
            ->getResult();
    }
    
    public function find($id, $lockMode = null, $lockVersion = null): ?object
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }
//    /**
//     * @return Traitement[] Returns an array of Traitement objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('t.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Traitement
//    {
//        return $this->createQueryBuilder('t')
//            ->andWhere('t.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}

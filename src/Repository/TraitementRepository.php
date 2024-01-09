<?php

namespace App\Repository;

use App\Entity\Traitement;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Query\ResultSetMapping;
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






    public function findByDossierStatisticsTotalByYearAndMonth($year)
    {
        $entityManager = $this->getEntityManager();
        
        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('year', 'year');
        $rsm->addScalarResult('month', 'month');
        $rsm->addScalarResult('total_dossiers', 'totalDossiers'); // Use the correct alias

        $query = $entityManager->createNativeQuery('
            SELECT 
                EXTRACT(YEAR FROM t.date_debut::timestamp) AS year,
                EXTRACT(MONTH FROM t.date_debut::timestamp) AS month,
                SUM(t.nbre_dossier) AS total_dossiers
            FROM 
                traitement AS t
            WHERE
                EXTRACT(YEAR FROM t.date_debut::timestamp) = :yearParam
            GROUP BY 
                EXTRACT(YEAR FROM t.date_debut::timestamp), EXTRACT(MONTH FROM t.date_debut::timestamp)
            ORDER BY 
                year, month;
        ', $rsm);

        // Bind the parameter to the actual value
        $query->setParameter('yearParam', $year);

        $result = $query->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);

        return $result;
    }


    public function findByPool($year, $poolVM)
    {
        $entityManager = $this->getEntityManager();
        $rsm = new ResultSetMapping();
        $rsm->addScalarResult('year', 'year');
        $rsm->addScalarResult('month', 'month');
        $rsm->addScalarResult('total_dossiers', 'totalDossiers');
    
        $query = $entityManager->createNativeQuery('
            SELECT 
                EXTRACT(YEAR FROM traitement.date_debut::timestamp) AS year,
                EXTRACT(MONTH FROM traitement.date_debut::timestamp) AS month,
                SUM(traitement.nbre_dossier) AS total_dossiers
            FROM 
                traitement
            WHERE
                (:yearParam IS NULL OR EXTRACT(YEAR FROM traitement.date_debut::timestamp) = :yearParam)
                AND (:poolParam IS NULL OR traitement.id_pool_id = :poolParam)
            GROUP BY 
                EXTRACT(YEAR FROM traitement.date_debut::timestamp), EXTRACT(MONTH FROM traitement.date_debut::timestamp)
            ORDER BY 
                year, month;
        ', $rsm);
    
        // Bind the parameters to the actual values
        $query->setParameter('yearParam', $year);
        $query->setParameter('poolParam', $poolVM);
    
        $result = $query->getResult(\Doctrine\ORM\Query::HYDRATE_ARRAY);
    
        return $result;
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

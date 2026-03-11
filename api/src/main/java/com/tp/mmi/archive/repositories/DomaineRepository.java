package com.tp.mmi.archive.repositories;

import com.tp.mmi.archive.models.Domaine;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DomaineRepository extends CrudRepository<Domaine, Long> {
}

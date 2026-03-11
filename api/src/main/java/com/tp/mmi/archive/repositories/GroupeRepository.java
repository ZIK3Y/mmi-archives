package com.tp.mmi.archive.repositories;

import com.tp.mmi.archive.models.Groupe;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupeRepository extends CrudRepository<Groupe, Long> {
}

package com.tp.mmi.archive.repositories;

import com.tp.mmi.archive.models.Sae;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaeRepository extends CrudRepository<Sae, Long> {
}

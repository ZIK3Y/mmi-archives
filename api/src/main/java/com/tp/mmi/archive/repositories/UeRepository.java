package com.tp.mmi.archive.repositories;

import com.tp.mmi.archive.models.Ue;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UeRepository extends CrudRepository<Ue, Long> {
}

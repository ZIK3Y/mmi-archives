package com.tp.mmi.archive.repositories;

import com.tp.mmi.archive.models.SaeCompetence;
import com.tp.mmi.archive.models.SaeCompetenceId;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaeCompetenceRepository extends CrudRepository<SaeCompetence, SaeCompetenceId> {
}

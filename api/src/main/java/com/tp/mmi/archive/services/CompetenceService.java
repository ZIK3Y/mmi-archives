package com.tp.mmi.archive.services;

import com.tp.mmi.archive.models.Competence;
import com.tp.mmi.archive.repositories.CompetenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompetenceService {

    @Autowired
    private CompetenceRepository competenceRepository;

    public Competence saveCompetence(Competence competence) {
        return competenceRepository.save(competence);
    }

    public Iterable<Competence> getAllCompetences() {
        return competenceRepository.findAll();
    }

    public Competence getCompetenceById(Long id) {
        return competenceRepository.findById(id).orElse(null);
    }

    public Competence updateCompetence(Long id, Competence competence) {
        competence.setIdCompetence(id);
        return competenceRepository.save(competence);
    }

    public void deleteCompetenceById(Long id) {
        competenceRepository.deleteById(id);
    }
}

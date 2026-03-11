package com.tp.mmi.archive.services;

import com.tp.mmi.archive.models.SaeCompetence;
import com.tp.mmi.archive.models.SaeCompetenceId;
import com.tp.mmi.archive.repositories.SaeCompetenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SaeCompetenceService {

    @Autowired
    private SaeCompetenceRepository saeCompetenceRepository;

    public SaeCompetence saveSaeCompetence(SaeCompetence saeCompetence) {
        return saeCompetenceRepository.save(saeCompetence);
    }

    public Iterable<SaeCompetence> getAllSaeCompetences() {
        return saeCompetenceRepository.findAll();
    }

    public SaeCompetence getSaeCompetenceById(SaeCompetenceId id) {
        return saeCompetenceRepository.findById(id).orElse(null);
    }

    public void deleteSaeCompetenceById(SaeCompetenceId id) {
        saeCompetenceRepository.deleteById(id);
    }
}

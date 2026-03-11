package com.tp.mmi.archive.services;

import com.tp.mmi.archive.models.Domaine;
import com.tp.mmi.archive.repositories.DomaineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DomaineService {

    @Autowired
    private DomaineRepository domaineRepository;

    public Domaine saveDomaine(Domaine domaine) {
        return domaineRepository.save(domaine);
    }

    public Iterable<Domaine> getAllDomaines() {
        return domaineRepository.findAll();
    }

    public Domaine getDomaineById(Long id) {
        return domaineRepository.findById(id).orElse(null);
    }

    public Domaine updateDomaine(Long id, Domaine domaine) {
        domaine.setIdDomaine(id);
        return domaineRepository.save(domaine);
    }

    public void deleteDomaineById(Long id) {
        domaineRepository.deleteById(id);
    }
}

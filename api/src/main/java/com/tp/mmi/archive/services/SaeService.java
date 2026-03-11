package com.tp.mmi.archive.services;

import com.tp.mmi.archive.models.Sae;
import com.tp.mmi.archive.repositories.SaeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SaeService {

    @Autowired
    private SaeRepository saeRepository;

    public Sae saveSae(Sae sae) {
        return saeRepository.save(sae);
    }

    public Iterable<Sae> getAllSaes() {
        return saeRepository.findAll();
    }

    public Sae getSaeById(Long id) {
        return saeRepository.findById(id).orElse(null);
    }

    public Sae updateSae(Long id, Sae sae) {
        sae.setIdSae(id);
        return saeRepository.save(sae);
    }

    public void deleteSaeById(Long id) {
        saeRepository.deleteById(id);
    }
}

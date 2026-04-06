package com.tp.mmi.archive.services;

import com.tp.mmi.archive.dto.SaeDTO;
import com.tp.mmi.archive.models.Sae;
import com.tp.mmi.archive.repositories.SaeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class SaeService {

    @Autowired
    private SaeRepository saeRepository;

    public Sae saveSae(Sae sae) {
        return saeRepository.save(sae);
    }

    public List<SaeDTO> getAllSaes() {
        return StreamSupport.stream(saeRepository.findAll().spliterator(), false)
                .map(SaeDTO::new)
                .collect(Collectors.toList());
    }

    public SaeDTO getSaeById(Long id) {
        return saeRepository.findById(id).map(SaeDTO::new).orElse(null);
    }

    public List<SaeDTO> getSaesByAnnee(String anneePromo) {
        return StreamSupport.stream(saeRepository.findAll().spliterator(), false)
                .filter(s -> anneePromo.equalsIgnoreCase(s.getAnneePromo()))
                .map(SaeDTO::new)
                .collect(Collectors.toList());
    }

    public List<SaeDTO> getSaesByDomaine(String domaine) {
        return StreamSupport.stream(saeRepository.findAll().spliterator(), false)
                .filter(s -> s.getDomaine() != null && domaine.equalsIgnoreCase(s.getDomaine().getLibelle()))
                .map(SaeDTO::new)
                .collect(Collectors.toList());
    }

    public List<SaeDTO> getSaesOrderedByNote() {
        return StreamSupport.stream(saeRepository.findAll().spliterator(), false)
                .map(SaeDTO::new)
                .sorted((a, b) -> Float.compare(b.getNote(), a.getNote()))
                .collect(Collectors.toList());
    }

    public Sae updateSae(Long id, Sae sae) {
        sae.setIdSae(id);
        return saeRepository.save(sae);
    }

    public void deleteSaeById(Long id) {
        saeRepository.deleteById(id);
    }
}

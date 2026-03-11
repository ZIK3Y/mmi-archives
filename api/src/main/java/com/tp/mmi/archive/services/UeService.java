package com.tp.mmi.archive.services;

import com.tp.mmi.archive.models.Ue;
import com.tp.mmi.archive.repositories.UeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UeService {

    @Autowired
    private UeRepository ueRepository;

    public Ue saveUe(Ue ue) {
        return ueRepository.save(ue);
    }

    public Iterable<Ue> getAllUes() {
        return ueRepository.findAll();
    }

    public Ue getUeById(Long id) {
        return ueRepository.findById(id).orElse(null);
    }

    public Ue updateUe(Long id, Ue ue) {
        ue.setIdUe(id);
        return ueRepository.save(ue);
    }

    public void deleteUeById(Long id) {
        ueRepository.deleteById(id);
    }
}

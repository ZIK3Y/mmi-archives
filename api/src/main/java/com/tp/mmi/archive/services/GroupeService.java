package com.tp.mmi.archive.services;

import com.tp.mmi.archive.models.Groupe;
import com.tp.mmi.archive.repositories.GroupeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupeService {

    @Autowired
    private GroupeRepository groupeRepository;

    public Groupe saveGroupe(Groupe groupe) {
        return groupeRepository.save(groupe);
    }

    public Iterable<Groupe> getAllGroupes() {
        return groupeRepository.findAll();
    }

    public Groupe getGroupeById(Long id) {
        return groupeRepository.findById(id).orElse(null);
    }

    public Groupe updateGroupe(Long id, Groupe groupe) {
        groupe.setIdGroupe(id);
        return groupeRepository.save(groupe);
    }

    public void deleteGroupeById(Long id) {
        groupeRepository.deleteById(id);
    }
}

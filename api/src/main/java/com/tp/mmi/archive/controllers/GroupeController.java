package com.tp.mmi.archive.controller;

import com.tp.mmi.archive.models.Groupe;
import com.tp.mmi.archive.services.GroupeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groupes")
public class GroupeController {

    @Autowired
    private GroupeService groupeService;

    @PostMapping
    public Groupe createGroupe(@RequestBody Groupe groupe) {
        return groupeService.saveGroupe(groupe);
    }

    @GetMapping
    public Iterable<Groupe> getAllGroupes() {
        return groupeService.getAllGroupes();
    }

    @GetMapping("/{id}")
    public Groupe getGroupeById(@PathVariable Long id) {
        return groupeService.getGroupeById(id);
    }

    @PutMapping("/{id}")
    public Groupe updateGroupe(@PathVariable Long id, @RequestBody Groupe groupe) {
        return groupeService.updateGroupe(id, groupe);
    }

    @DeleteMapping("/{id}")
    public void deleteGroupe(@PathVariable Long id) {
        groupeService.deleteGroupeById(id);
    }
}

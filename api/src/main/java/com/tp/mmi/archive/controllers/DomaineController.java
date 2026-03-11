package com.tp.mmi.archive.controller;

import com.tp.mmi.archive.models.Domaine;
import com.tp.mmi.archive.services.DomaineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/domaines")
public class DomaineController {

    @Autowired
    private DomaineService domaineService;

    @PostMapping
    public Domaine createDomaine(@RequestBody Domaine domaine) {
        return domaineService.saveDomaine(domaine);
    }

    @GetMapping
    public Iterable<Domaine> getAllDomaines() {
        return domaineService.getAllDomaines();
    }

    @GetMapping("/{id}")
    public Domaine getDomaineById(@PathVariable Long id) {
        return domaineService.getDomaineById(id);
    }

    @PutMapping("/{id}")
    public Domaine updateDomaine(@PathVariable Long id, @RequestBody Domaine domaine) {
        return domaineService.updateDomaine(id, domaine);
    }

    @DeleteMapping("/{id}")
    public void deleteDomaine(@PathVariable Long id) {
        domaineService.deleteDomaineById(id);
    }
}

package com.tp.mmi.archive.controllers;

import com.tp.mmi.archive.models.Competence;
import com.tp.mmi.archive.services.CompetenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/competences")
public class CompetenceController {

    @Autowired
    private CompetenceService competenceService;

    @PostMapping
    public Competence createCompetence(@RequestBody Competence competence) {
        return competenceService.saveCompetence(competence);
    }

    @GetMapping
    public Iterable<Competence> getAllCompetences() {
        return competenceService.getAllCompetences();
    }

    @GetMapping("/{id}")
    public Competence getCompetenceById(@PathVariable Long id) {
        return competenceService.getCompetenceById(id);
    }

    @PutMapping("/{id}")
    public Competence updateCompetence(@PathVariable Long id, @RequestBody Competence competence) {
        return competenceService.updateCompetence(id, competence);
    }

    @DeleteMapping("/{id}")
    public void deleteCompetence(@PathVariable Long id) {
        competenceService.deleteCompetenceById(id);
    }
}

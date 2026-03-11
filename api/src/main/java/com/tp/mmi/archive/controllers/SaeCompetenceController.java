package com.tp.mmi.archive.controller;

import com.tp.mmi.archive.models.SaeCompetence;
import com.tp.mmi.archive.models.SaeCompetenceId;
import com.tp.mmi.archive.services.SaeCompetenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sae-competences")
public class SaeCompetenceController {

    @Autowired
    private SaeCompetenceService saeCompetenceService;

    @PostMapping
    public SaeCompetence createSaeCompetence(@RequestBody SaeCompetence saeCompetence) {
        return saeCompetenceService.saveSaeCompetence(saeCompetence);
    }

    @GetMapping
    public Iterable<SaeCompetence> getAllSaeCompetences() {
        return saeCompetenceService.getAllSaeCompetences();
    }

    @GetMapping("/{idSae}/{idCompetence}")
    public SaeCompetence getSaeCompetenceById(@PathVariable Long idSae,
                                              @PathVariable Long idCompetence) {
        return saeCompetenceService.getSaeCompetenceById(new SaeCompetenceId(idSae, idCompetence));
    }

    @DeleteMapping("/{idSae}/{idCompetence}")
    public void deleteSaeCompetence(@PathVariable Long idSae, @PathVariable Long idCompetence) {
        saeCompetenceService.deleteSaeCompetenceById(new SaeCompetenceId(idSae, idCompetence));
    }
}

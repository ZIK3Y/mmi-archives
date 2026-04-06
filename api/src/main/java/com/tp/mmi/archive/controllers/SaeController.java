package com.tp.mmi.archive.controllers;

import com.tp.mmi.archive.dto.SaeDTO;
import com.tp.mmi.archive.models.Sae;
import com.tp.mmi.archive.services.SaeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saes")
@CrossOrigin
public class SaeController {

    @Autowired
    private SaeService saeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Sae createSae(@RequestBody Sae sae) {
        return saeService.saveSae(sae);
    }

    @GetMapping
    public List<SaeDTO> getAllSaes() {
        return saeService.getAllSaes();
    }

    @GetMapping("/{id}")
    public SaeDTO getSaeById(@PathVariable Long id) {
        return saeService.getSaeById(id);
    }

    @GetMapping("/annee/{annee}")
    public List<SaeDTO> getSaesByAnnee(@PathVariable String annee) {
        return saeService.getSaesByAnnee(annee);
    }

    @GetMapping("/domaine/{domaine}")
    public List<SaeDTO> getSaesByDomaine(@PathVariable String domaine) {
        return saeService.getSaesByDomaine(domaine);
    }

    @GetMapping("/classement")
    public List<SaeDTO> getSaesClassement() {
        return saeService.getSaesOrderedByNote();
    }

    @PutMapping("/{id}")
    public Sae updateSae(@PathVariable Long id, @RequestBody Sae sae) {
        return saeService.updateSae(id, sae);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSae(@PathVariable Long id) {
        saeService.deleteSaeById(id);
    }
}

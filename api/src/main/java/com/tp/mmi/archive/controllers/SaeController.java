package com.tp.mmi.archive.controllers;

import com.tp.mmi.archive.models.Sae;
import com.tp.mmi.archive.services.SaeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/saes")
public class SaeController {

    @Autowired
    private SaeService saeService;

    @PostMapping
    public Sae createSae(@RequestBody Sae sae) {
        return saeService.saveSae(sae);
    }

    @GetMapping
    public Iterable<Sae> getAllSaes() {
        return saeService.getAllSaes();
    }

    @GetMapping("/{id}")
    public Sae getSaeById(@PathVariable Long id) {
        return saeService.getSaeById(id);
    }

    @PutMapping("/{id}")
    public Sae updateSae(@PathVariable Long id, @RequestBody Sae sae) {
        return saeService.updateSae(id, sae);
    }

    @DeleteMapping("/{id}")
    public void deleteSae(@PathVariable Long id) {
        saeService.deleteSaeById(id);
    }
}

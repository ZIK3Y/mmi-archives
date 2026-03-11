package com.tp.mmi.archive.controllers;

import com.tp.mmi.archive.models.Ue;
import com.tp.mmi.archive.services.UeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ues")
public class UeController {

    @Autowired
    private UeService ueService;

    @PostMapping
    public Ue createUe(@RequestBody Ue ue) {
        return ueService.saveUe(ue);
    }

    @GetMapping
    public Iterable<Ue> getAllUes() {
        return ueService.getAllUes();
    }

    @GetMapping("/{id}")
    public Ue getUeById(@PathVariable Long id) {
        return ueService.getUeById(id);
    }

    @PutMapping("/{id}")
    public Ue updateUe(@PathVariable Long id, @RequestBody Ue ue) {
        return ueService.updateUe(id, ue);
    }

    @DeleteMapping("/{id}")
    public void deleteUe(@PathVariable Long id) {
        ueService.deleteUeById(id);
    }
}

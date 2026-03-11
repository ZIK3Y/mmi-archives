package com.tp.mmi.archive.controller;

import com.tp.mmi.archive.models.GroupeSae;
import com.tp.mmi.archive.models.GroupeSaeId;
import com.tp.mmi.archive.services.GroupeSaeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/groupe-saes")
public class GroupeSaeController {

    @Autowired
    private GroupeSaeService groupeSaeService;

    @PostMapping
    public GroupeSae createGroupeSae(@RequestBody GroupeSae groupeSae) {
        return groupeSaeService.saveGroupeSae(groupeSae);
    }

    @GetMapping
    public Iterable<GroupeSae> getAllGroupeSaes() {
        return groupeSaeService.getAllGroupeSaes();
    }

    @GetMapping("/{idGroupe}/{idSae}")
    public GroupeSae getGroupeSaeById(@PathVariable Long idGroupe, @PathVariable Long idSae) {
        return groupeSaeService.getGroupeSaeById(new GroupeSaeId(idGroupe, idSae));
    }

    @PutMapping("/{idGroupe}/{idSae}")
    public GroupeSae updateGroupeSae(@PathVariable Long idGroupe, @PathVariable Long idSae,
                                     @RequestBody GroupeSae groupeSae) {
        return groupeSaeService.updateGroupeSae(new GroupeSaeId(idGroupe, idSae), groupeSae);
    }

    @DeleteMapping("/{idGroupe}/{idSae}")
    public void deleteGroupeSae(@PathVariable Long idGroupe, @PathVariable Long idSae) {
        groupeSaeService.deleteGroupeSaeById(new GroupeSaeId(idGroupe, idSae));
    }
}

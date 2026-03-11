package com.tp.mmi.archive.services;

import com.tp.mmi.archive.models.GroupeSae;
import com.tp.mmi.archive.models.GroupeSaeId;
import com.tp.mmi.archive.repositories.GroupeSaeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupeSaeService {

    @Autowired
    private GroupeSaeRepository groupeSaeRepository;

    public GroupeSae saveGroupeSae(GroupeSae groupeSae) {
        return groupeSaeRepository.save(groupeSae);
    }

    public Iterable<GroupeSae> getAllGroupeSaes() {
        return groupeSaeRepository.findAll();
    }

    public GroupeSae getGroupeSaeById(GroupeSaeId id) {
        return groupeSaeRepository.findById(id).orElse(null);
    }

    public GroupeSae updateGroupeSae(GroupeSaeId id, GroupeSae groupeSae) {
        return groupeSaeRepository.save(groupeSae);
    }

    public void deleteGroupeSaeById(GroupeSaeId id) {
        groupeSaeRepository.deleteById(id);
    }
}

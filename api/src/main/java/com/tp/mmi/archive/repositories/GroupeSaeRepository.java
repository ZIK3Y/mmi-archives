package com.tp.mmi.archive.repositories;

import com.tp.mmi.archive.models.GroupeSae;
import com.tp.mmi.archive.models.GroupeSaeId;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupeSaeRepository extends CrudRepository<GroupeSae, GroupeSaeId> {
}

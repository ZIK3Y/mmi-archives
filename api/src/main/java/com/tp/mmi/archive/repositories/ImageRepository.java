package com.tp.mmi.archive.repositories;

import com.tp.mmi.archive.models.Image;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends CrudRepository<Image, Long> {
}

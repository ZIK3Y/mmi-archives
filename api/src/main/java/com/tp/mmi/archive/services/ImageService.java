package com.tp.mmi.archive.services;

import com.tp.mmi.archive.models.Image;
import com.tp.mmi.archive.repositories.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    public Image saveImage(Image image) {
        return imageRepository.save(image);
    }

    public Iterable<Image> getAllImages() {
        return imageRepository.findAll();
    }

    public Image getImageById(Long id) {
        return imageRepository.findById(id).orElse(null);
    }

    public Image updateImage(Long id, Image image) {
        image.setIdImage(id);
        return imageRepository.save(image);
    }

    public void deleteImageById(Long id) {
        imageRepository.deleteById(id);
    }
}

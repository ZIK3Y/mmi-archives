package com.tp.mmi.archive.controller;

import com.tp.mmi.archive.models.Image;
import com.tp.mmi.archive.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    @Autowired
    private ImageService imageService;

    @PostMapping
    public Image createImage(@RequestBody Image image) {
        return imageService.saveImage(image);
    }

    @GetMapping
    public Iterable<Image> getAllImages() {
        return imageService.getAllImages();
    }

    @GetMapping("/{id}")
    public Image getImageById(@PathVariable Long id) {
        return imageService.getImageById(id);
    }

    @PutMapping("/{id}")
    public Image updateImage(@PathVariable Long id, @RequestBody Image image) {
        return imageService.updateImage(id, image);
    }

    @DeleteMapping("/{id}")
    public void deleteImage(@PathVariable Long id) {
        imageService.deleteImageById(id);
    }
}

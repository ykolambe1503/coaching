package com.coaching.platform.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Service for handling file uploads (images)
 */
@Service
@Slf4j
public class FileStorageService {

    @Value("${storage.upload-dir:./uploads/answers}")
    private String uploadDir;

    /**
     * Upload image and return URL
     */
    public String uploadImage(MultipartFile file, UUID answerId) throws IOException {
        // Create upload directory if not exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String filename = answerId + "_" + UUID.randomUUID() + extension;

        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        log.info("Uploaded image: {}", filename);

        // Return URL (relative path for now, can be S3 URL later)
        return "/uploads/answers/" + filename;
    }

    /**
     * Delete image
     */
    public void deleteImage(String imageUrl) {
        try {
            String filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Files.deleteIfExists(filePath);
            log.info("Deleted image: {}", filename);
        } catch (IOException e) {
            log.error("Failed to delete image: {}", imageUrl, e);
        }
    }
}

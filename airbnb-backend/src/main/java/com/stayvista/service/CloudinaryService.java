package com.stayvista.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    private static final String FOLDER = "stayvista/properties";

    public Map<String, String> uploadImage(MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", FOLDER,
                        "resource_type", "image",
                        "quality", "auto",
                        "fetch_format", "auto"
                )
        );
        return Map.of(
                "url", (String) result.get("secure_url"),
                "publicId", (String) result.get("public_id")
        );
    }

    public List<Map<String, String>> uploadMultipleImages(List<MultipartFile> files) throws IOException {
        List<Map<String, String>> results = new ArrayList<>();
        for (MultipartFile file : files) {
            results.add(uploadImage(file));
        }
        return results;
    }

    public Map<String, String> uploadAvatar(MultipartFile file, Long userId) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "stayvista/avatars",
                        "public_id", "user_" + userId,
                        "resource_type", "image",
                        "overwrite", true,
                        "quality", "auto:low",
                        "width", 200,
                        "height", 200,
                        "crop", "fill"
                )
        );
        return Map.of(
                "url", (String) result.get("secure_url"),
                "publicId", (String) result.get("public_id")
        );
    }

    public void deleteImage(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Deleted image from Cloudinary: {}", publicId);
        } catch (IOException e) {
            log.error("Failed to delete image from Cloudinary: {}", publicId, e);
        }
    }

    public void deleteMultipleImages(List<String> publicIds) {
        publicIds.forEach(this::deleteImage);
    }
}


package com.stayvista.controller;

import com.stayvista.dto.common.ApiResponse;
import com.stayvista.dto.common.PagedResponse;
import com.stayvista.dto.property.CreatePropertyRequest;
import com.stayvista.dto.property.PropertyResponse;
import com.stayvista.dto.property.UpdatePropertyRequest;
import com.stayvista.entity.Property;
import com.stayvista.entity.User;
import com.stayvista.repository.UserRepository;
import com.stayvista.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponse>>> searchProperties(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer guests,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) Integer bathrooms,
            @RequestParam(required = false) List<String> amenities,
            @RequestParam(required = false) Property.PropertyType propertyType,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long currentUserId = null;
        if (userDetails != null) {
            currentUserId = userRepository.findByEmail(userDetails.getUsername())
                    .map(User::getId).orElse(null);
        }

        PagedResponse<PropertyResponse> response = propertyService.searchProperties(
                city, country, minPrice, maxPrice, guests, bedrooms, bathrooms,
                amenities, propertyType, categoryId, keyword, sortBy, sortDir, page, size, currentUserId);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> getProperty(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long currentUserId = null;
        if (userDetails != null) {
            currentUserId = userRepository.findByEmail(userDetails.getUsername())
                    .map(User::getId).orElse(null);
        }
        return ResponseEntity.ok(ApiResponse.success(propertyService.getPropertyById(id, currentUserId)));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<PropertyResponse>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.success(propertyService.getFeaturedProperties()));
    }

    @GetMapping("/top-cities")
    public ResponseEntity<ApiResponse<List<String>>> getTopCities() {
        return ResponseEntity.ok(ApiResponse.success(propertyService.getTopCities()));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<PropertyResponse>> createProperty(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestPart("data") CreatePropertyRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws Exception {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        PropertyResponse response = propertyService.createProperty(user.getId(), request, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Property created", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PropertyResponse>> updateProperty(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdatePropertyRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success("Property updated",
                propertyService.updateProperty(id, user.getId(), request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProperty(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        propertyService.deleteProperty(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Property deleted", null));
    }

    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Void>> addImages(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("images") List<MultipartFile> images) throws Exception {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        propertyService.addPropertyImages(id, user.getId(), images);
        return ResponseEntity.ok(ApiResponse.success("Images uploaded", null));
    }

    @DeleteMapping("/{propertyId}/images/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @PathVariable Long propertyId,
            @PathVariable Long imageId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        propertyService.deletePropertyImage(propertyId, imageId, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Image deleted", null));
    }

    @GetMapping("/host/my-listings")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponse>>> getMyListings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success(propertyService.getHostProperties(user.getId(), page, size)));
    }
}

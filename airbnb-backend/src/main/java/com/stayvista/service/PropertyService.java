package com.stayvista.service;

import com.stayvista.dto.common.PagedResponse;
import com.stayvista.dto.property.CreatePropertyRequest;
import com.stayvista.dto.property.PropertyResponse;
import com.stayvista.dto.property.UpdatePropertyRequest;
import com.stayvista.entity.*;
import com.stayvista.exception.BadRequestException;
import com.stayvista.exception.ResourceNotFoundException;
import com.stayvista.exception.UnauthorizedException;
import com.stayvista.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final WishlistRepository wishlistRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public PropertyResponse createProperty(Long hostId, CreatePropertyRequest request,
                                           List<MultipartFile> images) throws Exception {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new ResourceNotFoundException("User", hostId));

        if (host.getRole() != User.Role.HOST && host.getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Only hosts can create property listings");
        }

        Property property = Property.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .propertyType(request.getPropertyType())
                .pricePerNight(request.getPricePerNight())
                .cleaningFee(request.getCleaningFee() != null ? request.getCleaningFee() : BigDecimal.ZERO)
                .maxGuests(request.getMaxGuests())
                .bedrooms(request.getBedrooms())
                .bathrooms(request.getBathrooms())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .zipCode(request.getZipCode())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .amenities(request.getAmenities() != null ? request.getAmenities() : new ArrayList<>())
                .host(host)
                .status(Property.PropertyStatus.ACTIVE)
                .build();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
            property.setCategory(category);
        }

        Property savedProperty = propertyRepository.save(property);

        // Upload images
        if (images != null && !images.isEmpty()) {
            uploadPropertyImages(savedProperty, images);
        }

        return mapToResponse(propertyRepository.findById(savedProperty.getId()).orElseThrow(), null);
    }

    @Transactional(readOnly = true)
    public PropertyResponse getPropertyById(Long propertyId, Long currentUserId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", propertyId));

        Boolean isWishlisted = false;
        if (currentUserId != null) {
            isWishlisted = wishlistRepository.existsByUserIdAndPropertyId(currentUserId, propertyId);
        }

        return mapToResponse(property, isWishlisted);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> searchProperties(
            String city, String country, BigDecimal minPrice, BigDecimal maxPrice,
            Integer guests, Integer bedrooms, Integer bathrooms, List<String> amenities,
            Property.PropertyType propertyType, Long categoryId, String keyword,
            String sortBy, String sortDir, int page, int size, Long currentUserId) {

        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ?
                Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = switch (sortBy != null ? sortBy : "createdAt") {
            case "price" -> "pricePerNight";
            case "rating" -> "averageRating";
            default -> "createdAt";
        };

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        Specification<Property> spec = PropertySpecification.buildSpecification(
                city, country, minPrice, maxPrice, guests, bedrooms, bathrooms,
                amenities, propertyType, categoryId, keyword);

        Page<Property> properties = propertyRepository.findAll(spec, pageable);

        return PagedResponse.of(properties.map(p -> {
            Boolean wishlisted = currentUserId != null &&
                    wishlistRepository.existsByUserIdAndPropertyId(currentUserId, p.getId());
            return mapToResponse(p, wishlisted);
        }));
    }

    @Transactional
    public PropertyResponse updateProperty(Long propertyId, Long hostId, UpdatePropertyRequest request) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", propertyId));

        if (!property.getHost().getId().equals(hostId)) {
            throw new UnauthorizedException("You are not authorized to update this property");
        }

        if (request.getTitle() != null) property.setTitle(request.getTitle());
        if (request.getDescription() != null) property.setDescription(request.getDescription());
        if (request.getPropertyType() != null) property.setPropertyType(request.getPropertyType());
        if (request.getPricePerNight() != null) property.setPricePerNight(request.getPricePerNight());
        if (request.getCleaningFee() != null) property.setCleaningFee(request.getCleaningFee());
        if (request.getMaxGuests() != null) property.setMaxGuests(request.getMaxGuests());
        if (request.getBedrooms() != null) property.setBedrooms(request.getBedrooms());
        if (request.getBathrooms() != null) property.setBathrooms(request.getBathrooms());
        if (request.getAddress() != null) property.setAddress(request.getAddress());
        if (request.getCity() != null) property.setCity(request.getCity());
        if (request.getState() != null) property.setState(request.getState());
        if (request.getCountry() != null) property.setCountry(request.getCountry());
        if (request.getZipCode() != null) property.setZipCode(request.getZipCode());
        if (request.getLatitude() != null) property.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) property.setLongitude(request.getLongitude());
        if (request.getAmenities() != null) property.setAmenities(request.getAmenities());
        if (request.getStatus() != null) property.setStatus(request.getStatus());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
            property.setCategory(category);
        }

        return mapToResponse(propertyRepository.save(property), null);
    }

    @Transactional
    public void deleteProperty(Long propertyId, Long hostId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", propertyId));

        if (!property.getHost().getId().equals(hostId)) {
            throw new UnauthorizedException("You are not authorized to delete this property");
        }

        // Delete images from Cloudinary
        property.getImages().forEach(img -> cloudinaryService.deleteImage(img.getPublicId()));
        propertyRepository.delete(property);
    }

    @Transactional
    public List<PropertyResponse> addPropertyImages(Long propertyId, Long hostId,
                                                     List<MultipartFile> images) throws Exception {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", propertyId));

        if (!property.getHost().getId().equals(hostId)) {
            throw new UnauthorizedException("Not authorized");
        }

        if (property.getImages().size() + images.size() > 10) {
            throw new BadRequestException("Maximum 10 images allowed per property");
        }

        uploadPropertyImages(property, images);
        return null;
    }

    @Transactional
    public void deletePropertyImage(Long propertyId, Long imageId, Long hostId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", propertyId));

        if (!property.getHost().getId().equals(hostId)) {
            throw new UnauthorizedException("Not authorized");
        }

        PropertyImage image = propertyImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image", imageId));

        cloudinaryService.deleteImage(image.getPublicId());
        propertyImageRepository.delete(image);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertyResponse> getHostProperties(Long hostId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Property> properties = propertyRepository.findByHostId(hostId, pageable);
        return PagedResponse.of(properties.map(p -> mapToResponse(p, false)));
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getFeaturedProperties() {
        Pageable pageable = PageRequest.of(0, 8);
        return propertyRepository.findLatestProperties(pageable)
                .stream().map(p -> mapToResponse(p, false)).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<String> getTopCities() {
        return propertyRepository.findTopCities(PageRequest.of(0, 8));
    }

    public void updatePropertyRating(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", propertyId));
        // Rating update is handled by ReviewService
        propertyRepository.save(property);
    }

    private void uploadPropertyImages(Property property, List<MultipartFile> images) throws Exception {
        List<Map<String, String>> uploadResults = cloudinaryService.uploadMultipleImages(images);
        boolean hasPrimary = propertyImageRepository.findByPropertyIdAndIsPrimaryTrue(property.getId()).isPresent();

        for (int i = 0; i < uploadResults.size(); i++) {
            Map<String, String> result = uploadResults.get(i);
            PropertyImage image = PropertyImage.builder()
                    .url(result.get("url"))
                    .publicId(result.get("publicId"))
                    .isPrimary(!hasPrimary && i == 0)
                    .displayOrder(property.getImages().size() + i)
                    .property(property)
                    .build();
            propertyImageRepository.save(image);
            if (!hasPrimary && i == 0) hasPrimary = true;
        }
    }

    public PropertyResponse mapToResponse(Property property, Boolean isWishlisted) {
        String primaryImageUrl = property.getImages().stream()
                .filter(PropertyImage::getIsPrimary)
                .findFirst()
                .map(PropertyImage::getUrl)
                .orElse(property.getImages().isEmpty() ? null :
                        property.getImages().get(0).getUrl());

        return PropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .propertyType(property.getPropertyType())
                .pricePerNight(property.getPricePerNight())
                .cleaningFee(property.getCleaningFee())
                .maxGuests(property.getMaxGuests())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .address(property.getAddress())
                .city(property.getCity())
                .state(property.getState())
                .country(property.getCountry())
                .zipCode(property.getZipCode())
                .latitude(property.getLatitude())
                .longitude(property.getLongitude())
                .amenities(property.getAmenities())
                .status(property.getStatus())
                .averageRating(property.getAverageRating())
                .reviewCount(property.getReviewCount())
                .primaryImageUrl(primaryImageUrl)
                .isWishlisted(isWishlisted)
                .createdAt(property.getCreatedAt())
                .host(property.getHost() != null ? PropertyResponse.HostInfo.builder()
                        .id(property.getHost().getId())
                        .firstName(property.getHost().getFirstName())
                        .lastName(property.getHost().getLastName())
                        .avatar(property.getHost().getAvatar())
                        .createdAt(property.getHost().getCreatedAt())
                        .build() : null)
                .category(property.getCategory() != null ? PropertyResponse.CategoryInfo.builder()
                        .id(property.getCategory().getId())
                        .name(property.getCategory().getName())
                        .icon(property.getCategory().getIcon())
                        .build() : null)
                .images(property.getImages().stream()
                        .map(img -> PropertyResponse.ImageInfo.builder()
                                .id(img.getId())
                                .url(img.getUrl())
                                .isPrimary(img.getIsPrimary())
                                .displayOrder(img.getDisplayOrder())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}

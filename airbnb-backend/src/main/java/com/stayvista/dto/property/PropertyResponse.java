package com.stayvista.dto.property;

import com.stayvista.entity.Property;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertyResponse {

    private Long id;
    private String title;
    private String description;
    private Property.PropertyType propertyType;
    private BigDecimal pricePerNight;
    private BigDecimal cleaningFee;
    private Integer maxGuests;
    private Integer bedrooms;
    private Integer bathrooms;
    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;
    private Double latitude;
    private Double longitude;
    private List<String> amenities;
    private Property.PropertyStatus status;
    private Double averageRating;
    private Integer reviewCount;
    private HostInfo host;
    private CategoryInfo category;
    private List<ImageInfo> images;
    private String primaryImageUrl;
    private LocalDateTime createdAt;
    private Boolean isWishlisted;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HostInfo {
        private Long id;
        private String firstName;
        private String lastName;
        private String avatar;
        private LocalDateTime createdAt;
        private Integer totalListings;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryInfo {
        private Long id;
        private String name;
        private String icon;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageInfo {
        private Long id;
        private String url;
        private Boolean isPrimary;
        private Integer displayOrder;
    }
}

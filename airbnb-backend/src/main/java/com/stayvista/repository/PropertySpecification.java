package com.stayvista.repository;

import com.stayvista.entity.Property;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class PropertySpecification {

    public static Specification<Property> buildSpecification(
            String city,
            String country,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer minGuests,
            Integer minBedrooms,
            Integer minBathrooms,
            List<String> amenities,
            Property.PropertyType propertyType,
            Long categoryId,
            String keyword
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always filter ACTIVE properties
            predicates.add(cb.equal(root.get("status"), Property.PropertyStatus.ACTIVE));

            if (city != null && !city.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("city")),
                        "%" + city.toLowerCase() + "%"));
            }

            if (country != null && !country.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("country")),
                        "%" + country.toLowerCase() + "%"));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("pricePerNight"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("pricePerNight"), maxPrice));
            }

            if (minGuests != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("maxGuests"), minGuests));
            }

            if (minBedrooms != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("bedrooms"), minBedrooms));
            }

            if (minBathrooms != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("bathrooms"), minBathrooms));
            }

            if (propertyType != null) {
                predicates.add(cb.equal(root.get("propertyType"), propertyType));
            }

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (keyword != null && !keyword.isBlank()) {
                String likePattern = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), likePattern),
                        cb.like(cb.lower(root.get("description")), likePattern),
                        cb.like(cb.lower(root.get("city")), likePattern),
                        cb.like(cb.lower(root.get("address")), likePattern)
                ));
            }

            if (amenities != null && !amenities.isEmpty()) {
                // Filter properties that have ALL requested amenities
                for (String amenity : amenities) {
                    predicates.add(cb.isMember(amenity, root.get("amenities")));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

package com.stayvista.dto.property;

import com.stayvista.entity.Property;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreatePropertyRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 10, max = 150, message = "Title must be between 10 and 150 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 50, message = "Description must be at least 50 characters")
    private String description;

    @NotNull(message = "Property type is required")
    private Property.PropertyType propertyType;

    @NotNull(message = "Price per night is required")
    @DecimalMin(value = "1.0", message = "Price must be at least $1")
    private BigDecimal pricePerNight;

    @DecimalMin(value = "0.0")
    private BigDecimal cleaningFee;

    @NotNull
    @Min(value = 1, message = "Must accommodate at least 1 guest")
    @Max(value = 50, message = "Cannot exceed 50 guests")
    private Integer maxGuests;

    @NotNull
    @Min(value = 1)
    private Integer bedrooms;

    @NotNull
    @Min(value = 1)
    private Integer bathrooms;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Country is required")
    private String country;

    private String zipCode;

    private Double latitude;

    private Double longitude;

    private List<String> amenities;

    private Long categoryId;
}

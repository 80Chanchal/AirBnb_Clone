package com.stayvista.dto.property;

import com.stayvista.entity.Property;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class UpdatePropertyRequest {

    @Size(min = 10, max = 150)
    private String title;

    @Size(min = 50)
    private String description;

    private Property.PropertyType propertyType;

    @DecimalMin(value = "1.0")
    private BigDecimal pricePerNight;

    @DecimalMin(value = "0.0")
    private BigDecimal cleaningFee;

    @Min(1) @Max(50)
    private Integer maxGuests;

    @Min(1)
    private Integer bedrooms;

    @Min(1)
    private Integer bathrooms;

    private String address;
    private String city;
    private String state;
    private String country;
    private String zipCode;
    private Double latitude;
    private Double longitude;
    private List<String> amenities;
    private Long categoryId;
    private Property.PropertyStatus status;
}

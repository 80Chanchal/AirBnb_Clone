package com.stayvista.config;

import com.stayvista.entity.*;
import com.stayvista.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping seeder...");
            return;
        }

        log.info("Seeding database with default users, categories, and properties...");

        // 1. Create Default Users
        User admin = User.builder()
                .firstName("Admin")
                .lastName("System")
                .email("admin@airbnb.com")
                .password(passwordEncoder.encode("Password123"))
                .role(User.Role.ADMIN)
                .emailVerified(true)
                .isActive(true)
                .build();
        userRepository.save(admin);

        User host = User.builder()
                .firstName("Goa")
                .lastName("Host")
                .email("host@airbnb.com")
                .password(passwordEncoder.encode("Password123"))
                .role(User.Role.HOST)
                .avatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200")
                .emailVerified(true)
                .isActive(true)
                .build();
        userRepository.save(host);

        // 2. Create Categories
        Category catHomes = Category.builder().name("Homes").icon("🏡").isActive(true).build();
        Category catBeach = Category.builder().name("Beach").icon("🏖️").isActive(true).build();
        Category catVillas = Category.builder().name("Villas").icon("🏰").isActive(true).build();
        categoryRepository.saveAll(List.of(catHomes, catBeach, catVillas));

        // 3. Create Goa Properties
        createProperty(host, catHomes, "Villa in Baga", 
                "Beautiful villa in Baga, Goa. Spacious living space with perfect ventilation, cozy seating, and modern amenities.",
                Property.PropertyType.VILLA, new BigDecimal("8503"), 4.98, 12, "Baga Road", "North Goa", "Goa", "India",
                "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600");

        createProperty(host, catHomes, "Villa in Vagator", 
                "Charming indoor living room with light blue accents in Vagator. Ideal space for relaxing after beach trips.",
                Property.PropertyType.VILLA, new BigDecimal("5400"), 4.92, 8, "Vagator Beach Rd", "North Goa", "Goa", "India",
                "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600");

        createProperty(host, catHomes, "Home in Calangute", 
                "Lovely red exterior villa surrounded by palm trees in Calangute. Features a private pool and sit-out area.",
                Property.PropertyType.HOUSE, new BigDecimal("10073"), 5.0, 15, "Calangute-Mapusa Rd", "North Goa", "Goa", "India",
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600");

        createProperty(host, catHomes, "Apartment in Goa", 
                "Clean bedroom with large windows capturing Goan sunlight. Close to beaches and local restaurants.",
                Property.PropertyType.APARTMENT, new BigDecimal("2875"), 4.96, 6, "Candolim Rd", "North Goa", "Goa", "India",
                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600");

        createProperty(host, catHomes, "Flat in Anjuna", 
                "Modern living room setup in Anjuna. Equipped with smart television, cozy couch, and high-speed Wi-Fi.",
                Property.PropertyType.APARTMENT, new BigDecimal("4018"), 4.92, 5, "Anjuna Beach Rd", "North Goa", "Goa", "India",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600");

        createProperty(host, catHomes, "Flat in Calangute", 
                "Unique interior design with wooden stairs in Calangute. Compact, fully furnished, and beach-friendly.",
                Property.PropertyType.APARTMENT, new BigDecimal("5166"), 4.87, 9, "Calangute Main Rd", "North Goa", "Goa", "India",
                "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600");

        createProperty(host, catHomes, "Flat in Nerul", 
                "Elegant dining room table with beautiful views of Nerul river waters. Extremely quiet and premium locality.",
                Property.PropertyType.APARTMENT, new BigDecimal("5706"), 5.0, 10, "Nerul Road", "North Goa", "Goa", "India",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600");

        // 4. Create Lonavala Properties
        createProperty(host, catVillas, "Home in Lonavala", 
                "Stunning modern structure with private swimming pool lit up at night. Enjoy standard luxury inside the valleys.",
                Property.PropertyType.HOUSE, new BigDecimal("35000"), 4.86, 20, "Tungarli Road", "Lonavala", "Maharashtra", "India",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600");

        createProperty(host, catVillas, "Guest suite in Lonavala", 
                "Lush green outdoor terrace space with standard seating and fresh flower plants. Excellent weather view.",
                Property.PropertyType.APARTMENT, new BigDecimal("7988"), 5.0, 11, "Gold Valley Road", "Lonavala", "Maharashtra", "India",
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600");

        createProperty(host, catHomes, "Room in नांदगाव", 
                "Cozy bedroom with wooden ceiling details and raw stone wall textures. Situated in Nandgaon.",
                Property.PropertyType.HOUSE, new BigDecimal("6000"), 4.8, 4, "Nandgaon Village", "Lonavala", "Maharashtra", "India",
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600");

        createProperty(host, catVillas, "Villa in Lonavala", 
                "Large luxury villa with private pool illuminated nicely at night. Features open deck chairs.",
                Property.PropertyType.VILLA, new BigDecimal("17317"), 4.86, 12, "Ryewoods Road", "Lonavala", "Maharashtra", "India",
                "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600");

        createProperty(host, catVillas, "Home in Lonavala (Night Pool)", 
                "Cozy private home in Lonavala featuring beautiful illuminated pool deck for late night swims.",
                Property.PropertyType.HOUSE, new BigDecimal("21000"), 4.86, 10, "Khandala Road", "Lonavala", "Maharashtra", "India",
                "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600");

        createProperty(host, catHomes, "Room in Lonavala", 
                "Modern indoor seating area with handpicked wall art and comfy cushions.",
                Property.PropertyType.HOUSE, new BigDecimal("6000"), 4.79, 7, "Varsoli Road", "Lonavala", "Maharashtra", "India",
                "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600");

        createProperty(host, catVillas, "Home in Lonavala (Premium)", 
                "Beautiful villa lighting casting reflections on private swimming pool. Excellent hill views.",
                Property.PropertyType.VILLA, new BigDecimal("22300"), 4.79, 14, "Kune Village Road", "Lonavala", "Maharashtra", "India",
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600");

        log.info("Database seeding successfully completed!");
    }

    private void createProperty(User host, Category category, String title, String description,
                                Property.PropertyType type, BigDecimal price, double rating, int reviewsCount,
                                String address, String city, String state, String country, String imageUrl) {
        Property property = Property.builder()
                .title(title)
                .description(description)
                .propertyType(type)
                .pricePerNight(price)
                .cleaningFee(new BigDecimal("500"))
                .maxGuests(6)
                .bedrooms(3)
                .bathrooms(3)
                .address(address)
                .city(city)
                .state(state)
                .country(country)
                .zipCode("400001")
                .latitude(15.5520)
                .longitude(73.7516)
                .amenities(List.of("Wifi", "Kitchen", "Free parking", "Air conditioning", "Dedicated workspace", "Pool"))
                .status(Property.PropertyStatus.ACTIVE)
                .averageRating(rating)
                .reviewCount(reviewsCount)
                .host(host)
                .category(category)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Property savedProperty = propertyRepository.save(property);

        PropertyImage image = PropertyImage.builder()
                .url(imageUrl)
                .publicId("dummy_" + savedProperty.getId())
                .isPrimary(true)
                .displayOrder(0)
                .property(savedProperty)
                .build();
        propertyImageRepository.save(image);
    }
}

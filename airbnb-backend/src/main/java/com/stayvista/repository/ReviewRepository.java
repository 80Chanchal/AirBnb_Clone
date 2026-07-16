package com.stayvista.repository;

import com.stayvista.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Page<Review> findByPropertyIdOrderByCreatedAtDesc(Long propertyId, Pageable pageable);

    Page<Review> findByGuestIdOrderByCreatedAtDesc(Long guestId, Pageable pageable);

    Optional<Review> findByBookingId(Long bookingId);

    boolean existsByBookingId(Long bookingId);

    @Query("""
        SELECT AVG(r.rating) FROM Review r WHERE r.property.id = :propertyId
    """)
    Double calculateAverageRating(@Param("propertyId") Long propertyId);

    @Query("""
        SELECT COUNT(r) FROM Review r WHERE r.property.id = :propertyId
    """)
    Integer countByPropertyId(@Param("propertyId") Long propertyId);
}

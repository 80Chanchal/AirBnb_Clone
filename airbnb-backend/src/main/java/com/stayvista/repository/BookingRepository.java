package com.stayvista.repository;

import com.stayvista.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Page<Booking> findByGuestIdOrderByCreatedAtDesc(Long guestId, Pageable pageable);

    Page<Booking> findByPropertyHostIdOrderByCreatedAtDesc(Long hostId, Pageable pageable);

    Page<Booking> findByPropertyIdOrderByCreatedAtDesc(Long propertyId, Pageable pageable);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.property.id = :propertyId
        AND b.status IN ('CONFIRMED', 'PENDING')
        AND (b.checkIn < :checkOut AND b.checkOut > :checkIn)
    """)
    List<Booking> findConflictingBookings(
        @Param("propertyId") Long propertyId,
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut
    );

    @Query("""
        SELECT b.checkIn, b.checkOut FROM Booking b
        WHERE b.property.id = :propertyId
        AND b.status IN ('CONFIRMED', 'PENDING')
        AND b.checkOut >= CURRENT_DATE
    """)
    List<Object[]> findBookedDateRanges(@Param("propertyId") Long propertyId);

    @Query("""
        SELECT SUM(b.totalPrice) FROM Booking b
        WHERE b.property.host.id = :hostId
        AND b.status = 'COMPLETED'
    """)
    BigDecimal getTotalEarningsByHost(@Param("hostId") Long hostId);

    @Query("""
        SELECT SUM(b.totalPrice) FROM Booking b
        WHERE b.property.host.id = :hostId
        AND b.status = 'COMPLETED'
        AND MONTH(b.createdAt) = :month
        AND YEAR(b.createdAt) = :year
    """)
    BigDecimal getMonthlyEarningsByHost(@Param("hostId") Long hostId,
                                        @Param("month") int month,
                                        @Param("year") int year);

    @Query("""
        SELECT COUNT(b) FROM Booking b WHERE b.status = :status
    """)
    Long countByStatus(@Param("status") Booking.BookingStatus status);

    @Query("""
        SELECT SUM(b.totalPrice) FROM Booking b WHERE b.status = 'COMPLETED'
    """)
    BigDecimal getTotalRevenue();

    boolean existsByGuestIdAndPropertyId(Long guestId, Long propertyId);
}

package com.stayvista.dto.booking;

import com.stayvista.entity.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;
    private PropertyInfo property;
    private GuestInfo guest;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer guests;
    private BigDecimal nightlyRate;
    private Integer numberOfNights;
    private BigDecimal subtotal;
    private BigDecimal cleaningFee;
    private BigDecimal taxes;
    private BigDecimal totalPrice;
    private Booking.BookingStatus status;
    private String cancellationReason;
    private LocalDateTime cancelledAt;
    private Boolean hasReview;
    private Long reviewId;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PropertyInfo {
        private Long id;
        private String title;
        private String city;
        private String country;
        private String primaryImageUrl;
        private Long hostId;
        private String hostName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GuestInfo {
        private Long id;
        private String firstName;
        private String lastName;
        private String avatar;
        private String email;
    }
}

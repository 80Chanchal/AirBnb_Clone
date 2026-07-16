package com.stayvista.controller;

import com.stayvista.dto.booking.BookingResponse;
import com.stayvista.dto.booking.CreateBookingRequest;
import com.stayvista.dto.booking.PriceCalculationResponse;
import com.stayvista.dto.common.ApiResponse;
import com.stayvista.dto.common.PagedResponse;
import com.stayvista.entity.User;
import com.stayvista.repository.UserRepository;
import com.stayvista.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateBookingRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        BookingResponse response = bookingService.createBooking(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully", response));
    }

    @GetMapping("/calculate-price")
    public ResponseEntity<ApiResponse<PriceCalculationResponse>> calculatePrice(
            @RequestParam Long propertyId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return ResponseEntity.ok(ApiResponse.success(
                bookingService.calculatePrice(propertyId, checkIn, checkOut)));
    }

    @GetMapping("/booked-dates/{propertyId}")
    public ResponseEntity<ApiResponse<List<Object[]>>> getBookedDates(@PathVariable Long propertyId) {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookedDates(propertyId)));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success(
                bookingService.getGuestBookings(user.getId(), page, size)));
    }

    @GetMapping("/host/reservations")
    public ResponseEntity<ApiResponse<PagedResponse<BookingResponse>>> getHostReservations(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success(
                bookingService.getHostReservations(user.getId(), page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success(bookingService.getBookingById(id, user.getId())));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(required = false) Map<String, String> body) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        String reason = body != null ? body.get("reason") : null;
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled",
                bookingService.cancelBooking(id, user.getId(), reason)));
    }
}

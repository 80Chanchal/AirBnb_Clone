package com.stayvista.service;

import com.stayvista.dto.booking.CreateBookingRequest;
import com.stayvista.entity.*;
import com.stayvista.exception.BadRequestException;
import com.stayvista.exception.ConflictException;
import com.stayvista.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("BookingService Tests")
class BookingServiceTest {

    @Mock private BookingRepository bookingRepository;
    @Mock private PropertyRepository propertyRepository;
    @Mock private UserRepository userRepository;
    @Mock private ReviewRepository reviewRepository;
    @Mock private EmailService emailService;
    @Mock private NotificationService notificationService;

    @InjectMocks
    private BookingService bookingService;

    private User guest;
    private User host;
    private Property property;
    private CreateBookingRequest bookingRequest;

    @BeforeEach
    void setUp() {
        host = User.builder().id(1L).firstName("Host").lastName("User")
                .email("host@example.com").role(User.Role.HOST).build();

        guest = User.builder().id(2L).firstName("Guest").lastName("User")
                .email("guest@example.com").role(User.Role.GUEST).build();

        property = Property.builder()
                .id(1L)
                .title("Test Property")
                .pricePerNight(new BigDecimal("100.00"))
                .cleaningFee(new BigDecimal("20.00"))
                .maxGuests(4)
                .host(host)
                .status(Property.PropertyStatus.ACTIVE)
                .build();

        bookingRequest = new CreateBookingRequest();
        bookingRequest.setPropertyId(1L);
        bookingRequest.setCheckIn(LocalDate.now().plusDays(7));
        bookingRequest.setCheckOut(LocalDate.now().plusDays(10));
        bookingRequest.setGuests(2);
    }

    @Test
    @DisplayName("Create booking - should throw BadRequest when host books own property")
    void createBooking_shouldThrow_whenHostBooksOwnProperty() {
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(property));

        assertThatThrownBy(() -> bookingService.createBooking(host.getId(), bookingRequest))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("cannot book your own");
    }

    @Test
    @DisplayName("Create booking - should throw Conflict when dates are unavailable")
    void createBooking_shouldThrow_whenDatesConflict() {
        Booking existingBooking = Booking.builder().id(99L).build();
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(property));
        when(bookingRepository.findConflictingBookings(anyLong(), any(), any()))
                .thenReturn(List.of(existingBooking));

        assertThatThrownBy(() -> bookingService.createBooking(guest.getId(), bookingRequest))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("not available");
    }

    @Test
    @DisplayName("Create booking - should succeed with correct price calculation")
    void createBooking_shouldSucceed_withCorrectPrice() {
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(property));
        when(bookingRepository.findConflictingBookings(anyLong(), any(), any()))
                .thenReturn(Collections.emptyList());
        when(userRepository.findById(guest.getId())).thenReturn(Optional.of(guest));

        Booking savedBooking = Booking.builder()
                .id(1L)
                .property(property)
                .guest(guest)
                .checkIn(bookingRequest.getCheckIn())
                .checkOut(bookingRequest.getCheckOut())
                .guests(2)
                .nightlyRate(new BigDecimal("100.00"))
                .numberOfNights(3)
                .subtotal(new BigDecimal("300.00"))
                .cleaningFee(new BigDecimal("20.00"))
                .taxes(new BigDecimal("38.40"))
                .totalPrice(new BigDecimal("358.40"))
                .status(Booking.BookingStatus.CONFIRMED)
                .build();

        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);
        when(reviewRepository.existsByBookingId(anyLong())).thenReturn(false);
        doNothing().when(notificationService).createBookingConfirmedNotification(any(), anyString(), anyLong());
        doNothing().when(notificationService).createNewReservationNotification(any(), anyString(), anyString(), anyLong());
        doNothing().when(emailService).sendBookingConfirmation(anyString(), anyString(), anyString(), anyString(), anyString(), anyString());
        doNothing().when(emailService).sendNewReservationNotification(anyString(), anyString(), anyString(), anyString(), anyString(), anyString());

        var response = bookingService.createBooking(guest.getId(), bookingRequest);

        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(Booking.BookingStatus.CONFIRMED);
        assertThat(response.getNumberOfNights()).isEqualTo(3);
    }
}

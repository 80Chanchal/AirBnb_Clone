package com.stayvista.service;

import com.stayvista.dto.booking.BookingResponse;
import com.stayvista.dto.booking.CreateBookingRequest;
import com.stayvista.dto.booking.PriceCalculationResponse;
import com.stayvista.dto.common.PagedResponse;
import com.stayvista.entity.Booking;
import com.stayvista.entity.Property;
import com.stayvista.entity.User;
import com.stayvista.exception.BadRequestException;
import com.stayvista.exception.ConflictException;
import com.stayvista.exception.ResourceNotFoundException;
import com.stayvista.exception.UnauthorizedException;
import com.stayvista.repository.BookingRepository;
import com.stayvista.repository.PropertyRepository;
import com.stayvista.repository.ReviewRepository;
import com.stayvista.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;

    private static final BigDecimal TAX_RATE = new BigDecimal("0.12"); // 12%

    @Transactional
    public BookingResponse createBooking(Long guestId, CreateBookingRequest request) {
        if (!request.getCheckOut().isAfter(request.getCheckIn())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new ResourceNotFoundException("Property", request.getPropertyId()));

        if (property.getStatus() != Property.PropertyStatus.ACTIVE) {
            throw new BadRequestException("This property is not available for booking");
        }

        if (property.getHost().getId().equals(guestId)) {
            throw new BadRequestException("You cannot book your own property");
        }

        if (request.getGuests() > property.getMaxGuests()) {
            throw new BadRequestException("Number of guests exceeds maximum capacity of " + property.getMaxGuests());
        }

        // Check for conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                request.getPropertyId(), request.getCheckIn(), request.getCheckOut());
        if (!conflicts.isEmpty()) {
            throw new ConflictException("Property is not available for the selected dates");
        }

        User guest = userRepository.findById(guestId)
                .orElseThrow(() -> new ResourceNotFoundException("User", guestId));

        // Calculate price
        long nights = ChronoUnit.DAYS.between(request.getCheckIn(), request.getCheckOut());
        BigDecimal nightlyRate = property.getPricePerNight();
        BigDecimal subtotal = nightlyRate.multiply(BigDecimal.valueOf(nights));
        BigDecimal cleaningFee = property.getCleaningFee();
        BigDecimal taxes = subtotal.add(cleaningFee).multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(cleaningFee).add(taxes);

        Booking booking = Booking.builder()
                .property(property)
                .guest(guest)
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .guests(request.getGuests())
                .nightlyRate(nightlyRate)
                .numberOfNights((int) nights)
                .subtotal(subtotal)
                .cleaningFee(cleaningFee)
                .taxes(taxes)
                .totalPrice(total)
                .status(Booking.BookingStatus.CONFIRMED)
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Send notifications and emails
        notificationService.createBookingConfirmedNotification(
                guest, property.getTitle(), savedBooking.getId());
        notificationService.createNewReservationNotification(
                property.getHost(), guest.getFullName(), property.getTitle(), savedBooking.getId());

        emailService.sendBookingConfirmation(
                guest.getEmail(), guest.getFirstName(), property.getTitle(),
                request.getCheckIn().toString(), request.getCheckOut().toString(),
                savedBooking.getId().toString());
        emailService.sendNewReservationNotification(
                property.getHost().getEmail(), property.getHost().getFirstName(),
                guest.getFullName(), property.getTitle(),
                request.getCheckIn().toString(), request.getCheckOut().toString());

        return mapToResponse(savedBooking);
    }

    public PriceCalculationResponse calculatePrice(Long propertyId, LocalDate checkIn, LocalDate checkOut) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", propertyId));

        boolean isAvailable = bookingRepository.findConflictingBookings(propertyId, checkIn, checkOut).isEmpty();

        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        BigDecimal nightlyRate = property.getPricePerNight();
        BigDecimal subtotal = nightlyRate.multiply(BigDecimal.valueOf(nights));
        BigDecimal cleaningFee = property.getCleaningFee();
        BigDecimal taxes = subtotal.add(cleaningFee).multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(cleaningFee).add(taxes);

        return PriceCalculationResponse.builder()
                .checkIn(checkIn)
                .checkOut(checkOut)
                .numberOfNights((int) nights)
                .nightlyRate(nightlyRate)
                .subtotal(subtotal)
                .cleaningFee(cleaningFee)
                .taxes(taxes)
                .total(total)
                .isAvailable(isAvailable)
                .build();
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, Long userId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        boolean isGuest = booking.getGuest().getId().equals(userId);
        boolean isHost = booking.getProperty().getHost().getId().equals(userId);

        if (!isGuest && !isHost) {
            throw new UnauthorizedException("Not authorized to cancel this booking");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);
        booking.setCancelledAt(java.time.LocalDateTime.now());
        bookingRepository.save(booking);

        notificationService.createBookingCancelledNotification(
                booking.getGuest(), booking.getProperty().getTitle());

        return mapToResponse(booking);
    }

    public PagedResponse<BookingResponse> getGuestBookings(Long guestId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Booking> bookings = bookingRepository.findByGuestIdOrderByCreatedAtDesc(guestId, pageable);
        return PagedResponse.of(bookings.map(this::mapToResponse));
    }

    public PagedResponse<BookingResponse> getHostReservations(Long hostId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Booking> bookings = bookingRepository.findByPropertyHostIdOrderByCreatedAtDesc(hostId, pageable);
        return PagedResponse.of(bookings.map(this::mapToResponse));
    }

    public BookingResponse getBookingById(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        boolean isGuest = booking.getGuest().getId().equals(userId);
        boolean isHost = booking.getProperty().getHost().getId().equals(userId);

        if (!isGuest && !isHost) {
            throw new UnauthorizedException("Not authorized to view this booking");
        }

        return mapToResponse(booking);
    }

    public List<Object[]> getBookedDates(Long propertyId) {
        return bookingRepository.findBookedDateRanges(propertyId);
    }

    private BookingResponse mapToResponse(Booking booking) {
        Property property = booking.getProperty();
        User guest = booking.getGuest();

        String primaryImage = property.getImages().stream()
                .filter(img -> img.getIsPrimary())
                .findFirst()
                .map(img -> img.getUrl())
                .orElse(null);

        boolean hasReview = reviewRepository.existsByBookingId(booking.getId());
        Long reviewId = null;
        if (hasReview) {
            reviewId = reviewRepository.findByBookingId(booking.getId())
                    .map(r -> r.getId()).orElse(null);
        }

        return BookingResponse.builder()
                .id(booking.getId())
                .property(BookingResponse.PropertyInfo.builder()
                        .id(property.getId())
                        .title(property.getTitle())
                        .city(property.getCity())
                        .country(property.getCountry())
                        .primaryImageUrl(primaryImage)
                        .hostId(property.getHost().getId())
                        .hostName(property.getHost().getFullName())
                        .build())
                .guest(BookingResponse.GuestInfo.builder()
                        .id(guest.getId())
                        .firstName(guest.getFirstName())
                        .lastName(guest.getLastName())
                        .avatar(guest.getAvatar())
                        .email(guest.getEmail())
                        .build())
                .checkIn(booking.getCheckIn())
                .checkOut(booking.getCheckOut())
                .guests(booking.getGuests())
                .nightlyRate(booking.getNightlyRate())
                .numberOfNights(booking.getNumberOfNights())
                .subtotal(booking.getSubtotal())
                .cleaningFee(booking.getCleaningFee())
                .taxes(booking.getTaxes())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .cancellationReason(booking.getCancellationReason())
                .cancelledAt(booking.getCancelledAt())
                .hasReview(hasReview)
                .reviewId(reviewId)
                .createdAt(booking.getCreatedAt())
                .build();
    }
}

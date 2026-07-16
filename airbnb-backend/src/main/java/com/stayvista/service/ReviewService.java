package com.stayvista.service;

import com.stayvista.dto.common.PagedResponse;
import com.stayvista.dto.review.CreateReviewRequest;
import com.stayvista.dto.review.ReviewResponse;
import com.stayvista.entity.Booking;
import com.stayvista.entity.Property;
import com.stayvista.entity.Review;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse createReview(Long guestId, CreateReviewRequest request) {
        if (reviewRepository.existsByBookingId(request.getBookingId())) {
            throw new ConflictException("You have already reviewed this booking");
        }

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking", request.getBookingId()));

        if (!booking.getGuest().getId().equals(guestId)) {
            throw new UnauthorizedException("You can only review your own bookings");
        }

        if (booking.getStatus() != Booking.BookingStatus.COMPLETED &&
            booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new BadRequestException("You can only review completed bookings");
        }

        User guest = userRepository.findById(guestId)
                .orElseThrow(() -> new ResourceNotFoundException("User", guestId));

        Review review = Review.builder()
                .booking(booking)
                .guest(guest)
                .property(booking.getProperty())
                .rating(request.getRating())
                .comment(request.getComment())
                .cleanlinessRating(request.getCleanlinessRating())
                .accuracyRating(request.getAccuracyRating())
                .communicationRating(request.getCommunicationRating())
                .locationRating(request.getLocationRating())
                .valueRating(request.getValueRating())
                .build();

        Review savedReview = reviewRepository.save(review);
        updatePropertyRating(booking.getProperty());

        return mapToResponse(savedReview);
    }

    @Transactional
    public ReviewResponse updateReview(Long reviewId, Long guestId, CreateReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", reviewId));

        if (!review.getGuest().getId().equals(guestId)) {
            throw new UnauthorizedException("You can only edit your own reviews");
        }

        if (request.getRating() != null) review.setRating(request.getRating());
        if (request.getComment() != null) review.setComment(request.getComment());
        if (request.getCleanlinessRating() != null) review.setCleanlinessRating(request.getCleanlinessRating());
        if (request.getAccuracyRating() != null) review.setAccuracyRating(request.getAccuracyRating());
        if (request.getCommunicationRating() != null) review.setCommunicationRating(request.getCommunicationRating());
        if (request.getLocationRating() != null) review.setLocationRating(request.getLocationRating());
        if (request.getValueRating() != null) review.setValueRating(request.getValueRating());

        Review updated = reviewRepository.save(review);
        updatePropertyRating(review.getProperty());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteReview(Long reviewId, Long guestId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", reviewId));

        if (!review.getGuest().getId().equals(guestId)) {
            throw new UnauthorizedException("You can only delete your own reviews");
        }

        Property property = review.getProperty();
        reviewRepository.delete(review);
        updatePropertyRating(property);
    }

    public PagedResponse<ReviewResponse> getPropertyReviews(Long propertyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = reviewRepository.findByPropertyIdOrderByCreatedAtDesc(propertyId, pageable);
        return PagedResponse.of(reviews.map(this::mapToResponse));
    }

    private void updatePropertyRating(Property property) {
        Double avgRating = reviewRepository.calculateAverageRating(property.getId());
        Integer reviewCount = reviewRepository.countByPropertyId(property.getId());
        property.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);
        property.setReviewCount(reviewCount != null ? reviewCount : 0);
        propertyRepository.save(property);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .bookingId(review.getBooking().getId())
                .guest(ReviewResponse.GuestInfo.builder()
                        .id(review.getGuest().getId())
                        .firstName(review.getGuest().getFirstName())
                        .lastName(review.getGuest().getLastName())
                        .avatar(review.getGuest().getAvatar())
                        .build())
                .propertyId(review.getProperty().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .cleanlinessRating(review.getCleanlinessRating())
                .accuracyRating(review.getAccuracyRating())
                .communicationRating(review.getCommunicationRating())
                .locationRating(review.getLocationRating())
                .valueRating(review.getValueRating())
                .createdAt(review.getCreatedAt())
                .build();
    }
}

package com.stayvista.controller;

import com.stayvista.dto.common.ApiResponse;
import com.stayvista.dto.common.PagedResponse;
import com.stayvista.dto.review.CreateReviewRequest;
import com.stayvista.dto.review.ReviewResponse;
import com.stayvista.entity.User;
import com.stayvista.repository.UserRepository;
import com.stayvista.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateReviewRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        ReviewResponse response = reviewService.createReview(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Review submitted", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateReviewRequest request) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success("Review updated",
                reviewService.updateReview(id, user.getId(), request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        reviewService.deleteReview(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<ApiResponse<PagedResponse<ReviewResponse>>> getPropertyReviews(
            @PathVariable Long propertyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                reviewService.getPropertyReviews(propertyId, page, size)));
    }
}

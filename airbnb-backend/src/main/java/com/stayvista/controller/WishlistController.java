package com.stayvista.controller;

import com.stayvista.dto.common.ApiResponse;
import com.stayvista.dto.common.PagedResponse;
import com.stayvista.dto.property.PropertyResponse;
import com.stayvista.entity.User;
import com.stayvista.repository.UserRepository;
import com.stayvista.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    @PostMapping("/{propertyId}/toggle")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> toggleWishlist(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        boolean added = wishlistService.toggleWishlist(user.getId(), propertyId);
        String message = added ? "Added to wishlist" : "Removed from wishlist";
        return ResponseEntity.ok(ApiResponse.success(message, Map.of("wishlisted", added)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<PropertyResponse>>> getMyWishlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(ApiResponse.success(
                wishlistService.getUserWishlist(user.getId(), page, size)));
    }

    @GetMapping("/{propertyId}/status")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkWishlistStatus(
            @PathVariable Long propertyId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        boolean isWishlisted = wishlistService.isWishlisted(user.getId(), propertyId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("wishlisted", isWishlisted)));
    }
}

package com.stayvista.service;

import com.stayvista.dto.common.PagedResponse;
import com.stayvista.dto.property.PropertyResponse;
import com.stayvista.entity.Property;
import com.stayvista.entity.User;
import com.stayvista.entity.Wishlist;
import com.stayvista.exception.ResourceNotFoundException;
import com.stayvista.repository.PropertyRepository;
import com.stayvista.repository.UserRepository;
import com.stayvista.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyService propertyService;

    @Transactional
    public boolean toggleWishlist(Long userId, Long propertyId) {
        if (wishlistRepository.existsByUserIdAndPropertyId(userId, propertyId)) {
            wishlistRepository.deleteByUserIdAndPropertyId(userId, propertyId);
            return false; // removed
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", propertyId));

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .property(property)
                .build();
        wishlistRepository.save(wishlist);
        return true; // added
    }

    public PagedResponse<PropertyResponse> getUserWishlist(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Wishlist> wishlists = wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return PagedResponse.of(wishlists.map(w -> propertyService.mapToResponse(w.getProperty(), true)));
    }

    public boolean isWishlisted(Long userId, Long propertyId) {
        return wishlistRepository.existsByUserIdAndPropertyId(userId, propertyId);
    }
}

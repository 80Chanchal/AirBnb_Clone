package com.stayvista.service;

import com.stayvista.dto.common.PagedResponse;
import com.stayvista.dto.user.UserResponse;
import com.stayvista.entity.Booking;
import com.stayvista.entity.Property;
import com.stayvista.entity.User;
import com.stayvista.repository.BookingRepository;
import com.stayvista.repository.PropertyRepository;
import com.stayvista.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository bookingRepository;
    private final UserService userService;

    public DashboardStats getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalHosts = userRepository.countByRole(User.Role.HOST);
        long totalGuests = userRepository.countByRole(User.Role.GUEST);
        long totalProperties = propertyRepository.count();
        long activeProperties = propertyRepository.countActiveProperties();
        long totalBookings = bookingRepository.count();
        long confirmedBookings = bookingRepository.countByStatus(Booking.BookingStatus.CONFIRMED);
        long cancelledBookings = bookingRepository.countByStatus(Booking.BookingStatus.CANCELLED);
        BigDecimal totalRevenue = bookingRepository.getTotalRevenue();
        long newUsersLastMonth = userRepository.countNewUsersSince(java.time.LocalDateTime.now().minusDays(30));

        return DashboardStats.builder()
                .totalUsers(totalUsers)
                .totalHosts(totalHosts)
                .totalGuests(totalGuests)
                .totalProperties(totalProperties)
                .activeProperties(activeProperties)
                .totalBookings(totalBookings)
                .confirmedBookings(confirmedBookings)
                .cancelledBookings(cancelledBookings)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .newUsersLastMonth(newUsersLastMonth)
                .build();
    }

    public PagedResponse<UserResponse> getAllUsers(int page, int size, String role) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users;
        if (role != null) {
            User.Role userRole = User.Role.valueOf(role.toUpperCase());
            users = userRepository.findAll(pageable); // simplified; can add role filter
        } else {
            users = userRepository.findAll(pageable);
        }
        return PagedResponse.of(users.map(userService::mapToResponse));
    }

    @Transactional
    public void banUser(Long userId) {
        userService.banUser(userId);
    }

    @Transactional
    public void unbanUser(Long userId) {
        userService.unbanUser(userId);
    }

    @Transactional
    public void updatePropertyStatus(Long propertyId, Property.PropertyStatus status) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new com.stayvista.exception.ResourceNotFoundException("Property", propertyId));
        property.setStatus(status);
        propertyRepository.save(property);
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private Long totalUsers;
        private Long totalHosts;
        private Long totalGuests;
        private Long totalProperties;
        private Long activeProperties;
        private Long totalBookings;
        private Long confirmedBookings;
        private Long cancelledBookings;
        private BigDecimal totalRevenue;
        private Long newUsersLastMonth;
    }
}

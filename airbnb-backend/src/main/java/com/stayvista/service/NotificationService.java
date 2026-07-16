package com.stayvista.service;

import com.stayvista.entity.Notification;
import com.stayvista.entity.User;
import com.stayvista.dto.common.PagedResponse;
import com.stayvista.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void createNotification(User user, Notification.NotificationType type,
                                   String title, String message, String actionUrl) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .actionUrl(actionUrl)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }

    public void createWelcomeNotification(User user) {
        createNotification(user,
                Notification.NotificationType.WELCOME,
                "Welcome to StayVista! 🎉",
                "Your account has been created. Start exploring amazing properties or list your own!",
                "/explore");
    }

    public void createBookingConfirmedNotification(User guest, String propertyTitle, Long bookingId) {
        createNotification(guest,
                Notification.NotificationType.BOOKING_CONFIRMED,
                "Booking Confirmed!",
                "Your booking for " + propertyTitle + " has been confirmed.",
                "/bookings/" + bookingId);
    }

    public void createNewReservationNotification(User host, String guestName, String propertyTitle, Long bookingId) {
        createNotification(host,
                Notification.NotificationType.NEW_RESERVATION,
                "New Reservation!",
                guestName + " has booked your property: " + propertyTitle,
                "/host/reservations/" + bookingId);
    }

    public void createBookingCancelledNotification(User user, String propertyTitle) {
        createNotification(user,
                Notification.NotificationType.BOOKING_CANCELLED,
                "Booking Cancelled",
                "Your booking for " + propertyTitle + " has been cancelled.",
                "/bookings");
    }

    public PagedResponse<Notification> getUserNotifications(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return PagedResponse.of(notifications);
    }

    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        notificationRepository.markAsRead(notificationId, userId);
    }
}

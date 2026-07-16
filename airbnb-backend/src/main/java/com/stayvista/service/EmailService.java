package com.stayvista.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Async
    public void sendEmailVerification(String toEmail, String firstName, String token) {
        String verificationLink = frontendUrl + "/verify-email?token=" + token;
        String subject = "Verify your StayVista account";
        String body = buildEmailVerificationHtml(firstName, verificationLink);
        sendHtmlEmail(toEmail, subject, body);
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String firstName, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        String subject = "Reset your StayVista password";
        String body = buildPasswordResetHtml(firstName, resetLink);
        sendHtmlEmail(toEmail, subject, body);
    }

    @Async
    public void sendBookingConfirmation(String toEmail, String guestName, String propertyTitle,
                                        String checkIn, String checkOut, String bookingId) {
        String subject = "Booking Confirmed – " + propertyTitle;
        String body = buildBookingConfirmationHtml(guestName, propertyTitle, checkIn, checkOut, bookingId);
        sendHtmlEmail(toEmail, subject, body);
    }

    @Async
    public void sendNewReservationNotification(String toEmail, String hostName, String guestName,
                                                String propertyTitle, String checkIn, String checkOut) {
        String subject = "New Reservation – " + propertyTitle;
        String body = buildNewReservationHtml(hostName, guestName, propertyTitle, checkIn, checkOut);
        sendHtmlEmail(toEmail, subject, body);
    }

    private void sendHtmlEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "StayVista");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            mailSender.send(message);
            log.info("Email sent to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to: {}", to, e);
        } catch (Exception e) {
            log.error("Unexpected error sending email", e);
        }
    }

    private String buildEmailVerificationHtml(String name, String link) {
        return """
            <!DOCTYPE html>
            <html><body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 40px;">
                <h1 style="color: #FF385C; text-align: center;">StayVista</h1>
                <h2>Hello, %s!</h2>
                <p>Thank you for creating an account with StayVista. Please verify your email to start exploring amazing properties.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="%s" style="background-color: #FF385C; color: white; padding: 14px 30px;
                       text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
                        Verify Email Address
                    </a>
                </div>
                <p style="color: #666;">This link expires in 24 hours.</p>
            </div>
            </body></html>
            """.formatted(name, link);
    }

    private String buildPasswordResetHtml(String name, String link) {
        return """
            <!DOCTYPE html>
            <html><body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 40px;">
                <h1 style="color: #FF385C; text-align: center;">StayVista</h1>
                <h2>Hello, %s!</h2>
                <p>We received a request to reset your password. Click the button below to create a new password.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="%s" style="background-color: #FF385C; color: white; padding: 14px 30px;
                       text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
                        Reset Password
                    </a>
                </div>
                <p style="color: #666;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
            </div>
            </body></html>
            """.formatted(name, link);
    }

    private String buildBookingConfirmationHtml(String guestName, String propertyTitle,
                                                 String checkIn, String checkOut, String bookingId) {
        return """
            <!DOCTYPE html>
            <html><body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 40px;">
                <h1 style="color: #FF385C; text-align: center;">StayVista</h1>
                <h2>🎉 Booking Confirmed!</h2>
                <p>Hi %s, your booking has been confirmed!</p>
                <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Property:</strong> %s</p>
                    <p><strong>Check-in:</strong> %s</p>
                    <p><strong>Check-out:</strong> %s</p>
                    <p><strong>Booking ID:</strong> #%s</p>
                </div>
                <p>Have a wonderful stay!</p>
            </div>
            </body></html>
            """.formatted(guestName, propertyTitle, checkIn, checkOut, bookingId);
    }

    private String buildNewReservationHtml(String hostName, String guestName, String propertyTitle,
                                            String checkIn, String checkOut) {
        return """
            <!DOCTYPE html>
            <html><body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 40px;">
                <h1 style="color: #FF385C; text-align: center;">StayVista</h1>
                <h2>🏠 New Reservation!</h2>
                <p>Hi %s, you have a new reservation!</p>
                <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Guest:</strong> %s</p>
                    <p><strong>Property:</strong> %s</p>
                    <p><strong>Check-in:</strong> %s</p>
                    <p><strong>Check-out:</strong> %s</p>
                </div>
            </div>
            </body></html>
            """.formatted(hostName, guestName, propertyTitle, checkIn, checkOut);
    }
}

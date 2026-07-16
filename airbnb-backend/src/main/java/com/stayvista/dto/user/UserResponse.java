package com.stayvista.dto.user;

import com.stayvista.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private User.Role role;
    private String avatar;
    private String bio;
    private String phone;
    private Boolean emailVerified;
    private Boolean isActive;
    private Boolean isBanned;
    private LocalDateTime createdAt;
}

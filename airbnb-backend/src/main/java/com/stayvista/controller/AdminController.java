package com.stayvista.controller;

import com.stayvista.dto.common.ApiResponse;
import com.stayvista.dto.common.PagedResponse;
import com.stayvista.dto.user.UserResponse;
import com.stayvista.entity.Property;
import com.stayvista.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<AdminService.DashboardStats>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String role) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers(page, size, role)));
    }

    @PostMapping("/users/{id}/ban")
    public ResponseEntity<ApiResponse<Void>> banUser(@PathVariable Long id) {
        adminService.banUser(id);
        return ResponseEntity.ok(ApiResponse.success("User banned", null));
    }

    @PostMapping("/users/{id}/unban")
    public ResponseEntity<ApiResponse<Void>> unbanUser(@PathVariable Long id) {
        adminService.unbanUser(id);
        return ResponseEntity.ok(ApiResponse.success("User unbanned", null));
    }

    @PatchMapping("/properties/{id}/status")
    public ResponseEntity<ApiResponse<Void>> updatePropertyStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        Property.PropertyStatus status = Property.PropertyStatus.valueOf(body.get("status").toUpperCase());
        adminService.updatePropertyStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Property status updated", null));
    }
}

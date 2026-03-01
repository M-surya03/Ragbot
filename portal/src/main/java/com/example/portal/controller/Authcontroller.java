    package com.example.portal.controller;



    import com.example.portal.dto.*;
    import com.example.portal.service.AuthService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.web.bind.annotation.*;

    @RestController
    @RequestMapping("/api/auth")
    @RequiredArgsConstructor
    public class Authcontroller{
        private final AuthService authService;

        @PostMapping("/login")
        public AuthResponse login(@RequestBody LoginRequest req) {
            return authService.login(req);
        }

        @PostMapping("/google")
        public AuthResponse google(@RequestBody GoogleAuthRequest req) {
            String email = parseEmail(req.getToken());
            String name = "Student";

            return authService.googleLogin(email, name);
        }

        @PostMapping("/set-password")
        public void setPassword(@RequestBody SetPasswordRequest req) {
            authService.setPassword(req);
        }

        private String parseEmail(String token) {
            return token;
        }
    }


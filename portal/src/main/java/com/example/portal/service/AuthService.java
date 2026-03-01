package com.example.portal.service;



import com.example.portal.dto.*;
import com.example.portal.model.*;
import com.example.portal.repository.UserRepository;
import com.example.portal.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repo;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder encoder;
    public AuthResponse login(LoginRequest req) {

        User user = repo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.isPasswordSet()) {
            throw new RuntimeException("Please login with Google and set password first.");
        }

        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, false);
    }

    public AuthResponse googleLogin(String email, String name) {

        User user = repo.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setEmail(email);
            u.setName(name);
            u.setRole(Role.STUDENT);
            u.setProvider(Provider.GOOGLE);
            u.setPasswordSet(false);
            return repo.save(u);
        });

        String token = jwtUtil.generateToken(email);

        return new AuthResponse(token, !user.isPasswordSet());
    }
    public void setPassword(SetPasswordRequest req) {

        User user = repo.findByEmail(req.getEmail()).orElseThrow();

        user.setPassword(encoder.encode(req.getPassword()));
        user.setPasswordSet(true);

        repo.save(user);
    }
}

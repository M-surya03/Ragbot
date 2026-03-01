package com.example.portal.config;

import com.example.portal.model.Provider;
import com.example.portal.model.Role;
import com.example.portal.model.User;
import com.example.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner createDefaultAdmin() {
        return args -> {

            String adminEmail = "admin@college.edu";

            if (userRepository.findByEmail(adminEmail).isPresent()) {
                log.info("Admin already exists");
                return;
            }

            User admin = new User();
            admin.setName("Administrator");
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setProvider(Provider.LOCAL);
            admin.setPasswordSet(true);

            userRepository.save(admin);

            log.info("Default ADMIN created");
            log.info("Email: {}", adminEmail);
            log.info("Password: admin123");
            log.warn("Change this password after first login!");
        };
    }
}

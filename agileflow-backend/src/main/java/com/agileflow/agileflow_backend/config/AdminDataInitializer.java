package com.agileflow.agileflow_backend.config;

import com.agileflow.agileflow_backend.auth.entity.Role;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.RoleRepository;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.common.enums.RoleName;
import com.agileflow.agileflow_backend.common.enums.UserStatus;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@Order(2)
public class AdminDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminDataInitializer(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // Create default roles if missing
        Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(RoleName.ADMIN);
                    return roleRepository.save(role);
                });

        roleRepository.findByName(RoleName.PROJECT_MANAGER)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(RoleName.PROJECT_MANAGER);
                    return roleRepository.save(role);
                });

        roleRepository.findByName(RoleName.DEVELOPER)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(RoleName.DEVELOPER);
                    return roleRepository.save(role);
                });

        // Create default admin user if missing
        if (userRepository.existsByEmail("admin@agileflow.com")) {
            return;
        }

        User admin = new User();

        admin.setFirstName("System");
        admin.setLastName("Admin");
        admin.setEmail("admin@agileflow.com");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setStatus(UserStatus.ACTIVE);
        admin.setRoles(Set.of(adminRole));

        userRepository.save(admin);
    }
}
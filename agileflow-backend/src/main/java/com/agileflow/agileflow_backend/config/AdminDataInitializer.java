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

        Role pmRole = roleRepository.findByName(RoleName.PROJECT_MANAGER)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(RoleName.PROJECT_MANAGER);
                    return roleRepository.save(role);
                });

        Role devRole = roleRepository.findByName(RoleName.DEVELOPER)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(RoleName.DEVELOPER);
                    return roleRepository.save(role);
                });

        // 1. Ensure admin@agileflow.com exists and has ADMIN role
        User admin = userRepository.findByEmail("admin@agileflow.com").orElse(null);
        if (admin == null) {
            admin = new User();
            admin.setFirstName("System");
            admin.setLastName("Admin");
            admin.setEmail("admin@agileflow.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setStatus(UserStatus.ACTIVE);
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
        } else {
            if (!admin.getRoles().contains(adminRole)) {
                admin.setRoles(Set.of(adminRole));
                userRepository.save(admin);
            }
        }

        // 2. Ensure pm@gmail.com exists and has PROJECT_MANAGER role
        User pm = userRepository.findByEmail("pm@gmail.com").orElse(null);
        if (pm == null) {
            pm = new User();
            pm.setFirstName("Project");
            pm.setLastName("Manager");
            pm.setEmail("pm@gmail.com");
            pm.setPassword(passwordEncoder.encode("manager@1234"));
            pm.setStatus(UserStatus.ACTIVE);
            pm.setRoles(Set.of(pmRole));
            userRepository.save(pm);
        } else {
            if (!pm.getRoles().contains(pmRole)) {
                pm.setRoles(Set.of(pmRole));
                userRepository.save(pm);
            }
        }

        // 3. Ensure dev@gmail.com exists and has DEVELOPER role
        User dev = userRepository.findByEmail("dev@gmail.com").orElse(null);
        if (dev == null) {
            dev = new User();
            dev.setFirstName("project");
            dev.setLastName(" dev");
            dev.setEmail("dev@gmail.com");
            dev.setPassword(passwordEncoder.encode("dev@1234"));
            dev.setStatus(UserStatus.ACTIVE);
            dev.setRoles(Set.of(devRole));
            userRepository.save(dev);
        } else {
            if (!dev.getRoles().contains(devRole)) {
                dev.setRoles(Set.of(devRole));
                userRepository.save(dev);
            }
        }
    }
}
package com.agileflow.agileflow_backend.config;

import com.agileflow.agileflow_backend.auth.entity.Role;
import com.agileflow.agileflow_backend.auth.repository.RoleRepository;
import com.agileflow.agileflow_backend.common.enums.RoleName;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class RoleDataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public RoleDataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {

        if (roleRepository.count() > 0) {
            return;
        }

        Role admin = new Role();
        admin.setName(RoleName.ADMIN);

        Role pm = new Role();
        pm.setName(RoleName.PROJECT_MANAGER);

        Role developer = new Role();
        developer.setName(RoleName.DEVELOPER);

        roleRepository.save(admin);
        roleRepository.save(pm);
        roleRepository.save(developer);
    }
}
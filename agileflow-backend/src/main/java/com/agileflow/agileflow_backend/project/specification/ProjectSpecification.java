package com.agileflow.agileflow_backend.project.specification;

import com.agileflow.agileflow_backend.project.entity.Project;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class ProjectSpecification {

    public static Specification<Project> filterProjects(
            String keyword,
            Long ownerId) {
        return filterProjects(keyword, ownerId, null);
    }

    public static Specification<Project> filterProjects(
            String keyword,
            Long ownerId,
            Set<Long> allowedProjectIds) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (allowedProjectIds != null) {
                if (allowedProjectIds.isEmpty()) {
                    predicates.add(criteriaBuilder.disjunction());
                } else {
                    predicates.add(root.get("id").in(allowedProjectIds));
                }
            }

            // Optional keyword search in name or description (case-insensitive)
            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                Predicate namePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern);
                Predicate descPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern);
                predicates.add(criteriaBuilder.or(namePredicate, descPredicate));
            }

            // Optional owner filter
            if (ownerId != null) {
                predicates.add(criteriaBuilder.equal(root.get("owner").get("id"), ownerId));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

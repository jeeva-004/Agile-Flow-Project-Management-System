package com.agileflow.agileflow_backend.sprint.entity;

import com.agileflow.agileflow_backend.project.entity.Project;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "sprints")
@Getter
@Setter
public class Sprint {

    @Id
    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY)
    private Long id;

    @Column(
            nullable = false,
            length = 150)
    private String name;

    @Column(
            nullable = false)
    private LocalDate startDate;

    @Column(
            nullable = false)
    private LocalDate endDate;

    @ManyToOne(
            fetch =
                    FetchType.LAZY)
    @JoinColumn(
            name = "project_id",
            nullable = false)
    private Project project;

    // getters setters

}
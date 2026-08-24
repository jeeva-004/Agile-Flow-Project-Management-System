package com.agileflow.agileflow_backend.config;

import com.agileflow.agileflow_backend.activity.entity.Activity;
import com.agileflow.agileflow_backend.activity.repository.ActivityRepository;
import com.agileflow.agileflow_backend.auth.entity.Role;
import com.agileflow.agileflow_backend.auth.entity.User;
import com.agileflow.agileflow_backend.auth.repository.RoleRepository;
import com.agileflow.agileflow_backend.auth.repository.UserRepository;
import com.agileflow.agileflow_backend.comment.entity.Comment;
import com.agileflow.agileflow_backend.comment.repository.CommentRepository;
import com.agileflow.agileflow_backend.common.enums.IssuePriority;
import com.agileflow.agileflow_backend.common.enums.IssueStatus;
import com.agileflow.agileflow_backend.common.enums.IssueType;
import com.agileflow.agileflow_backend.common.enums.RoleName;
import com.agileflow.agileflow_backend.common.enums.UserStatus;
import com.agileflow.agileflow_backend.issue.entity.Issue;
import com.agileflow.agileflow_backend.issue.repository.IssueRepository;
import com.agileflow.agileflow_backend.project.entity.Project;
import com.agileflow.agileflow_backend.project.repository.ProjectRepository;
import com.agileflow.agileflow_backend.projectmember.entity.ProjectMember;
import com.agileflow.agileflow_backend.projectmember.repository.ProjectMemberRepository;
import com.agileflow.agileflow_backend.sprint.entity.Sprint;
import com.agileflow.agileflow_backend.sprint.repository.SprintRepository;
import com.agileflow.agileflow_backend.worklog.entity.WorkLog;
import com.agileflow.agileflow_backend.worklog.repository.WorkLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Set;

@Component
@Order(3)
public class SampleDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(SampleDataInitializer.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final SprintRepository sprintRepository;
    private final IssueRepository issueRepository;
    private final WorkLogRepository workLogRepository;
    private final CommentRepository commentRepository;
    private final ActivityRepository activityRepository;
    private final PasswordEncoder passwordEncoder;

    public SampleDataInitializer(
            UserRepository userRepository,
            RoleRepository roleRepository,
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            SprintRepository sprintRepository,
            IssueRepository issueRepository,
            WorkLogRepository workLogRepository,
            CommentRepository commentRepository,
            ActivityRepository activityRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.sprintRepository = sprintRepository;
        this.issueRepository = issueRepository;
        this.workLogRepository = workLogRepository;
        this.commentRepository = commentRepository;
        this.activityRepository = activityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Safe check: do not re-seed if projects already exist
        if (projectRepository.count() > 0) {
            logger.info("Sample projects already exist. Skipping sample data seeding.");
            return;
        }

        logger.info("Seeding realistic sample data for AgileFlow...");

        // Fetch roles
        Role adminRole = roleRepository.findByName(RoleName.ADMIN).orElse(null);
        Role pmRole = roleRepository.findByName(RoleName.PROJECT_MANAGER).orElse(null);
        Role devRole = roleRepository.findByName(RoleName.DEVELOPER).orElse(null);

        // Fetch default users created by AdminDataInitializer
        User adminUser = userRepository.findByEmail("admin@agileflow.com").orElse(null);
        User defaultPmUser = userRepository.findByEmail("pm@gmail.com").orElse(null);
        User defaultDevUser = userRepository.findByEmail("dev@gmail.com").orElse(null);

        // Seed additional realistic team member users if missing
        User sarahPm = getOrCreateUser("Sarah", "Jenkins", "sarah.pm@agileflow.com", "manager@1234", pmRole);
        User alexDev = getOrCreateUser("Alex", "Rivera", "alex.dev@agileflow.com", "dev@1234", devRole);
        User emmaDev = getOrCreateUser("Emma", "Watson", "emma.dev@agileflow.com", "dev@1234", devRole);
        User michaelDev = getOrCreateUser("Michael", "Chen", "michael.dev@agileflow.com", "dev@1234", devRole);

        // ----------------------------------------------------
        // 1. SEED PROJECTS
        // ----------------------------------------------------
        Project p1 = new Project();
        p1.setName("AgileFlow Platform Redesign");
        p1.setDescription("Core web application modernization with responsive layout system, interactive sprint backlog, and real-time project analytics.");
        p1.setStartDate(LocalDate.of(2026, 1, 10));
        p1.setEndDate(LocalDate.of(2026, 12, 31));
        p1.setOwner(defaultPmUser != null ? defaultPmUser : adminUser);
        p1 = projectRepository.save(p1);

        Project p2 = new Project();
        p2.setName("Mobile Client App (iOS & Android)");
        p2.setDescription("Cross-platform native mobile application providing offline task management, biometric auth, and push notifications.");
        p2.setStartDate(LocalDate.of(2026, 2, 1));
        p2.setEndDate(LocalDate.of(2026, 10, 30));
        p2.setOwner(sarahPm != null ? sarahPm : adminUser);
        p2 = projectRepository.save(p2);

        Project p3 = new Project();
        p3.setName("DevOps & Cloud Infrastructure");
        p3.setDescription("Automated CI/CD build pipelines, Kubernetes cluster orchestration, and Prometheus monitoring infrastructure.");
        p3.setStartDate(LocalDate.of(2026, 3, 1));
        p3.setEndDate(LocalDate.of(2026, 11, 30));
        p3.setOwner(adminUser);
        p3 = projectRepository.save(p3);

        // ----------------------------------------------------
        // 2. SEED PROJECT MEMBERS
        // ----------------------------------------------------
        addProjectMember(p1, defaultPmUser);
        addProjectMember(p1, defaultDevUser);
        addProjectMember(p1, alexDev);
        addProjectMember(p1, emmaDev);
        addProjectMember(p1, adminUser);

        addProjectMember(p2, sarahPm);
        addProjectMember(p2, defaultDevUser);
        addProjectMember(p2, michaelDev);

        addProjectMember(p3, adminUser);
        addProjectMember(p3, alexDev);
        addProjectMember(p3, michaelDev);
        addProjectMember(p3, defaultPmUser);

        // ----------------------------------------------------
        // 3. SEED SPRINTS
        // ----------------------------------------------------
        Sprint s1_p1 = new Sprint();
        s1_p1.setName("Sprint 1 - Foundation & Core UI Shell");
        s1_p1.setStartDate(LocalDate.of(2026, 1, 15));
        s1_p1.setEndDate(LocalDate.of(2026, 2, 15));
        s1_p1.setProject(p1);
        s1_p1 = sprintRepository.save(s1_p1);

        Sprint s2_p1 = new Sprint();
        s2_p1.setName("Sprint 2 - Issue Board & Sprint Management");
        s2_p1.setStartDate(LocalDate.of(2026, 2, 16));
        s2_p1.setEndDate(LocalDate.of(2026, 3, 31));
        s2_p1.setProject(p1);
        s2_p1 = sprintRepository.save(s2_p1);

        Sprint s3_p1 = new Sprint();
        s3_p1.setName("Sprint 3 - Analytics & Reporting Engine");
        s3_p1.setStartDate(LocalDate.of(2026, 4, 1));
        s3_p1.setEndDate(LocalDate.of(2026, 5, 15));
        s3_p1.setProject(p1);
        s3_p1 = sprintRepository.save(s3_p1);

        Sprint s1_p2 = new Sprint();
        s1_p2.setName("Sprint 1 - Mobile UI Wireframes & Auth");
        s1_p2.setStartDate(LocalDate.of(2026, 2, 5));
        s1_p2.setEndDate(LocalDate.of(2026, 3, 5));
        s1_p2.setProject(p2);
        s1_p2 = sprintRepository.save(s1_p2);

        Sprint s2_p2 = new Sprint();
        s2_p2.setName("Sprint 2 - Offline Sync & Push Notifications");
        s2_p2.setStartDate(LocalDate.of(2026, 3, 6));
        s2_p2.setEndDate(LocalDate.of(2026, 4, 15));
        s2_p2.setProject(p2);
        s2_p2 = sprintRepository.save(s2_p2);

        Sprint s1_p3 = new Sprint();
        s1_p3.setName("Sprint 1 - Kubernetes & Docker Setup");
        s1_p3.setStartDate(LocalDate.of(2026, 3, 1));
        s1_p3.setEndDate(LocalDate.of(2026, 4, 1));
        s1_p3.setProject(p3);
        s1_p3 = sprintRepository.save(s1_p3);

        // ----------------------------------------------------
        // 4. SEED ISSUES
        // ----------------------------------------------------
        Issue i1 = createIssue(
                "Design Responsive Application Shell & Sidebar Drawer",
                "Construct flexible side nav drawer layout that supports smooth transitions on mobile, tablet, and desktop viewports.",
                IssueStatus.DONE,
                IssuePriority.HIGH,
                IssueType.STORY,
                16,
                LocalDate.of(2026, 2, 10),
                p1,
                s1_p1,
                defaultDevUser,
                defaultPmUser != null ? defaultPmUser : adminUser
        );

        Issue i2 = createIssue(
                "Implement JWT Security Filter & Role-Based Guard Pipeline",
                "Integrate Spring Security JWT authentication filter with automatic token validation and role-based API protection.",
                IssueStatus.DONE,
                IssuePriority.CRITICAL,
                IssueType.TASK,
                24,
                LocalDate.of(2026, 2, 14),
                p1,
                s1_p1,
                alexDev,
                defaultPmUser != null ? defaultPmUser : adminUser
        );

        Issue i3 = createIssue(
                "Fix Kanban Drag-and-Drop Touch Lag on Mobile Devices",
                "Touch event listeners on issue card containers freeze during rapid touch drag actions on mobile webkit browsers.",
                IssueStatus.IN_PROGRESS,
                IssuePriority.HIGH,
                IssueType.BUG,
                8,
                LocalDate.of(2026, 3, 20),
                p1,
                s2_p1,
                defaultDevUser,
                defaultPmUser != null ? defaultPmUser : adminUser
        );

        Issue i4 = createIssue(
                "Develop Interactive Burndown Chart & Velocity Analytics",
                "Integrate Chart.js metrics for sprint progress tracking and remaining issue estimate calculations.",
                IssueStatus.IN_PROGRESS,
                IssuePriority.MEDIUM,
                IssueType.STORY,
                16,
                LocalDate.of(2026, 3, 28),
                p1,
                s2_p1,
                emmaDev,
                defaultPmUser != null ? defaultPmUser : adminUser
        );

        Issue i5 = createIssue(
                "Automate Email Notifications for High Priority Ticket Creation",
                "Trigger background notification alerts to assigned developers whenever critical or high priority tickets are logged.",
                IssueStatus.TODO,
                IssuePriority.MEDIUM,
                IssueType.TASK,
                12,
                LocalDate.of(2026, 4, 10),
                p1,
                s2_p1,
                alexDev,
                defaultPmUser != null ? defaultPmUser : adminUser
        );

        Issue i6 = createIssue(
                "Setup Export to PDF Audit Report Endpoint",
                "Construct PDF report generator service compiling user activities and project audit timelines into downloadable documents.",
                IssueStatus.TODO,
                IssuePriority.LOW,
                IssueType.TASK,
                8,
                LocalDate.of(2026, 5, 10),
                p1,
                s3_p1,
                emmaDev,
                defaultPmUser != null ? defaultPmUser : adminUser
        );

        Issue i7 = createIssue(
                "Implement Biometric FaceID & Fingerprint Login Screen",
                "Integrate mobile native biometric auth module allowing seamless login on supported mobile hardware.",
                IssueStatus.DONE,
                IssuePriority.HIGH,
                IssueType.STORY,
                16,
                LocalDate.of(2026, 3, 1),
                p2,
                s1_p2,
                michaelDev,
                sarahPm != null ? sarahPm : adminUser
        );

        Issue i8 = createIssue(
                "Configure SQLite Local Cache for Mobile Offline Mode",
                "Implement local relational storage for mobile client allowing issue reading and draft creation while offline.",
                IssueStatus.IN_PROGRESS,
                IssuePriority.CRITICAL,
                IssueType.TASK,
                20,
                LocalDate.of(2026, 4, 5),
                p2,
                s2_p2,
                defaultDevUser,
                sarahPm != null ? sarahPm : adminUser
        );

        Issue i9 = createIssue(
                "Configure Helm Charts for Kubernetes Deployment Pipeline",
                "Write production Helm chart manifests for backend spring services, postgres DB clusters, and ingress routers.",
                IssueStatus.DONE,
                IssuePriority.HIGH,
                IssueType.TASK,
                16,
                LocalDate.of(2026, 3, 25),
                p3,
                s1_p3,
                alexDev,
                adminUser
        );

        // ----------------------------------------------------
        // 5. SEED WORK LOGS
        // ----------------------------------------------------
        createWorkLog(i1, defaultDevUser, 8.0, "Constructed responsive HTML layout shell and top navigation bar.", LocalDate.of(2026, 1, 20));
        createWorkLog(i1, defaultDevUser, 8.0, "Integrated sidebar drawer slide transitions and touch backdrop overlays.", LocalDate.of(2026, 1, 22));

        createWorkLog(i2, alexDev, 12.0, "Built Spring Security JwtAuthenticationFilter and token signing service.", LocalDate.of(2026, 1, 25));
        createWorkLog(i2, alexDev, 12.0, "Configured token refresh rotation and public route permit matcher rules.", LocalDate.of(2026, 1, 28));

        createWorkLog(i3, defaultDevUser, 4.0, "Investigated mobile webkit touch drag events and CSS transform hardware acceleration.", LocalDate.of(2026, 2, 18));
        createWorkLog(i4, emmaDev, 6.0, "Calculated daily remaining work velocity metrics algorithm for burndown chart.", LocalDate.of(2026, 2, 20));

        createWorkLog(i7, michaelDev, 8.0, "Integrated iOS LocalAuthentication framework and Android BiometricPrompt bridge.", LocalDate.of(2026, 2, 10));
        createWorkLog(i9, alexDev, 10.0, "Created Helm values template for postgresql connection strings and ingress cert-manager.", LocalDate.of(2026, 3, 5));

        // ----------------------------------------------------
        // 6. SEED COMMENTS
        // ----------------------------------------------------
        createComment(i3, defaultPmUser != null ? defaultPmUser : adminUser, "Great progress on the touch drag investigation! Make sure to test on iOS Safari as well as Android Chrome.");
        createComment(i3, defaultDevUser, "Tested on both devices now. Touch response is smooth at 60fps after enabling CSS transform acceleration.");
        createComment(i4, emmaDev, "Completed the burndown chart calculation backend service. Integrating Chart.js frontend controls next.");
        createComment(i7, sarahPm != null ? sarahPm : adminUser, "Biometric authentication flow tested clean on iPhone 15 Pro. Excellent work Michael!");
        createComment(i9, adminUser, "Helm charts deployed cleanly to the staging cluster. All pods are in Healthy running state.");

        // ----------------------------------------------------
        // 7. SEED ACTIVITIES
        // ----------------------------------------------------
        createActivity("CREATE", "Project 'AgileFlow Platform Redesign' was created.", "PROJECT", p1.getId(), defaultPmUser != null ? defaultPmUser : adminUser, p1);
        createActivity("CREATE", "Sprint 'Sprint 1 - Foundation & Core UI Shell' was created.", "SPRINT", s1_p1.getId(), defaultPmUser != null ? defaultPmUser : adminUser, p1);
        createActivity("CREATE", "Issue 'Design Responsive Application Shell & Sidebar Drawer' was created.", "ISSUE", i1.getId(), defaultPmUser != null ? defaultPmUser : adminUser, p1);
        createActivity("UPDATE", "Issue 'Design Responsive Application Shell & Sidebar Drawer' status changed to DONE.", "ISSUE", i1.getId(), defaultDevUser, p1);
        createActivity("CREATE", "Work log of 8.0 hours logged on issue 'Design Responsive Application Shell & Sidebar Drawer'.", "WORKLOG", i1.getId(), defaultDevUser, p1);

        logger.info("Successfully seeded realistic sample data for AgileFlow!");
    }

    private User getOrCreateUser(String firstName, String lastName, String email, String password, Role role) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User u = new User();
            u.setFirstName(firstName);
            u.setLastName(lastName);
            u.setEmail(email);
            u.setPassword(passwordEncoder.encode(password));
            u.setStatus(UserStatus.ACTIVE);
            if (role != null) {
                u.setRoles(Set.of(role));
            }
            return userRepository.save(u);
        });
    }

    private void addProjectMember(Project project, User user) {
        if (project != null && user != null) {
            if (!projectMemberRepository.existsByProjectIdAndUserId(project.getId(), user.getId())) {
                ProjectMember pm = new ProjectMember();
                pm.setProject(project);
                pm.setUser(user);
                projectMemberRepository.save(pm);
            }
        }
    }

    private Issue createIssue(
            String title,
            String description,
            IssueStatus status,
            IssuePriority priority,
            IssueType type,
            Integer estimateHours,
            LocalDate dueDate,
            Project project,
            Sprint sprint,
            User assignee,
            User createdBy) {
        Issue issue = new Issue();
        issue.setTitle(title);
        issue.setDescription(description);
        issue.setStatus(status);
        issue.setPriority(priority);
        issue.setType(type);
        issue.setEstimateHours(estimateHours);
        issue.setDueDate(dueDate);
        issue.setProject(project);
        issue.setSprint(sprint);
        issue.setAssignee(assignee);
        issue.setCreatedBy(createdBy);
        return issueRepository.save(issue);
    }

    private void createWorkLog(Issue issue, User user, Double hoursSpent, String description, LocalDate workDate) {
        if (issue != null && user != null) {
            WorkLog log = new WorkLog();
            log.setIssue(issue);
            log.setUser(user);
            log.setHoursSpent(hoursSpent);
            log.setDescription(description);
            log.setWorkDate(workDate);
            workLogRepository.save(log);
        }
    }

    private void createComment(Issue issue, User author, String message) {
        if (issue != null && author != null) {
            Comment c = new Comment();
            c.setIssue(issue);
            c.setAuthor(author);
            c.setMessage(message);
            commentRepository.save(c);
        }
    }

    private void createActivity(String action, String message, String entityType, Long entityId, User user, Project project) {
        if (user != null && project != null) {
            Activity a = new Activity();
            a.setAction(action);
            a.setMessage(message);
            a.setEntityType(entityType);
            a.setEntityId(entityId);
            a.setUser(user);
            a.setProject(project);
            activityRepository.save(a);
        }
    }
}

package com.edutrack.service;

import com.edutrack.entity.Exam;
import com.edutrack.entity.Student;
import com.edutrack.repository.AttendanceRepository;
import com.edutrack.repository.ExamRepository;
import com.edutrack.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class NotificationScheduler {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private EmailService emailService;

    // Daily check at 9 AM for low attendance and upcoming exams
    @Scheduled(cron = "0 0 9 * * *")
    public void runDailyChecks() {
        System.out.println("Running daily automated notification checks...");
        checkLowAttendance();
        checkUpcomingExams();
    }

    private void checkLowAttendance() {
        List<Object[]> lowAttendanceList = attendanceRepository.getStudentsWithLowAttendance();
        for (Object[] row : lowAttendanceList) {
            Long id = (Long) row[0];
            String name = (String) row[1];
            Long total = (Long) row[2];
            Long present = (Long) row[3];
            double percentage = total > 0 ? (present * 100.0 / total) : 0;

            if (total >= 5) { // Only notify after some baseline stats exist
                studentRepository.findById(id).ifPresent(student -> {
                    String subject = "Low Attendance Alert: Important";
                    String body = String.format(
                        "Dear %s,\n\nYour attendance in EduTrack classes is currently low at %.2f%% (%d of %d days).\nPlease ensure you maintain at least 75%% attendance.\n\nBest,\nEduTrack Attendance System",
                        name, percentage, present, total
                    );
                    emailService.sendEmail(student.getEmail(), subject, body);
                });
            }
        }
    }

    private void checkUpcomingExams() {
        // Find exams scheduled for tomorrow
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        List<Exam> upcomingExams = examRepository.findByExamDate(tomorrow);

        for (Exam exam : upcomingExams) {
            // Find all students in that class (dept, year, section)
            List<Student> students = studentRepository.findByDepartmentAndYearAndSection(
                exam.getDepartment(), exam.getYear(), exam.getSection()
            );

            for (Student student : students) {
                String subject = "Exam Reminder: " + exam.getSubject();
                String body = String.format(
                    "Dear %s,\n\nThis is a reminder for your exam in %s scheduled for tomorrow (%s).\nTime: %s - %s\nLocation: %s\n\nBest of luck!\n\nRegards,\nEduTrack System",
                    student.getName(), exam.getSubject(), exam.getExamDate(), exam.getStartTime(), exam.getEndTime(), exam.getLocation()
                );
                emailService.sendEmail(student.getEmail(), subject, body);
            }
        }
    }
}

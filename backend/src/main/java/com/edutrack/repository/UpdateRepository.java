package com.edutrack.repository;

import com.edutrack.entity.Update;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UpdateRepository extends JpaRepository<Update, Long> {
    
    @Query("SELECT u FROM Update u ORDER BY u.createdAt DESC")
    List<Update> findLatestUpdates();
}

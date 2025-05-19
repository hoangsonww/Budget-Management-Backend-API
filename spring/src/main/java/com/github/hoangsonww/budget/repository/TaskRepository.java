package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {}

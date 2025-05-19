package com.github.hoangsonww.budget.service;

import com.github.hoangsonww.budget.model.Task;
import com.github.hoangsonww.budget.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository repo;
    public TaskService(TaskRepository repo) { this.repo = repo; }
    public List<Task> findAll() { return repo.findAll(); }
    public Task findById(String id) { return repo.findById(id).orElse(null); }
    public Task save(Task t) { return repo.save(t); }
    public void delete(String id) { repo.deleteById(id); }
}

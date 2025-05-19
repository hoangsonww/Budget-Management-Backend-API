package com.github.hoangsonww.budget.service;

import com.github.hoangsonww.budget.model.User;
import com.github.hoangsonww.budget.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { this.repo = repo; }
    public List<User> findAll() { return repo.findAll(); }
    public User findById(String id) { return repo.findById(id).orElse(null); }
    public User save(User u) { return repo.save(u); }
    public void delete(String id) { repo.deleteById(id); }
}

package com.github.hoangsonww.budget.controller;

import com.github.hoangsonww.budget.model.User;
import com.github.hoangsonww.budget.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    public UserController(UserService service) { this.service = service; }

    @GetMapping
    public List<User> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public User one(@PathVariable String id) { return service.findById(id); }

    @PostMapping
    public User create(@RequestBody User u) { return service.save(u); }

    @PutMapping("/{id}")
    public User update(@PathVariable String id, @RequestBody User u) {
        u.setId(id);
        return service.save(u);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }
}

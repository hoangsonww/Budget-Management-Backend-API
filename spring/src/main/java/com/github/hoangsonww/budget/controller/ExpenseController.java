package com.github.hoangsonww.budget.controller;

import com.github.hoangsonww.budget.model.Expense;
import com.github.hoangsonww.budget.service.ExpenseService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseService service;
    public ExpenseController(ExpenseService service) { this.service = service; }

    @GetMapping
    public List<Expense> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public Expense one(@PathVariable String id) { return service.findById(id); }

    @PostMapping
    public Expense create(@RequestBody Expense e) { return service.save(e); }

    @PutMapping("/{id}")
    public Expense update(@PathVariable String id, @RequestBody Expense e) {
        e.setId(id);
        return service.save(e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }
}

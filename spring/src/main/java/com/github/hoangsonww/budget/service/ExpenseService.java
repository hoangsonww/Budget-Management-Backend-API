package com.github.hoangsonww.budget.service;

import com.github.hoangsonww.budget.model.Expense;
import com.github.hoangsonww.budget.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExpenseService {
    private final ExpenseRepository repo;
    public ExpenseService(ExpenseRepository repo) { this.repo = repo; }
    public List<Expense> findAll() { return repo.findAll(); }
    public Expense findById(String id) { return repo.findById(id).orElse(null); }
    public Expense save(Expense e) { return repo.save(e); }
    public void delete(String id) { repo.deleteById(id); }
}

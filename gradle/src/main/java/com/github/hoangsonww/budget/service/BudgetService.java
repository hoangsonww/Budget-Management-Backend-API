package com.github.hoangsonww.budget.service;

import com.github.hoangsonww.budget.model.Budget;
import com.github.hoangsonww.budget.repository.BudgetRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BudgetService {
    private final BudgetRepository repo;
    public BudgetService(BudgetRepository repo) { this.repo=repo; }
    public List<Budget> findAll(){ return repo.findAll(); }
    public Budget findById(String id){ return repo.findById(id).orElse(null);}
    public Budget save(Budget b){ return repo.save(b); }
    public void delete(String id){ repo.deleteById(id); }
}

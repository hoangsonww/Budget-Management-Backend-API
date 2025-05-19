package com.github.hoangsonww.budget.controller;

import com.github.hoangsonww.budget.model.Budget;
import com.github.hoangsonww.budget.service.BudgetService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    private final BudgetService service;
    public BudgetController(BudgetService service){this.service=service;}
    @GetMapping public List<Budget> all(){return service.findAll();}
    @GetMapping("/{id}") public Budget one(@PathVariable String id){return service.findById(id);}
    @PostMapping public Budget create(@RequestBody Budget b){return service.save(b);}
    @PutMapping("/{id}") public Budget update(@PathVariable String id,@RequestBody Budget b){
        b.setId(id);return service.save(b);}
    @DeleteMapping("/{id}") public void delete(@PathVariable String id){service.delete(id);}
}

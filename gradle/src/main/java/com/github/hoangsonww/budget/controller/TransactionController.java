package com.github.hoangsonww.budget.controller;

import com.github.hoangsonww.budget.model.Transaction;
import com.github.hoangsonww.budget.service.TransactionService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService service;
    public TransactionController(TransactionService service){this.service=service;}
    @GetMapping public List<Transaction> all(){return service.findAll();}
    @GetMapping("/{id}") public Transaction one(@PathVariable String id){return service.findById(id);}
    @PostMapping public Transaction create(@RequestBody Transaction t){return service.save(t);}
    @PutMapping("/{id}") public Transaction update(@PathVariable String id,@RequestBody Transaction t){
        t.setId(id);return service.save(t);}
    @DeleteMapping("/{id}") public void delete(@PathVariable String id){service.delete(id);}
}

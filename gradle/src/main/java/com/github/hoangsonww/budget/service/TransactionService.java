package com.github.hoangsonww.budget.service;

import com.github.hoangsonww.budget.model.Transaction;
import com.github.hoangsonww.budget.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransactionService {
    private final TransactionRepository repo;
    public TransactionService(TransactionRepository repo){this.repo=repo;}
    public List<Transaction> findAll(){return repo.findAll();}
    public Transaction findById(String id){return repo.findById(id).orElse(null);}
    public Transaction save(Transaction t){return repo.save(t);}
    public void delete(String id){repo.deleteById(id);}
}

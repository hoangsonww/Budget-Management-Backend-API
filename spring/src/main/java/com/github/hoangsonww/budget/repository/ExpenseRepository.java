package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense, String> {}

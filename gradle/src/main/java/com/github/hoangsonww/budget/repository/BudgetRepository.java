package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetRepository extends MongoRepository<Budget,String> {}

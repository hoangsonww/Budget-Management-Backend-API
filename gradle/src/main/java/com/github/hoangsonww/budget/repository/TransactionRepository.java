package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction,String> {}

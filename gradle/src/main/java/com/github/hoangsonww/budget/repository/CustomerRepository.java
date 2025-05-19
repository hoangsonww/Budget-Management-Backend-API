package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends MongoRepository<Customer,String> {}

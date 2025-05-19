package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends MongoRepository<Order,String> {}

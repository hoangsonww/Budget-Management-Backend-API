package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User,String> {}

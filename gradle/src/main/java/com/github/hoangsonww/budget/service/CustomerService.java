package com.github.hoangsonww.budget.service;

import com.github.hoangsonww.budget.model.Customer;
import com.github.hoangsonww.budget.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository repo;
    public CustomerService(CustomerRepository repo){this.repo=repo;}
    public List<Customer> findAll(){return repo.findAll();}
    public Customer findById(String id){return repo.findById(id).orElse(null);}
    public Customer save(Customer c){return repo.save(c);}
    public void delete(String id){repo.deleteById(id);}
}

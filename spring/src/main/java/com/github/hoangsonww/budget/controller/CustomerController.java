package com.github.hoangsonww.budget.controller;

import com.github.hoangsonww.budget.model.Customer;
import com.github.hoangsonww.budget.service.CustomerService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService service;
    public CustomerController(CustomerService service) { this.service = service; }

    @GetMapping
    public List<Customer> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public Customer one(@PathVariable String id) { return service.findById(id); }

    @PostMapping
    public Customer create(@RequestBody Customer c) { return service.save(c); }

    @PutMapping("/{id}")
    public Customer update(@PathVariable String id, @RequestBody Customer c) {
        c.setId(id);
        return service.save(c);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }
}

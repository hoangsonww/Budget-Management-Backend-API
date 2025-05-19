package com.github.hoangsonww.budget.service;

import com.github.hoangsonww.budget.model.Order;
import com.github.hoangsonww.budget.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository repo;
    public OrderService(OrderRepository repo) { this.repo = repo; }
    public List<Order> findAll() { return repo.findAll(); }
    public Order findById(String id) { return repo.findById(id).orElse(null); }
    public Order save(Order o) { return repo.save(o); }
    public void delete(String id) { repo.deleteById(id); }
}

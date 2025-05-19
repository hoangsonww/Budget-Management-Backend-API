package com.github.hoangsonww.budget.controller;

import com.github.hoangsonww.budget.model.Order;
import com.github.hoangsonww.budget.service.OrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService service;
    public OrderController(OrderService service) { this.service = service; }

    @GetMapping
    public List<Order> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public Order one(@PathVariable String id) { return service.findById(id); }

    @PostMapping
    public Order create(@RequestBody Order o) { return service.save(o); }

    @PutMapping("/{id}")
    public Order update(@PathVariable String id, @RequestBody Order o) {
        o.setId(id);
        return service.save(o);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }
}

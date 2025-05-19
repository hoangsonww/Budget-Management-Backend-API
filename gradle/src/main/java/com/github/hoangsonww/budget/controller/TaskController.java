package com.github.hoangsonww.budget.controller;

import com.github.hoangsonww.budget.model.Task;
import com.github.hoangsonww.budget.service.TaskService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;
    public TaskController(TaskService service){this.service=service;}
    @GetMapping public List<Task> all(){return service.findAll();}
    @GetMapping("/{id}") public Task one(@PathVariable String id){return service.findById(id);}
    @PostMapping public Task create(@RequestBody Task t){return service.save(t);}
    @PutMapping("/{id}") public Task update(@PathVariable String id,@RequestBody Task t){
        t.setId(id);return service.save(t);}
    @DeleteMapping("/{id}") public void delete(@PathVariable String id){service.delete(id);}
}

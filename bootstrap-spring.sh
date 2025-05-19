#!/usr/bin/env bash
# bootstrap-spring.sh
# -------------------
# Creates a Spring Boot + Maven backend under ./spring/
# with 7 resources: Budget, Expense, User, Customer, Order, Task, Transaction.
# MongoDB for Budget & Expense, PostgreSQL (JPA) for all.
# Fully explicit—no loops or fancy Bash expansions.

set -e

BASE_DIR="$(pwd)"
SPRING_DIR="$BASE_DIR/spring"
PKG_PATH="com/github/hoangsonww/budget"

# 1) Clean & mkdirs
rm -rf "$SPRING_DIR"
mkdir -p "$SPRING_DIR/src/main/resources"
mkdir -p "$SPRING_DIR/src/main/java/$PKG_PATH/model"
mkdir -p "$SPRING_DIR/src/main/java/$PKG_PATH/repository"
mkdir -p "$SPRING_DIR/src/main/java/$PKG_PATH/service"
mkdir -p "$SPRING_DIR/src/main/java/$PKG_PATH/controller"

# 2) pom.xml
cat > "$SPRING_DIR/pom.xml" <<'EOF'
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.github.hoangsonww</groupId>
  <artifactId>budget-backend</artifactId>
  <version>1.0.0</version>
  <properties>
    <java.version>17</java.version>
    <spring.boot.version>2.7.12</spring.boot.version>
  </properties>
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-dependencies</artifactId>
        <version>${spring.boot.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
  <dependencies>
    <!-- Web -->
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
    <!-- JPA/PostgreSQL -->
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
    <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>
    <!-- MongoDB -->
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-mongodb</artifactId></dependency>
    <!-- JWT -->
    <dependency><groupId>io.jsonwebtoken</groupId><artifactId>jjwt</artifactId><version>0.9.1</version></dependency>
    <!-- Lombok -->
    <dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><scope>provided</scope></dependency>
    <!-- Testing -->
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope></dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin>
    </plugins>
  </build>
  <distributionManagement>
    <repository>
      <id>github</id>
      <url>https://maven.pkg.github.com/hoangsonww/Budget-Management-Backend-API</url>
    </repository>
  </distributionManagement>
</project>
EOF

# 3) application.properties
cat > "$SPRING_DIR/src/main/resources/application.properties" <<'EOF'
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/budget_manager
spring.datasource.username=user
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update

spring.data.mongodb.uri=mongodb://localhost:27017/budget_manager

jwt.secret=ChangeThisJWTSecret123!

logging.level.org.springframework=INFO
EOF

# 4) Main class
cat > "$SPRING_DIR/src/main/java/$PKG_PATH/BudgetBackendApplication.java" <<'EOF'
package com.github.hoangsonww.budget;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BudgetBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BudgetBackendApplication.class, args);
    }
}
EOF

# 5) Budget
cat > "$SPRING_DIR/src/main/java/$PKG_PATH/model/Budget.java" <<'EOF'
package com.github.hoangsonww.budget.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.persistence.*;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="budgets")
public class Budget {
    @Id
    @org.springframework.data.annotation.Id
    private String id;
    private String name;
    private Double limit;
    private Date createdAt;
}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/repository/BudgetRepository.java" <<'EOF'
package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetRepository extends MongoRepository<Budget, String> {}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/service/BudgetService.java" <<'EOF'
package com.github.hoangsonww.budget.service;

import com.github.hoangsonww.budget.model.Budget;
import com.github.hoangsonww.budget.repository.BudgetRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BudgetService {
    private final BudgetRepository repo;
    public BudgetService(BudgetRepository repo) { this.repo = repo; }
    public List<Budget> findAll() { return repo.findAll(); }
    public Budget findById(String id) { return repo.findById(id).orElse(null); }
    public Budget save(Budget b) { return repo.save(b); }
    public void delete(String id) { repo.deleteById(id); }
}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/controller/BudgetController.java" <<'EOF'
package com.github.hoangsonww.budget.controller;

import com.github.hoangsonww.budget.model.Budget;
import com.github.hoangsonww.budget.service.BudgetService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    private final BudgetService service;
    public BudgetController(BudgetService service) { this.service = service; }

    @GetMapping
    public List<Budget> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public Budget one(@PathVariable String id) { return service.findById(id); }

    @PostMapping
    public Budget create(@RequestBody Budget b) { return service.save(b); }

    @PutMapping("/{id}")
    public Budget update(@PathVariable String id, @RequestBody Budget b) {
        b.setId(id);
        return service.save(b);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }
}
EOF

# 6) Expense
cat > "$SPRING_DIR/src/main/java/$PKG_PATH/model/Expense.java" <<'EOF'
package com.github.hoangsonww.budget.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.persistence.*;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="expenses")
public class Expense {
    @Id
    @org.springframework.data.annotation.Id
    private String id;
    private String budgetId;
    private String description;
    private Double amount;
    private Date createdAt;
}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/repository/ExpenseRepository.java" <<'EOF'
package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense, String> {}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/service/ExpenseService.java" <<'EOF'
package com.github.hoangsonww.budget.service;

import com.github.hoangsonww.budget.model.Expense;
import com.github.hoangsonww.budget.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExpenseService {
    private final ExpenseRepository repo;
    public ExpenseService(ExpenseRepository repo) { this.repo = repo; }
    public List<Expense> findAll() { return repo.findAll(); }
    public Expense findById(String id) { return repo.findById(id).orElse(null); }
    public Expense save(Expense e) { return repo.save(e); }
    public void delete(String id) { repo.deleteById(id); }
}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/controller/ExpenseController.java" <<'EOF'
package com.github.hoangsonww.budget.controller;

import com.github.hoangsonww.budget.model.Expense;
import com.github.hoangsonww.budget.service.ExpenseService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseService service;
    public ExpenseController(ExpenseService service) { this.service = service; }

    @GetMapping
    public List<Expense> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public Expense one(@PathVariable String id) { return service.findById(id); }

    @PostMapping
    public Expense create(@RequestBody Expense e) { return service.save(e); }

    @PutMapping("/{id}")
    public Expense update(@PathVariable String id, @RequestBody Expense e) {
        e.setId(id);
        return service.save(e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }
}
EOF

# 7) User
cat > "$SPRING_DIR/src/main/java/$PKG_PATH/model/User.java" <<'EOF'
package com.github.hoangsonww.budget.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.persistence.*;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="users")
public class User {
    @Id
    @org.springframework.data.annotation.Id
    private String id;
    private String username;
    private String email;
    private String password;
    private Date createdAt;
}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/repository/UserRepository.java" <<'EOF'
package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/service/UserService.java" <<'EOF'
package com.github.hoangsonww.budget.service;

import com.github.hoangsonww.budget.model.User;
import com.github.hoangsonww.budget.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { this.repo = repo; }
    public List<User> findAll() { return repo.findAll(); }
    public User findById(String id) { return repo.findById(id).orElse(null); }
    public User save(User u) { return repo.save(u); }
    public void delete(String id) { repo.deleteById(id); }
}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/controller/UserController.java" <<'EOF'
package com.github.hoangsonww.budget.controller;

import com.github.hoangsonww.budget.model.User;
import com.github.hoangsonww.budget.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    public UserController(UserService service) { this.service = service; }

    @GetMapping
    public List<User> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public User one(@PathVariable String id) { return service.findById(id); }

    @PostMapping
    public User create(@RequestBody User u) { return service.save(u); }

    @PutMapping("/{id}")
    public User update(@PathVariable String id, @RequestBody User u) {
        u.setId(id);
        return service.save(u);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }
}
EOF

# 8) Customer
cat > "$SPRING_DIR/src/main/java/$PKG_PATH/model/Customer.java" <<'EOF'
package com.github.hoangsonww.budget.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.persistence.*;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="customers")
public class Customer {
    @Id
    @org.springframework.data.annotation.Id
    private String id;
    private String name;
    private String email;
    private String phone;
}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/repository/CustomerRepository.java" <<'EOF'
package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, String> {}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/service/CustomerService.java" <<'EOF'
package com.github.hoangsonww.budget.service;

import com.github.hoangsonww.budget.model.Customer;
import com.github.hoangsonww.budget.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository repo;
    public CustomerService(CustomerRepository repo) { this.repo = repo; }
    public List<Customer> findAll() { return repo.findAll(); }
    public Customer findById(String id) { return repo.findById(id).orElse(null); }
    public Customer save(Customer c) { return repo.save(c); }
    public void delete(String id) { repo.deleteById(id); }
}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/controller/CustomerController.java" <<'EOF'
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
EOF

# 9) Order
cat > "$SPRING_DIR/src/main/java/$PKG_PATH/model/Order.java" <<'EOF'
package com.github.hoangsonww.budget.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.persistence.*;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="orders")
public class Order {
    @Id
    @org.springframework.data.annotation.Id
    private String id;
    private String customerId;
    private Double amount;
    private String status;
    private Date createdAt;
}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/repository/OrderRepository.java" <<'EOF'
package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/service/OrderService.java" <<'EOF'
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
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/controller/OrderController.java" <<'EOF'
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
EOF

# 10) Task
cat > "$SPRING_DIR/src/main/java/$PKG_PATH/model/Task.java" <<'EOF'
package com.github.hoangsonww.budget.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.persistence.*;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="tasks")
public class Task {
    @Id
    @org.springframework.data.annotation.Id
    private String id;
    private String description;
    private String status;
    private Date createdAt;
}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/repository/TaskRepository.java" <<'EOF'
package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends MongoRepository<Task, String> {}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/service/TaskService.java" <<'EOF'
package com.github.hoangsonww.budget.service;

import com.github.hoangsonww.budget.model.Task;
import com.github.hoangsonww.budget.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository repo;
    public TaskService(TaskRepository repo) { this.repo = repo; }
    public List<Task> findAll() { return repo.findAll(); }
    public Task findById(String id) { return repo.findById(id).orElse(null); }
    public Task save(Task t) { return repo.save(t); }
    public void delete(String id) { repo.deleteById(id); }
}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/controller/TaskController.java" <<'EOF'
package com.github.hoangsonww.budget.controller;

import com.github.hoangsonww.budget.model.Task;
import com.github.hoangsonww.budget.service.TaskService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService service;
    public TaskController(TaskService service) { this.service = service; }

    @GetMapping
    public List<Task> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public Task one(@PathVariable String id) { return service.findById(id); }

    @PostMapping
    public Task create(@RequestBody Task t) { return service.save(t); }

    @PutMapping("/{id}")
    public Task update(@PathVariable String id, @RequestBody Task t) {
        t.setId(id);
        return service.save(t);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }
}
EOF

# 11) Transaction
cat > "$SPRING_DIR/src/main/java/$PKG_PATH/model/Transaction.java" <<'EOF'
package com.github.hoangsonww.budget.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.persistence.*;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="transactions")
public class Transaction {
    @Id
    @org.springframework.data.annotation.Id
    private String id;
    private String referenceId;
    private String type;
    private Double amount;
    private Date createdAt;
}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/repository/TransactionRepository.java" <<'EOF'
package com.github.hoangsonww.budget.repository;

import com.github.hoangsonww.budget.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/service/TransactionService.java" <<'EOF'
package com.github.hoangsonww.budget.service;

import com.github.hoangsonww.budget.model.Transaction;
import com.github.hoangsonww.budget.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransactionService {
    private final TransactionRepository repo;
    public TransactionService(TransactionRepository repo) { this.repo = repo; }
    public List<Transaction> findAll() { return repo.findAll(); }
    public Transaction findById(String id) { return repo.findById(id).orElse(null); }
    public Transaction save(Transaction t) { return repo.save(t); }
    public void delete(String id) { repo.deleteById(id); }
}
EOF

cat > "$SPRING_DIR/src/main/java/$PKG_PATH/controller/TransactionController.java" <<'EOF'
package com.github.hoangsonww.budget.controller;

import com.github.hoangsonww.budget.model.Transaction;
import com.github.hoangsonww.budget.service.TransactionService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService service;
    public TransactionController(TransactionService service) { this.service = service; }

    @GetMapping
    public List<Transaction> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public Transaction one(@PathVariable String id) { return service.findById(id); }

    @PostMapping
    public Transaction create(@RequestBody Transaction t) { return service.save(t); }

    @PutMapping("/{id}")
    public Transaction update(@PathVariable String id, @RequestBody Transaction t) {
        t.setId(id);
        return service.save(t);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) { service.delete(id); }
}
EOF

echo "✅ Done — your Spring Boot backend is in ./spring"
echo "   cd spring && mvn clean package && java -jar target/budget-backend-1.0.0.jar"

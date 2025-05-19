#!/usr/bin/env bash
# bootstrap-gradle.sh
# -------------------
# Generates a Spring Boot + Gradle project under ./gradle/
# with 7 resources (Budget, Expense, User, Customer, Order, Task, Transaction),
# wired to MongoDB (for Budget & Expense) and PostgreSQL (via JPA),
# plus JWT, Lombok, and publishing to GitHub Packages.

set -e

# 0) Paths & config
BASE_DIR=`pwd`
TARGET_DIR="$BASE_DIR/gradle"
GROUP_ID="com.github.hoangsonww"
PKG_PATH="com/github/hoangsonww/budget"
VERSION="1.0.0"

# 1) Clean & make directories
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR/src/main/java/$PKG_PATH/model"
mkdir -p "$TARGET_DIR/src/main/java/$PKG_PATH/repository"
mkdir -p "$TARGET_DIR/src/main/java/$PKG_PATH/service"
mkdir -p "$TARGET_DIR/src/main/java/$PKG_PATH/controller"
mkdir -p "$TARGET_DIR/src/main/resources"

cd "$TARGET_DIR"

# 2) settings.gradle
cat > settings.gradle <<EOF
rootProject.name = 'budget-backend-gradle'
EOF

# 3) build.gradle
cat > build.gradle <<EOF
plugins {
    id 'org.springframework.boot' version '2.7.12'
    id 'io.spring.dependency-management' version '1.0.13.RELEASE'
    id 'java'
    id 'maven-publish'
}

group = '$GROUP_ID'
version = '$VERSION'
sourceCompatibility = '17'

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    runtimeOnly 'org.postgresql:postgresql'
    implementation 'org.springframework.boot:spring-boot-starter-data-mongodb'
    implementation 'io.jsonwebtoken:jjwt:0.9.1'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
}

publishing {
    publications {
        mavenJava(MavenPublication) {
            from components.java
            pom {
                name = 'Budget Management Backend'
                description = 'Spring Boot backend for budgets, expenses, users, customers, orders, tasks, transactions'
                url = 'https://github.com/hoangsonww/Budget-Management-Backend-API'
                licenses {
                    license {
                        name = 'MIT License'
                        url = 'https://opensource.org/licenses/MIT'
                    }
                }
                developers {
                    developer {
                        id = 'hoangsonww'
                        name = 'Son Nguyen'
                        email = 'hoangson091104@gmail.com'
                    }
                }
                scm {
                    connection = 'scm:git:git://github.com/hoangsonww/Budget-Management-Backend-API.git'
                    developerConnection = 'scm:git:ssh://git@github.com/hoangsonww/Budget-Management-Backend-API.git'
                    url = 'https://github.com/hoangsonww/Budget-Management-Backend-API'
                }
            }
        }
    }
    repositories {
        maven {
            name = 'GitHubPackages'
            url = uri('https://maven.pkg.github.com/hoangsonww/Budget-Management-Backend-API')
            credentials {
                username = project.findProperty('gpr.user') ?: System.getenv('GITHUB_USER')
                password = project.findProperty('gpr.token') ?: System.getenv('GITHUB_TOKEN')
            }
        }
    }
}

tasks.withType(JavaCompile) {
    options.encoding = 'UTF-8'
}
EOF

# 4) application.properties
cat > src/main/resources/application.properties <<EOF
server.port=8080

# PostgreSQL (JPA)
spring.datasource.url=jdbc:postgresql://localhost:5432/budget_manager
spring.datasource.username=user
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/budget_manager

# JWT Secret
jwt.secret=ChangeThisJWTSecret123!

logging.level.org.springframework=INFO
EOF

# 5) Main application class
mkdir -p src/main/java/$PKG_PATH
cat > src/main/java/$PKG_PATH/BudgetBackendApplication.java <<EOF
package $GROUP_ID.budget;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BudgetBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BudgetBackendApplication.class, args);
    }
}
EOF

# 6) Models
cat > src/main/java/$PKG_PATH/model/Budget.java <<EOF
package $GROUP_ID.budget.model;

import lombok.*;
import javax.persistence.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="budgets")
public class Budget {
    @Id @org.springframework.data.annotation.Id
    private String id;
    private String name;
    private Double limit;
    private Date createdAt;
}
EOF

cat > src/main/java/$PKG_PATH/model/Expense.java <<EOF
package $GROUP_ID.budget.model;

import lombok.*;
import javax.persistence.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="expenses")
public class Expense {
    @Id @org.springframework.data.annotation.Id
    private String id;
    private String budgetId;
    private String description;
    private Double amount;
    private Date createdAt;
}
EOF

cat > src/main/java/$PKG_PATH/model/User.java <<EOF
package $GROUP_ID.budget.model;

import lombok.*;
import javax.persistence.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="users")
public class User {
    @Id @org.springframework.data.annotation.Id
    private String id;
    private String username;
    private String email;
    private String password;
    private Date createdAt;
}
EOF

cat > src/main/java/$PKG_PATH/model/Customer.java <<EOF
package $GROUP_ID.budget.model;

import lombok.*;
import javax.persistence.*;
import org.springframework.data.mongodb.core.mapping.Document;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="customers")
public class Customer {
    @Id @org.springframework.data.annotation.Id
    private String id;
    private String name;
    private String email;
    private String phone;
}
EOF

cat > src/main/java/$PKG_PATH/model/Order.java <<EOF
package $GROUP_ID.budget.model;

import lombok.*;
import javax.persistence.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="orders")
public class Order {
    @Id @org.springframework.data.annotation.Id
    private String id;
    private String customerId;
    private Double amount;
    private String status;
    private Date createdAt;
}
EOF

cat > src/main/java/$PKG_PATH/model/Task.java <<EOF
package $GROUP_ID.budget.model;

import lombok.*;
import javax.persistence.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="tasks")
public class Task {
    @Id @org.springframework.data.annotation.Id
    private String id;
    private String description;
    private String status;
    private Date createdAt;
}
EOF

cat > src/main/java/$PKG_PATH/model/Transaction.java <<EOF
package $GROUP_ID.budget.model;

import lombok.*;
import javax.persistence.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Document(collection="transactions")
public class Transaction {
    @Id @org.springframework.data.annotation.Id
    private String id;
    private String referenceId;
    private String type;
    private Double amount;
    private Date createdAt;
}
EOF

# 7) Repositories
cat > src/main/java/$PKG_PATH/repository/BudgetRepository.java <<EOF
package $GROUP_ID.budget.repository;

import $GROUP_ID.budget.model.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetRepository extends MongoRepository<Budget,String> {}
EOF

cat > src/main/java/$PKG_PATH/repository/ExpenseRepository.java <<EOF
package $GROUP_ID.budget.repository;

import $GROUP_ID.budget.model.Expense;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends MongoRepository<Expense,String> {}
EOF

cat > src/main/java/$PKG_PATH/repository/UserRepository.java <<EOF
package $GROUP_ID.budget.repository;

import $GROUP_ID.budget.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User,String> {}
EOF

cat > src/main/java/$PKG_PATH/repository/CustomerRepository.java <<EOF
package $GROUP_ID.budget.repository;

import $GROUP_ID.budget.model.Customer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends MongoRepository<Customer,String> {}
EOF

cat > src/main/java/$PKG_PATH/repository/OrderRepository.java <<EOF
package $GROUP_ID.budget.repository;

import $GROUP_ID.budget.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends MongoRepository<Order,String> {}
EOF

cat > src/main/java/$PKG_PATH/repository/TaskRepository.java <<EOF
package $GROUP_ID.budget.repository;

import $GROUP_ID.budget.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends MongoRepository<Task,String> {}
EOF

cat > src/main/java/$PKG_PATH/repository/TransactionRepository.java <<EOF
package $GROUP_ID.budget.repository;

import $GROUP_ID.budget.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction,String> {}
EOF

# 8) Services
cat > src/main/java/$PKG_PATH/service/BudgetService.java <<EOF
package $GROUP_ID.budget.service;

import $GROUP_ID.budget.model.Budget;
import $GROUP_ID.budget.repository.BudgetRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BudgetService {
    private final BudgetRepository repo;
    public BudgetService(BudgetRepository repo) { this.repo=repo; }
    public List<Budget> findAll(){ return repo.findAll(); }
    public Budget findById(String id){ return repo.findById(id).orElse(null);}
    public Budget save(Budget b){ return repo.save(b); }
    public void delete(String id){ repo.deleteById(id); }
}
EOF

cat > src/main/java/$PKG_PATH/service/ExpenseService.java <<EOF
package $GROUP_ID.budget.service;

import $GROUP_ID.budget.model.Expense;
import $GROUP_ID.budget.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExpenseService {
    private final ExpenseRepository repo;
    public ExpenseService(ExpenseRepository repo){this.repo=repo;}
    public List<Expense> findAll(){return repo.findAll();}
    public Expense findById(String id){return repo.findById(id).orElse(null);}
    public Expense save(Expense e){return repo.save(e);}
    public void delete(String id){repo.deleteById(id);}
}
EOF

cat > src/main/java/$PKG_PATH/service/UserService.java <<EOF
package $GROUP_ID.budget.service;

import $GROUP_ID.budget.model.User;
import $GROUP_ID.budget.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo){this.repo=repo;}
    public List<User> findAll(){return repo.findAll();}
    public User findById(String id){return repo.findById(id).orElse(null);}
    public User save(User u){return repo.save(u);}
    public void delete(String id){repo.deleteById(id);}
}
EOF

cat > src/main/java/$PKG_PATH/service/CustomerService.java <<EOF
package $GROUP_ID.budget.service;

import $GROUP_ID.budget.model.Customer;
import $GROUP_ID.budget.repository.CustomerRepository;
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
EOF

cat > src/main/java/$PKG_PATH/service/OrderService.java <<EOF
package $GROUP_ID.budget.service;

import $GROUP_ID.budget.model.Order;
import $GROUP_ID.budget.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository repo;
    public OrderService(OrderRepository repo){this.repo=repo;}
    public List<Order> findAll(){return repo.findAll();}
    public Order findById(String id){return repo.findById(id).orElse(null);}
    public Order save(Order o){return repo.save(o);}
    public void delete(String id){repo.deleteById(id);}
}
EOF

cat > src/main/java/$PKG_PATH/service/TaskService.java <<EOF
package $GROUP_ID.budget.service;

import $GROUP_ID.budget.model.Task;
import $GROUP_ID.budget.repository.TaskRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository repo;
    public TaskService(TaskRepository repo){this.repo=repo;}
    public List<Task> findAll(){return repo.findAll();}
    public Task findById(String id){return repo.findById(id).orElse(null);}
    public Task save(Task t){return repo.save(t);}
    public void delete(String id){repo.deleteById(id);}
}
EOF

cat > src/main/java/$PKG_PATH/service/TransactionService.java <<EOF
package $GROUP_ID.budget.service;

import $GROUP_ID.budget.model.Transaction;
import $GROUP_ID.budget.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransactionService {
    private final TransactionRepository repo;
    public TransactionService(TransactionRepository repo){this.repo=repo;}
    public List<Transaction> findAll(){return repo.findAll();}
    public Transaction findById(String id){return repo.findById(id).orElse(null);}
    public Transaction save(Transaction t){return repo.save(t);}
    public void delete(String id){repo.deleteById(id);}
}
EOF

# 9) Controllers
cat > src/main/java/$PKG_PATH/controller/BudgetController.java <<EOF
package $GROUP_ID.budget.controller;

import $GROUP_ID.budget.model.Budget;
import $GROUP_ID.budget.service.BudgetService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    private final BudgetService service;
    public BudgetController(BudgetService service){this.service=service;}
    @GetMapping public List<Budget> all(){return service.findAll();}
    @GetMapping("/{id}") public Budget one(@PathVariable String id){return service.findById(id);}
    @PostMapping public Budget create(@RequestBody Budget b){return service.save(b);}
    @PutMapping("/{id}") public Budget update(@PathVariable String id,@RequestBody Budget b){
        b.setId(id);return service.save(b);}
    @DeleteMapping("/{id}") public void delete(@PathVariable String id){service.delete(id);}
}
EOF

cat > src/main/java/$PKG_PATH/controller/ExpenseController.java <<EOF
package $GROUP_ID.budget.controller;

import $GROUP_ID.budget.model.Expense;
import $GROUP_ID.budget.service.ExpenseService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseService service;
    public ExpenseController(ExpenseService service){this.service=service;}
    @GetMapping public List<Expense> all(){return service.findAll();}
    @GetMapping("/{id}") public Expense one(@PathVariable String id){return service.findById(id);}
    @PostMapping public Expense create(@RequestBody Expense e){return service.save(e);}
    @PutMapping("/{id}") public Expense update(@PathVariable String id,@RequestBody Expense e){
        e.setId(id);return service.save(e);}
    @DeleteMapping("/{id}") public void delete(@PathVariable String id){service.delete(id);}
}
EOF

cat > src/main/java/$PKG_PATH/controller/UserController.java <<EOF
package $GROUP_ID.budget.controller;

import $GROUP_ID.budget.model.User;
import $GROUP_ID.budget.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    public UserController(UserService service){this.service=service;}
    @GetMapping public List<User> all(){return service.findAll();}
    @GetMapping("/{id}") public User one(@PathVariable String id){return service.findById(id);}
    @PostMapping public User create(@RequestBody User u){return service.save(u);}
    @PutMapping("/{id}") public User update(@PathVariable String id,@RequestBody User u){
        u.setId(id);return service.save(u);}
    @DeleteMapping("/{id}") public void delete(@PathVariable String id){service.delete(id);}
}
EOF

cat > src/main/java/$PKG_PATH/controller/CustomerController.java <<EOF
package $GROUP_ID.budget.controller;

import $GROUP_ID.budget.model.Customer;
import $GROUP_ID.budget.service.CustomerService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerService service;
    public CustomerController(CustomerService service){this.service=service;}
    @GetMapping public List<Customer> all(){return service.findAll();}
    @GetMapping("/{id}") public Customer one(@PathVariable String id){return service.findById(id);}
    @PostMapping public Customer create(@RequestBody Customer c){return service.save(c);}
    @PutMapping("/{id}") public Customer update(@PathVariable String id,@RequestBody Customer c){
        c.setId(id);return service.save(c);}
    @DeleteMapping("/{id}") public void delete(@PathVariable String id){service.delete(id);}
}
EOF

cat > src/main/java/$PKG_PATH/controller/OrderController.java <<EOF
package $GROUP_ID.budget.controller;

import $GROUP_ID.budget.model.Order;
import $GROUP_ID.budget.service.OrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService service;
    public OrderController(OrderService service){this.service=service;}
    @GetMapping public List<Order> all(){return service.findAll();}
    @GetMapping("/{id}") public Order one(@PathVariable String id){return service.findById(id);}
    @PostMapping public Order create(@RequestBody Order o){return service.save(o);}
    @PutMapping("/{id}") public Order update(@PathVariable String id,@RequestBody Order o){
        o.setId(id);return service.save(o);}
    @DeleteMapping("/{id}") public void delete(@PathVariable String id){service.delete(id);}
}
EOF

cat > src/main/java/$PKG_PATH/controller/TaskController.java <<EOF
package $GROUP_ID.budget.controller;

import $GROUP_ID.budget.model.Task;
import $GROUP_ID.budget.service.TaskService;
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
EOF

cat > src/main/java/$PKG_PATH/controller/TransactionController.java <<EOF
package $GROUP_ID.budget.controller;

import $GROUP_ID.budget.model.Transaction;
import $GROUP_ID.budget.service.TransactionService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService service;
    public TransactionController(TransactionService service){this.service=service;}
    @GetMapping public List<Transaction> all(){return service.findAll();}
    @GetMapping("/{id}") public Transaction one(@PathVariable String id){return service.findById(id);}
    @PostMapping public Transaction create(@RequestBody Transaction t){return service.save(t);}
    @PutMapping("/{id}") public Transaction update(@PathVariable String id,@RequestBody Transaction t){
        t.setId(id);return service.save(t);}
    @DeleteMapping("/{id}") public void delete(@PathVariable String id){service.delete(id);}
}
EOF

echo "✔ Gradle project scaffolded under ./gradle"
echo "→ cd gradle && ./gradlew build"

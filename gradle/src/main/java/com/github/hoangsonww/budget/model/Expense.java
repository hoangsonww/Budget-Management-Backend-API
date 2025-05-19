package com.github.hoangsonww.budget.model;

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

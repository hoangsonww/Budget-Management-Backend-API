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

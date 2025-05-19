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

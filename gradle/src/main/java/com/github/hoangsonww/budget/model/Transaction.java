package com.github.hoangsonww.budget.model;

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

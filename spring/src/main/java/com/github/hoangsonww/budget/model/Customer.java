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

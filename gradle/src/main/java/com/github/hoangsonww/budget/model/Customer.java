package com.github.hoangsonww.budget.model;

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

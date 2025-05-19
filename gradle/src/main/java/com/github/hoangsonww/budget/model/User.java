package com.github.hoangsonww.budget.model;

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

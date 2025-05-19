#!/usr/bin/env bash
set -e

SPRING_MODELS="spring/src/main/java/com/github/hoangsonww/budget/model"
POM="spring/pom.xml"

# 1) Fix each model
for f in "$SPRING_MODELS"/*.java; do
  # remove the import of the Spring Data @Id
  sed -i '' '/import org.springframework.data.annotation.Id;/d' "$f"

  # add import javax.persistence.Id if missing
  grep -q 'import javax.persistence.Id;' "$f" || \
    sed -i '' '1,/package com.github.hoangsonww.budget.model;/s|package com.github.hoangsonww.budget.model;|&\n\nimport javax.persistence.Id;|' "$f"

  # replace the two separate @Id usages onto two fully-qualified annotations
  sed -i '' 's|@Id\n[[:space:]]*@org.springframework.data.annotation.Id|@javax.persistence.Id\n    @org.springframework.data.annotation.Id|' "$f"
done

echo "✔ Model annotations fixed."

# 2) Add plugin version to pom.xml
# if <artifactId>spring-boot-maven-plugin</artifactId> has no <version>, insert one
awk '
/<artifactId>spring-boot-maven-plugin<\/artifactId>/ {
  print; getline;
  if ($0 ~ /<version>/) {
    print;
  } else {
    print "        <version>2.7.12</version>";
    print;
  }
  next
}
{ print }
' "$POM" > "$POM.tmp" && mv "$POM.tmp" "$POM"

echo "✔ Added spring-boot-maven-plugin version in pom.xml."

# 3) Re-run deploy
cd spring
mvn clean deploy -DskipTests

echo "🎉 Done — models fixed, POM updated, artifact deployed."

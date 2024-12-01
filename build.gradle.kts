group = "pl.smt"
version = System.getenv("APP_VERSION") ?: "0.1v"

plugins {
    java
    checkstyle
    alias(libs.plugins.spring.boot)
    id("io.spring.dependency-management") version "1.1.6"
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

tasks.jar {
    manifest.attributes["Main-Class"] = "pl.smt.SmtApp"
    enabled = false
}

checkstyle {
    configFile = rootProject.file("checkstyle.xml")
    toolVersion = libs.versions.checkstyle.get()
}

defaultTasks("bootRun")

springBoot {
    mainClass = "pl.smt.SmtApp"
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.spring.boot.starter.web)
    implementation(libs.spring.web)
    implementation(libs.spring.boot.starter.data.jpa)
    implementation(libs.spring.boot.starter.actuator)
    implementation(libs.spring.boot.starter.validation)
    implementation(libs.spring.boot.starter.websocket)
    implementation(libs.resilience4j.spring.boot2)
    implementation(libs.resilience4j.circuitbreaker)
    implementation(libs.commons.lang3)
    runtimeOnly(libs.postgresql)
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0")
    implementation("org.springframework.boot:spring-boot-starter-data-rest:3.4.0")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")

    testImplementation(libs.testcontainers)
    testImplementation(libs.testcontainers.junit.jupiter)
    testImplementation(libs.testcontainers.postgresql)
    testImplementation(libs.spring.boot.starter.test)

    compileOnly(libs.lombok)
    annotationProcessor(libs.lombok)
    annotationProcessor(libs.spring.boot.configuration.processor)
}

tasks.withType<Test> {
    useJUnitPlatform()
    environment("SPRING_PROFILES_ACTIVE", "dev")
}
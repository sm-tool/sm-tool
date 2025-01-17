group = "pl.smt"
version = System.getenv("APP_VERSION") ?: "0.9v"

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
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.15.2")

    testImplementation(libs.testcontainers)
    testImplementation(libs.testcontainers.junit.jupiter)
    testImplementation(libs.testcontainers.postgresql)
    testImplementation(libs.spring.boot.starter.test)
    testImplementation("org.springframework.security:spring-security-test")

    compileOnly(libs.lombok)
    annotationProcessor(libs.lombok)
    annotationProcessor(libs.spring.boot.configuration.processor)
}

tasks.withType<Test> {
    useJUnitPlatform()
    environment("SPRING_PROFILES_ACTIVE", "dev")
    reports {
        html.required.set(true)
        junitXml.required.set(true)
        html.outputLocation.set(file("$buildDir/reports/tests"))
        junitXml.outputLocation.set(file("$buildDir/test-results"))
    }
}

tasks.withType<Javadoc> {
    (options as StandardJavadocDocletOptions).tags(
        "apiNote:a:API Note:",
        "implSpec:a:Implementation Requirements:",
        "implNote:a:Implementation Note:"
    )
}

tasks.javadoc {
    setDestinationDir(file("documentation/backend"))
    
    options {
        this as StandardJavadocDocletOptions
        encoding = "UTF-8"
        docEncoding = "UTF-8"
        charSet = "UTF-8"
        locale = "pl"
        memberLevel = JavadocMemberLevel.PROTECTED
        (this as CoreJavadocOptions).addBooleanOption("html5", true)
        (this as CoreJavadocOptions).addStringOption("Xdoclint:none", "-quiet")

        overview = "src/main/javadoc/overview.html"
        windowTitle = "Nazwa Twojego Projektu API"
        docTitle = "Dokumentacja API"
    }
}


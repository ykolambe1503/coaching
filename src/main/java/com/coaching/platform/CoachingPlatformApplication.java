package com.coaching.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CoachingPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(CoachingPlatformApplication.class, args);
    }

}

package com.infosys.sentinelcorebackend.config;

import com.infosys.sentinelcorebackend.security.JwtFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})

                .authorizeHttpRequests(auth -> auth
                        // Login, refresh and viewer registration do not require JWT.
                        .requestMatchers("/api/auth/**").permitAll()

                        // Every other API requires authentication.
                        .anyRequest().authenticated()
                )

                // Expired/invalid access tokens must produce 401.
                // The frontend Axios interceptor uses 401 to start the refresh flow.
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(
                                        HttpServletResponse.SC_UNAUTHORIZED,
                                        "Unauthorized"
                                )
                        )
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}

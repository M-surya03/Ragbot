package com.example.portal.dto;

import lombok.Data;

@Data
public class SetPasswordRequest {
    private String email;
    private String password;
}

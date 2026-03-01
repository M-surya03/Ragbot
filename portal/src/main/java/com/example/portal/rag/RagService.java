package com.example.portal.rag;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class RagService {

    @Value("${rag.service.url}")
    private String ragUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String askRag(String question) {

        RagRequest request = new RagRequest();
        request.setQuestion(question);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<RagRequest> entity = new HttpEntity<>(request, headers);

        ResponseEntity<RagResponse> response =
                restTemplate.exchange(
                        ragUrl,
                        HttpMethod.POST,
                        entity,
                        RagResponse.class
                );

        return response.getBody().getAnswer();
    }
}

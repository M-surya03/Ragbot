package com.example.portal.rag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
public class RagController {

    private final RagService ragService;

    // accessible to all authenticated users
    @PostMapping("/ask")
    public RagResponse ask(@RequestBody RagRequest request,
                           Authentication auth) {

        String answer = ragService.askRag(request.getQuestion());

        RagResponse response = new RagResponse();
        response.setAnswer(answer);

        return response;
    }
}

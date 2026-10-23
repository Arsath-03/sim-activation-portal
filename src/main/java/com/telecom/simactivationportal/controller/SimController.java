package com.telecom.simactivationportal.controller;

import com.telecom.simactivationportal.entity.Sim;
import com.telecom.simactivationportal.repository.SimRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://sim-activation-portal.netlify.app"
})


@RestController
@RequestMapping("/api/sims")
public class SimController {

    private final SimRepository simRepository;

    public SimController(SimRepository simRepository) {
        this.simRepository = simRepository;
    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateSim(
            @RequestParam String simNumber) {

        return simRepository.findBySimNumber(simNumber)
                .map(sim -> {
                    if ("AVAILABLE".equalsIgnoreCase(sim.getStatus())) {
                        return ResponseEntity.ok(
                                "SIM is valid and available for activation.");
                    }

                    return ResponseEntity.ok(
                            "SIM exists but is not available for activation.");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
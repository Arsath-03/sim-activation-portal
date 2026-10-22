package com.telecom.simactivationportal.controller;

import com.telecom.simactivationportal.entity.Offer;
import com.telecom.simactivationportal.repository.OfferRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500"
})
@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferRepository offerRepository;

    public OfferController(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    // Get all active offers
    @GetMapping
    public List<Offer> getActiveOffers() {
        return offerRepository.findByActiveTrue();
    }

    // Get one offer by ID
    @GetMapping("/{id}")
    public ResponseEntity<Offer> getOfferById(
            @PathVariable Long id) {

        return offerRepository.findById(id)
                .filter(Offer::isActive)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

package com.telecom.simactivationportal.controller;

import jakarta.validation.Valid;

import com.telecom.simactivationportal.entity.Customer;
import com.telecom.simactivationportal.repository.CustomerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

import java.util.Map;

@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://sim-activation-portal.netlify.app"
})

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(
            @PathVariable Long id) {

        return customerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Customer createCustomer(@Valid @RequestBody Customer customer) {
        return customerRepository.save(customer);
    }


    @GetMapping("/validate")
    public ResponseEntity<Customer> validateCustomer(
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String email) {

        return customerRepository
                .findByFirstNameAndLastNameAndEmail(
                        firstName, lastName, email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/validate-by-dob")
    public ResponseEntity<Customer> validateCustomerByEmailAndDob(
            @RequestParam String email,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dateOfBirth) {

        return customerRepository
                .findByEmailAndDateOfBirth(email, dateOfBirth)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/address")
    public ResponseEntity<Customer> updateCustomerAddress(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        return customerRepository.findById(id)
                .map(customer -> {
                    customer.setAddress(request.get("address"));
                    Customer updatedCustomer =
                            customerRepository.save(customer);
                    return ResponseEntity.ok(updatedCustomer);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/validate-id-proof")
    public ResponseEntity<Customer> validateIdProof(
            @RequestParam String idProofType,
            @RequestParam String idProofNumber) {

        return customerRepository
                .findByIdProofTypeAndIdProofNumber(
                        idProofType, idProofNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


}


package com.telecom.simactivationportal.repository;

import com.telecom.simactivationportal.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import java.time.LocalDate;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByFirstNameAndLastNameAndEmail(
            String firstName,
            String lastName,
            String email
    );

    Optional<Customer> findByEmailAndDateOfBirth(
            String email,
            LocalDate dateOfBirth
    );

    Optional<Customer> findByIdProofTypeAndIdProofNumber(
            String idProofType,
            String idProofNumber
    );
}

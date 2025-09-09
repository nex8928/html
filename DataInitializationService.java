package com.loanorigination.service;

import com.loanorigination.entity.*;
import com.loanorigination.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private LoanStatusLookupRepository loanStatusLookupRepository;

    @Autowired
    private GenderLookupRepository genderLookupRepository;

    @Autowired
    private MaritalStatusLookupRepository maritalStatusLookupRepository;

    @Autowired
    private OccupationLookupRepository occupationLookupRepository;

    @Autowired
    private DocumentTypeRepository documentTypeRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeLoanStatuses();
        initializeGenders();
        initializeMaritalStatuses();
        initializeOccupations();
        initializeDocumentTypes();
        initializeDefaultMembers();
    }

    private void initializeRoles() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role("CUSTOMER"));
            roleRepository.save(new Role("MAKER"));
            roleRepository.save(new Role("CHECKER"));
            roleRepository.save(new Role("ADMIN"));
        }
    }

    private void initializeLoanStatuses() {
        if (loanStatusLookupRepository.count() == 0) {
            loanStatusLookupRepository.save(new LoanStatusLookup("DRAFT"));
            loanStatusLookupRepository.save(new LoanStatusLookup("SUBMITTED"));
            loanStatusLookupRepository.save(new LoanStatusLookup("UNDER_REVIEW"));
            loanStatusLookupRepository.save(new LoanStatusLookup("PENDING_VERIFICATION"));
            loanStatusLookupRepository.save(new LoanStatusLookup("APPROVED"));
            loanStatusLookupRepository.save(new LoanStatusLookup("REJECTED"));
            loanStatusLookupRepository.save(new LoanStatusLookup("DISBURSED"));
        }
    }

    private void initializeGenders() {
        if (genderLookupRepository.count() == 0) {
            genderLookupRepository.save(new GenderLookup("Male"));
            genderLookupRepository.save(new GenderLookup("Female"));
            genderLookupRepository.save(new GenderLookup("Other"));
        }
    }

    private void initializeMaritalStatuses() {
        if (maritalStatusLookupRepository.count() == 0) {
            maritalStatusLookupRepository.save(new MaritalStatusLookup("Single"));
            maritalStatusLookupRepository.save(new MaritalStatusLookup("Married"));
            maritalStatusLookupRepository.save(new MaritalStatusLookup("Divorced"));
            maritalStatusLookupRepository.save(new MaritalStatusLookup("Widowed"));
        }
    }

    private void initializeOccupations() {
        if (occupationLookupRepository.count() == 0) {
            occupationLookupRepository.save(new OccupationLookup("Salaried"));
            occupationLookupRepository.save(new OccupationLookup("Self-Employed"));
            occupationLookupRepository.save(new OccupationLookup("Business Owner"));
            occupationLookupRepository.save(new OccupationLookup("Professional"));
            occupationLookupRepository.save(new OccupationLookup("Retired"));
            occupationLookupRepository.save(new OccupationLookup("Student"));
        }
    }

    private void initializeDocumentTypes() {
        if (documentTypeRepository.count() == 0) {
            // Identity Documents
            documentTypeRepository.save(new DocumentType("Aadhaar Card"));
            documentTypeRepository.save(new DocumentType("PAN Card"));
            documentTypeRepository.save(new DocumentType("Passport"));
            documentTypeRepository.save(new DocumentType("Voter ID"));
            documentTypeRepository.save(new DocumentType("Driver License"));
            documentTypeRepository.save(new DocumentType("Photograph"));

            // Income Documents
            documentTypeRepository.save(new DocumentType("Salary Certificate"));
            documentTypeRepository.save(new DocumentType("Bank Statements"));
            documentTypeRepository.save(new DocumentType("ITR"));
            documentTypeRepository.save(new DocumentType("Form 16"));

            // Business Documents
            documentTypeRepository.save(new DocumentType("Business Registration"));
            documentTypeRepository.save(new DocumentType("GST Certificate"));
            documentTypeRepository.save(new DocumentType("Trade License"));

            // Loan Specific Documents
            documentTypeRepository.save(new DocumentType("Property Documents"));
            documentTypeRepository.save(new DocumentType("Sale Agreement"));
            documentTypeRepository.save(new DocumentType("Valuation Report"));
            documentTypeRepository.save(new DocumentType("Insurance Policy"));
        }
    }

    private void initializeDefaultMembers() {
        if (memberRepository.count() == 0) {
            Role makerRole = roleRepository.findByRoleName("MAKER").orElse(null);
            Role checkerRole = roleRepository.findByRoleName("CHECKER").orElse(null);
            Role adminRole = roleRepository.findByRoleName("ADMIN").orElse(null);

            // Default Maker: username=maker, password=maker123
            if (makerRole != null) {
                Member maker = new Member();
                maker.setUsername("maker");
                maker.setPasswordHash(passwordEncoder.encode("maker123"));
                maker.setRole(makerRole);
                memberRepository.save(maker);
            }

            // Default Checker: username=checker, password=checker123
            if (checkerRole != null) {
                Member checker = new Member();
                checker.setUsername("checker");
                checker.setPasswordHash(passwordEncoder.encode("checker123"));
                checker.setRole(checkerRole);
                memberRepository.save(checker);
            }

            // Default Admin: username=admin, password=admin123
            if (adminRole != null) {
                Member admin = new Member();
                admin.setUsername("admin");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setRole(adminRole);
                memberRepository.save(admin);
            }
        }
    }
}

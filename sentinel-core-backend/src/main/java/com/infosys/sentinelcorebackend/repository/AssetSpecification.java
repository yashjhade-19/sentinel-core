package com.infosys.sentinelcorebackend.repository;

import com.infosys.sentinelcorebackend.entity.Asset;
import org.springframework.data.jpa.domain.Specification;

public class AssetSpecification {

    public static Specification<Asset> searchAssets(
            String search,
            String status,
            String risk
    ) {

        return (root, query, criteriaBuilder) -> {

            var predicates = criteriaBuilder.conjunction();

            // Search by asset name
            if (search != null && !search.isBlank()) {

                predicates = criteriaBuilder.and(
                        predicates,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(
                                        root.get("assetName")
                                ),
                                "%" + search.toLowerCase() + "%"
                        )
                );
            }

            // Filter by status
            if (status != null && !status.isBlank()) {

                predicates = criteriaBuilder.and(
                        predicates,
                        criteriaBuilder.equal(
                                root.get("status"),
                                status
                        )
                );
            }

            // Filter by risk
            if (risk != null && !risk.isBlank()) {

                predicates = criteriaBuilder.and(
                        predicates,
                        criteriaBuilder.equal(
                                root.get("risk"),
                                risk
                        )
                );
            }

            return predicates;
        };
    }
}
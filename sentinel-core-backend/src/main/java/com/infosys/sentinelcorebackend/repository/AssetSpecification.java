package com.infosys.sentinelcorebackend.repository;

import com.infosys.sentinelcorebackend.entity.Asset;
import org.springframework.data.jpa.domain.Specification;

public final class AssetSpecification {

    private AssetSpecification() {
    }

    public static Specification<Asset> searchAssets(
            String search,
            String status,
            String risk) {

        return (root, query, cb) -> {
            var predicate = cb.conjunction();

            if (search != null && !search.isBlank()) {
                String value = "%" + search.trim().toLowerCase() + "%";
                var searchPredicate = cb.or(
                        cb.like(cb.lower(root.get("assetName")), value),
                        cb.like(cb.lower(root.get("assetType")), value),
                        cb.like(cb.lower(root.get("ipAddress")), value),
                        cb.like(cb.lower(root.get("location")), value),
                        cb.like(cb.lower(root.get("status")), value),
                        cb.like(cb.lower(root.get("risk")), value)
                );
                predicate = cb.and(predicate, searchPredicate);
            }

            if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
                predicate = cb.and(
                        predicate,
                        cb.equal(cb.lower(root.get("status")), status.trim().toLowerCase())
                );
            }

            if (risk != null && !risk.isBlank() && !risk.equalsIgnoreCase("ALL")) {
                predicate = cb.and(
                        predicate,
                        cb.equal(cb.lower(root.get("risk")), risk.trim().toLowerCase())
                );
            }

            return predicate;
        };
    }
}

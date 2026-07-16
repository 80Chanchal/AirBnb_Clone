package com.stayvista.repository;

import com.stayvista.entity.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long>, JpaSpecificationExecutor<Property> {

    Page<Property> findByHostId(Long hostId, Pageable pageable);

    Page<Property> findByStatus(Property.PropertyStatus status, Pageable pageable);

    Page<Property> findByCategoryId(Long categoryId, Pageable pageable);

    @Query("""
        SELECT p FROM Property p
        WHERE p.status = 'ACTIVE'
        AND (:city IS NULL OR LOWER(p.city) LIKE LOWER(CONCAT('%', :city, '%')))
        ORDER BY p.averageRating DESC
    """)
    Page<Property> findFeaturedProperties(@Param("city") String city, Pageable pageable);

    @Query("""
        SELECT p FROM Property p
        WHERE p.status = 'ACTIVE'
        ORDER BY p.createdAt DESC
    """)
    List<Property> findLatestProperties(Pageable pageable);

    @Query("""
        SELECT p FROM Property p
        WHERE p.status = 'ACTIVE'
        AND p.host.id = :hostId
        ORDER BY p.createdAt DESC
    """)
    List<Property> findActivePropertiesByHost(@Param("hostId") Long hostId);

    @Query("""
        SELECT COUNT(p) FROM Property p
        WHERE p.status = 'ACTIVE'
    """)
    Long countActiveProperties();

    @Query("""
        SELECT DISTINCT p.city FROM Property p
        WHERE p.status = 'ACTIVE'
        GROUP BY p.city
        ORDER BY COUNT(p) DESC
    """)
    List<String> findTopCities(Pageable pageable);

    boolean existsByIdAndHostId(Long propertyId, Long hostId);
}

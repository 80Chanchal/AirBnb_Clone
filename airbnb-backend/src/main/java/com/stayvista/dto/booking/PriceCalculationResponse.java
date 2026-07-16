package com.stayvista.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceCalculationResponse {

    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer numberOfNights;
    private BigDecimal nightlyRate;
    private BigDecimal subtotal;
    private BigDecimal cleaningFee;
    private BigDecimal taxes;
    private BigDecimal total;
    private Boolean isAvailable;
}

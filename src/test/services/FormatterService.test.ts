// __tests__/services/FormatterService.test.ts
import { FormatterService } from "../../services/FormatterService";

describe("FormatterService", () => {

  describe("formatCurrency", () => {
    test("debe formatear un monto grande a CLP (sin decimales)", () => {
      const amount = 1500000;
      const formatted = FormatterService.formatCurrency(amount);
      expect(formatted).toContain("$");
      expect(formatted).toContain("1.500.000");
    });

    test("debe formatear cero correctamente", () => {
      expect(FormatterService.formatCurrency(0)).toContain("0");
    });
  });

  describe("formatDate", () => {
    test("debe formatear una fecha ISO a formato es-ES", () => {
      const dateString = "2025-01-28";
      expect(FormatterService.formatDate(dateString)).toBe("28/1/2025");
    });

    test("debe manejar fechas con un solo dígito en el mes y día", () => {
      const dateString = "2025-07-05";
      expect(FormatterService.formatDate(dateString)).toBe("5/7/2025");
    });
  });
});

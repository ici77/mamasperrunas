import { TestBed } from '@angular/core/testing';
import { HolaMundoService } from './hola-mundo.service';

/**
 * 📌 Pruebas para `HolaMundoService`
 *
 * Este archivo contiene pruebas unitarias básicas para verificar
 * que el servicio `HolaMundoService` se crea correctamente.
 */
describe('HolaMundoService', () => {
  let service: HolaMundoService;

  /**
   * 🔹 Configura el módulo de prueba antes de ejecutar cada test.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HolaMundoService);
  });

  /**
   * 📌 Prueba que verifica si el servicio se ha creado correctamente.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

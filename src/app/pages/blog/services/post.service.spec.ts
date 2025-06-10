import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';

/**
 * Pruebas unitarias para el servicio PostService.
 * Se verifica que el servicio se cree correctamente.
 * 
 * @example
 * describe('PostService', () => {
 *   it('should be created', () => {
 *     expect(service).toBeTruthy();
 *   });
 * });
 */
describe('PostService', () => {
  /** Instancia del servicio PostService */
  let service: PostService;

  /**
   * Configura el entorno de prueba antes de cada prueba.
   * Se inyecta el servicio PostService en la instancia `service`.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostService);
  });

  /**
   * Verifica que el servicio PostService se cree correctamente.
   * 
   * @returns `true` si el servicio se crea correctamente
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

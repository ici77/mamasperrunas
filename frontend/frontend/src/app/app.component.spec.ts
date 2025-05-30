import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

/**
 * 📌 Pruebas para `AppComponent`
 *
 * Este archivo contiene pruebas unitarias para verificar la correcta creación 
 * y funcionamiento del componente principal de la aplicación (`AppComponent`).
 */
describe('AppComponent', () => {
  /**
   * 🔹 Configuración inicial del módulo de prueba antes de ejecutar cada test.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  /**
   * 📌 Prueba que verifica si el `AppComponent` se ha creado correctamente.
   */
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /**
   * 📌 Prueba que verifica si la propiedad `title` de `AppComponent` tiene el valor esperado.
   */
  it(`should have the 'frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });

  /**
   * 📌 Prueba que verifica si el título se renderiza correctamente en el HTML.
   */
  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, frontend');
  });
});

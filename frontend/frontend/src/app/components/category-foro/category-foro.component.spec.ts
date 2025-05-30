import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryForoComponent } from './category-foro.component';

describe('CategoryForoComponent', () => {
  let component: CategoryForoComponent;
  let fixture: ComponentFixture<CategoryForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryForoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

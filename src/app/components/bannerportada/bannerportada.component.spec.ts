import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerportadaComponent } from './bannerportada.component';

describe('BannerportadaComponent', () => {
  let component: BannerportadaComponent;
  let fixture: ComponentFixture<BannerportadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerportadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerportadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

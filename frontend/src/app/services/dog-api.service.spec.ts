import { TestBed } from '@angular/core/testing';
import { environment } from '../../environment/environment';


import { DogApiService } from './dog-api.service';

describe('DogApiService', () => {
  let service: DogApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DogApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

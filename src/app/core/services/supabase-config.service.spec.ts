import { TestBed } from '@angular/core/testing';

import { SupabaseConfigService } from './supabase-config.service';

describe('SupabaseConfigService', () => {
  let service: SupabaseConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

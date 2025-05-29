import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryCell } from './gallery-cell';

describe('GalleryCell', () => {
  let component: GalleryCell;
  let fixture: ComponentFixture<GalleryCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

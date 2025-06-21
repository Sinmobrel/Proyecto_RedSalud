import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarComponent } from './gestionar.component';

describe('GestionarComponent', () => {
  let component: GestionarComponent;
  let fixture: ComponentFixture<GestionarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

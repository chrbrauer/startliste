import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStarterComponent } from './create-starter.component';

describe('CreateStarterComponent', () => {
  let component: CreateStarterComponent;
  let fixture: ComponentFixture<CreateStarterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateStarterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateStarterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveViewersComponent } from './active-viewers.component';

describe('ActiveViewersComponent', () => {
  let component: ActiveViewersComponent;
  let fixture: ComponentFixture<ActiveViewersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActiveViewersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveViewersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

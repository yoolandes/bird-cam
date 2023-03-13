import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveStreamProgressBarComponent } from './live-stream-progress-bar.component';

describe('LiveStreamProgressBarComponent', () => {
  let component: LiveStreamProgressBarComponent;
  let fixture: ComponentFixture<LiveStreamProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveStreamProgressBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveStreamProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsPreviewComponent } from './comments-preview.component';

describe('CommentsPreviewComponent', () => {
  let component: CommentsPreviewComponent;
  let fixture: ComponentFixture<CommentsPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentsPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

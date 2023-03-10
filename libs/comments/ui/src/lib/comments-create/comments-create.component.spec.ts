import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsCreateComponent } from './comments-create.component';

describe('CommentsCreateComponent', () => {
  let component: CommentsCreateComponent;
  let fixture: ComponentFixture<CommentsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentsCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

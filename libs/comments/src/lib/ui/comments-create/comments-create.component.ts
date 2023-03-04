import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Comment } from '../../domain/model/comment.model';

@Component({
  selector: 'bird-cam-comments-create',
  templateUrl: './comments-create.component.html',
  styleUrls: ['./comments-create.component.css']
})
export class CommentsCreateComponent {
  
  readonly profileForm = new FormGroup({
    author: new FormControl('',  {nonNullable: true}),
    text: new FormControl('',  {nonNullable: true}), 
  });

  @Output() commentAdded = new EventEmitter<Comment>();

  onSubmit(): void {
    this.commentAdded.next({
      text: this.profileForm.controls.text.value,
      author: this.profileForm.controls.author.value
    }
     
    );
    this.profileForm.get('text')?.reset();
  }

}

import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateCommentDto } from '@bird-cam/comments/model';

export const SPECIES = [
  'Blauracke',
  'Doppelschnepfe',
  'Gänsegeier',
  'Mornellregenpfeifer',
  'Papageitaucher',
  'Rosenseeschwalbe',
  'Rothuhn',
  'Schlangenadler',
  'Schwarzstirnwürger',
  'Steinsperling',
  'Steinwälzer',
  'Waldrapp',
  'Würgfalke',
  'Zwergtrappe',
];

@Component({
  selector: 'bird-cam-comments-create',
  templateUrl: './comments-create.component.html',
})
export class CommentsCreateComponent implements OnInit {
  readonly profileForm = new FormGroup({
    author: new FormControl('', { nonNullable: true }),
    text: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  @Output() commentAdded = new EventEmitter<CreateCommentDto>();

  ngOnInit(): void {
    this.setRandomAuthor();
  }

  private setRandomAuthor(): void {
    let author = localStorage?.getItem('commentAuthor');
    if (!author) {
      author = SPECIES[Math.floor(Math.random() * SPECIES.length)];
      localStorage?.setItem('commentAuthor', author);
    }
    this.profileForm.get('author')?.setValue(author);
  }

  async onSubmit(ele: any): Promise<void> {
    if (!this.profileForm.valid) {
      return;
    }
    this.commentAdded.next({
      text: this.profileForm.controls.text.value,
      author: this.profileForm.controls.author.value,
    });

    const inputEle = await ele.getInputElement();
    inputEle.blur();
    this.profileForm.controls.text.reset();
  }
}

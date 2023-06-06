import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageHeaderService {
  private title = new BehaviorSubject<string>('');
  private subheader = new BehaviorSubject<string>('');
  private img = new BehaviorSubject<string>('');
  private type = new BehaviorSubject<'site' | 'post'>('site');
  private metadata = new BehaviorSubject<string>('');

  title$ = this.title.asObservable();
  subheader$ = this.subheader.asObservable();
  img$ = this.img.asObservable();
  type$ = this.type.asObservable();
  metadata$ = this.metadata.asObservable();

  setPageData(
    title: string,
    subheader?: string,
    img?: string,
    metadata?: string,
    type?: 'site' | 'post'
  ) {
    this.title.next(title);
    if (subheader) {
      this.subheader.next(subheader);
    } else {
      this.subheader.next('');
    }
    if (img) {
      this.img.next(img);
    } else {
      this.img.next('');
    }
    if (metadata) {
      this.metadata.next(metadata);
    } else {
      this.metadata.next('');
    }
    if (type) {
      this.type.next(type);
    } else {
      this.type.next('site');
    }
  }
  constructor() {}
}

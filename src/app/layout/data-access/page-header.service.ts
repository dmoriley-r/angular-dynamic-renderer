import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PageHeaderService {
  private title = new BehaviorSubject<string>('');
  private subheader = new BehaviorSubject<string>('');
  private img = new BehaviorSubject<string>('');

  title$ = this.title.asObservable();
  subheader$ = this.subheader.asObservable();
  img$ = this.img.asObservable();

  setPageData(title: string, subheader?: string, img?: string) {
    this.title.next(title);
    if (subheader) {
      this.subheader.next(subheader);
    }
    if (img) {
      this.img.next(img);
    }
  }
  constructor() {}
}

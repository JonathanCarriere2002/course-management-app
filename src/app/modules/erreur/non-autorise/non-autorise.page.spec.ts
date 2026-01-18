import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { NonAutorisePage } from './non-autorise.page';

describe('NonAutorisePage', () => {
  let component: NonAutorisePage;
  let fixture: ComponentFixture<NonAutorisePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NonAutorisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

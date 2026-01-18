import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { IntrouvablePage } from './introuvable.page';

describe('IntrouvablePage', () => {
  let component: IntrouvablePage;
  let fixture: ComponentFixture<IntrouvablePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IntrouvablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

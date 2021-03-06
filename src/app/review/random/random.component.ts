import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CardService } from '../../services/card.service';
import { ICard } from '../../shared/card.interface';
import { timer } from 'rxjs';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import * as _ from 'lodash';

@Component({
  selector: 'app-random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.css']
})
export class RandomComponent implements OnInit {
  cardToDisplay: ICard;
  cards: ICard[];
  index: number;
  dueCards: ICard[];
  revealAnswer: boolean;
  progressPercent: number;
  subscribeTimer: number;
  totalTime: number;
  timeLeft: number;
  size = 'large';
  loaded = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private cardService: CardService,
    private _hotkeysService: HotkeysService,
  ) {
    this._hotkeysService.add(new Hotkey('space', (event: KeyboardEvent): boolean => {
      if (this.revealAnswer) {
        this.nextCard();
      } else {
        this.toggleAnswer();
      }
      return false;
    }));
  }

  ngOnInit(): void {
    this.cardService.getCards().subscribe(cards => {
      this.cards = cards;
      this.index = 0;
      this.dueCards = this.getDueCards();
      this.cardToDisplay = this.dueCards[this.index];
      this.loaded = true;
      this.totalTime = 300;
      this.progressPercent = 100;
      this.timer();
    });
 
  }
  timer(): void {
    const source = timer(1000, 1000);
    this.timeLeft = this.totalTime;
    source.subscribe(value => {
      if (value <= 300 && this.timeLeft >= 0) {
        this.timeLeft = this.totalTime - value;
        this.progressPercent = this.timeLeft / 3;
      }
    });

  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  getDueCards(): ICard[] {
    return _.shuffle(this.cards);
  }
  nextCard(): void {
    this.revealAnswer = false;
    this.index++;
    this.cardToDisplay = this.dueCards[this.index];
  }
  toggleAnswer(): void {
    this.revealAnswer = true;
  }


}

import {Component, OnInit} from '@angular/core';
import {rotateVertical} from '../styles/animations'

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss'],
  animations: [rotateVertical]
})
export class JournalComponent implements OnInit {
  moodInterval: number
  moodList = []
  moodSelection = {old: 0, new: 0}

  constructor() {
  }

  ngOnInit() {
    this.generateMoodEmojis(5)
  }

  public onMoodLevelChange(moodLevel: number) {
    if (this.moodInterval) {
      clearInterval(this.moodInterval)
    }
    this.moodSelection.new = moodLevel
    const difference = this.moodSelection.new - this.moodSelection.old
    const negative: boolean = difference < 0
    if (difference) {
      this._changeState(negative)
      this.moodInterval = setInterval(() => this._changeState(negative), 250)
    }
  }

  private _changeState(negative) {
    if (this.moodSelection.old !== this.moodSelection.new) {
      this.moodList[this.moodSelection.old].state = (negative) ? 'up' : 'down';
      (negative) ? this.moodSelection.old -= 1 : this.moodSelection.old += 1
    } else {
      this.moodList[this.moodSelection.old].state = 'normal'
      clearInterval(this.moodInterval)
    }
  }

  private generateMoodEmojis(numberOfMoods: number = 5) {
    for (let i = 0; i <= numberOfMoods; i++) {
      this.moodList.push({
        index: i,
        emoji: this.getMoodEmoji(i),
        state: (i === 0) ? 'normal' : 'up'
      })
    }
  }

  private getMoodEmoji(moodLevel: number): string {
    switch (moodLevel) {
      case 0:
        return ''
      case 1:
        return ['😡', '🤬', '🥺'][Math.floor(Math.random() * 3)]
      case 2:
        return '😤'
      case 3:
        return '😕'
      case 4:
        return ['🙂', '😬', '🤨', '🙃'][Math.floor(Math.random() * 4)]
      case 5:
        return ['🤩', '💪', '🥰', '😋', '🚀'][Math.floor(Math.random() * 5)]
    }
  }
}

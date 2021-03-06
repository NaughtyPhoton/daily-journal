import {Journal} from './journal.model'
import {Injectable} from '@angular/core'
import {AngularFirestore} from '@angular/fire/firestore'
import {AuthService} from '../auth/auth.service'
import {Subject} from 'rxjs'
import {take} from 'rxjs/operators'

@Injectable()
export class JournalService {
  private _todayJournalEntry: unknown = {
    journalEntry: '',
    mood: 0,
    id: '',
    dateUpdated: null
  }
  private fsJournalCollectionPath: string
  private todayDateId: string
  public todayJournalEntryUpdated = new Subject()

  constructor(
    private db: AngularFirestore,
    private authService: AuthService
  ) {
  }

  fsGetTodayJournal() {
    this.fsJournalCollectionPath = `users/${this.authService.fbUser.uid}/journalEntries`
    this.todayDateId = new Date().toLocaleDateString().replace(/\//g, '.')


    this.db.collection(`users/${this.authService.fbUser.uid}/journalEntries`)
    .doc(this.todayDateId)
    .valueChanges()
    .pipe(take(1))
    .subscribe(doc => {
      if (doc) {
        this._todayJournalEntry = {...(doc as any)}
        console.log(this.todayJournalEntry)
        this.todayJournalEntryUpdated.next()
      } else {
        this.createJournalForToday(this.todayDateId)
      }
    })
  }

  private createJournalForToday(todayDateId) {
    const journalEntry = {
      id: todayDateId,
      dateUpdated: new Date(),
      mood: 0,
      journalEntry: ''
    }
    this.db.collection(this.fsJournalCollectionPath).doc(todayDateId).set(journalEntry)
  }

  get todayJournalEntry(): Journal {
    return this._todayJournalEntry as Journal
  }

  public updateJournalEntry(data) {
    console.log('UPDATING:', data)
    this.db.collection(this.fsJournalCollectionPath).doc(this.todayDateId).update(data)
  }
}



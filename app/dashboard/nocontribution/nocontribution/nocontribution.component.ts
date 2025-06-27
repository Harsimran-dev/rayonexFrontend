import { Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ExcelService } from 'src/app/services/excelservice/ExcelService';
import { of } from 'rxjs';
import { GeminiService } from 'src/app/services/GeminiService/GeminiService';
import { TextToSpeechService } from 'src/app/services/TextToSpeech/TextToSpeechService';

@Component({
  selector: 'app-nocontribution',
  templateUrl: './nocontribution.component.html',
  styleUrls: ['./nocontribution.component.scss']
})
export class NocontributionComponent {
  rahIdInput = new FormControl('');
  suggestions: any[] = [];
  selectedRecord: any = null;
  tooltipVisible: boolean = false;
  backendResponse: string | null = null;
  isPlaying: boolean = false; // To track if speech is playing
  currentSpeech: SpeechSynthesisUtterance | null = null;

  constructor(
    private excelService: ExcelService,
    private geminiService: GeminiService,
    private textToSpeechService: TextToSpeechService // Inject the text-to-speech service
  ) {
    this.rahIdInput.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(value => {
          if (!value || value.trim() === '') {
            return of([]);
          }
          return this.excelService.searchExcelRecordsByRahId(value);
        })
      )
      .subscribe(results => {
        this.suggestions = results;
      });
  }

  selectRahId(rahId: string) {
    this.rahIdInput.setValue(rahId);
    this.suggestions = [];

    this.excelService.getExcelRecordByRahId(rahId).subscribe(record => {
      this.selectedRecord = record;
    });
  }

  showTooltip() {
    this.tooltipVisible = true;
  }

  hideTooltip() {
    this.tooltipVisible = false;
  }

  extractWord(event: MouseEvent, field: string) {
    const selectedWord = window.getSelection()?.toString().trim();
    if (selectedWord) {
      console.log(`Double-clicked word from ${field}:`, selectedWord);
      this.sendWordToBackend(selectedWord, field);
    }
  }

  sendWordToBackend(word: string, field: string) {
    const query = `Summarize in 150 words in plain English ${word}`;
    
    this.geminiService.getGeneratedContent(query).subscribe(response => {
      if (response && response.candidates && response.candidates[0]?.content?.parts[0]?.text) {
        let responseText = response.candidates[0].content.parts[0].text;
        responseText = responseText.replace(/\*/g, '');
        responseText = responseText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        this.backendResponse = `<p><strong>${field}:</strong> ${responseText}</p>`;
      } else {
        this.backendResponse = `No response from backend for ${field}.`;
      }
    });
  }

  // Start from the beginning and play the description
  startSpeech() {
    if (this.selectedRecord && this.selectedRecord.description) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      // Create new speech instance
      this.currentSpeech = new SpeechSynthesisUtterance(this.selectedRecord.description);
      speechSynthesis.speak(this.currentSpeech);

      this.isPlaying = true; // Set isPlaying to true when speech starts
      console.log('Speech started');

      // Add event listener for when speech ends
      this.currentSpeech.onend = () => {
        this.isPlaying = false; // Set isPlaying to false when speech ends
        console.log('Speech ended');
      };

      this.currentSpeech.onerror = (event) => {
        console.error('Error during speech synthesis: ', event);
        this.isPlaying = false; // Set isPlaying to false on error
      };
    }
  }

  // Stop speech and reset
  stopSpeech() {
    if (speechSynthesis.speaking || this.isPlaying) {
      speechSynthesis.cancel(); // Stop any ongoing speech
      this.isPlaying = false; // Set isPlaying to false when speech stops
      console.log('Speech stopped');
    }
  }

  // Toggle between start and stop
  toggleSpeech() {
    if (this.isPlaying) {
      this.stopSpeech(); // Stop if it's playing
    } else {
      this.startSpeech(); // Start speech if it's not playing
    }
  }

  extractWordFromDescription(event: MouseEvent) {
    this.extractWord(event, 'Description');
  }

  extractWordFromProgramDetails(event: MouseEvent) {
    this.extractWord(event, 'Program Details');
  }
}

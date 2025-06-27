import { Injectable } from '@angular/core';
import Speech from 'speak-tts';

@Injectable({
  providedIn: 'root',
})
export class TextToSpeechService {
  private speech: any;

  constructor() {
    this.speech = new Speech(); // Initialize speech
    if (this.speech.hasBrowserSupport()) {
      this.speech.init({
        volume: 1,
        lang: 'en-GB',
        rate: 1,
        pitch: 1,
        voice: 'Google UK English Male',
      }).then(() => {
        console.log("Speech is ready");
      }).catch((e: Error) => {  // Explicitly declare 'e' as an instance of Error
        console.error("An error occurred while initializing : ", e);
      });
    } else {
      console.error("Browser does not support speech synthesis.");
    }
  }

  startSpeech(text: string): Promise<any> {
    return this.speech.speak({ text });
  }
}

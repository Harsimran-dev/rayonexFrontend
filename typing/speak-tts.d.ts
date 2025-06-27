declare module 'speak-tts' {
    export default class Speech {
      constructor();
      hasBrowserSupport(): boolean;
      init(options: any): Promise<any>;
      speak(options: { text: string }): Promise<any>;
      pause(): void;
      resume(): void;
      cancel(): void;
    }
  }
  
declare global {
  interface YouTubeGameApi {
    SDK_VERSION?: string;
    IN_PLAYABLES_ENV: boolean;
    game: { firstFrameReady(): void; gameReady(): void; loadData(): Promise<string>; saveData(data: string): Promise<void> };
    system: { isAudioEnabled(): boolean; onAudioEnabledChange(callback: (enabled: boolean) => void): (() => void) | void; onPause(callback: () => void): (() => void) | void; onResume(callback: () => void): (() => void) | void; };
    engagement: { sendScore(score: { value: number }): void };
  }
  interface Window { ytgame?: YouTubeGameApi }
}
export {};

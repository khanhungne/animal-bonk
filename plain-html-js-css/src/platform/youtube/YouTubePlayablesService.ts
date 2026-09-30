export class YouTubePlayablesService {
  private firstFrameSent = false; private readySent = false;
  get api(): YouTubeGameApi | undefined { return window.ytgame; }
  get isAvailable(): boolean { return Boolean(this.api?.IN_PLAYABLES_ENV); }
  firstFrameReady(): void { if (this.isAvailable && !this.firstFrameSent) { this.api!.game.firstFrameReady(); this.firstFrameSent = true; } }
  gameReady(): void { if (this.isAvailable && this.firstFrameSent && !this.readySent) { this.api!.game.gameReady(); this.readySent = true; } }
  async loadData(): Promise<string> { return this.isAvailable ? (await this.api!.game.loadData()) || '' : ''; }
  async saveData(data: string): Promise<void> { if (this.isAvailable) await this.api!.game.saveData(data); }
  sendScore(value: number): void { if (this.isAvailable && this.readySent) this.api!.engagement.sendScore({ value }); }
  isAudioEnabled(): boolean { return this.isAvailable ? this.api!.system.isAudioEnabled() : true; }
  onAudioEnabledChange(cb: (enabled: boolean) => void): (() => void) | undefined { return this.isAvailable ? this.api!.system.onAudioEnabledChange(cb) || undefined : undefined; }
  onPause(cb: () => void): (() => void) | undefined { return this.isAvailable ? this.api!.system.onPause(cb) || undefined : undefined; }
  onResume(cb: () => void): (() => void) | undefined { return this.isAvailable ? this.api!.system.onResume(cb) || undefined : undefined; }
}
export const youtube = new YouTubePlayablesService();

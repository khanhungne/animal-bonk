import './style.css';
import { Game } from './core/Game';

const host = document.querySelector<HTMLElement>('#game');
if (!host) throw new Error('Game host element is missing.');
new Game(host).start().catch(error => {
  console.error(error);
  const loading = document.querySelector<HTMLElement>('#loading');
  if (loading) loading.textContent = 'BONK ENGINE FAILED — CHECK CONSOLE';
});

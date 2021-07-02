import Store from '/src/index.js';
import GamepadProvider from './gamepad-provider.js';
import './sources-view';

const store = new Store();

store.addSourceProviderType(GamepadProvider);
store.addSourceProvider('Gamepad', 'Gamepad');

export default store;
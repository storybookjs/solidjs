import type { Component } from 'solid-js';

import styles from './App.module.css';
import { Logos } from './components/Logos';
import { Link } from './components/Link';

const App: Component = () => {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <Logos />
        <p>
          You're using <code>storybook-solidjs</code>!
        </p>
        <Link
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
          primary
        >
          Learn Solid
        </Link>
      </header>
    </div>
  );
};

export default App;

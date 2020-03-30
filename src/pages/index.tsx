import * as React from 'react';

export default () => (
  <>
    <h1>Hey, this is the API for GameBox</h1>
    <br />
    <p>
      You can find general modules info at <a href={'/modules'}>`/modules`</a>. Information about all versions of a
      specific module can be found at `/module/:moduleId`. If you already know which version of which module you would
      like, use the endpoint `/module/:moduleId/:version`.
    </p>
    <p>
      Get GameBox{' '}
      <a href={'https://www.spigotmc.org/resources/37273/'} target={'_blank'}>
        on Spigot
      </a>
    </p>
  </>
);

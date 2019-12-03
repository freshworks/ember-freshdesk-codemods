import { expect } from 'chai';
import { describe, it, context, beforeEach, afterEach, before, after } from 'mocha';
import { setupTest, setupWindowMock, setupApplicationTest } from '@freshdesk/test-helpers';
import { faker } from 'ember-cli-mirage';
import { run } from '@ember/runloop';
import {
  SWITCHER_OPTIONS as switcherOptions
} from 'freshdesk/constants/automations';

let name = faker.name.firstName();

describe('Integration | Component test', function() {
  let hooks;
  hooks = setupTest();

  switcherOptions();

  // ...
});

describe('Integration | Component test', function() {
  let hooks, router, route, transitionTo;
  hooks = setupTest();

  // ...
});

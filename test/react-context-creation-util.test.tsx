import { createContextProvider } from '../src';

describe('Thing', () => {
  it('calls without crashing', () => {
    createContextProvider(() => null);
  });
});

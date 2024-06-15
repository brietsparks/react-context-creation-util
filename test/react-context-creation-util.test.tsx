import { render } from '@testing-library/react';

import { createContextProvider } from '../src';

describe('createContextProvider', () => {
  interface ContextProviderProps {
    prop1: any;
  }

  const { ContextProvider, useContext, useContextOrUndefined } =
    createContextProvider((props: ContextProviderProps) => {
      return {
        attribute1: `Hello ${props.prop1}!`,
      };
    });

  describe('useContext', () => {
    const ContextConsumer = () => {
      const context = useContext();
      return <div data-testid="elem">{context.attribute1}</div>;
    };

    it('returns the value if inside provider', () => {
      const result = render(
        <ContextProvider prop1="world">
          <ContextConsumer />
        </ContextProvider>
      );

      expect(result.getByTestId('elem').innerHTML).toEqual('Hello world!');
    });

    it('throws if not inside provider', () => {
      const consoleErrorFn = jest
        .spyOn(console, 'error')
        .mockImplementation(() => jest.fn());
      expect(() => render(<ContextConsumer />)).toThrow();
      consoleErrorFn.mockRestore();
    });
  });

  describe('useContextOrUndefined', () => {
    const fn = jest.fn();
    const ContextConsumer = () => {
      const context = useContextOrUndefined();
      fn(context);
      return <div data-testid="elem">{context?.attribute1}</div>;
    };

    it('returns the value if inside provider', () => {
      const result = render(
        <ContextProvider prop1="world">
          <ContextConsumer />
        </ContextProvider>
      );

      expect(result.getByTestId('elem').innerHTML).toEqual('Hello world!');
    });

    it('returns undefined if not inside provider', () => {
      fn.mockClear();
      render(<ContextConsumer />);
      expect(fn).toHaveBeenCalledWith(undefined);
    });
  });
});

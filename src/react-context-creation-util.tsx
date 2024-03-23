import { createContext, PropsWithChildren, useContext as useContextBase } from 'react';

export type UseMapPropsToContext<P, V> = (props: P) => V;

export interface CreateContextProviderOptions<V> {
  defaultValue?: V;
  name?: boolean;
}

export type ContextProviderProps<P> = PropsWithChildren & P;

export interface UseContextOpts {
  allowUndefined?: boolean
}

export function createContextProvider<P, V>(useMapPropsToContext: UseMapPropsToContext<P, V>, opts: CreateContextProviderOptions<V> = {}) {
  const Context = createContext<V|undefined>(opts.defaultValue);

  function ContextProvider(props: ContextProviderProps<P>) {
    const value = useMapPropsToContext(props);
    return (
      <Context.Provider value={value}>
        {props.children}
      </Context.Provider>
    );
  }

  function useContextOrUndefined(): V | undefined {
    return useContextBase(Context);
  }

  function useContext(): V {
    const context = useContextOrUndefined();
    if (context === undefined) {
      const errorMessage = opts?.name
        ? `cannot use the context "${opts.name}" because the context is undefined`
        : 'cannot use context because the context is undefined';
      throw new Error(errorMessage);
    }
    return context;
  }

  return {
    ContextProvider,
    useContext,
    useContextOrUndefined,
  }
}

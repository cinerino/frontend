/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare const wizViewMessenger: {
  postMessage: (data: string, targetView: string) => void
};

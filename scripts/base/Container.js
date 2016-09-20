export default class {

  constructor(store, viewClass, mapMethodsToState, mapViewCallbacksToActions, onCreated) {
    // instanciate the component
    this.view = new viewClass();

    // listen to all app state updates
    store.subscribe(() => this._onStateChange(store.getState()));

    // an internal representation of the state props that this component is interested in
    // used for diffing of these props and app state
    // as opposed to React, _props are not intended to be used by containers or components
    this._props = {};

    // component methods that should be called, for a given prop of the app state
    // method names are used as dict keys
    this._methodsToState = mapMethodsToState;

    // make container callbacks available to the component
    this.view.callbacks = this._prepareCallbacks(store, mapViewCallbacksToActions());

    // use this as a chance to dispatch an action when component is instanciated (always miss this in react-redux)
    if (onCreated) onCreated(store.dispatch);

    if (this.view.onCreated) this.view.onCreated();
  }

  _onStateChange(state) {
    // returns a method - state values dictionary
    const methodsToState = this._methodsToState(state);
    Object.keys(methodsToState).forEach(k => {
      const stateValue = methodsToState[k];
      // check if internal _prop differs from new app state value
      if (stateValue !== undefined && stateValue !== this._props[k]) {
        // in which case update internal _props
        this._props[k] = stateValue;
        // and call the method (k, the dict key) directly on the component
        if (this.view[k]) {
          this.view[k](stateValue);
        } else {
          console.warn(`trying to call ${k} on view but it doesn't exist`);
        }
      }
    });
  }

  // called once at container init
  // binds component callbacks to ac tion generators set in the container
  _prepareCallbacks(store, callbacksToActions) {
    // collect all callbacks names
    const callbackKeys = Object.keys(callbacksToActions);
    const callbacks = {};
    callbackKeys.forEach(k => {
      // the method set up in the container, which should return an action
      const actionGenerator = callbacksToActions[k];
      // replace dict entry with a function that dispatches the action to the store instead of just returning it
      callbacks[k] = (...payload) => store.dispatch(actionGenerator(...payload));
    });
    return callbacks;
  }
}

import { Component } from "react";

const withHover = (WrappedComponent: any) => {
  return class extends Component {
    static displayName = `withHover(${
      WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

    state = {
      on: false,
    };

    onMouseOver = () => {
      this.setState({ on: true });
    };

    onMouseOut = () => {
      this.setState({ on: false });
    };

    render() {
      return (
        <div onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
          <WrappedComponent {...this.props} on={this.state.on} />
        </div>
      );
    }
  };
};

export default withHover;

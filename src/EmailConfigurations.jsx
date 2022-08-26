import React from "react";
import Spinner from "./components/Spinner";
import { applyActionCode } from "firebase/auth";
import { Navigate } from "react-router-dom";
class EmailConfigurations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  async componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const actionCode = params.get("oobCode");
    await this.props.auth.operations;
    const user = this.props.auth.currentUser;
    const mode = params.get("mode");
    if (user && !user.emailVerified) {
      switch (mode) {
        case "verifyEmail":
          await applyActionCode(this.props.auth, actionCode);
          this.setState({
            loading: false,
          });
          break;
        default:
          break;
      }
    }
  }
  render() {
    if (this.state.loading) {
      return (
        <div className="flex flex-col h-full justify-center items-center">
          <Spinner />
        </div>
      );
    } else {
      return <Navigate to="/settings/user" replace></Navigate>;
    }
  }
}

export default EmailConfigurations;

import { Component, ReactNode } from "react";
import { loadUsers } from "../../../core/api/apiCalls";

type UserData = {
  id: number;
  username: string;
  email: string;
  image: null;
};

type UserListResponse = {
  page: {
    content?: UserData[];
    page: number;
    size: number;
    totalPages: number;
  };
};

class UserList extends Component {
  state = {
    page: {
      content: [],
      page: 0,
      size: 3,
      totalPages: 9,
    },
  } as UserListResponse;

  componentDidMount() {
    loadUsers().then((response) => {
      this.setState({ page: response.data });
    });
  }

  render(): ReactNode {
    return (
      <div className="card">
        <div className="card-header text-center">
          <h3>Users</h3>
        </div>
        <ul className="list-group list-group-flush">
          {this.state.page.content?.map((user, index) => {
            return (
              <li
                className="list-group-item list-group-item-action"
                key={index}
              >
                {user.username}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default UserList;

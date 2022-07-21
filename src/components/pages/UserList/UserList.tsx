import { Component, ReactNode } from "react";
import { loadUsers } from "../../../core/api/apiCalls";
import { Link } from "react-router-dom";

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
    this.loadData();
  }

  loadData = async (pageIndex?: number) => {
    try {
      const response = await loadUsers(pageIndex);
      this.setState({ page: response.data });
    } catch (error) {}
  };

  render(): ReactNode {
    const { content, page, totalPages } = this.state.page;

    return (
      <div className="card">
        <div className="card-header text-center">
          <h3>Users</h3>
        </div>
        <ul className="list-group list-group-flush">
          {content?.map((user, index) => {
            return (
              <li
                className="list-group-item list-group-item-action"
                key={index}
                style={{
                  cursor: "pointer",
                }}
              >
                <Link to={`/user/${user.id}`}>{user.username}</Link>
              </li>
            );
          })}
        </ul>
        <div className="card-footer">
          {page !== 0 && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => this.loadData(page - 1)}
            >
              &lt; previous
            </button>
          )}
          {totalPages > page + 1 && (
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => this.loadData(page + 1)}
            >
              next &gt;
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default UserList;

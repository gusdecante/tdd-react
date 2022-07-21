import { Component, ReactNode } from "react";
import { loadUsers } from "../../../core/api/apiCalls";
import { UserListItem } from "./UserListItem/UserListItem";

export type UserData = {
  id: number;
  username: string;
  email: string;
  image: null;
};

type UserListResponse = {
  content?: UserData[];
  page: number;
  size: number;
  totalPages: number;
};

type UserListProps = {
  page: UserListResponse;
};

class UserList extends Component {
  state = {
    page: {
      content: [],
      page: 0,
      size: 3,
      totalPages: 9,
    },
  } as UserListProps;

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
          {content?.map((user) => (
            <UserListItem user={user} key={user.id} />
          ))}
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

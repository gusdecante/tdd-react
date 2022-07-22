import { Component, ReactNode } from "react";
import { withTranslation, WithTranslation } from "react-i18next";

import { loadUsers } from "../../../core/api/apiCalls";
import { UserListItem } from "./UserListItem/UserListItem";
import { Spinner } from "../../widget";

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
  pendingApiCall: boolean;
};

class UserList extends Component<WithTranslation> {
  state = {
    page: {
      content: [],
      page: 0,
      size: 3,
      totalPages: 9,
    },
    pendingApiCall: false,
  } as UserListProps;

  componentDidMount() {
    this.loadData();
  }

  loadData = async (pageIndex?: number) => {
    this.setState({ pendingApiCall: true });
    try {
      const response = await loadUsers(pageIndex);
      this.setState({ page: response.data });
    } catch (error) {}
    this.setState({ pendingApiCall: false });
  };

  render(): ReactNode {
    const { content, page, totalPages } = this.state.page;
    const { pendingApiCall } = this.state;
    const { t } = this.props;

    return (
      <div className="card">
        <div className="card-header text-center">
          <h3>{t("users")}</h3>
        </div>
        <ul className="list-group list-group-flush">
          {content?.map((user) => (
            <UserListItem user={user} key={user.id} />
          ))}
        </ul>
        <div className="card-footer text-center">
          {page !== 0 && !pendingApiCall && (
            <button
              className="btn btn-outline-secondary btn-sm float-start"
              onClick={() => this.loadData(page - 1)}
            >
              {t("previousPage")}
            </button>
          )}
          {totalPages > page + 1 && !pendingApiCall && (
            <button
              className="btn btn-outline-secondary btn-sm float-end"
              onClick={() => this.loadData(page + 1)}
            >
              {t("nextPage")}
            </button>
          )}
          {pendingApiCall && <Spinner />}
        </div>
      </div>
    );
  }
}

export default withTranslation()(UserList);
